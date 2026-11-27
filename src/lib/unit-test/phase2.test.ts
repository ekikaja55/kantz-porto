import { describe, it, expect } from 'vitest';
import { setMode, resetMode } from 'mode-watcher';

describe('Admin Theme Management (mode-watcher)', () => {
	it('provides mode-watcher control functions', () => {
		expect(typeof setMode).toBe('function');
		expect(typeof resetMode).toBe('function');
	});
});
