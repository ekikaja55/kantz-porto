/**
 * Terminal Command Registry, Parser, and Tab Completion
 * Pure TypeScript - No Svelte imports
 */

export type CommandKind = 'nav' | 'inline';

export interface CommandArg {
	name: string;
	optional: boolean;
	values?: readonly string[] | 'slugs';
}

export interface Command {
	id: string;
	name: string;
	aliases: readonly string[];
	description: string;
	kind: CommandKind;
	route?: string;
	arg?: CommandArg;
	echo?: (arg?: string) => string;
	inline?: 'help' | 'theme' | 'history' | 'clear';
	menu: boolean;
}

export type ParseResult =
	| { kind: 'empty' }
	| { kind: 'ok'; command: Command; arg?: string }
	| { kind: 'bad-args'; command: Command; usage: string }
	| { kind: 'unknown'; input: string; suggestions: string[] };

export type CompletionResult =
	| { kind: 'none' }
	| { kind: 'single'; value: string }
	| { kind: 'multiple'; value: string; candidates: string[] };

export const COMMAND_REGISTRY: readonly Command[] = [
	{
		id: 'about_me',
		name: 'about_me',
		aliases: ['about', 'whoami'],
		description: 'profile overview and featured work',
		kind: 'nav',
		route: '/',
		echo: () => 'about_me',
		menu: true
	},
	{
		id: 'projects',
		name: 'projects',
		aliases: ['ls'],
		description: 'directory of published projects',
		kind: 'nav',
		route: '/projects',
		echo: () => 'projects',
		menu: true
	},
	{
		id: 'open',
		name: 'open',
		aliases: ['cat'],
		description: 'read project case study by slug',
		kind: 'nav',
		arg: {
			name: 'slug',
			optional: false,
			values: 'slugs'
		},
		echo: (slug) => (slug ? `open ${slug}` : 'open'),
		menu: false
	},
	{
		id: 'skills',
		name: 'skills',
		aliases: [],
		description: 'technical capabilities by category',
		kind: 'nav',
		route: '/skills',
		echo: () => 'skills',
		menu: true
	},
	{
		id: 'experience',
		name: 'experience',
		aliases: ['log'],
		description: 'chronological engineering log',
		kind: 'nav',
		route: '/experience',
		echo: () => 'experience',
		menu: true
	},
	{
		id: 'contact',
		name: 'contact',
		aliases: [],
		description: 'direct channels and external profiles',
		kind: 'nav',
		route: '/contact',
		echo: () => 'contact',
		menu: true
	},
	{
		id: 'back',
		name: 'back',
		aliases: ['..'],
		description: 'return to parent route',
		kind: 'nav',
		echo: () => 'back',
		menu: false
	},
	{
		id: 'theme',
		name: 'theme',
		aliases: [],
		description: 'switch palette [moonfly|ayu]',
		kind: 'inline',
		inline: 'theme',
		arg: {
			name: 'moonfly|ayu',
			optional: true,
			values: ['moonfly', 'ayu']
		},
		menu: false
	},
	{
		id: 'history',
		name: 'history',
		aliases: [],
		description: 'list commands typed this session',
		kind: 'inline',
		inline: 'history',
		menu: true
	},
	{
		id: 'help',
		name: 'help',
		aliases: ['?'],
		description: 'list available commands and keys',
		kind: 'inline',
		inline: 'help',
		menu: true
	},
	{
		id: 'clear',
		name: 'clear',
		aliases: [],
		description: 'clear appended scrollback output',
		kind: 'inline',
		inline: 'clear',
		menu: true
	},
	{
		id: 'sudo',
		name: 'sudo',
		aliases: [],
		description: 'open administrator login',
		kind: 'nav',
		route: '/login',
		echo: () => 'sudo',
		menu: false
	}
] as const;

export function formatCommandUsage(command: Command): string {
	if (!command.arg) {
		return command.name;
	}
	const bracketed = command.arg.optional ? `[${command.arg.name}]` : `<${command.arg.name}>`;
	return `${command.name} ${bracketed}`;
}

export function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];
	const aLen = a.length;
	const bLen = b.length;

	for (let i = 0; i <= aLen; i++) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= bLen; j++) {
		matrix[0][j] = j;
	}

	for (let i = 1; i <= aLen; i++) {
		for (let j = 1; j <= bLen; j++) {
			const cost = a[i - 1] === b[j - 1] ? 0 : 1;
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1,
				matrix[i][j - 1] + 1,
				matrix[i - 1][j - 1] + cost
			);
		}
	}

	return matrix[aLen][bLen];
}

export function longestCommonPrefix(items: readonly string[]): string {
	if (items.length === 0) return '';
	let prefix = items[0];
	for (let i = 1; i < items.length; i++) {
		const current = items[i];
		let j = 0;
		while (j < prefix.length && j < current.length && prefix[j] === current[j]) {
			j++;
		}
		prefix = prefix.slice(0, j);
		if (!prefix) break;
	}
	return prefix;
}

