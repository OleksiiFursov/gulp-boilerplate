import { $e, $each, isLoaded } from './base.js'
import { debounce, throttle } from './utils.js'

// Click:

const onClickHashParams = []
export const onClickHash = (call) => {
	onClickHashParams.push(call)
}
let onClickParams = new Map()

function onClickHandler (e) {
	const el = e.target
	if (el.tagName === 'A' && el.hash) {
		const hash = el.hash.slice(1)
		for (const call of onClickHashParams) {
			call(e, hash)
		}
	}
	const actionEl = el.closest('[data-action]')
	if (actionEl) {
		const actions = actionEl.dataset.action.split(' ')
		for (const action of actions) {
			const find = onClickParams.get(action)
			if (find) {
				for (const eventCall of onClickParams.get(action) || []) {
					eventCall(e)
				}
			} else {
				for (const [key, calls] of onClickParams) {

					if (key instanceof RegExp) {
						const match = action.match(key)
						if (match) {
							for (const call of calls) {
								call(e, match)
							}
						}

					}
				}
			}
		}
	}
}

export const onClick = (action, call) => {
	if (!onClickParams.size) {
		window.addEventListener('click', onClickHandler)
	}
	if (!onClickParams.has(action)) {
		onClickParams.set(action, [])
	}
	onClickParams.get(action).push(call)
}

// SCROLL:
const onScrollParams = new Map()

const onScrollCalc = (el, callback) => {
	const rect = el.getBoundingClientRect()
	const start = rect.top + scrollY - innerHeight,
	  end = Math.min(scrollMaxY, start + el.offsetHeight + innerHeight),
	  range = end - start

	onScrollParams.set(el, {
		start,
		end,
		range,
		el,
		callback,
	})

}

export const onScroll = (parent, callback) => {
	if (!onScrollParams.size) {
		$e(window, 'scroll', throttle(onScrollHandler, window.cfjsConfig.onScrollThrottle))
		onResize(() => {
			for (const { el, callback } of onScrollParams.values()) {
				onScrollCalc(el, callback)
			}
		})
	}
	$each(parent, el => onScrollCalc(el, callback))
}

function onScrollHandler (e) {
	onScrollParams.forEach(el => {
		if (scrollY > el.start && scrollY < el.end) {
			el.callback(e, (scrollY - el.start) / el.range, el.el)
		}
	})
}

// RESIZE:
const onResizeParams = []
const onResize = call => {onResizeParams.push(call)}

$e(window, 'resize', debounce(e => {
	window.isMob = innerWidth < window.cfjsConfig.mobileMaxWidth
	for (const call of onResizeParams) {
		call(e)
	}
}))

// onReady

export const onReady = call => {
	isLoaded.then(call)
}

const onMouseMoveParams = []
export const onMouseMove = call => {
	if (!onMouseMoveParams.length) {
		$e(window, 'mousemove', throttle(onMouseMoveHandler, window.cfjsConfig.onMouseMoveThrottle))
	}
	onMouseMoveParams.push(call)
}

const onMouseMoveHandler = e => {
	for (const call of onMouseMoveParams) {
		call(e)
	}
}
