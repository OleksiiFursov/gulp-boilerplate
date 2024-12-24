import {devLine, ga, init, onClick, onClickHash, onReady, vAnimRun} from './cfjs'

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

onClick(/active-modal-(.+)/, (_, [modalName])=>{
	const name = 'active-modal-'+modalName;
	bc.add(name)
	ga('event', name)
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
