import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { Cookie, createCookie } from './utils/cookie'

const teacher: Pick<User, 'email' | 'role'> = {
	email: faker.datatype.uuid() + '@hepia.com',
	role: 'Teacher',
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

	const createdCourse = await prisma.course.create({
		data: {
			fieldId: createdField.id,
			roomId: createdRoom.id,
			season: semester.season,
			year: semester.year,
			description: courseDescription,
		},
	})

	const createdTeacher = await prisma.user.create({
		data: teacher,
	})

	await prisma.teaching.create({
		data: {
			fieldId: createdCourse.fieldId,
			roomId: createdCourse.roomId,
			season: createdCourse.season,
			year: createdCourse.year,
			teacherId: createdTeacher.id,
		},
	})

	const cookie = await createCookie(createdTeacher)
	userCookies.set(createdTeacher.email, cookie)
})

test(`Create assignement as teacher`, async ({ browser }) => {
	const cookie = userCookies.get(teacher.email)

	if (!cookie) {
		throw new Error('no cookie found')
	}

	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	await page.goto('http://localhost:3000/assignements/create')
	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Create a new Assignment'
	)

	const responsePromise = page.waitForResponse(
		'http://localhost:3000/api/trpc/assignment.create?batch=1'
	)

	await page.getByTestId('course').selectOption({
		label: courseDescription,
	})

	await page.getByTestId('start-date').fill('2023-02-02')
	await page.getByTestId('end-date').fill('2023-02-12')
	await page.getByTestId('estimated-time').fill('42')
	await page.getByTestId('description').fill('New Assignments')
	await page.getByText('submit').click()

	const createResponse = await responsePromise

	expect(createResponse.request().method()).toBe('POST')
	expect(createResponse.status()).toBe(200)
})
