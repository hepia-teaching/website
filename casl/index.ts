import { Course, Field, Role, User } from '@prisma/client'
import { PureAbility, AbilityBuilder } from '@casl/ability'
import { PrismaQuery, Subjects } from '@casl/prisma'
import { createPrismaAbility } from './prisma'

export function defineAbilityFor(user: User | null) {
	type Actions = 'read' | 'create' | 'update' | 'delete'
	type PrismaSubjects = {
		User: User
		Course: Course
		Field: Field
	}

	type AppAbility = PureAbility<
		[Actions, Subjects<PrismaSubjects>],
		PrismaQuery
	>

	type DefinePermissions = (
		user: User,
		builder: AbilityBuilder<AppAbility>
	) => void

	const rolePermissions: Record<Role, DefinePermissions> = {
		Student(user, { can }) {
			can('read', 'User', { email: user.email })
		},
		Teacher(user, { can }) {
			can('read', 'Course', { teaching: { some: { teacherId: user.id } } })
			can('read', 'User')

			can('create', 'Course')
		},
		Admin(user, { can }) {
			can('read', 'Course')
			can('read', 'User')

			can('create', 'Course')
			can('create', 'Field')

			can('delete', 'Course')
			can('delete', 'Field')
			can('delete', 'User')
		},
	}

	const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

	const { can, cannot, build } = builder

	can('create', 'User', { role: Role.Student })

	if (user) {
		if (typeof rolePermissions[user.role] === 'function') {
			rolePermissions[user.role](user, builder)
		} else {
			throw new Error(`Trying to use unknown role "${user.role}"`)
		}
	}

	return build()
}
