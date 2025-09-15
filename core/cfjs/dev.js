
import { $e } from './base.js'
import { rand } from './utils.js'

function getRandomColor () {
	let letters = '0123456789ABCDEF'
	let color = '#'
	for (let i = 0; i < 6; i++) {
		color += letters[rand(0, 15)]
	}
	return color
}

let styleDev = null;
export function styleInline(css){
	if(!styleDev){
		styleDev = document.createElement('style')
		body.appendChild(styleDev)
	}
	styleDev.textContent+= "\n" + css
}

export const devLine = () => {
	styleInline(`.cf-line{
		position:fixed;
		top:0; 
		z-index:99999;
		width: 3px;
		height:100vw;
		opacity: .8;
	}`);

	$e(d, 'click', e => {
		if (e.altKey) {
			if (e.target.className === 'cf-line') {
				e.target.remove()
			} else {
				const el = d.createElement('div')
				el.className = 'cf-line'
				el.style.cssText = 'left:' + e.clientX + 'px; background:' + getRandomColor() + ';'
				body.append(el)
			}

		}
	})

}

export function ga(){
	return gtag ?? console.log
}
