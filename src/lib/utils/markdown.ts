/**
 * Micro Markdown parser for safe rendering of case studies.
 * Parses headings (h3, h4), bold (**text**), lists (- item), and paragraphs.
 * Escapes unsafe HTML characters before rendering.
 */
export function renderMarkdown(raw: string): string {
	if (!raw) return '';

	// Escape basic HTML entities to avoid injection
	const escaped = raw
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');

	const lines = escaped.split('\n');
	const output: string[] = [];
	let inList = false;

	for (const line of lines) {
		const trimmed = line.trim();

		if (trimmed.startsWith('### ')) {
			if (inList) {
				output.push('</ul>');
				inList = false;
			}
			const text = parseInline(trimmed.slice(4));
			output.push(`<h3 class="font-bold text-[14px] text-[#000080] border-b border-[#C0C0C0] pb-1 mt-3 mb-1.5">${text}</h3>`);
		} else if (trimmed.startsWith('#### ')) {
			if (inList) {
				output.push('</ul>');
				inList = false;
			}
			const text = parseInline(trimmed.slice(5));
			output.push(`<h4 class="font-bold text-[13px] text-[#000080] mt-2 mb-1">${text}</h4>`);
		} else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
			if (!inList) {
				output.push('<ul class="space-y-1 my-1.5 pl-4 list-disc">');
				inList = true;
			}
			const text = parseInline(trimmed.slice(2));
			output.push(`<li class="text-[13px] leading-relaxed">${text}</li>`);
		} else if (trimmed === '') {
			if (inList) {
				output.push('</ul>');
				inList = false;
			}
		} else {
			if (inList) {
				output.push('</ul>');
				inList = false;
			}
			const text = parseInline(trimmed);
			output.push(`<p class="text-[13px] leading-relaxed mb-2">${text}</p>`);
		}
	}

	if (inList) {
		output.push('</ul>');
	}

	return output.join('\n');
}

function parseInline(text: string): string {
	return text
		// Bold **text**
		.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-[#000000]">$1</strong>')
		// Italic *text*
		.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
		// Inline code `code`
		.replace(/`(.*?)`/g, '<code class="win-mono bg-[#EFEFEF] px-1 py-0.5 border border-[#C0C0C0] text-[11px]">$1</code>');
}
