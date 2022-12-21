import { FormKitNode } from '@formkit/core'

export function castNumber(node: FormKitNode) {
	node.hook.input((value, next) => next(Number(value)))
}
