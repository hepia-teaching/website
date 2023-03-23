import { test, expect } from '@playwright/test'
import { PrismaClient, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

let users: Pick<User, 'email' | 'role'>[] = []

test.beforeEach(async () => {
	const prisma = new PrismaClient()

	users = [
		{
			email: faker.datatype.uuid() + '@hepia.com',
			role: 'Teacher',
		},
		{
			email: faker.datatype.uuid() + '@hepia.com',
			role: 'Student',
		},
		{
			email: faker.datatype.uuid() + '@hepia.com',
			role: 'Admin',
		},
	]

	await prisma.user.createMany({
		data: users,
	})
})

users.map((user) => {
	test(`login as ${user.role}`, async ({ page }) => {
		await page.goto('http://localhost:3000/')
		await expect(page.getByTestId('homepage-title')).toHaveText('Login')

		const responsePromise = page.waitForResponse(
			'http://localhost:3000/api/trpc/auth.login?batch=1'
		)

		const element = page.getByTestId('login-email')
		await element.selectText()
		await element.type(user.email)
		await page.getByText('submit').click()
		const response = await responsePromise

		expect(response.request().method()).toBe('POST')
		expect(response.status()).toBe(200)
		expect(page.url()).toBe('http://localhost:3000/')
		expect(await page.getByTestId('navbar-role').textContent()).toBe(user.role)
	})
})
