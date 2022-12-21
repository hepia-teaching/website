import { User } from '@prisma/client'
import { PureAbility, AbilityBuilder } from '@casl/ability'
import { PrismaQuery, Subjects } from '@casl/prisma'
import { createPrismaAbility } from './prisma'

export function defineAbilityFor(user: User | null) {
	type AppAbility = PureAbility<
		[
			'read' | 'create' | 'update' | 'delete',
			Subjects<{
				User: User
			}>
		],
		PrismaQuery
	>

	const { can, cannot, build } = new AbilityBuilder<AppAbility>(
		createPrismaAbility
	)

	can('read', 'User')
	can('create', 'User')

	if (user) {
		can('update', 'User', { email: user.email })
		can('delete', 'User', { email: user.email })
	}

	return build()
}
