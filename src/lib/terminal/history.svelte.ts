import { untrack } from 'svelte';

/**
 * Typed Command History Store
 * Persists typed commands in sessionStorage (max 50) with local HH:MM timestamps.
 */

export interface HistoryItem {
	command: string;
	time: string;
}

const STORAGE_KEY = 'kantz-history';
export const MAX_HISTORY = 50;

let entries = $state<HistoryItem[]>([]);
let initialized = false;

function isBrowser(): boolean {
	return typeof window !== 'undefined' && typeof window.sessionStorage !== 'undefined';
}

const timeFormatter = new Intl.DateTimeFormat('en-GB', {
	hour: '2-digit',
	minute: '2-digit',
	hourCycle: 'h23'
});

export function formatLocalTime(timestampMs: number = Date.now()): string {
	return timeFormatter.format(timestampMs);
}

export function parseStoredHistory(raw: string | null): HistoryItem[] {
	if (!raw) return [];
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed
			.filter(
				(item): item is HistoryItem =>
					typeof item === 'object' &&
					item !== null &&
					typeof (item as Record<string, unknown>).command === 'string' &&
					typeof (item as Record<string, unknown>).time === 'string'
			)
			.slice(-MAX_HISTORY);
	} catch {
		return [];
	}
}

export function initHistory(): void {
	if (!isBrowser() || initialized) return;
	initialized = true;
	untrack(() => {
		try {
			entries = parseStoredHistory(window.sessionStorage.getItem(STORAGE_KEY));
		} catch {
			entries = [];
		}
	});
}

export function recordCommand(raw: string, timestampMs: number = Date.now()): void {
	const trimmed = raw.trim();
	if (!trimmed) return;

	untrack(() => {
		if (isBrowser() && !initialized) {
			initHistory();
		}

		const next: HistoryItem = {
			command: trimmed,
			time: formatLocalTime(timestampMs)
		};

		entries = [...entries, next].slice(-MAX_HISTORY);

		if (isBrowser()) {
			try {
				window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
			} catch {
				// Ignore storage quota or private-mode errors
			}
		}
	});
}

export function getHistory(): readonly HistoryItem[] {
	return entries;
}

export function resetHistoryForTest(): void {
	untrack(() => {
		entries = [];
		initialized = false;
		if (isBrowser()) {
			try {
				window.sessionStorage.removeItem(STORAGE_KEY);
			} catch {
				// Ignore storage errors
			}
		}
	});
}
