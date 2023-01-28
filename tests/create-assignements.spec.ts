import { test, expect } from '@playwright/test'
import { PrismaClient, User } from '@prisma/client'
import { faker } from '@faker-js/faker'

const users: Pick<User, 'email' | 'role'>[] = [
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

test.beforeAll(async () => {
	const prisma = new PrismaClient()

	await prisma.user.createMany({
		data: users,
	})
})

test(`Create assignement as teacher`, async ({ page }) => {
	await page.goto('http://localhost:3000/')
	await expect(page.getByTestId('homepage-title')).toHaveText('Login')

	const responsePromise = page.waitForResponse(
		'http://localhost:3000/api/trpc/auth.login?batch=1'
	)

	const teacher = users[0]
	const element = page.getByTestId('login-email')
	await element.selectText()
	await element.type(teacher.email)
	await page.getByText('submit').click()
	const response = await responsePromise

	expect(response.request().method()).toBe('POST')
	expect(response.status()).toBe(200)
	expect(page.url()).toBe('http://localhost:3000/')
	expect(await page.getByTestId('navbar-role').textContent()).toBe(teacher.role)

	// testing create
	await page.goto('http://localhost:3000/assignements/create')
	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Create a new Assignment'
	)

	// testing form inputs
	await page.getByTestId('course').selectOption({ label: 'Maths' })
	await page.getByTestId('start-date').fill('2023-02-02')
	await page.getByTestId('end-date').fill('2023-02-12')
	await page.getByTestId('estimated-time').fill('42')
	await page.getByTestId('description').fill('New Assignments')

	await page.getByText('submit').click()

	const createResponse = await responsePromise

	expect(createResponse.request().method()).toBe('POST')
	expect(createResponse.status()).toBe(200)
})
