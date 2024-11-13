const w = window;

w.d = document
w.body = d.body
w.bc = body.classList


export const $ = (sel, p = d) => p.querySelector(sel);
export const $$ = (sel, p = d) => p.querySelectorAll(sel);
export const getElement = sel => (typeof sel === 'string' ? $(sel) : sel);

export const $each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call)
export const $o = (sel, func, params={rootMargin: '0px', threshold: 0.2,}) => {
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
				call(sel);
				if (once) {
					obs.unobserve(getElement(sel))
				}
			}

		})
	})
};
