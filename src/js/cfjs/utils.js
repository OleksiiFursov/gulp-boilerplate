export const rand = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min
export const rwd = (d, m) => isMob ? m : d
export const ufirst = str => str[0].toUpperCase() + str.slice(1)
export const delay = ms => new Promise(r => setTimeout(r, ms))

export function urlencode(str) {
	return encodeURIComponent(str).replace(/%20/g, '+')
}


export const isEmpty = (value) => {
	if (value == null) return true
	if (typeof value === 'string') return value.trim() === ''
	if (Array.isArray(value)) return !value.length
	if (value instanceof Set || value instanceof Map) return !value.size
	if (typeof value === 'object') return !Object.keys(value).length
	return false
}

export function debounce(func, wait=200) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}

export function throttle(func, limit=100) {
	let lastFunc;
	let lastRan;
	return function (...args) {
		const context = this;
		const now = Date.now();
		if (!lastRan) {
			func.apply(context, args);
			lastRan = now;
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(() => {
				if (now - lastRan >= limit) {
					func.apply(context, args);
					lastRan = now;
				}
			}, limit - (now - lastRan));
		}
	};
}

