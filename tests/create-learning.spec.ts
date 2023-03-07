import { test, expect } from '@playwright/test'
import { PrismaClient, User, Field, Room, Semester } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { Cookie, createCookie } from './utils/cookie'

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

    await prisma.course.create({
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

    const cookie = await createCookie(createdStudent)
    userCookies.set(createdStudent.email, cookie)
})

test(`Create assignement as teacher`, async ({ browser }) => {
    const cookie = userCookies.get(student.email)

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

    const responsePromise = page.waitForResponse(
        'http://localhost:3000/api/trpc/learning.create?batch=1'
    )

    await page.getByTestId('course').selectOption({
        label: field.name,
    })
    await page.check('text=' + student.email)
    await page.getByText('submit').click()

    const createResponse = await responsePromise

    expect(createResponse.request().method()).toBe('POST')
    expect(createResponse.status()).toBe(200)
})
