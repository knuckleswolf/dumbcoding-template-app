import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('unknown route renders an accessible 404 page with a way home @a11y', async ({ page }) => {
  const response = await page.goto('/missing-page');

  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);

  await page.getByRole('link', { name: 'Go to home page' }).click();
  await expect(
    page.getByRole('heading', { name: 'Universal TanStack starting point.' }),
  ).toBeVisible();
});
