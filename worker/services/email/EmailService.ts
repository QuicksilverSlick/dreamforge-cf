/**
 * Email Service — outbound transactional email via Cloudflare Email Sending.
 *
 * Uses the typed `cloudflare:email` EmailMessage binding (env.EMAIL.send). Once
 * the sending domain (getdreamforge.com) is onboarded for Email Sending in the
 * dashboard, the binding delivers to ANY recipient; before that — or if the
 * binding is simply absent (e.g. the test env) — send() degrades gracefully and
 * returns { sent: false }. Invite flows therefore never DEPEND on email: the
 * raw accept-link is always surfaced to the inviter as a fallback.
 *
 * Security: all values interpolated into MIME HEADERS are stripped of CR/LF
 * (header-injection defense); all values interpolated into the HTML body are
 * HTML-escaped. Only the SHA-256 hash of an invite token is ever stored — the
 * raw token lives only in the link rendered here.
 */

import { EmailMessage } from 'cloudflare:email';
import { createLogger } from '../../logger';
import type { OrgRole } from '../../types/auth-types';
import { generateId } from '../../utils/idGenerator';

export interface OrgInviteEmailParams {
    to: string;
    orgName: string;
    inviterName: string;
    role: OrgRole;
    acceptUrl: string;
    /** The inviter's email, used as Reply-To so the invitee can reach a human. */
    replyTo?: string;
    expiresAt: Date;
}

export interface EmailSendOutcome {
    sent: boolean;
    messageId?: string;
    /** Machine-readable reason when sent === false (for logs/telemetry, not UI). */
    error?: string;
}

const ROLE_LABELS: Record<OrgRole, string> = {
    owner: 'Owner',
    admin: 'Admin',
    member: 'Member',
};

export class EmailService {
    private readonly logger = createLogger('EmailService');

    constructor(private readonly env: Env) {}

    /** Whether the Email Sending binding is wired (false in the test env). */
    get isConfigured(): boolean {
        return Boolean(this.env.EMAIL);
    }

    /**
     * Send an organization invitation. Best-effort: returns { sent: false }
     * rather than throwing when the binding is absent or the provider rejects
     * the send, so the caller can fall back to the copy-link.
     */
    async sendOrgInvite(params: OrgInviteEmailParams): Promise<EmailSendOutcome> {
        if (!this.env.EMAIL) {
            this.logger.warn('EMAIL binding not configured; skipping invite email (copy-link fallback)', {
                to: params.to,
            });
            return { sent: false, error: 'email_not_configured' };
        }

        const fromAddress = this.env.EMAIL_FROM_ADDRESS;
        const fromName = this.env.EMAIL_FROM_NAME || 'Dreamforge';
        if (!fromAddress) {
            this.logger.error('EMAIL_FROM_ADDRESS is not set; cannot send invite email');
            return { sent: false, error: 'sender_not_configured' };
        }

        const { subject, html, text } = EmailService.renderOrgInvite(params, fromName);

        // E_SENDER_NOT_VERIFIED (domain not onboarded yet), quota, etc. are
        // never fatal to the invite, which already exists in D1 — the caller
        // falls back to the copy-link.
        return this.deliver({
            fromName,
            fromAddress,
            to: params.to,
            replyTo: params.replyTo,
            subject,
            html,
            text,
            logLabel: 'invite email',
        });
    }

    /** produce@ on the sending domain — the PRODUCE lane's address (also an Email Routing inbox). */
    private get produceAddress(): string {
        const domain = this.env.EMAIL_FROM_ADDRESS?.split('@')[1] ?? 'getdreamforge.com';
        return `produce@${domain}`;
    }

