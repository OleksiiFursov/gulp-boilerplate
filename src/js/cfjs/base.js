import { animAfter } from './animate.js'

window.d = document
window.body = d.body
window.bc = body.classList
window.isMob = null

window.cfjsConfig = {}

export let theLoaded

// Animate:
export const init = ({
	delayLoading = 100,
	mobileMaxWidth = 980,
	onScrollThrottle = 10,
	onMouseMoveThrottle = 10,
	loadedAnimAfter,
} = {}) => {

	$o('.page-top', e => {
		bc[e.intersectionRatio === 0 ? 'add' : 'remove']('is-scroll')
	})
	window.cfjsConfig.mobileMaxWidth = mobileMaxWidth
	window.cfjsConfig.onScrollThrottle = onScrollThrottle
	window.cfjsConfig.onMouseMoveThrottle = onMouseMoveThrottle

	$e(window, 'load', () => {

		setTimeout(() => {
			bc.add('loaded')
			if (loadedAnimAfter) {
				animAfter(loadedAnimAfter, theLoaded)
			} else {
				theLoaded()
			}

		}, delayLoading)
	})

}
export const isLoaded = new Promise(e => theLoaded = e)
export const $ = (sel, p = d) => p.querySelector(sel)
export const $$ = (sel, p = d) => p.querySelectorAll(sel)
export const getElement = (sel, p = d) => (typeof sel === 'string' ? $(sel, p) : sel)

export const $each = (sel, call, p = d) => $$(sel, p).forEach(call)
export const $o = (sel, func, params = { rootMargin: '0px', threshold: 0.2 }) => {
	const el = getElement(sel)
	if (el) {
		const r = new IntersectionObserver(([e]) => {
			func(e, e.target)
		}, params)
		r.observe(el)
		return r
	}
}

export const $e = (sel, type, call) => {
	const el = typeof sel === 'string' ? $(sel) : sel
	el && el.addEventListener(type, call)
}

export const $v = (sel, call, once = false) => {
	isLoaded.then(() => {
		let obs = $o(sel, e => {
			if (e.isIntersecting) {
				call(sel)
				if (once) {
					obs.unobserve(getElement(sel))
				}
			}

		})
	})
}

