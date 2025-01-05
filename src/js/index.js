import {ga, init, onClick, onClickHash, onReady, vAnimRun} from './cfjs'

//devLine();
init({
	loadedAnimAfter: '.header',
	onScrollThrottle:10,
});
onReady(()=>{
	vAnimRun('.footer', ()=>vAnimRun('#start'))
})


onClick('header-burger', ()=>{
	bc.toggle('header-menu-active');
});

onClick(/modal-(active|close)-(.+)/, (e, [query, action]) => {
	bc.toggle(query, action === 'active');
	gtag('event', action)
});


onClick(/close-modal-(.+)/, (_, [modalName])=>{
	bc.remove('active-modal-' + modalName);
	ga('event', 'close-modal-' + modalName);
});

onClick('close-overlay', () =>{
	bc.forEach(name => {
		if (name.includes('active-modal')) {
			bc.remove(name)
			ga('event', 'close-' + name.replace('active-', ''))
		}
	})
})

onClickHash(()=>{
	bc.remove('header-menu-active')
})
