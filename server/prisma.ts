import { PrismaClient } from '@prisma/client'

declare global {
	var prisma: PrismaClient | undefined
}

const isProduction = process.env.NODE_ENV !== 'production'

export const client =
	globalThis.prisma ||
	new PrismaClient({
		log: isProduction ? ['query', 'info', 'warn', 'error'] : [],
	})

if (isProduction) globalThis.prisma = client
