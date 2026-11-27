import { untrack } from 'svelte';
import type { HistoryItem } from './history.svelte';
import type { ThemeName } from './theme.svelte';

/**
 * Client-side Scrollback Store for inline commands.
 * Appended blocks live only in memory and reset on route navigation.
 */

export type ScrollbackPayload =
	| { type: 'help' }
	| { type: 'history'; entries: readonly HistoryItem[] }
	| { type: 'theme'; theme: ThemeName }
	| { type: 'info'; text: string }
	| { type: 'unknown'; input: string; suggestions: readonly string[] }
	| { type: 'bad-args'; usage: string }
	| { type: 'candidates'; items: readonly string[] };

export interface ScrollbackBlock {
	id: number;
	echo: string;
	payload: ScrollbackPayload;
}

let blocks = $state<ScrollbackBlock[]>([]);
let nextId = 1;

export function appendScrollback(echo: string, payload: ScrollbackPayload): ScrollbackBlock {
	const block: ScrollbackBlock = {
		id: nextId++,
		echo,
		payload
	};

	untrack(() => {
		blocks = [...blocks, block];
	});

	return block;
}

export function clearScrollback(): void {
	untrack(() => {
		blocks = [];
	});
}

export function getScrollback(): readonly ScrollbackBlock[] {
	return blocks;
}
