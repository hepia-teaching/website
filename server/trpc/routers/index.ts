import { router } from '../trpc'
import { userRouter } from './user'
import { authRouter } from './auth'
import { courseRouter } from './course'
import { fieldRouter } from './field'
import { roomRouter } from './room'
import { semesterRouter } from './semester'

export const appRouter = router({
	user: userRouter,
	auth: authRouter,
	course: courseRouter,
	field: fieldRouter,
	room: roomRouter,
	semester: semesterRouter,
})

export type AppRouter = typeof appRouter
