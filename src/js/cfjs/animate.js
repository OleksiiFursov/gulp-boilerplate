import { $e, $each, $v, getElement } from './base.js'
import { rand } from './utils.js'

export const animAfter = (el, call) => $e(el, 'transitionend', call)
export const vAnim = (sel, call) => $each(sel, el => $v(el, call, true))
export const vAnimRun = (el, call=null, parent = d) => {
	const $el = getElement(el, parent)
	if (!$el) return 0
	$el.classList.add('run')
	call && animAfter(el, call)
}
export const randAnim = (el, className = 'run', min = 200, max = 1000) => setTimeout(() => el.classList.add(className), rand(min, max))
