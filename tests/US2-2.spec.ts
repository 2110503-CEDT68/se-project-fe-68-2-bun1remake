import { test, expect } from '@playwright/test';
import { LogInAsUser } from './auth-test';

test.describe('User Story 2-2',()=>{
   test.describe('Logged In Cases', () => {
        test.beforeEach(async ({ page }) => {
            await LogInAsUser(page);
        });
        test('Acceptance criteria 1',async ({page})=>{
            await page.goto('http://localhost:3000/hotel');

            await page.getByRole('link', { name: 'detail' }).nth(1).click();
            //delay 3s
            await page.waitForTimeout(3000);

            await expect(page.locator('h2')).toContainText('5.0★');

            //delay 3s
            await page.waitForTimeout(3000);
        
        });

        test('Acceptance criteria 2',async ({page})=>{
            await page.goto('http://localhost:3000/hotel');

            await page.getByRole('button', { name: 'Next page' }).click();
            await page.getByRole('button', { name: 'Next page' }).click();

            await page.getByRole('link', { name: 'ขอเทสplaywrightหน่อย' }).click();
            await expect(page.getByRole('main')).toContainText('No ratings yet');

            //delay 3s
            await page.waitForTimeout(3000);
        
        })
    });
});