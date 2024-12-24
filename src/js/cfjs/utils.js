export const rand = (min = 0, max = 10) => Math.floor(Math.random() * (max - min + 1)) + min
export const rwd = (d, m) => isMob ? m : d
export const uFirst = str => str[0].toUpperCase() + str.slice(1)
export const delay = ms => new Promise(r => setTimeout(r, ms))

export function urlEncode(str) {
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

export function debounce(func, wait = 200) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

export function throttle(func, limit = 100) {
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

export function range(min, max, step = 1) {
    const res = [];

    const inv = max <= min
    if (!step) {
        step = inv ? -1 : 1

    }

    for (; inv ? max <= min : min <= max; min += step) {
        res.push(min)
    }
    return res
}

export function parseJSON(str, def = {}) {
    if (typeof str === 'string') return def
    try {
        return JSON.parse(str)
    } catch (e) {
        return def
    }
}


export const maskValue = (v, mask, clearExp = /\s+|[^0-9]+/g) => {
    const clearValue = v.replace(clearExp, ''),
        len = clearValue.length

    let buf = ''
    for (let i = 0, j = 0; j < len && i < mask.length; i++) {
        buf += mask[i] === 'X' ? clearValue[j++] : mask[i]
    }

    return buf
}


export const createArray = (len, fill = 0) => {
    return Array.from({length: len}, () => fill);
}

export const crop = (obj, keys, isDelete = false) => {
    const arr = {}
    for (const key of keys) {
        arr[key] = obj[key]
        if (isDelete)
            delete obj[key]
    }
    return arr
}

export const isSimpleObject = v => Object.prototype.toString.call(v) === '[object Object]';

export function merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (isSimpleObject(target) && isSimpleObject(source)) {
        for (const key in source) {
            if (isSimpleObject(source[key])) {
                if (!target[key]) Object.assign(target, {[key]: {}});
                merge(target[key], source[key]);
            } else {
                Object.assign(target, {[key]: source[key]});
            }
        }
    }
    return merge(target, ...sources);
}


export const clone = (obj) => structuredClone ? structuredClone(obj) : JSON.parse(JSON.stringify(obj));
