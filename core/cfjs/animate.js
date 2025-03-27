import { $, $$, $e, $each, $v, getElement } from './base.js'
import { rand } from './utils.js'

export const animAfter = (el, call) => $e(el, 'transitionend', call)
export const vAnim = (sel, call) => $each(sel, el => $v(el, call, true))
export const vAnimRun = (el, call = null, parent = d) => {
	const $el = getElement(el, parent)
	if (!$el) return 0
	$el.classList.add('run')
	call && animAfter(el, call)
}
export const randAnim = (el, className = 'run', min = 200, max = 1000) => setTimeout(() => el.classList.add(className), rand(min, max))


// Next version
// class xAnimClass {
//     constructor(parent) {
//         this.parent = parent ? $(parent) : d;
//         this.queue = Promise.resolve();
//     }
//
//     delay(time) {
//         this.queue = this.queue.then(() =>
//             new Promise((resolve) => {
//                 setTimeout(resolve, time);
//             })
//         );
//         return this;
//     }
//
//     run(sel) {
//         this.queue = this.queue.then(() => {
//             const el = $(sel, this.parent);
//             if (!el) console.error(`Element not found`, sel);
//             el.classList.add('run');
//         });
//         return this;
//     }
//
//     runStep(sel, delay, onRun = func) {
//         this.queue = this.queue.then(() => {
//             return new Promise((resolve) => {
//                 $each(sel, (el, i, els )=>{
// 					setTimeout(() => {
// 						onRun(el);
// 						el.classList.add('run');
// 						if (i === els.length - 1) resolve();
// 					}, i * delay);
// 				}, this.parent);
//             });
//         });
//         return this;
//     }
// }
//
// export const xAnim = parent => new xAnimClass(parent);
