import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { createCookie } from './utils/cookie'
import dayjs from 'dayjs'

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
const newCourseDescription = faker.datatype.uuid()

test(`Delete an assignement as teacher`, async ({ browser }) => {
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

	await prisma.teaching.createMany({
		data: [
			{
				fieldId: createdField.id,
				roomId: createdRoom.id,
				season: semester.season,
				year: semester.year,
				teacherId: createdTeacher.id,
			},
		],
	})

	const { id, fieldId, roomId, season, year } =
		await prisma.assignements.create({
			data: {
				fieldId: createdCourse.fieldId,
				roomId: createdCourse.roomId,
				season: createdCourse.season,
				year: createdCourse.year,
				description: newCourseDescription,
				estimated_time: faker.datatype.number({ min: 1, max: 100 }),
				startDate: dayjs().subtract(1, 'day').toDate(),
			},
		})

	const cookie = await createCookie(createdTeacher)
	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	const path = [id, fieldId, roomId, season, year].join('-')
	let res = await page.goto(`http://localhost:3000/assignements/delete/${path}`)
	expect(res?.status()).toBe(200)
	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Please confirm the deletion'
	)

	const responsePromise = page.waitForResponse(
		'http://localhost:3000/api/trpc/assignment.delete?batch=1'
	)

	await page.getByText('submit').click()

	const deleteResponse = await responsePromise

	// NOTE only POST and GET request exists on trpc, therefore, no DELETE
	expect(deleteResponse.request().method()).toBe('POST')
	expect(deleteResponse.status()).toBe(200)
})
