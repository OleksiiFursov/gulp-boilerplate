const w = window
w.d = document
w.body = d.body
w.bc = body.classList
w.$ = (sel, p = d) => p.querySelector(sel)
w.$each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call)
w.$_oo = {
	rootMargin: '0px',
	threshold: 0.2,
}
w.$o = (sel, func) => {
	const el = $(sel)
	if (el) {
		new IntersectionObserver(([e]) => {
			func(e, e.target)
		}, $_oo).observe(el)
	}
}
w.$e = (sel, type, call) => {
	const el = typeof sel === 'string' ? $(sel) : sel
	el && el.addEventListener(type, call)
}
