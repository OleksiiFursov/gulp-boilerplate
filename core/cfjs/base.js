import { animAfter } from './animate.js'

export let theLoaded

window.d = document
window.body = d.body
window.bc = body.classList

window.cfjsConfig = {}
export const detectDevice = () => innerWidth < window.cfjsConfig.mobileMaxWidth || innerWidth < innerHeight
window.isMob = detectDevice()

// Animate:
export const init = ({
	delayLoading = 100,
	mobileMaxWidth = 980,
	onScrollThrottle = 10,
	onMouseMoveThrottle = 10,
	onSwipeMoveThrottle = 10,
	loadedAnimAfter,
	preloader = false,
	preloaderText = 'Loading...',
} = {}) => {

	$o('.page-top', e => {
		bc.toggle('is-scroll', e.intersectionRatio === 0)
	})
	// Preloader

	let preloaderTimer
	if (preloader) {
		preloaderTimer = setTimeout(() => {
			$('.preloader').textContent = preloaderText
		}, 300)
	}

	Object.assign(cfjsConfig, {
		mobileMaxWidth,
		onScrollThrottle,
		onMouseMoveThrottle,
		onSwipeMoveThrottle,
	})

	$e(window, 'load', () => {
		setTimeout(() => {
			bc.add('loaded')
			if (preloader)
				clearTimeout(preloaderTimer)
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
export const func = () => 1
export const getElement = (sel, p = d) => (typeof sel === 'string' ? $(sel, p) : sel)

export const interacted = {}
const interactionPromise = {}

export function onUserInteraction (call, events = ['click', 'keydown', 'mousemove', 'touchstart', 'scroll']) {
	return (() => {
		const keys = events.sort().join()
		if (interacted[keys]) return Promise.resolve()
		if (!interactionPromise[keys]) {
			interactionPromise[keys] = new Promise((resolve) => {
				const handler = () => {
					interacted[keys] = true
					$each(events, (ev) =>
					  $eR(window, ev, handler),
					)
					resolve()
				}

				events.forEach((ev) =>
				  $e(window, ev, handler, { once: true }),
				)
			})
		}

		return interactionPromise[keys]
	})().then(call)
}

export const $each = (sel, call, p = d) => (Array.isArray(sel) || sel instanceof NodeList ? sel : $$(sel, p)).forEach(call)
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

export const $e = (sel, type, call, options) => {
	const el = typeof sel === 'string' ? $(sel) : sel
	el && el.addEventListener(type, call, options)
}

export const $eR = (sel, type, call) => {
	const el = typeof sel === 'string' ? $(sel) : sel
	el && el.removeEventListener(type, call)
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

export const css = (sel, prop, value = undefined, unit = 'rem') => {
	const $el = getElement(sel)

	if (value === undefined){
		const st = getComputedStyle($el)
		return st[prop]
	}

	const exlProp = ['line-height', 'lineHeight', 'opacity', 'flex-grow', 'scale', 'zoom', 'flexGrow', 'flex', 'z-index', 'zIndex', 'order', 'orphans', 'widows', 'tab-size', 'tabSize', 'animation-iteration-count', 'animationIterationCount'];
	if (typeof value === 'number' && value !== 0 && !exlProp.includes(value))
	{
		value += unit
	}
	$el.style[prop] = value
}

export const setCSS = (selector, props) => {
	const $el = getElement(selector)
	for (const prop in props) {
		css($el, prop, props[prop]);
	}
}

// export const icss = (sel, prop, value, unit='rem') => {
//     const $el = getElement(sel);
//     if(!$el.styleInit)
//         $el.styleInit = {};
//
//     if (!$el.styleInit[prop]){
//         $el.styleInit[prop] = css(sel, prop)
//     }
//
//     return {
//         set(prop, val) {
//
//             $el.style[prop] = val;
//         }
//     }
// }
// export const qCss = sel => {
//     const $el = getElement(sel);
//     $el.styleInit = {};
//     return {
//         set(prop, val) {
//             if ($el.styleInit[prop]){
//                 $el.styleInit[prop] = css(sel, prop)
//             }
//             $el.style[prop] = val;
//         }
//     }
// }
