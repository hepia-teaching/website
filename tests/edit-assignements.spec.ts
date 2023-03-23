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

const newField: Pick<Field, 'name'> = {
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

test(`Edit an assignement as teacher`, async ({ browser }) => {
	const prisma = new PrismaClient()

	const createdField = await prisma.field.create({
		data: field,
	})

	const createdNewField = await prisma.field.create({
		data: newField,
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

	await prisma.course.create({
		data: {
			fieldId: createdNewField.id,
			roomId: createdRoom.id,
			season: semester.season,
			year: semester.year,
			description: newCourseDescription,
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
			{
				fieldId: createdNewField.id,
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
				description: faker.lorem.word(),
				estimated_time: faker.datatype.number({ min: 1, max: 100 }),
				startDate: dayjs().subtract(1, 'day').toDate(),
			},
		})

	const cookie = await createCookie(createdTeacher)
	const browserContext = await browser.newContext()
	await browserContext.addCookies([cookie])
	const page = await browserContext.newPage()

	const course = [fieldId, roomId, season, year].join('-')
	await page.goto(
		`http://localhost:3000/courses/${course}/assignements/${id}/edit`
	)

	await expect(page.getByTestId('homepage-title')).toHaveText(
		'Edit an Assignement'
	)

	const responsePromise = page.waitForResponse(
		'http://localhost:3000/api/trpc/assignment.update?batch=1'
	)

	await page.getByTestId('start-date').fill('2023-02-02')
	await page.getByTestId('end-date').fill('2023-05-12')
	await page.getByTestId('estimated-time').fill('45')
	await page.getByTestId('description').fill('Edit Assignments')
	await page.getByText('submit').click()

	const createResponse = await responsePromise

	expect(createResponse.request().method()).toBe('POST')
	expect(createResponse.status()).toBe(200)
})
