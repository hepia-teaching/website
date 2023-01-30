import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'
import * as jose from 'jose'

type Cookie = {
	value: string
	name: 'auth_token'
	path: '/'
	httpOnly: true
	domain: 'localhost'
}

async function getCookie(user: User): Promise<Cookie> {
	const secret = new TextEncoder().encode('secret')
	const alg = 'HS256'

	const token = await new jose.SignJWT(user)
		.setProtectedHeader({ alg })
		.setExpirationTime('2h')
		.sign(secret)

	return {
		name: 'auth_token',
		value: token,
		path: '/',
		httpOnly: true,
		domain: 'localhost',
	}
}

const student: Pick<User, 'email' | 'role'> = {
	email: faker.datatype.uuid() + '@hepia.com',
	role: 'Student',
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
const assignmentDescription = faker.datatype.uuid()

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

	const createdStudent = await prisma.user.create({
		data: student,
	})

	await prisma.learning.create({
		data: {
			fieldId: createdCourse.fieldId,
			roomId: createdCourse.roomId,
			season: createdCourse.season,
			year: createdCourse.year,
			studentId: createdStudent.id,
		},
	})

	await prisma.assignements.create({
		data: {
			fieldId: createdCourse.fieldId,
			roomId: createdCourse.roomId,
			season: createdCourse.season,
			year: createdCourse.year,
			description: assignmentDescription,
			estimated_time: faker.datatype.number({ min: 1, max: 20 }),
			startDate: dayjs().toDate(),
			endDate: dayjs().add(1, 'week').toDate(),
		},
	})

	const cookie = await getCookie(createdStudent)
	userCookies.set(createdStudent.email, cookie)
})

test('Get assignments as student', async ({ browser }) => {
	const cookie = userCookies.get(student.email)

	if (!cookie) {
		throw new Error('no cookie found')
	}

	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	await page.goto('http://localhost:3000/')
	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Liste des rendus et échéances'
	)

	expect(await page.getByTestId('assignments').textContent()).toContain(
		assignmentDescription
	)
})
