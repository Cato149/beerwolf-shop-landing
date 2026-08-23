import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('presents the complete commission journey', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Personal websites for furry identities/i,
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('link', { name: /Order via TelegramBot/i }).first(),
  ).toBeVisible();
  await expect(page.locator('[data-archive-card]')).toHaveCount(3);
  await expect(
    page.getByRole('heading', {
      name: 'Need website? Better call Beerwolf.',
    }),
  ).toBeAttached();
});

test('supports keyboard entry and persists Russian', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: /Skip to the main/i })).toBeFocused();

  await expect(page.getByRole('link', { name: 'Beerwolf' })).toBeVisible();
  const meLink = page.getByRole('link', { name: 'ME' }).first();
  await expect(meLink).toBeVisible();
  await expect(meLink).toHaveAttribute('href', /beerwolf\.site/);

  await page.getByRole('button', { name: 'RU' }).first().click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('фурри-образов');
  await expect(page.getByRole('link', { name: 'Пиволк' })).toBeVisible();
  await expect(page.getByRole('link', { name: /Это я/ }).first()).toBeVisible();

  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ru');
});

test('has no serious automated accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  const severeViolations = results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? ''),
  );

  expect(severeViolations).toEqual([]);
});

test('admin studio does not use a relative OAuth placeholder', async ({ page, request }) => {
  const config = await request.get('/admin/config.yml');
  expect(config.ok()).toBeTruthy();
  const body = await config.text();
  expect(body).not.toContain('REPLACE_WITH_OAUTH_PROXY_URL');
  expect(body).toContain('auth_methods: [token]');

  await page.goto('/admin/');
  await expect(page).toHaveURL(/\/admin\/?$/);
  await expect(page.locator('script[src*="sveltia-cms"]')).toHaveCount(1);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: /Personal websites for furry identities/i,
    }),
  ).toHaveCount(0);
});

test('archive file picker stays on the selected dossier', async ({ page }) => {
  await page.goto('/');
  await page.locator('#archive').scrollIntoViewIfNeeded();

  const picker = page.getByLabel('Choose a portfolio file from the archive');
  await picker.selectOption({ index: 1 });

  await expect(page.getByRole('heading', { level: 1 })).not.toBeInViewport();
  await expect(page.getByRole('heading', { name: 'Soft Riot' })).toBeVisible();
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('keeps every archive dossier in the document flow', async ({ page }) => {
    await page.goto('/');
    await page.locator('#archive').scrollIntoViewIfNeeded();

    const cards = page.locator('[data-archive-card]');
    await expect(cards).toHaveCount(3);
    for (let index = 0; index < 3; index += 1) {
      await expect(cards.nth(index)).toBeVisible();
    }
  });
});