export function resolveParentRoute(
	pathname: string,
	depth: 'parent' | 'root' = 'parent'
): string | null {
	const normalized = pathname.replace(/\/+$/, '') || '/';
	if (normalized === '/') {
		return null;
	}
	if (depth === 'root') {
		return '/';
	}
	if (normalized.startsWith('/projects/') && normalized.length > '/projects/'.length) {
		return '/projects';
	}
	return '/';
}

export function suggestCommands(
	query: string,
	registry: readonly Command[] = COMMAND_REGISTRY,
	limit = 3
): string[] {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return [];

	const publicCommands = registry.filter((cmd) => cmd.id !== 'sudo');
	const scored = publicCommands
		.map((cmd) => {
			const names = [cmd.name, ...cmd.aliases.filter((a) => a !== '?' && a !== '..')];
			const bestDist = Math.min(...names.map((n) => levenshteinDistance(normalized, n)));
			return { name: cmd.name, dist: bestDist };
		})
		.filter((item) => item.dist <= 3)
		.sort((a, b) => a.dist - b.dist);

	return Array.from(new Set(scored.map((s) => s.name))).slice(0, limit);
}

export function parse(
	input: string,
	registry: readonly Command[] = COMMAND_REGISTRY,
	slugs: readonly string[] = []
): ParseResult {
	const collapsed = input.trim().replace(/\s+/g, ' ');
	if (!collapsed) {
		return { kind: 'empty' };
	}

	// Silent convenience for developer muscle memory without exposing a fake filesystem
	const lowerCollapsed = collapsed.toLowerCase();
	const backCommand = registry.find((cmd) => cmd.id === 'back');
	if (backCommand) {
		if (lowerCollapsed === 'cd ..' || lowerCollapsed === 'cd ../') {
			return { kind: 'ok', command: backCommand, arg: 'parent' };
		}
		if (
			lowerCollapsed === 'cd ../..' ||
			lowerCollapsed === 'cd ../../' ||
			lowerCollapsed === 'cd ~'
		) {
			return { kind: 'ok', command: backCommand, arg: 'root' };
		}
	}

	const firstSpaceIndex = collapsed.indexOf(' ');
	const rawName = firstSpaceIndex === -1 ? collapsed : collapsed.slice(0, firstSpaceIndex);
	const rawArg = firstSpaceIndex === -1 ? undefined : collapsed.slice(firstSpaceIndex + 1);

	const commandName = rawName.toLowerCase();
	const command = registry.find(
		(cmd) => cmd.name === commandName || cmd.aliases.includes(commandName)
	);

	if (!command) {
		return {
			kind: 'unknown',
			input: collapsed,
			suggestions: suggestCommands(commandName, registry, 3)
		};
	}

	if (!command.arg) {
		if (rawArg !== undefined) {
			return {
				kind: 'bad-args',
				command,
				usage: formatCommandUsage(command)
			};
		}
		return { kind: 'ok', command };
	}

	const { optional, values } = command.arg;

	if (!rawArg) {
		if (!optional) {
			return {
				kind: 'bad-args',
				command,
				usage: formatCommandUsage(command)
			};
		}
		return { kind: 'ok', command };
	}

	// Arguments do not accept extra space-separated tokens or flags
	if (rawArg.includes(' ')) {
		return {
			kind: 'bad-args',
			command,
			usage: formatCommandUsage(command)
		};
	}

	const lowerArg = rawArg.toLowerCase();

	if (values === 'slugs') {
		const matchedSlug = slugs.find((s) => s.toLowerCase() === lowerArg);
		if (!matchedSlug) {
			return {
				kind: 'bad-args',
				command,
				usage: formatCommandUsage(command)
			};
		}
		return { kind: 'ok', command, arg: matchedSlug };
	}

	if (Array.isArray(values)) {
		if (!values.includes(lowerArg)) {
			return {
				kind: 'bad-args',
				command,
				usage: formatCommandUsage(command)
			};
		}
		return { kind: 'ok', command, arg: lowerArg };
	}

	return { kind: 'ok', command, arg: rawArg };
}

