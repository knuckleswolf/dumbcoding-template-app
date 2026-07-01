import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('home page renders template content', async ({ page }) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { name: 'Universal TanStack starting point.' }),
  ).toBeVisible();
  await expect(page.getByRole('region', { name: 'Template foundations' })).toBeVisible();
});

test('home page has no automatically detectable accessibility violations @a11y', async ({
  page,
}) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
