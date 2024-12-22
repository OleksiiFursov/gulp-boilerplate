import { init, $o, $e, onScroll, onClick, onClickHash } from './base.js'
init();

onScroll('.ba', (p, e)=>{
	console.log(1, p, e);
})



onClick('header-burger', ()=>{
	bc.toggle('header-menu-active');
});

onClick(/active-modal-(.+)/, (_, [modalName])=>{
	const name = 'active-modal-'+modalName;
	bc.add(name)
	//gtag('event', name)
});

onClick(/close-modal-(.+)/, (_, [modalName])=>{
	bc.remove('active-modal-' + modalName);
	gtag('event', 'close-modal-' + modalName);
});
onClick('close-overlay', () =>{
	bc.forEach(name => {
		if (name.includes('active-modal')) {
			bc.remove(name)
			gtag('event', 'close-' + name.replace('active', ''))
		}
	})
})

onClickHash('', ()=>{
	bc.remove('header-menu-active')
})

