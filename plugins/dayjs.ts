import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'

export default defineNuxtPlugin(() => {
	dayjs.extend(utc)
	dayjs.extend(isBetween)
	dayjs.extend(customParseFormat)

	return {
		provide: {
			dayjs,
		},
	}
})
