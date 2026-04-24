import {test, expect }  from '@playwright/test';

test('try entry', async ({ page }) => {
  await page.goto('http://localhost:3000/hotel');
  
  await expect(page.locator('body')).toContainText('Add');
});