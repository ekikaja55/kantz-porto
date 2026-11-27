import { describe, it, expect, beforeEach } from 'vitest';
import {
	parse,
	completeInput,
	getGhostSuggestion,
	resolveParentRoute,
	COMMAND_REGISTRY,
	levenshteinDistance,
	longestCommonPrefix
} from '#lib/terminal/commands';
import {
	recordCommand,
	getHistory,
	resetHistoryForTest,
	formatLocalTime,
	parseStoredHistory,
	MAX_HISTORY
} from '#lib/terminal/history.svelte';
import {
	appendScrollback,
	clearScrollback,
	getScrollback
} from '#lib/terminal/scrollback.svelte';

describe('Terminal Command Parser (commands.ts)', () => {
	const sampleSlugs = ['invoizy', 'mlbb-voice-timer', 'portfolio-v1'];

	it('handles empty and whitespace-only input', () => {
		expect(parse('', COMMAND_REGISTRY, sampleSlugs)).toEqual({ kind: 'empty' });
		expect(parse('   ', COMMAND_REGISTRY, sampleSlugs)).toEqual({ kind: 'empty' });
		expect(parse('\t\n  ', COMMAND_REGISTRY, sampleSlugs)).toEqual({ kind: 'empty' });
	});

	it('recognizes every primary command and alias', () => {
		const cases: [string, string][] = [
			['about_me', 'about_me'],
			['about', 'about_me'],
			['whoami', 'about_me'],
			['projects', 'projects'],
			['ls', 'projects'],
			['skills', 'skills'],
			['experience', 'experience'],
			['log', 'experience'],
			['contact', 'contact'],
			['back', 'back'],
			['..', 'back'],
			['theme', 'theme'],
			['history', 'history'],
			['help', 'help'],
			['?', 'help'],
			['clear', 'clear'],
			['sudo', 'sudo']
		];

		for (const [raw, expectedId] of cases) {
			const res = parse(raw, COMMAND_REGISTRY, sampleSlugs);
			expect(res.kind).toBe('ok');
			if (res.kind === 'ok') {
				expect(res.command.id).toBe(expectedId);
			}
		}

		// cat alias for open
		const catRes = parse('cat invoizy', COMMAND_REGISTRY, sampleSlugs);
		expect(catRes.kind).toBe('ok');
		if (catRes.kind === 'ok') {
			expect(catRes.command.id).toBe('open');
			expect(catRes.arg).toBe('invoizy');
		}
	});

	it('validates open command with valid, missing, and invalid slugs', () => {
		const missing = parse('open', COMMAND_REGISTRY, sampleSlugs);
		expect(missing).toEqual({
			kind: 'bad-args',
			command: COMMAND_REGISTRY.find((c) => c.id === 'open'),
			usage: 'open <slug>'
		});

		const valid = parse('  open   MLBB-VOICE-TIMER  ', COMMAND_REGISTRY, sampleSlugs);
		expect(valid.kind).toBe('ok');
		if (valid.kind === 'ok') {
			expect(valid.command.id).toBe('open');
			expect(valid.arg).toBe('mlbb-voice-timer');
		}

		const invalid = parse('open unknown-project', COMMAND_REGISTRY, sampleSlugs);
		expect(invalid.kind).toBe('bad-args');
		if (invalid.kind === 'bad-args') {
			expect(invalid.usage).toBe('open <slug>');
		}
	});

	it('validates theme command with valid and invalid arguments', () => {
		const toggle = parse('theme', COMMAND_REGISTRY, sampleSlugs);
		expect(toggle.kind).toBe('ok');
		if (toggle.kind === 'ok') {
			expect(toggle.arg).toBeUndefined();
		}

		for (const name of ['ayu', 'moonfly', 'MOONFLY']) {
			const res = parse(`theme ${name}`, COMMAND_REGISTRY, sampleSlugs);
			expect(res.kind).toBe('ok');
			if (res.kind === 'ok') {
				expect(res.arg).toBe(name.toLowerCase());
			}
		}

		const badTheme = parse('theme solarized', COMMAND_REGISTRY, sampleSlugs);
		expect(badTheme.kind).toBe('bad-args');
		if (badTheme.kind === 'bad-args') {
			expect(badTheme.usage).toBe('theme [moonfly|ayu]');
		}
	});

	it('rejects extra tokens or flags on no-arg commands with bad-args', () => {
		const lsFlag = parse('ls -l', COMMAND_REGISTRY, sampleSlugs);
		expect(lsFlag.kind).toBe('bad-args');
		if (lsFlag.kind === 'bad-args') {
			expect(lsFlag.command.id).toBe('projects');
			expect(lsFlag.usage).toBe('projects');
		}

		const aboutExtra = parse('about_me now', COMMAND_REGISTRY, sampleSlugs);
		expect(aboutExtra.kind).toBe('bad-args');
		if (aboutExtra.kind === 'bad-args') {
			expect(aboutExtra.usage).toBe('about_me');
		}
	});

	it('returns unknown with suggestions and never navigates on unknown input', () => {
		const typo = parse('whoam', COMMAND_REGISTRY, sampleSlugs);
		expect(typo.kind).toBe('unknown');
		if (typo.kind === 'unknown') {
			expect(typo.input).toBe('whoam');
			expect(typo.suggestions).toContain('about_me');
		}

		const nonsense = parse('zzzznotacommand', COMMAND_REGISTRY, sampleSlugs);
		expect(nonsense).toEqual({
			kind: 'unknown',
			input: 'zzzznotacommand',
			suggestions: []
		});
	});

	it('handles whitespace normalization, case-insensitivity, and 1:1 echo strings', () => {
		const res = parse('   EXPERIENCE   ', COMMAND_REGISTRY, sampleSlugs);
		expect(res.kind).toBe('ok');
		if (res.kind === 'ok') {
			expect(res.command.echo?.()).toBe('experience');
		}

		const aboutCmd = COMMAND_REGISTRY.find((c) => c.id === 'about_me');
		expect(aboutCmd?.echo?.()).toBe('about_me');

		const openCmd = COMMAND_REGISTRY.find((c) => c.id === 'open');
		expect(openCmd?.echo?.('invoizy')).toBe('open invoizy');
	});

	it('handles back, .., silent cd shortcuts, and parent route resolution', () => {
		const cdParent = parse('cd ..', COMMAND_REGISTRY, sampleSlugs);
		expect(cdParent.kind).toBe('ok');
		if (cdParent.kind === 'ok') {
			expect(cdParent.command.id).toBe('back');
			expect(cdParent.arg).toBe('parent');
		}

		for (const raw of ['cd ../..', 'cd ../../', 'cd ~']) {
			const cdRoot = parse(raw, COMMAND_REGISTRY, sampleSlugs);
			expect(cdRoot.kind).toBe('ok');
			if (cdRoot.kind === 'ok') {
				expect(cdRoot.command.id).toBe('back');
				expect(cdRoot.arg).toBe('root');
			}
		}

		// Unsupported cd targets stay unknown (no fake filesystem)
		expect(parse('cd projects', COMMAND_REGISTRY, sampleSlugs).kind).toBe('unknown');

		// Parent route hierarchy resolution
		expect(resolveParentRoute('/', 'parent')).toBeNull();
		expect(resolveParentRoute('/', 'root')).toBeNull();
		expect(resolveParentRoute('/projects/invoizy', 'parent')).toBe('/projects');
		expect(resolveParentRoute('/projects/invoizy/', 'parent')).toBe('/projects');
		expect(resolveParentRoute('/projects/invoizy', 'root')).toBe('/');
		expect(resolveParentRoute('/projects', 'parent')).toBe('/');
		expect(resolveParentRoute('/skills', 'parent')).toBe('/');
		expect(resolveParentRoute('/nonexistent/deep/path', 'parent')).toBe('/');
	});

	it('completes commands, arguments, and inline ghost hints', () => {
		expect(completeInput('pr', COMMAND_REGISTRY, sampleSlugs)).toEqual({
			kind: 'single',
			value: 'projects'
		});

		expect(completeInput('op', COMMAND_REGISTRY, sampleSlugs)).toEqual({
			kind: 'single',
			value: 'open '
		});

		const multi = completeInput('h', COMMAND_REGISTRY, sampleSlugs);
		expect(multi).toEqual({
			kind: 'multiple',
			value: 'h',
			candidates: ['history', 'help']
		});

		expect(completeInput('open inv', COMMAND_REGISTRY, sampleSlugs)).toEqual({
			kind: 'single',
			value: 'open invoizy'
		});

		expect(completeInput('theme m', COMMAND_REGISTRY, sampleSlugs)).toEqual({
			kind: 'single',
			value: 'theme moonfly'
		});

		// Ghost suggestions
		expect(getGhostSuggestion('', COMMAND_REGISTRY, sampleSlugs)).toBe('');
		expect(getGhostSuggestion('ab', COMMAND_REGISTRY, sampleSlugs)).toBe('out_me');
		expect(getGhostSuggestion('op', COMMAND_REGISTRY, sampleSlugs)).toBe('en invoizy');
		expect(getGhostSuggestion('open ', COMMAND_REGISTRY, sampleSlugs)).toBe('invoizy');
		expect(getGhostSuggestion('open ml', COMMAND_REGISTRY, sampleSlugs)).toBe('bb-voice-timer');
		expect(getGhostSuggestion('th', COMMAND_REGISTRY, sampleSlugs)).toBe('eme ayu');
		expect(getGhostSuggestion('theme ', COMMAND_REGISTRY, sampleSlugs)).toBe('ayu');
		expect(getGhostSuggestion('s', COMMAND_REGISTRY, sampleSlugs)).toBe('kills');

		expect(levenshteinDistance('about_me', 'about_m')).toBe(1);
		expect(longestCommonPrefix(['project-alpha', 'project-beta'])).toBe('project-');
	});
});

