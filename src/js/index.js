const d = document,
  body = d.body,
  bc = body.classList,
  $ = (sel, p = d) => p.querySelector(sel),
  $each = (sel, call, p = d) => p.querySelectorAll(sel).forEach(call),
  $_oo = {
	  rootMargin: "0px",
	  threshold: 1.0,
  },
  $o = (sel, func) => {
	  const el = $(sel);
	  if (el) {
		  new IntersectionObserver(([e]) => {
			  func(e, e.target);
		  }, $_oo).observe(el)
	  }

  }
$e = (sel, type, call) => {
	const el = typeof sel === 'string' ? $(sel) : sel;
	el && el.addEventListener(type, call);
};

$e(".header-burger", "click", () => {
	bc.toggle("header-menu-active");
});


$o(".page-top", e => {
	bc[e.intersectionRatio === 0 ? 'add' : 'remove']('is-scroll')
});
