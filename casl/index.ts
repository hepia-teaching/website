import { Course, Role, User } from '@prisma/client'
import { PureAbility, AbilityBuilder } from '@casl/ability'
import { PrismaQuery, Subjects } from '@casl/prisma'
import { createPrismaAbility } from './prisma'

export function defineAbilityFor(user: User | null) {
	type AppAbility = PureAbility<
		[
			'read' | 'create' | 'update' | 'delete',
			Subjects<{
				User: User
				Course: Course
			}>
		],
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
			can('read', 'User')
			can('create', 'Course')
		},
		Admin(user, { can }) {
			can('read', 'User')
			can('create', 'Course')
		},
	}

	const builder = new AbilityBuilder<AppAbility>(createPrismaAbility)

	if (user) {
		if (typeof rolePermissions[user.role] === 'function') {
			rolePermissions[user.role](user, builder)
		} else {
			throw new Error(`Trying to use unknown role "${user.role}"`)
		}
	}

	return builder.build()
}
