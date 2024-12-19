window.d = document
window.body = d.body
window.bc = body.classList
window.isMob = null

let theLoaded,
  eventList = {}

// utils:
export const rand = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min
export const rwd = (d, m) => isMob ? m : d
export const ufirst = str => str[0].toUpperCase() + str.slice(1);
export const delay = ms => new Promise(r => setTimeout(r, ms))

// Animate:

export const animAfter = (el, call) => $e(el, 'transitionend', call)
export const vAnim = (sel, call) => $each(sel, el => $v(el, call, true))
export const vAnimRun = (root, sel, call) => {
	const el = $(sel, root)
	if (!el) return 0
	el.classList.add('run')
	call && animAfter(el, call)
}
export const randAnim = (el, className = 'run', min = 200, max = 1000) => setTimeout(() => el.classList.add(className), rand(min, max));


const scrollPointer = new Map();

export const onScroll = (parent, callback) => {
	const h = innerHeight * .8;
	if(!eventList.onScroll)
		eventList.onScroll = [];

	$each(parent, el => {
		const rect = el.getBoundingClientRect()
		const start = rect.top + scrollY - h,
		  end = start + el.offsetHeight + h,
		  range = end - start

		scrollPointer.set(el, {
			start,
			end,
			range,
			el,
			callback
		})

	})
}

const getProgress = p => (scrollY - p.start) / p.range;

export const init = ({ delayLoading = 100, loadedAnimAfter=".header"}={}) => {

	$o('.page-top', e => {
		bc[e.intersectionRatio === 0 ? 'add' : 'remove']('is-scroll')
	})

	$e(window, 'load', () => {
		bc.add('loaded')
		setTimeout(() => {

			const eventsAvailable = ['scroll', 'resize', 'move', 'click'];
			for(const event of eventsAvailable) {
				const keyOn = 'on'+ufirst(event);
				//let p = getProgress(point)
				//console.log(3, eventList[keyOn])
				if(eventList[keyOn]){
					window.addEventListener(event, e=>{
						for(const eventCall of eventList[keyOn]){
							eventCall(e);
						}
					})
				}
				console.log(eventList[keyOn]);
			}


			if(loadedAnimAfter){
				animAfter(loadedAnimAfter, theLoaded)
			}else{
				theLoaded();
			}

		}, delayLoading)
	})

}
export const isLoaded = new Promise(e => theLoaded = e)
export const $ = (sel, p = d) => p.querySelector(sel)
export const $$ = (sel, p = d) => p.querySelectorAll(sel)
export const getElement = sel => (typeof sel === 'string' ? $(sel) : sel)

export const $each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call)
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

export function urlencode (str) {
	return encodeURIComponent(str).replace(/%20/g, '+')
}