    /**
     * Automated acknowledgment to a PRODUCE applicant: "we received it and
     * are reaching out right away." Best-effort — the application is already
     * stored in D1 before this is attempted.
     */
    async sendProduceApplicationAck(params: {
        to: string;
        name: string;
        tierLabel: string;
    }): Promise<EmailSendOutcome> {
        const fromName = 'Dreamforge Produce';
        const eName = escapeHtml(params.name);
        const eTier = escapeHtml(params.tierLabel);
        const subject = 'We got your application — here\u2019s what happens next';
        const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e6e8eb;">
          <tr><td style="font-size:20px;font-weight:600;color:#0f172a;padding-bottom:8px;">Your application is in, ${eName}.</td></tr>
          <tr><td style="font-size:14px;line-height:22px;color:#475569;padding-bottom:16px;">
            We received your <strong>${eTier}</strong> application and a Dreamforge engineer is reviewing it right now. You\u2019ll hear from us within one business day to set up your scoping call \u2014 a real conversation, a fixed price in writing, and only then a payment link.
          </td></tr>
          <tr><td style="font-size:14px;line-height:22px;color:#475569;padding-bottom:24px;">
            While you wait: you can start exploring free at <a href="https://app.getdreamforge.com" style="color:#0ea5a4;text-decoration:none;font-weight:600;">app.getdreamforge.com</a> \u2014 anything you build comes with you into production.
          </td></tr>
          <tr><td style="font-size:12px;line-height:20px;color:#94a3b8;">
            Questions before we call? Just reply to this email \u2014 it reaches a human.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
        const text = [
            `Your application is in, ${params.name}.`,
            ``,
            `We received your ${params.tierLabel} application and a Dreamforge engineer is reviewing it right now.`,
            `You'll hear from us within one business day to set up your scoping call — a real conversation, a fixed price in writing, and only then a payment link.`,
            ``,
            `While you wait, you can start exploring free at https://app.getdreamforge.com — anything you build comes with you into production.`,
            ``,
            `Questions before we call? Just reply to this email — it reaches a human.`,
        ].join('\n');
        return this.deliver({
            fromName,
            fromAddress: this.produceAddress,
            to: params.to,
            replyTo: this.produceAddress,
            subject,
            html,
            text,
            logLabel: 'produce application ack',
        });
    }

    /**
     * Internal notification of a new application, delivered to the produce@
     * inbox (Email Routing forwards it on). Reply-To is the applicant, so a
     * plain reply from the operator's mail client starts the conversation.
     */
    async sendProduceApplicationNotice(params: {
        name: string;
        email: string;
        company?: string | null;
        tierLabel: string;
        projectDescription: string;
    }): Promise<EmailSendOutcome> {
        const subject = `New Produce application — ${params.tierLabel} — ${params.name}`;
        const rows: Array<[string, string]> = [
            ['Name', params.name],
            ['Email', params.email],
            ['Company', params.company || '—'],
            ['Tier', params.tierLabel],
            ['Project', params.projectDescription],
        ];
        const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:24px;border:1px solid #e6e8eb;">
    <tr><td style="font-size:17px;font-weight:600;color:#0f172a;padding-bottom:12px;">New Produce application</td></tr>
    ${rows
        .map(
            ([k, v]) =>
                `<tr><td style="font-size:13px;line-height:20px;color:#475569;padding-bottom:8px;"><strong style="color:#0f172a;">${escapeHtml(k)}:</strong> ${escapeHtml(v)}</td></tr>`,
        )
        .join('')}
    <tr><td style="font-size:12px;color:#94a3b8;padding-top:12px;">Reply to this email to answer the applicant directly.</td></tr>
  </table>
</body></html>`;
        const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
        return this.deliver({
            fromName: 'Dreamforge Produce',
            fromAddress: this.env.EMAIL_FROM_ADDRESS || this.produceAddress,
            to: this.produceAddress,
            replyTo: params.email,
            subject,
            html,
            text,
            logLabel: 'produce application notice',
        });
    }

    /** Shared best-effort delivery wrapper around the EMAIL binding. */
    private async deliver(input: {
        fromName: string;
        fromAddress: string;
        to: string;
        replyTo?: string;
        subject: string;
        html: string;
        text: string;
        logLabel: string;
    }): Promise<EmailSendOutcome> {
        if (!this.env.EMAIL) {
            this.logger.warn(`EMAIL binding not configured; skipping ${input.logLabel}`, { to: input.to });
            return { sent: false, error: 'email_not_configured' };
        }
        try {
            const raw = EmailService.buildMimeMessage(input);
            const result = await this.env.EMAIL.send(new EmailMessage(input.fromAddress, input.to, raw));
            this.logger.info(`Sent ${input.logLabel}`, { to: input.to, messageId: result.messageId });
            return { sent: true, messageId: result.messageId };
        } catch (error) {
            this.logger.error(`Failed to send ${input.logLabel}`, {
                to: input.to,
                error: error instanceof Error ? error.message : String(error),
            });
            return { sent: false, error: error instanceof Error ? error.message : 'send_failed' };
        }
    }

    /** Render the invite subject + HTML + plaintext bodies (all values escaped). */
    private static renderOrgInvite(
        params: OrgInviteEmailParams,
        fromName: string,
    ): { subject: string; html: string; text: string } {
        const org = params.orgName;
        const inviter = params.inviterName;
        const roleLabel = ROLE_LABELS[params.role];
        const subject = `${inviter} invited you to join ${org} on ${fromName}`;

        const eOrg = escapeHtml(org);
        const eInviter = escapeHtml(inviter);
        const eRole = escapeHtml(roleLabel);
        const eUrl = escapeHtml(params.acceptUrl);
        const expires = params.expiresAt.toUTCString();

        const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7f9;padding:32px 0;">
      <tr><td align="center">
        <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;padding:32px;border:1px solid #e6e8eb;">
          <tr><td style="font-size:20px;font-weight:600;color:#0f172a;padding-bottom:8px;">You're invited to ${eOrg}</td></tr>
          <tr><td style="font-size:14px;line-height:22px;color:#475569;padding-bottom:24px;">
            <strong>${eInviter}</strong> has invited you to join <strong>${eOrg}</strong> as a <strong>${eRole}</strong> on ${escapeHtml(fromName)}.
          </td></tr>
          <tr><td style="padding-bottom:24px;">
            <a href="${eUrl}" style="display:inline-block;background:#0ea5a4;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;">Accept invitation</a>
          </td></tr>
          <tr><td style="font-size:12px;line-height:20px;color:#94a3b8;">
            Or paste this link into your browser:<br/>
            <span style="color:#475569;word-break:break-all;">${eUrl}</span><br/><br/>
            This invitation expires on ${escapeHtml(expires)}. If you weren't expecting it, you can safely ignore this email.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

        const text = [
            `${inviter} has invited you to join ${org} as a ${roleLabel} on ${fromName}.`,
            ``,
            `Accept the invitation:`,
            params.acceptUrl,
            ``,
            `This invitation expires on ${expires}.`,
            `If you weren't expecting it, you can safely ignore this email.`,
        ].join('\n');

