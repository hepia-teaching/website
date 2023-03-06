import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import { Cookie, createCookie } from './utils/cookie'

const admin: Pick<User, 'email' | 'role'> = {
	email: faker.datatype.uuid() + '@hepia.com',
	role: 'Admin',
}

const field: Pick<Field, 'name'> = {
	name: faker.datatype.uuid(),
}

const field1: Pick<Field, 'name'> = {
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
const courseDescription1 = faker.datatype.uuid()

const userCookies = new Map<User['email'], Cookie>()

test.beforeAll(async () => {
	const prisma = new PrismaClient()

	const createdField = await prisma.field.create({
		data: field,
	})

	const createdField1 = await prisma.field.create({
		data: field1,
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

	await prisma.course.create({
		data: {
			fieldId: createdField.id,
			roomId: createdRoom.id,
			season: semester.season,
			year: semester.year,
			description: courseDescription,
		},
	})

	await prisma.course.create({
		data: {
			fieldId: createdField1.id,
			roomId: createdRoom.id,
			season: semester.season,
			year: semester.year,
			description: courseDescription1,
		},
	})

	const createdAdmin = await prisma.user.create({
		data: admin,
	})

	const cookie = await createCookie(createdAdmin)
	userCookies.set(createdAdmin.email, cookie)
})

test('Get courses as admin', async ({ browser }) => {
	const cookie = userCookies.get(admin.email)

	if (!cookie) {
		throw new Error('no cookie found')
	}

	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	await page.goto('http://localhost:3000/learning/create')
	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Assign Courses to Students'
	)

	await page.getByTestId('course').selectOption({
		label: field.name,
		index: 0,
	})

	await page.getByTestId('course').selectOption({
		label: field1.name,
		index: 1,
	})
})
