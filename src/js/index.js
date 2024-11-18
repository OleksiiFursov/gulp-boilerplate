import { init, $o, $e, onScroll } from './base.js'
init();

onScroll('.ba', (p, e)=>{
	console.log(1, p, e);
})

$e(body, 'click', e => {
	const el = e.target
	const elC = el.classList
	const fx = elC.length ? elC[0] : ''

	if (el.tagName === 'A' && el.hash.startsWith('#')) {
		bc.remove('header-menu-active')
		return
	}
	if (fx.startsWith('fx-')) {

		// Burger:
		if (fx === 'fx-header-burger') {
			bc.toggle('header-menu-active')
			// Open
		} else if (fx.includes('fx-active-modal')) {

			const name = fx.replace('fx-', '')
			bc.add(name)
			gtag('event', name)

			// Close
		} else if (fx === 'fx-modal-close') {
			const name = el.closest('section[class^="modal-"]').classList[0]
			bc.remove('active-' + name)
			gtag('event', 'close-' + name)

			// Send
		} else if (fx === 'fx-modal-send') {
			const name = el.closest('section[class^="modal-"]').classList[0]

			bc.remove('active-' + name)
			gtag('event', 'close-' + name)
		}
	}

	if (elC.contains('overlay')) {
		bc.forEach(name => {
			if (name.includes('active-modal')) {
				bc.remove(name)
				gtag('event', 'close-' + name.replace('active', ''))
			}
		})
	}

})