        return { subject, html, text };
    }

    /**
     * Build an RFC 5322 / MIME multipart-alternative message (CRLF line
     * endings, UTF-8 base64 bodies, RFC 2047-encoded subject). All header
     * values are CR/LF-stripped to prevent header injection.
     */
    private static buildMimeMessage(input: {
        fromName: string;
        fromAddress: string;
        to: string;
        replyTo?: string;
        subject: string;
        html: string;
        text: string;
    }): string {
        const boundary = `df_${generateId()}`;
        const domain = input.fromAddress.split('@')[1] ?? 'getdreamforge.com';
        const messageId = `<${generateId()}@${domain}>`;

        const headers: string[] = [
            `From: ${encodeHeaderWord(stripCrlf(input.fromName))} <${stripCrlf(input.fromAddress)}>`,
            `To: ${stripCrlf(input.to)}`,
        ];
        if (input.replyTo) {
            headers.push(`Reply-To: ${stripCrlf(input.replyTo)}`);
        }
        headers.push(
            `Message-ID: ${messageId}`,
            `Date: ${new Date().toUTCString()}`,
            `Subject: ${encodeHeaderWord(stripCrlf(input.subject))}`,
            `MIME-Version: 1.0`,
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
        );

        const parts = [
            `--${boundary}`,
            `Content-Type: text/plain; charset="utf-8"`,
            `Content-Transfer-Encoding: base64`,
            ``,
            foldBase64(toBase64(input.text)),
            `--${boundary}`,
            `Content-Type: text/html; charset="utf-8"`,
            `Content-Transfer-Encoding: base64`,
            ``,
            foldBase64(toBase64(input.html)),
            `--${boundary}--`,
            ``,
        ];

        return [...headers, ``, ...parts].join('\r\n');
    }
}

/**
 * Strip CR/LF (header-injection defense) plus other C0 control chars and DEL,
 * so an attacker-influenced value (org/inviter name, email) can't smuggle MIME
 * headers or malform the message.
 */
function stripCrlf(value: string): string {
    // eslint-disable-next-line no-control-regex
    return value.replace(/[\x00-\x1F\x7F]+/g, ' ').trim();
}

/** HTML-escape a value for safe interpolation into the email body. */
function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

/** RFC 2047 encoded-word for non-ASCII header values; pass-through for ASCII. */
function encodeHeaderWord(value: string): string {
    if (/^[\x20-\x7E]*$/.test(value)) {
        return value;
    }
    return `=?UTF-8?B?${toBase64(value)}?=`;
}

/** UTF-8 → standard base64 (chunked to avoid String.fromCharCode arg limits). */
function toBase64(input: string): string {
    const bytes = new TextEncoder().encode(input);
    let binary = '';
    const CHUNK = 0x8000;
    for (let i = 0; i < bytes.length; i += CHUNK) {
        binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
}

/** Fold a base64 string into ≤76-char lines per RFC 2045. */
function foldBase64(b64: string): string {
    return b64.replace(/.{76}/g, '$&\r\n');
}
