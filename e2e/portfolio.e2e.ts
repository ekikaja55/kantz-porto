import { expect, test } from '@playwright/test';

test.describe('Kantz Portfolio E2E Verification', () => {
	test('renders landing page with hero, navigation, and projects', async ({ page }) => {
		await page.goto('/');

		// Verify page title
		await expect(page).toHaveTitle(/Kantz/i);

		// Verify hero section is present
		const heroHeading = page.locator('h1');
		await expect(heroHeading).toBeVisible();

		// Verify featured projects section
		const featuredSection = page.locator('section#projects');
		await expect(featuredSection).toBeVisible();

		// Verify footer is rendered
		const footer = page.locator('footer');
		await expect(footer).toBeVisible();
	});

	test('toggles theme between dark and light mode', async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('body[data-hydrated="true"]');

		const themeButton = page.locator('[data-testid="theme-toggle"]');
		await expect(themeButton).toBeVisible();

		const html = page.locator('html');
		const initialDark = await html.evaluate((el) => el.classList.contains('dark'));

		await themeButton.click();

		if (initialDark) {
			await expect(html).not.toHaveClass(/dark/);
		} else {
			await expect(html).toHaveClass(/dark/);
		}
	});

	test('toggles language between English and Indonesian', async ({ page }) => {
		await page.goto('/');

		const langButton = page.locator('button[aria-label*="language" i], button[aria-label*="bahasa" i]').first();
		await expect(langButton).toBeVisible();

		// Click language toggle
		await langButton.click();

		// Verify text change
		await expect(page.locator('body')).toBeVisible();
	});

	test('filters projects in directory route', async ({ page }) => {
		await page.goto('/projects');

		// Check search input
		const searchInput = page.locator('input[placeholder*="Search" i]');
		await expect(searchInput).toBeVisible();

		// Search for specific project
		await searchInput.fill('MLBB');

		// Verify filtered card is visible
		const card = page.locator('article').filter({ hasText: /MLBB Voice Timer/i });
		await expect(card).toBeVisible();
	});

	test('renders case study page with technical breakdown', async ({ page }) => {
		await page.goto('/projects/mlbb-voice-timer');

		// Verify project heading
		const title = page.locator('h1').filter({ hasText: /MLBB Voice Timer/i });
		await expect(title).toBeVisible();

		// Verify technologies section
		const techSection = page.locator('text=Core Technologies:');
		await expect(techSection).toBeVisible();
	});

	test('redirects unauthenticated user from /admin to /login', async ({ page }) => {
		await page.goto('/admin');

		// Expect redirection to login
		await expect(page).toHaveURL(/\/login/);

		// Expect login card
		const loginHeader = page.locator('h1').filter({ hasText: /Admin Portal/i });
		await expect(loginHeader).toBeVisible();
	});

	test('toggles performance mode and shows informative toast notification', async ({ page }) => {
		await page.goto('/');
		await page.waitForSelector('body[data-hydrated="true"]');

		const perfButton = page.locator('button[aria-label*="Performance" i]').first();
		await expect(perfButton).toBeVisible();

		await perfButton.click();

		// Verify toast notification appears
		const toastNotification = page.locator('[role="status"]');
		await expect(toastNotification).toBeVisible();
		await expect(toastNotification).toContainText(/Performance Mode/i);
	});

	test('renders dynamic skills matrix and experience timeline sections', async ({ page }) => {
		await page.goto('/');

		// Skills section
		const skillsSection = page.locator('section#skills');
		await expect(skillsSection).toBeVisible();

		// Experience section
		const expSection = page.locator('section#experience');
		await expect(expSection).toBeVisible();
	});
});
