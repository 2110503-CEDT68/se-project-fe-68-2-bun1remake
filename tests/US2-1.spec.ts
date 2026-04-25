import { test, expect } from '@playwright/test';
import { LogInAsUser } from './auth-test';

test.describe('User Story 2-1',()=>{
   test.describe('Logged In Cases', () => {
        test.beforeEach(async ({ page }) => {
            await LogInAsUser(page);
        });
        test('Acceptance criteria 1',async ({page})=>{
            test.setTimeout(60000);
            await page.locator('a[href="/profile"]').first().click();
            
            await expect(page.getByRole('textbox', { name: 'Email Address' })).toHaveValue('user01@gmail.com');

            await page.getByRole('link', { name: 'HOTELS' }).click();
            await page.waitForSelector('text=The Mandarin Residences', { timeout: 30000 });
            await page.locator('a').filter({ hasText: 'DETAIL' }).first().click();
            await page.waitForSelector('h1:has-text("The Mandarin Residences")', { timeout: 15000 });
            await page.getByRole('button', { name: 'Write a review' }).click();
            await page.getByRole('button', { name: 'Rate 4' }).click();
            await page.getByRole('textbox', { name: 'Add your comment' }).fill('Good');
            await page.getByRole('button', { name: 'Submit Review' }).click();
        
            const review = page.locator('div').filter({ hasText: 'Good' }).first();
            await expect(review).toContainText('4.0');
            await expect(review).toContainText('user1');
            await expect(review).toContainText('Good');
            
            await page.getByRole('button', { name: 'LOGOUT' }).click();
            await page.waitForTimeout(3000);
            await page.getByRole('link', { name: 'LOGIN' }).click();
            await page.getByRole('textbox', { name: 'Email Address' }).fill('user2@mail.com');
            await page.getByRole('textbox', { name: 'Password' }).fill('zxcvbnm');
            await page.getByRole('button', { name: 'LOG IN' }).click();
            await page.waitForURL('**/', { timeout: 5000 });
            await page.locator('a[href="/profile"]').first().click();

            await expect(page.getByRole('textbox', { name: 'Email Address' })).toHaveValue('user2@mail.com');

            await page.getByRole('link', { name: 'HOTELS' }).click();
            await page.waitForSelector('text=The Mandarin Residences', { timeout: 30000 });
            await page.locator('a').filter({ hasText: 'DETAIL' }).first().click();
            await page.waitForSelector('h1:has-text("The Mandarin Residences")', { timeout: 15000 });
            const user1Review = page.locator('div').filter({ hasText: 'user1' }).filter({ hasText: 'Good' }).first();
            await user1Review.scrollIntoViewIfNeeded();

            await expect(user1Review).toBeVisible();
            await expect(user1Review).toContainText('4.0');
            await expect(user1Review).toContainText('user1');
            await expect(user1Review).toContainText('Good');
        });
        test('Acceptance criteria 2-1:No Comment',async ({page})=>{
            test.setTimeout(60000);
            await page.getByRole('link', { name: 'HOTELS' }).click();
            await page.waitForSelector('text=The Mandarin Residences', { timeout: 30000 });
            await page.locator('a').filter({ hasText: 'DETAIL' }).first().click();
            await page.waitForSelector('h1:has-text("The Mandarin Residences")', { timeout: 15000 });
            await page.getByRole('button', { name: 'Write a review' }).click();
            await page.getByRole('button', { name: 'Rate 4' }).click();
            await page.getByRole('button', { name: 'Submit Review' }).click();

            await expect(page.getByText('Please write a comment.')).toBeVisible();
        })
    });
    test.describe('Guest Cases (Not Login)', () => {
        test('Acceptance criteria 2-2:Not Login',async ({page})=>{
            test.setTimeout(60000);
            await page.goto('http://localhost:3000/');
            await page.getByRole('link', { name: 'HOTELS' }).click();
            await page.waitForSelector('text=Four Seasons Chiang Mai', { timeout: 30000 });
            await page.locator('a').filter({ hasText: 'DETAIL' }).nth(3).click();
            await page.waitForSelector('h1:has-text("Four Seasons Chiang Mai")', { timeout: 15000 });
            await page.getByRole('button', { name: 'Write a review' }).click();
            await page.getByRole('button', { name: 'Rate 1' }).click();
            await page.getByRole('textbox', { name: 'Add your comment' }).fill('Suck');
            await page.getByRole('button', { name: 'Submit Review' }).click();
            
            await page.waitForTimeout(5000);

            await expect(page.getByRole('button', { name: 'Submit Review' })).toBeVisible();
            await expect(page.locator('article').filter({ hasText: 'Suck' })).not.toBeVisible();
        });
    });
});