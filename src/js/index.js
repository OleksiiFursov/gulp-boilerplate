const GOOGLE_ANALYTICS = 'G-XXXXXXX';

const d = document,
  body = d.body,
  bc = body.classList,
  $ = (sel, p = d) => p.querySelector(sel),
  $each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call),
  $_oo = {
	  rootMargin: '0px',
	  threshold: 1.0,
  },
  $o = (sel, func) => {
	  const el = $(sel)
	  if (el) {
		  new IntersectionObserver(([e]) => {
			  func(e, e.target)
		  }, $_oo).observe(el)
	  }

  },
  $e = (sel, type, call) => {
	  const el = typeof sel === 'string' ? $(sel) : sel
	  el && el.addEventListener(type, call)
  }

// GOOGLE ANALYTICS
window.dataLayer = window.dataLayer || []
function gtag () {dataLayer.push(arguments)}
gtag('js', new Date())
gtag('config', GOOGLE_ANALYTICS)


$o('.page-top', e => {
	bc[e.intersectionRatio === 0 ? 'add' : 'remove']('is-scroll')
})

$e(body, 'click', e => {
	const el = e.target
	const elC = el.classList
	const fx = elC.length ? elC[0]: ''


	if (el.tagName === 'A' && el.hash.startsWith('#')) {
		bc.remove('header-menu-active')
		return
	}
	if (fx.startsWith('fx-')) {

		// Burger:
		if (fx === 'fx-header-burger') {
			bc.toggle('header-menu-active')
			// Open
		}else if (fx.includes('fx-active-modal')) {

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
