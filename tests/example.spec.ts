import { test, expect } from '@playwright/test'

test('homepage has title', async ({ page }) => {
	await page.goto('http://localhost:3000/')
	await expect(page.getByTestId('homepage-title')).toHaveText('Welcome to Hepia')
})
