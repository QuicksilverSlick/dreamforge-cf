/**
 * Locks the user-facing translation of internal agent activity: every known
 * tool resolves to a plain-language label + a role, unknown tools degrade to a
 * humanized name (never a raw identifier), and args-driven detail excerpts are
 * trimmed to one line.
 */
import { describe, it, expect } from 'vitest';
import { getToolDisplay, ROLE_DISPLAY, TOOL_DISPLAY } from './activityDisplay';

describe('getToolDisplay', () => {
	it('maps every registered tool to a non-empty label and a known role', () => {
		for (const name of Object.keys(TOOL_DISPLAY)) {
			const d = getToolDisplay(name);
			expect(d.label.length).toBeGreaterThan(0);
			expect(ROLE_DISPLAY[d.role]).toBeDefined();
			expect(d.roleLabel).toBe(ROLE_DISPLAY[d.role].label);
			expect(d.label).not.toBe(name); // never leak the raw identifier
		}
	});

	it('renders get_logs as debugger reading logs (the "Completed get_logs" fix)', () => {
		const d = getToolDisplay('get_logs');
		expect(d.role).toBe('debugger');
		expect(d.roleLabel).toBe('Debugger');
		expect(d.label.toLowerCase()).toContain('logs');
	});

	it('surfaces the queued request text from args as a detail excerpt', () => {
		const d = getToolDisplay('queue_request', { modificationRequest: 'Fix the crash when I click Sign In' });
		expect(d.role).toBe('assistant');
		expect(d.detail).toBe('Fix the crash when I click Sign In');
	});

	it('collapses whitespace and truncates long detail excerpts', () => {
		const long = 'a'.repeat(200);
		const d = getToolDisplay('queue_request', { modificationRequest: `  multi   line\n\ntext ${long}` });
		expect(d.detail).toBeDefined();
		expect(d.detail!.length).toBeLessThanOrEqual(90);
		expect(d.detail).not.toContain('\n');
	});

	it('degrades an unknown tool to a humanized name, never the raw id', () => {
		const d = getToolDisplay('some_new_tool');
		expect(d.label).toBe('Some new tool');
		expect(d.role).toBe('assistant');
	});

	it('returns no detail when args are absent or non-string', () => {
		expect(getToolDisplay('queue_request').detail).toBeUndefined();
		expect(getToolDisplay('queue_request', { modificationRequest: 42 }).detail).toBeUndefined();
	});
});
