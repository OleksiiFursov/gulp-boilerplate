import {init, onClick, onClickHash, onReady, vAnimRun} from './cfjs'

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


onClick('overlay', () => {
	bc.forEach(name => {
		if (name.includes('modal-active')) {
			bc.remove(name)
			gtag('event', name.replace('active', 'close'))
		}
	})
})

onClickHash(()=>{
	bc.remove('header-menu-active')
})
