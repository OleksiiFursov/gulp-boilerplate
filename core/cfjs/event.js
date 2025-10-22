import { $e, $each, detectDevice, getElement, isLoaded } from './base.js'
import {debounce, throttle} from './utils.js'

// Click:

const onClickHashParams = []
export const onClickHash = (call) => {
    onClickHashParams.push(call)
}
let onClickParams = new Map()

function onClickHandler(e) {
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
            for (const {el, callback} of onScrollParams.values()) {
                onScrollCalc(el, callback)
            }
        })
    }
    $each(parent, el => onScrollCalc(el, callback))
}

function onScrollHandler(e) {
    onScrollParams.forEach(el => {
        if (scrollY > el.start && scrollY < el.end) {
            el.callback(e, (scrollY - el.start) / el.range, el.el)
        }
    })
}

// RESIZE:
const onResizeParams = []
const onResize = call => {
    onResizeParams.push(call)
}

const onChangeResponseParams = [];
export const onChangeResponse = call => {
    onChangeResponseParams.push(call);
}


$e(window, 'resize', debounce((e) => {
    const isMob = detectDevice();
    if (isMob !== window.isMob) {
        const key = isMob ? 'mob' : 'pc';
        for (const call of onChangeResponseParams) {
            call(e, key);
        }
        window.isMob = isMob;
    }
    for (const call of onResizeParams) {
        call(e || {})
    }
}))
// onReady

export const onReady = call => isLoaded.then(call)


const onMouseMoveParams = []
export const onMouseMove = (parent, call) => {
    if (!onMouseMoveParams.length) {
        $e(parent, 'mousemove', throttle(onMouseMoveHandler, window.cfjsConfig.onMouseMoveThrottle))
    }
    onMouseMoveParams.push(call)
}

const onMouseMoveHandler = e => {
    for (const call of onMouseMoveParams) {
        call(e)
    }
}
const onSwipeParams = new Map();

export function onSwipe(parent, call) {
	parent = getElement(parent);
	let find = onSwipeParams.get(parent);
	const values = find ? [...find, call]: [call]
	onSwipeParams.set(parent, values);
	if (values.length > 1) return;

	let start = { x: 0, y: 0 }, end = { x: 0, y: 0 }, el = null;


	$e(parent, "pointerdown", e => {
		start = { x: e.clientX, y: e.clientY };
		el = e.target;
		el.setPointerCapture(e.pointerId);
	}, false);

	$e(parent, "pointerup", e => {
		end = { x: e.clientX, y: e.clientY };

		const dX = end.x - start.x;
		const dY = end.y - start.y;
		const absX = Math.abs(dX);
		const absY = Math.abs(dY);

		const threshold = 10;
		const dir = {
			top: dY < -threshold,
			left: dX < -threshold,
			right: dX > threshold,
			bottom: dY > threshold,
		};

		if (absX > threshold && absY > threshold) {
			dir.top = dY < 0;
			dir.bottom = dY > 0;
			dir.left = dX < 0;
			dir.right = dX > 0;
		}

		for (const fn of values) {
			fn(el, {
				from: start,
				to: end,
				direction: dir,
			});
		}
	}, false);
}

const onSwipeMoveParams = new Map();

export function onSwipeMove(parent, call) {
	parent = getElement(parent);
	let find = onSwipeMoveParams.get(parent);
	const values = find ? [...find, call]: [call]
	onSwipeMoveParams.set(parent, values);
	if (values.length > 1) return;


	let start = { x: 0, y: 0 }, to = { x: 0, y: 0 }, el = null;

	$e(parent, "pointerdown", e => {
		start = { x: e.clientX, y: e.clientY };
		to = { ...start };
		el = e.target;
		el.setPointerCapture(e.pointerId);
	}, false);

	$e(parent, "pointermove", throttle(e => {
		if (!el) return;

		to = { x: e.clientX, y: e.clientY };
		const over = document.elementFromPoint(to.x, to.y);

		for (const fn of values) {
			fn(el, {
				from: start,
				to,
				over,
			});
		}
	}, window.cfjsConfig.onSwipeMoveThrottle), false);

	$e(parent, "pointerup", e => {
		el = null;
	}, false);
}
