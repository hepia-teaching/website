import { FormKitNode } from '@formkit/core'

export function castNumber(node: FormKitNode) {
	node.hook.input((value, next) => {
		const casted = Number(value)
		return next(!isNaN(casted) ? casted : 0)
	})
}
