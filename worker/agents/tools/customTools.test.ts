/**
 * executeToolWithDefinition must report the TRUE outcome of a tool to the UI:
 * a tool that returns `{ error }`, or one that throws, is a failure — not a
 * false "Completed". Locks the onStart/onComplete contract the chat renderer
 * relies on to show an error chip.
 */
import { describe, it, expect, vi } from 'vitest';
import { executeToolWithDefinition } from './customTools';
import type { ToolDefinition } from './types';

function makeTool<TArgs, TResult>(
    impl: (args: TArgs) => Promise<TResult>,
    onStart = vi.fn(),
    onComplete = vi.fn(),
): ToolDefinition<TArgs, TResult> {
    return {
        type: 'function',
        function: { name: 'test_tool', description: 'x', parameters: { type: 'object', properties: {} } },
        implementation: impl,
        onStart,
        onComplete,
    } as unknown as ToolDefinition<TArgs, TResult>;
}

describe('executeToolWithDefinition', () => {
    it('passes a successful result to onComplete and returns it', async () => {
        const onComplete = vi.fn();
        const tool = makeTool(async () => ({ logs: 'ok' }), vi.fn(), onComplete);
        const result = await executeToolWithDefinition(tool, {});
        expect(result).toEqual({ logs: 'ok' });
        expect(onComplete).toHaveBeenCalledWith({}, { logs: 'ok' });
    });

    it('passes an { error } result through to onComplete (so the UI can flag it)', async () => {
        const onComplete = vi.fn();
        const tool = makeTool(async () => ({ error: 'Failed to get logs' }), vi.fn(), onComplete);
        await executeToolWithDefinition(tool, {});
        expect(onComplete).toHaveBeenCalledWith({}, { error: 'Failed to get logs' });
    });

    it('synthesizes an { error } result and rethrows when the tool throws', async () => {
        const onComplete = vi.fn();
        const tool = makeTool(async () => { throw new Error('boom'); }, vi.fn(), onComplete);
        await expect(executeToolWithDefinition(tool, {})).rejects.toThrow('boom');
        expect(onComplete).toHaveBeenCalledWith({}, { error: 'boom' });
    });

    it('always fires onStart before running', async () => {
        const onStart = vi.fn();
        const tool = makeTool(async () => ({ ok: true }), onStart);
        await executeToolWithDefinition(tool, { a: 1 });
        expect(onStart).toHaveBeenCalledWith({ a: 1 });
    });
});
