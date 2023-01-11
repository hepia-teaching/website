import { PrismaClient } from '@prisma/client'
import * as dayjs from 'dayjs'

const prisma = new PrismaClient()

async function main() {
	const admin = await prisma.user.create({
		data: {
			email: 'admin@hepia.local',
			role: 'Admin',
		},
	})

	const teacher = await prisma.user.create({
		data: {
			email: 'teacher@hepia.local',
			role: 'Teacher',
		},
	})

	const student = await prisma.user.create({
		data: {
			email: 'student@hepia.local',
			role: 'Student',
		},
	})

	const room = await prisma.room.create({
		data: {
			number: 'A404',
		},
	})

	const maths = await prisma.field.create({
		data: {
			name: 'Maths',
		},
	})

	const french = await prisma.field.create({
		data: {
			name: 'French',
		},
	})

	const semester1 = await prisma.semester.create({
		data: {
			name: 'Automn 2023',
			year: 2023,
			season: 'Automn',
		},
	})

	const semester2 = await prisma.semester.create({
		data: {
			name: 'Spring 2023',
			year: 2023,
			season: 'Spring',
		},
	})

	const course = await prisma.course.create({
		data: {
			fieldId: maths.id,
			roomId: room.id,
			season: semester1.season,
			year: semester1.year,
		},
	})

	const teaching = await prisma.teaching.create({
		data: {
			fieldId: course.fieldId,
			roomId: course.roomId,
			season: course.season,
			year: course.year,
			teacherId: teacher.id,
		},
	})

	const learning = await prisma.learning.create({
		data: {
			fieldId: course.fieldId,
			roomId: course.roomId,
			season: course.season,
			year: course.year,
			studentId: student.id,
		},
	})

	const assignment1 = await prisma.assignements.create({
		data: {
			fieldId: course.fieldId,
			roomId: course.roomId,
			season: course.season,
			year: course.year,
			description: 'Assignment 1',
			estimated_time: 10,
			startDate: dayjs().toDate(),
			endDate: dayjs().add(1, 'week').toDate(),
		},
	})

	const assignment2 = await prisma.assignements.create({
		data: {
			fieldId: course.fieldId,
			roomId: course.roomId,
			season: course.season,
			year: course.year,
			description: 'Assignment 2',
			estimated_time: 5,
			startDate: dayjs().add(1, 'week').toDate(),
			endDate: dayjs().add(2, 'week').toDate(),
		},
	})
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await prisma.$disconnect()
		process.exit(1)
	})
