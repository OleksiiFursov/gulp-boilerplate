let d = document,
	body = d.body,
	bc = body.classList,
	isMob,
    eventList = {};

// utils:
export const rand = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min;
export const rwd = (d, m) => isMob ? m : d;


export const delay = ms => new Promise(r => setTimeout(r, ms));


export const init = () => {
	$o('.page-top', e => {
		bc[e.intersectionRatio === 0 ? 'add' : 'remove']('is-scroll')
	})
	$e(window, 'load', ()=>{

	})

}
export const isLoaded = new Promise(e => theLoaded = e)
export const $ = (sel, p = d) => p.querySelector(sel)
export const $$ = (sel, p = d) => p.querySelectorAll(sel)
export const getElement = sel => (typeof sel === 'string' ? $(sel) : sel)

export const $each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call)
export const $o = (sel, func, params = { rootMargin: '0px', threshold: 0.2 }) => {
	const el = $(sel)
	if (el) {
		new IntersectionObserver(([e]) => {
			func(e, e.target)
		}, params).observe(el)
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
