import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { Cookie, createCookie } from './utils/cookie'

const admin: Pick<User, 'email' | 'role'> = {
	email: faker.datatype.uuid() + '@hepia.com',
	role: 'Admin',
}

const field: Pick<Field, 'name'> = {
	name: faker.datatype.uuid(),
}

const room: Pick<Room, 'number'> = {
	number: faker.datatype.uuid(),
}

const semester: Semester = {
	name: faker.lorem.word(),
	year: faker.datatype.number({ min: 2000, max: 3000 }),
	season: 'Automn',
}

const courseDescription = faker.datatype.uuid()

const userCookies = new Map<User['email'], Cookie>()

test.beforeAll(async () => {
	const prisma = new PrismaClient()

	const createdField = await prisma.field.create({
		data: field,
	})

	const createdRoom = await prisma.room.create({
		data: room,
	})

	const exists = await prisma.semester.findUnique({
		where: {
			year_season: {
				season: semester.season,
				year: semester.year,
			},
		},
	})

	if (!exists) {
		await prisma.semester.create({
			data: semester,
		})
	}

	// await prisma.course.create({
	// 	data: {
	// 		fieldId: createdField.id,
	// 		roomId: createdRoom.id,
	// 		season: semester.season,
	// 		year: semester.year,
	// 		description: courseDescription,
	// 	},
	// })

	const createdAdmin = await prisma.user.create({
		data: admin,
	})

	const cookie = await createCookie(createdAdmin)
	userCookies.set(createdAdmin.email, cookie)
})

test(`Create course as admin`, async ({ browser }) => {
	const cookie = userCookies.get(admin.email)

	if (!cookie) {
		throw new Error('no cookie found')
	}

	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	await page.goto('http://localhost:3000/courses/create')
	await expect(page.getByTestId('homepage-title')).toHaveText('Create a course')

	const responsePromise = page.waitForResponse(
		'http://localhost:3000/api/trpc/course.create?batch=1'
	)

	await page.getByTestId('room').selectOption({
		label: room.number,
	})

	await page.getByTestId('field').selectOption({
		label: field.name,
	})

	await page.getByTestId('semester').selectOption({
		label: semester.name,
	})

	await page.getByText('submit').click()

	const createResponse = await responsePromise

	expect(createResponse.request().method()).toBe('POST')
	expect(createResponse.status()).toBe(200)
})
