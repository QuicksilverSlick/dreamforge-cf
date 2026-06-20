# Email Sending — deliverability runbook (Phase 2.2)

Org invitations are delivered via **Cloudflare Email Service → Email Sending** (public beta,
GA'd 2026-04-16), using the native Workers `send_email` binding (`env.EMAIL`). This doc is the
owner checklist to make that mail actually land in inboxes.

## How invite delivery degrades (why this is not a blocker)

The invite **row** is always created and the API always returns the tokenized accept-link
(`acceptUrl`). The email send is **best-effort**: if the `EMAIL` binding is absent or the send
throws (e.g. `E_SENDER_NOT_VERIFIED` before the domain is onboarded), the inviter still gets the
copy-link to share. So the feature ships and works the day it deploys; onboarding the domain just
upgrades delivery from "copy the link" to "they get an email." See
`worker/services/email/EmailService.ts`.

## One required owner action: onboard the sending domain

Email Sending only delivers to arbitrary recipients **after** the sending domain is onboarded.
(Before onboarding, sends are limited to verified destination addresses in the account.)

1. Cloudflare dashboard → **Compute → Email Service → Email Sending → Onboard Domain**.
2. Choose **`getdreamforge.com`** → **Done**.

Because `getdreamforge.com` uses Cloudflare DNS, onboarding writes the four records below
automatically. Propagation is usually 5–15 min (up to 24h worst case).

## The four records onboarding adds (verify these are live)

| Type | Host | Value | Purpose |
|------|------|-------|---------|
| MX   | `cf-bounce.getdreamforge.com` | `route1/2/3.mx.cloudflare.net` | Bounce processing |
| TXT (SPF)  | `cf-bounce.getdreamforge.com` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | Authorize sending |
| TXT (DKIM) | `cf-bounce._domainkey.getdreamforge.com` | `v=DKIM1; h=sha256; k=rsa; p=…` (CF-issued) | Signature / `d=` alignment |
| TXT (DMARC)| `_dmarc.getdreamforge.com` | `v=DMARC1; p=reject;` (or `quarantine`) | Policy |

These give SPF + DKIM + DMARC **alignment** for mail `From: noreply@getdreamforge.com`
(DKIM `d=getdreamforge.com` aligns to the From org-domain; SPF aligns via the `cf-bounce`
return-path), so messages authenticate and avoid spam folders.

## Verify after onboarding (DNS-over-HTTPS, no dashboard needed)

```
# Each should return an Answer with the expected value:
https://dns.google/resolve?name=cf-bounce.getdreamforge.com&type=MX
https://dns.google/resolve?name=cf-bounce.getdreamforge.com&type=TXT          # v=spf1 …
https://dns.google/resolve?name=cf-bounce._domainkey.getdreamforge.com&type=TXT  # v=DKIM1 …
https://dns.google/resolve?name=_dmarc.getdreamforge.com&type=TXT             # v=DMARC1 …
```

As of 2026-06-20 **none of these exist yet** (the domain is not onboarded), so invite email
is in copy-link-fallback mode until the step above is done.

## Sender configuration (wrangler.jsonc)

- Binding: `send_email` → `EMAIL`.
- `EMAIL_FROM_ADDRESS = noreply@getdreamforge.com` (local-part must be on the onboarded domain).
- `EMAIL_FROM_NAME = Dreamforge`. Reply-To is set to the inviter's email at send time.

## Fast-follow (out of scope for 2.2)

Once the domain is onboarded, the same `EmailService` can power the currently-dormant OTP /
email-verification and password-reset flows (today stubbed in `AuthService`).
