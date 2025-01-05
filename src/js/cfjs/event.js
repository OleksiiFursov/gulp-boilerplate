import {$e, $each, detectDevice, isLoaded} from './base.js'
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
const onSwipeParams = [];

export function onSwipe(call) {
    onSwipeParams.push(call)
    if (onSwipeParams.length > 1) return
    let touchStart = {x: 0, y: 0}, touchEnd = {x: 0, y: 0}, el = null;

    $e(d, "touchstart", e => {
        const touch = e.touches[0];
        touchStart = {x: touch.clientX, y: touch.clientY};
        el = e.target;
    }, false);

    $e(d, "touchend", e => {
        const touch = e.changedTouches[0];
        touchEnd = {x: touch.clientX, y: touch.clientY};

        const deltaX = touchEnd.x - touchStart.x;
        const deltaY = touchEnd.y - touchStart.y;
        const absDeltaX = Math.abs(deltaX);
        const absDeltaY = Math.abs(deltaY);


        const threshold = 10;
        const direction = {
            top: deltaY < -threshold,
            left: deltaX < -threshold,
            right: deltaX > threshold,
            bottom: deltaY > threshold,
        };

        // Учитываем диагонали
        if (absDeltaX > threshold && absDeltaY > threshold) {
            direction.top = deltaY < 0;
            direction.bottom = deltaY > 0;
            direction.left = deltaX < 0;
            direction.right = deltaX > 0;
        }
        for (const call of onSwipeParams) {
            call(el,
                {
                    from: touchStart,
                    to: touchEnd,
                    direction,
                });
        }

    }, false);
}

const onSwipeMoveParams = [];

export function onSwipeMove(call) {
    onSwipeMoveParams.push(call);
    if (onSwipeMoveParams.length > 1) return;

    let touchStart = {x: 0, y: 0}, currentTouch = {x: 0, y: 0}, el = null;

    $e(d, "touchstart", (e) => {
        const touch = e.touches[0];
        touchStart = {x: touch.clientX, y: touch.clientY};
        currentTouch = {...touchStart};
        el = e.target;

    }, false);

    $e(d, "touchmove", throttle((e) => {
        const touch = e.touches[0];
        currentTouch = {x: touch.clientX, y: touch.clientY};

        const targetElement = d.elementFromPoint(currentTouch.x, currentTouch.y);

        for (const call of onSwipeMoveParams) {
            call(el, {
                from: touchStart,
                current: currentTouch,
                over: targetElement,
            });
        }
    }, window.cfjsConfig.onSwipeMoveThrottle), false);
}
