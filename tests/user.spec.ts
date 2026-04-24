import {test, expect }  from '@playwright/test';

test('try entry', async ({ page }) => {
  await page.goto('http://localhost:3000/hotel/69bf6e712a233d444785d245?checkIn=2026-04-24&checkOut=2026-04-25&guestsAdult=1&guestsChild=0');
  await page.getByRole('button', { name: 'BOOK' }).click();
  
  await expect(page.getByRole('main')).toContainText('The Mandarin Residences02-659-90001 adult48 Oriental AvenueApr 24, 2026 to Apr 25, 2026Created Apr 24, 2026');
});