import { describe, it, expect } from 'vitest';
import { renderMarkdown } from '#lib/utils/markdown';

describe('renderMarkdown', () => {
	it('handles empty input', () => {
		expect(renderMarkdown('')).toBe('');
		expect(renderMarkdown('   ')).toBe('');
	});

	it('renders paragraph', () => {
		const out = renderMarkdown('Simple paragraph text');
		expect(out).toBe('<p>Simple paragraph text</p>');
	});

	it('renders h3 and h4 headings', () => {
		expect(renderMarkdown('### Sub Heading')).toBe('<h3>Sub Heading</h3>');
		expect(renderMarkdown('#### Sub Sub Heading')).toBe('<h4>Sub Sub Heading</h4>');
	});

	it('demotes h1 and h2 headings to h3', () => {
		expect(renderMarkdown('# Main Heading')).toBe('<h3>Main Heading</h3>');
		expect(renderMarkdown('## Secondary Heading')).toBe('<h3>Secondary Heading</h3>');
	});

	it('renders unordered lists with - and *', () => {
		const dashList = renderMarkdown('- item 1\n- item 2');
		expect(dashList).toBe('<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>');

		const starList = renderMarkdown('* star 1\n* star 2');
		expect(starList).toBe('<ul>\n<li>star 1</li>\n<li>star 2</li>\n</ul>');
	});

	it('renders ordered lists', () => {
		const out = renderMarkdown('1. first item\n2. second item');
		expect(out).toBe('<ol>\n<li>first item</li>\n<li>second item</li>\n</ol>');
	});

	it('renders blockquote', () => {
		const out = renderMarkdown('> This is a quote');
		expect(out).toBe('<blockquote><p>This is a quote</p></blockquote>');
	});

	it('renders fenced code blocks with tabindex and spans', () => {
		const raw = '```ts\nconst a = 1;\nconst b = 2;\n```';
		const out = renderMarkdown(raw);
		expect(out).toBe(
			'<pre tabindex="0"><code><span>const a = 1;</span>\n<span>const b = 2;</span></code></pre>'
		);
	});

	it('renders inline code, bold, and italic', () => {
		const out = renderMarkdown('Here is `code`, **bold**, and *italic* text.');
		expect(out).toBe(
			'<p>Here is <code>code</code>, <strong>bold</strong>, and <em>italic</em> text.</p>'
		);
	});

	it('does not parse bold or italic inside inline code or fenced code', () => {
		const inline = renderMarkdown('Inline `**not bold** and *not italic*` code');
		expect(inline).toBe('<p>Inline <code>**not bold** and *not italic*</code> code</p>');
		expect(inline).not.toContain('<strong>');
		expect(inline).not.toContain('<em>');

		const fenced = renderMarkdown('```\n**not bold**\n```');
		expect(fenced).toBe('<pre tabindex="0"><code><span>**not bold**</span></code></pre>');
		expect(fenced).not.toContain('<strong>');
	});

	it('keeps 2 * 3 * 4 literal without italic formatting', () => {
		const out = renderMarkdown('2 * 3 * 4');
		expect(out).toBe('<p>2 * 3 * 4</p>');
		expect(out).not.toContain('<em>');
	});

	it('escapes <script> and <img onerror> inputs', () => {
		const scriptOut = renderMarkdown('<script>alert("xss")</script>');
		expect(scriptOut).not.toContain('<script>');
		expect(scriptOut).toContain('&lt;script&gt;');

		const imgOut = renderMarkdown('<img src=x onerror="alert(1)">');
		expect(imgOut).not.toContain('<img');
		expect(imgOut).toContain('&lt;img');
	});

	it('rejects javascript: and data: link URLs', () => {
		const jsLink = renderMarkdown('[click](javascript:alert(1))');
		expect(jsLink).not.toContain('<a href');
		expect(jsLink).toBe('<p>[click](javascript:alert(1))</p>');

		const dataLink = renderMarkdown('[click](data:text/html,<script>alert(1)</script>)');
		expect(dataLink).not.toContain('<a href');
	});

	it('handles quote injection in link text and URL safely', () => {
		const quoteUrl = renderMarkdown('[click](https://example.com" onmouseover="alert(1))');
		// URL had quotes injected; must NOT be parsed into an <a> tag with executable attribute
		expect(quoteUrl).not.toContain('<a href');
		expect(quoteUrl).not.toContain('onmouseover="alert(1)"');
		expect(quoteUrl).toBe('<p>[click](https://example.com&quot; onmouseover=&quot;alert(1))</p>');

		const singleQuoteUrl = renderMarkdown("[click](https://example.com'onmouseover='alert(1))");
		expect(singleQuoteUrl).not.toContain('<a href');

		const quoteText = renderMarkdown('[" onmouseover="alert(1)](https://example.com)');
		expect(quoteText).toContain(
			'<a href="https://example.com" rel="noopener noreferrer" target="_blank">&quot; onmouseover=&quot;alert(1)</a>'
		);
		expect(quoteText).not.toContain('onmouseover="alert(1)"');
	});

	it('allows valid http, https, query-string, and mailto links with no classes or inline styles', () => {
		const queryLink = renderMarkdown('[docs](https://example.com/search?q=svelte&page=2)');
		expect(queryLink).toBe(
			'<p><a href="https://example.com/search?q=svelte&amp;page=2" rel="noopener noreferrer" target="_blank">docs</a></p>'
		);

		const mailLink = renderMarkdown('[email](mailto:test@example.com)');
		expect(mailLink).toBe(
			'<p><a href="mailto:test@example.com" rel="noopener noreferrer">email</a></p>'
		);
	});

	it('handles unterminated fence gracefully', () => {
		const raw = '```ts\nconst open = true;';
		const out = renderMarkdown(raw);
		expect(out).toBe('<pre tabindex="0"><code><span>const open = true;</span></code></pre>');
	});

	it('closes list before heading', () => {
		const raw = '- item 1\n- item 2\n### Next Section';
		const out = renderMarkdown(raw);
		expect(out).toBe('<ul>\n<li>item 1</li>\n<li>item 2</li>\n</ul>\n<h3>Next Section</h3>');
	});

	it('handles mixed list types properly', () => {
		const raw = '- item A\n- item B\n1. num 1\n2. num 2';
		const out = renderMarkdown(raw);
		expect(out).toBe(
			'<ul>\n<li>item A</li>\n<li>item B</li>\n</ul>\n<ol>\n<li>num 1</li>\n<li>num 2</li>\n</ol>'
		);
	});
});
