/**
 * Micro Markdown parser for Terminal UI.
 * Pure function renderMarkdown(raw: string): string.
 * Escapes unsafe HTML characters before parsing.
 * Outputs plain HTML tags with no classes or inline styles.
 */

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export function renderMarkdown(raw: string): string {
	if (!raw || !raw.trim()) return '';

	// 1. Escape HTML first
	const escaped = escapeHtml(raw);

	// 2. Line-by-line block parsing
	const lines = escaped.split(/\r?\n/);
	const output: string[] = [];

	let inFence = false;
	const fenceLines: string[] = [];

	let currentListType: 'ul' | 'ol' | null = null;
	let inBlockquote = false;
	const blockquoteLines: string[] = [];

	function closeList() {
		if (currentListType === 'ul') {
			output.push('</ul>');
			currentListType = null;
		} else if (currentListType === 'ol') {
			output.push('</ol>');
			currentListType = null;
		}
	}

	function closeBlockquote() {
		if (inBlockquote) {
			const bqContent = blockquoteLines
				.map((line) => parseInline(line))
				.join('<br>');
			output.push(`<blockquote><p>${bqContent}</p></blockquote>`);
			blockquoteLines.length = 0;
			inBlockquote = false;
		}
	}

	for (let i = 0; i < lines.length; i++) {
		const rawLine = lines[i];
		const trimmed = rawLine.trim();

		// Fenced code start/end
		if (trimmed.startsWith('```')) {
			if (!inFence) {
				closeList();
				closeBlockquote();
				inFence = true;
				fenceLines.length = 0;
			} else {
				inFence = false;
				const formattedLines = fenceLines.map((l) => `<span>${l}</span>`).join('\n');
				output.push(`<pre tabindex="0"><code>${formattedLines}</code></pre>`);
				fenceLines.length = 0;
			}
			continue;
		}

		if (inFence) {
			fenceLines.push(rawLine);
			continue;
		}

		// Empty line
		if (!trimmed) {
			closeList();
			closeBlockquote();
			continue;
		}

		// Blockquote: starts with &gt; (since > was escaped)
		if (trimmed.startsWith('&gt; ') || trimmed === '&gt;') {
			closeList();
			inBlockquote = true;
			blockquoteLines.push(trimmed.startsWith('&gt; ') ? trimmed.slice(5) : '');
			continue;
		} else {
			closeBlockquote();
		}

		// Headings: #, ## demoted to h3; ### -> h3; #### -> h4
		const h4Match = trimmed.match(/^####\s+(.*)$/);
		if (h4Match) {
			closeList();
			const content = parseInline(h4Match[1]);
			output.push(`<h4>${content}</h4>`);
			continue;
		}

		const h3Match = trimmed.match(/^###\s+(.*)$/);
		if (h3Match) {
			closeList();
			const content = parseInline(h3Match[1]);
			output.push(`<h3>${content}</h3>`);
			continue;
		}

		const h2Match = trimmed.match(/^##\s+(.*)$/);
		if (h2Match) {
			closeList();
			const content = parseInline(h2Match[1]);
			output.push(`<h3>${content}</h3>`);
			continue;
		}

		const h1Match = trimmed.match(/^#\s+(.*)$/);
		if (h1Match) {
			closeList();
			const content = parseInline(h1Match[1]);
			output.push(`<h3>${content}</h3>`);
			continue;
		}

		// Unordered list: - or *
		const ulMatch = trimmed.match(/^[-*]\s+(.*)$/);
		if (ulMatch) {
			if (currentListType === 'ol') {
				closeList();
			}
			if (currentListType !== 'ul') {
				output.push('<ul>');
				currentListType = 'ul';
			}
			const content = parseInline(ulMatch[1]);
			output.push(`<li>${content}</li>`);
			continue;
		}

		// Ordered list: 1. or \d+.
		const olMatch = trimmed.match(/^\d+\.\s+(.*)$/);
		if (olMatch) {
			if (currentListType === 'ul') {
				closeList();
			}
			if (currentListType !== 'ol') {
				output.push('<ol>');
				currentListType = 'ol';
			}
			const content = parseInline(olMatch[1]);
			output.push(`<li>${content}</li>`);
			continue;
		}

		// Paragraph
		closeList();
		const pContent = parseInline(trimmed);
		output.push(`<p>${pContent}</p>`);
	}

	if (inFence) {
		const formattedLines = fenceLines.map((l) => `<span>${l}</span>`).join('\n');
		output.push(`<pre tabindex="0"><code>${formattedLines}</code></pre>`);
	}

	closeList();
	closeBlockquote();

	return output.join('\n');
}

function isSafeEscapedUrl(url: string, protocol: 'http' | 'mailto'): boolean {
	if (/(&quot;|&#39;|&lt;|&gt;|[\s"'<>])/i.test(url)) {
		return false;
	}
	if (protocol === 'http') {
		return /^https?:\/\/[^\s"'<>]+$/i.test(url);
	}
	return /^mailto:[^\s"'<>]+$/i.test(url);
}

function formatTextStyles(text: string): string {
	// Bold: **text**
	let styled = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

	// Italic: *text* requiring non-space adjacent characters
	styled = styled.replace(/(?<!\*)\*(?!\s|\*)([^*\n]+?)(?<=\S)\*(?!\*)/g, '<em>$1</em>');

	return styled;
}

function parseInline(text: string): string {
	// 1. Extract inline code first so contents are never parsed as bold, italic, or links
	const tokens: string[] = [];
	const inlineCodeRegex = /`([^`\n]+)`/g;
	let parsed = text.replace(inlineCodeRegex, (_match, codeContent) => {
		const id = tokens.length;
		tokens.push(`<code>${codeContent}</code>`);
		return `<<MD_TOKEN_${id}>>`;
	});

	// 2. Extract safe links ([text](url)) before bold/italic so URLs are never altered
	parsed = parsed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, linkUrl) => {
		const trimmedUrl = (linkUrl as string).trim();
		const styledText = formatTextStyles(linkText as string);

		if (isSafeEscapedUrl(trimmedUrl, 'http')) {
			const id = tokens.length;
			tokens.push(
				`<a href="${trimmedUrl}" rel="noopener noreferrer" target="_blank">${styledText}</a>`
			);
			return `<<MD_TOKEN_${id}>>`;
		}

		if (isSafeEscapedUrl(trimmedUrl, 'mailto')) {
			const id = tokens.length;
			tokens.push(`<a href="${trimmedUrl}" rel="noopener noreferrer">${styledText}</a>`);
			return `<<MD_TOKEN_${id}>>`;
		}

		return match;
	});

	// 3. Parse bold and italic on remaining prose
	parsed = formatTextStyles(parsed);

	// 4. Restore extracted tokens (links and inline code)
	parsed = parsed.replace(/<<MD_TOKEN_(\d+)>>/g, (_match, id) => {
		return tokens[Number.parseInt(id, 10)] ?? '';
	});

	return parsed;
}
