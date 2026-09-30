import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Derive the expected posting count from the job content collection so this
// assertion stays correct as roles are added or removed.
const jobsDir = fileURLToPath(new URL('../src/content/jobs', import.meta.url));
const expectedRoleCount = readdirSync(jobsDir).filter((f) => f.endsWith('.md')).length;

test.describe('Open roles listing', () => {
    test('shows the roles grid with all postings', async ({ page }) => {
        await page.goto('/');
        await expect(page.getByRole('heading', { name: 'Open roles' })).toBeVisible();

        const grid = page.getByTestId('roles-grid');
        await expect(grid).toBeVisible();
        await expect(page.getByTestId('role-card')).toHaveCount(expectedRoleCount);
    });

    test('filters roles by title without navigation and restores the listing', async ({ page }) => {
        await page.goto('/');

        const search = page.getByRole('searchbox', { name: 'Search roles by title' });
        const roleCards = page.getByTestId('role-card');
        const roleTitles = page.getByTestId('role-title');
        const originalTitles = await roleTitles.allTextContents();
        const initialUrl = page.url();
        let navigationCount = 0;

        page.on('framenavigated', () => {
            navigationCount += 1;
        });

        await test.step('show only case-insensitive title matches', async () => {
            await search.fill('DATA PLATFORM');

            await expect(search).toHaveValue('DATA PLATFORM');
            await expect(page.getByRole('link', { name: /Data Platform Engineer/ })).toBeVisible();
            await expect(page.getByRole('link', { name: /Clinical Research Scientist/ })).toBeHidden();
            await expect(roleCards).toHaveCount(expectedRoleCount);
            const filteredResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();
            expect(filteredResults.violations).toEqual([]);
            await expect(page).toHaveURL(initialUrl);
            expect(navigationCount).toBe(0);
        });

        await test.step('announce when no roles match', async () => {
            const noMatchStatus = page.getByTestId('role-search-status');

            await search.fill('does not exist');

            await expect(noMatchStatus).toBeVisible();
            await expect(noMatchStatus).toHaveAttribute('role', 'status');
            await expect(roleCards.filter({ visible: true })).toHaveCount(0);
            const noMatchResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa'])
                .analyze();
            expect(noMatchResults.violations).toEqual([]);
            await expect(page).toHaveURL(initialUrl);
            expect(navigationCount).toBe(0);
        });

        await test.step('clear the search and restore the original order', async () => {
            await search.fill('');

            await expect(page.getByTestId('role-search-status')).toBeHidden();
            await expect(roleCards).toHaveCount(expectedRoleCount);
            await expect(roleTitles).toHaveText(originalTitles);
            await expect(page).toHaveURL(initialUrl);
            expect(navigationCount).toBe(0);
        });
    });

    test('links through to a role detail page', async ({ page }) => {
        await page.goto('/');
        const firstCard = page.getByTestId('role-card').first();
        const title = await firstCard.getByTestId('role-title').textContent();
        await firstCard.click();
        await expect(page.getByTestId('role-detail-title')).toHaveText(title!.trim());
        await expect(page.getByTestId('apply-form')).toBeVisible();
    });

    test('has no automatically detectable accessibility violations', async ({ page }) => {
        await page.goto('/');
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa'])
            .analyze();
        expect(results.violations).toEqual([]);
    });
});