export function completeInput(
	raw: string,
	registry: readonly Command[] = COMMAND_REGISTRY,
	slugs: readonly string[] = []
): CompletionResult {
	const leadingTrimmed = raw.replace(/^\s+/, '');
	const spaceIndex = leadingTrimmed.indexOf(' ');

	// 1. Complete command name
	if (spaceIndex === -1) {
		const prefix = leadingTrimmed.toLowerCase();
		const primaryCandidates = registry
			.filter((cmd) => (cmd.id === 'sudo' ? prefix.startsWith('su') : true))
			.map((cmd) => cmd.name)
			.filter((name) => name.startsWith(prefix));

		let matches = primaryCandidates;
		if (matches.length === 0 && prefix.length > 0) {
			matches = registry
				.flatMap((cmd) => cmd.aliases)
				.filter((alias) => alias !== '?' && alias.startsWith(prefix));
		}

		if (matches.length === 0) {
			return { kind: 'none' };
		}

		if (matches.length === 1) {
			const match = matches[0];
			const matchedCmd = registry.find(
				(cmd) => cmd.name === match || cmd.aliases.includes(match)
			);
			const suffix = matchedCmd?.arg ? ' ' : '';
			return { kind: 'single', value: `${match}${suffix}` };
		}

		const lcp = longestCommonPrefix(matches);
		return {
			kind: 'multiple',
			value: lcp.length > prefix.length ? lcp : leadingTrimmed,
			candidates: matches
		};
	}

	// 2. Complete command argument
	const cmdToken = leadingTrimmed.slice(0, spaceIndex);
	const rest = leadingTrimmed.slice(spaceIndex + 1);
	if (rest.includes(' ')) {
		return { kind: 'none' };
	}

	const cmdLower = cmdToken.toLowerCase();
	const command = registry.find(
		(cmd) => cmd.name === cmdLower || cmd.aliases.includes(cmdLower)
	);

	if (!command?.arg?.values) {
		return { kind: 'none' };
	}

	const pool = command.arg.values === 'slugs' ? slugs : command.arg.values;
	const argPrefix = rest.toLowerCase();
	const matches = pool.filter((item) => item.toLowerCase().startsWith(argPrefix));

	if (matches.length === 0) {
		return { kind: 'none' };
	}

	if (matches.length === 1) {
		return { kind: 'single', value: `${cmdToken} ${matches[0]}` };
	}

	const lcp = longestCommonPrefix(matches);
	const nextArg = lcp.length > argPrefix.length ? lcp : rest;
	return {
		kind: 'multiple',
		value: `${cmdToken} ${nextArg}`,
		candidates: [...matches]
	};
}

/**
 * Returns the remaining suffix for Fish-shell style inline ghost autosuggestion.
 * Pure function suitable for direct $derived usage without side effects.
 */
export function getGhostSuggestion(
	raw: string,
	registry: readonly Command[] = COMMAND_REGISTRY,
	slugs: readonly string[] = []
): string {
	if (!raw || raw.startsWith(' ')) return '';

	const spaceIndex = raw.indexOf(' ');

	// 1. Suggest command name (+ sample argument when command takes one)
	if (spaceIndex === -1) {
		const lower = raw.toLowerCase();
		const primaryMatch = registry.find(
			(cmd) =>
				(cmd.id === 'sudo' ? lower.startsWith('su') : true) &&
				cmd.name.startsWith(lower)
		);

		if (primaryMatch) {
			let full = primaryMatch.name;
			if (primaryMatch.arg?.values === 'slugs' && slugs.length > 0) {
				full = `${primaryMatch.name} ${slugs[0]}`;
			} else if (Array.isArray(primaryMatch.arg?.values) && primaryMatch.arg.values.length > 0) {
				const sampleVal = primaryMatch.arg.values[primaryMatch.arg.values.length - 1];
				full = `${primaryMatch.name} ${sampleVal}`;
			}
			return full.length > raw.length ? full.slice(raw.length) : '';
		}

		const aliasMatch = registry
			.flatMap((cmd) => cmd.aliases.map((alias) => ({ alias, cmd })))
			.find(({ alias }) => alias !== '?' && alias.startsWith(lower));

		if (aliasMatch) {
			let full = aliasMatch.alias;
			if (aliasMatch.cmd.arg?.values === 'slugs' && slugs.length > 0) {
				full = `${aliasMatch.alias} ${slugs[0]}`;
			}
			return full.length > raw.length ? full.slice(raw.length) : '';
		}

		return '';
	}

	// 2. Suggest argument after command + space
	const cmdToken = raw.slice(0, spaceIndex).toLowerCase();
	const rest = raw.slice(spaceIndex + 1);
	if (rest.includes(' ')) return '';

	const command = registry.find(
		(cmd) => cmd.name === cmdToken || cmd.aliases.includes(cmdToken)
	);
	if (!command?.arg?.values) return '';

	const pool = command.arg.values === 'slugs' ? slugs : command.arg.values;
	if (pool.length === 0) return '';

	if (rest.length === 0) {
		return command.id === 'theme' && pool.includes('ayu') ? 'ayu' : pool[0];
	}

	const lowerRest = rest.toLowerCase();
	const match = pool.find((item) => item.toLowerCase().startsWith(lowerRest));
	if (!match || match.length <= rest.length) return '';
	return match.slice(rest.length);
}
