import {devLine, ga, init, onClick, onClickHash, onReady, onScroll, onSwap, onSwipeMove} from './cfjs'

//devLine();

init({
	loadedAnimAfter: '.header',
	onScrollThrottle:10,
});


onScroll('.ba', (_, p, el)=>{
	el.style.opacity = p;
	if(p>0.9){
		console.log((p-0.9)*1000+'%');
		el.style.translate = 0 - (p-0.9)*1000+'%';
	}else{

	}
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

//onSwipeMove(console.log);

//onSwap(console.log)