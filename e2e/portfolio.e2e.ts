import { expect, test } from '@playwright/test';

test.describe('kantZ Workstation E2E Verification', () => {
	test('renders landing page with MOTD, about_me output, featured panel, and command dock', async ({
		page
	}) => {
		await page.goto('/');
		await page.waitForSelector('body[data-hydrated="true"]');

		await expect(page).toHaveTitle(/about_me \| kantZ Workstation/);
		await expect(page.locator('section[aria-label="Message of the day"]')).toBeVisible();
		await expect(page.locator('main')).toContainText('$ about_me');
		await expect(page.locator('[data-testid="palette-swatches"] > span')).toHaveCount(8);
		await expect(page.locator('fieldset legend', { hasText: 'featured' })).toBeVisible();
		// Inline flowing prompt lives inside <main>, above the sticky bottom dock, fitting within 1 desktop screen
		await expect(page.locator('main #command')).toBeVisible();
		await expect(page.locator('main #command')).toBeInViewport();
		await expect(page.locator('[data-testid="block-caret"]')).toBeVisible();
		await expect(page.locator('[data-testid="pager-hint"]')).toBeHidden();
		await expect(page.locator('nav[aria-label="Commands"] button', { hasText: 'history' })).toBeVisible();
		await expect(page.locator('footer[aria-label="Statusline"]')).toBeVisible();
		await expect(page.getByRole('button', { name: /Jump to command prompt/i })).toBeVisible();
	});

	test('executes inline commands, back navigation, ghost autosuggestion, and resets scrollback on navigation', async ({
		page
	}) => {
		await page.goto('/');
		await page.waitForSelector('body[data-hydrated="true"]');

		const input = page.locator('main #command');

		// Ghost autosuggestion accepts on ArrowRight
		await input.fill('th');
		await expect(page.locator('[data-testid="ghost-suggestion"]')).toContainText('eme ayu');
		await input.press('ArrowRight');
		await expect(input).toHaveValue('theme ayu');
		await input.fill('');

		// back on landing route shows inline info instead of navigating away
		await input.fill('back');
		await input.press('Enter');
		const liveRegion = page.locator('[aria-live="polite"]');
		await expect(liveRegion).toContainText('already at ~ (landing page)');

		// Inline help command shows clickable examples and omits printable key
		await input.fill('help');
		await input.press('Enter');
		await expect(liveRegion).toContainText('walk typed history');
		await expect(liveRegion).toContainText('examples (click to run):');
		await expect(liveRegion).not.toContainText('printable key');

		// Strict parser rejects flags on no-arg commands
		await input.fill('ls -l');
		await input.press('Enter');
		await expect(liveRegion).toContainText('usage: projects');

		// Clear removes appended scrollback while keeping page output
		await input.fill('clear');
		await input.press('Enter');
		await expect(liveRegion).toBeEmpty();
		await expect(page.locator('main')).toContainText('$ about_me');

		// Navigation command resets scrollback and changes route
		await input.fill('help');
		await input.press('Enter');
		await expect(liveRegion).toContainText('walk typed history');

		await input.fill('projects');
		await input.press('Enter');
		await expect(page).toHaveURL(/\/projects$/);
		await expect(liveRegion).toBeEmpty();
		await expect(page.locator('main')).toContainText('$ projects');

		// cd .. returns to parent route (/)
		await input.fill('cd ..');
		await input.press('Enter');
		await expect(page).toHaveURL(/\/$/);
	});

	test('switches terminal theme between moonfly and ayu via statusline button', async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('body[data-hydrated="true"]');

		const html = page.locator('html');
		await expect(html).toHaveAttribute('data-term-theme', 'moonfly');

		const themeButton = page.getByRole('button', { name: /Switch theme/i });
		await themeButton.click();

		await expect(html).toHaveAttribute('data-term-theme', 'ayu');
		await expect(page.locator('[role="status"]')).toContainText('theme: ayu');

		await themeButton.click();
		await expect(html).toHaveAttribute('data-term-theme', 'moonfly');
	});

	test('renders project case study page and navigates up via back command', async ({ page }) => {
		await page.goto('/projects/mlbb-voice-timer');
		await page.waitForSelector('body[data-hydrated="true"]');

		await expect(page.locator('h1')).toContainText(/MLBB Voice Timer/i);
		await expect(page.locator('dt', { hasText: 'stack' })).toBeVisible();
		await expect(page.locator('.md')).toBeVisible();

		// Pager hint appears when inline prompt sits below the viewport on tall case studies, hiding redundant [$] button
		const pagerHint = page.locator('[data-testid="pager-hint"]');
		await expect(pagerHint).toBeVisible();
		await expect(page.getByRole('button', { name: /Jump to command prompt/i })).toBeHidden();
		await pagerHint.click();

		const input = page.locator('main #command');
		await expect(input).toBeInViewport();
		await expect(input).toBeFocused();
		await expect(pagerHint).toBeHidden();
		await expect(page.getByRole('button', { name: /Jump to command prompt/i })).toBeVisible();

		await input.fill('..');
		await input.press('Enter');
		await expect(page).toHaveURL(/\/projects$/);
	});

	test('renders skills, experience, contact, and 404 inside terminal shell', async ({ page }) => {
		await page.goto('/skills');
		await expect(page).toHaveTitle(/skills \| kantZ Workstation/);
		await expect(page.locator('main')).toContainText('$ skills');

		await page.goto('/experience');
		await expect(page).toHaveTitle(/experience \| kantZ Workstation/);
		await expect(page.locator('main')).toContainText('$ experience');

		await page.goto('/contact');
		await expect(page).toHaveTitle(/contact \| kantZ Workstation/);
		await expect(page.locator('dt', { hasText: 'email' })).toBeVisible();

		const notFoundRes = await page.goto('/nonexistent-terminal-route');
		expect(notFoundRes?.status()).toBe(404);
		await expect(page.locator('main')).toContainText('command not found: /nonexistent-terminal-route');
	});

	test('redirects unauthenticated user from /admin to /login', async ({ page }) => {
		await page.goto('/admin');

		await expect(page).toHaveURL(/\/login/);
		await expect(page.locator('h1')).toContainText(/Admin Portal/i);
	});
});