describe('Typed History Store (history.svelte.ts)', () => {
	beforeEach(() => {
		resetHistoryForTest();
	});

	it('formats local HH:MM timestamps and parses stored JSON safely', () => {
		const sampleMs = new Date(2026, 10, 25, 9, 5).getTime();
		expect(formatLocalTime(sampleMs)).toBe('09:05');

		expect(parseStoredHistory('invalid-json')).toEqual([]);
		expect(
			parseStoredHistory(JSON.stringify([{ command: 'about_me', time: '14:32' }, { bad: 1 }]))
		).toEqual([{ command: 'about_me', time: '14:32' }]);
	});

	it('records typed commands up to max 50 in chronological order', () => {
		const fixedMs = new Date(2026, 10, 25, 14, 30).getTime();
		for (let i = 1; i <= 55; i++) {
			recordCommand(`cmd-${i}`, fixedMs);
		}

		const history = getHistory();
		expect(history.length).toBe(MAX_HISTORY);
		expect(history[0].command).toBe('cmd-6');
		expect(history[MAX_HISTORY - 1]).toEqual({ command: 'cmd-55', time: '14:30' });
	});
});

describe('Scrollback Store (scrollback.svelte.ts)', () => {
	beforeEach(() => {
		clearScrollback();
	});

	it('appends and clears inline blocks cleanly', () => {
		appendScrollback('help', { type: 'help' });
		appendScrollback('theme moonfly', { type: 'theme', theme: 'moonfly' });

		expect(getScrollback().length).toBe(2);
		expect(getScrollback()[0].echo).toBe('help');
		expect(getScrollback()[1].payload).toEqual({ type: 'theme', theme: 'moonfly' });

		clearScrollback();
		expect(getScrollback()).toEqual([]);
	});
});
