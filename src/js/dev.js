// Dev
function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

let isTouch
$e(d, 'click', e=> {
	if(e.altKey) {
		if(e.target.className==='cf-line'){
			e.target.remove();
		}else{
			const el = d.createElement('div');
			el.className = 'cf-line';
			el.style.cssText  = 'position:fixed; top:0; left:'+e.clientX+'px; z-index:99999; background:'+getRandomColor()+'; width: 3px; height:100vw;opacity: .8';
			body.append(el);
		}
	}
})

let clickStartX, clickStartY, el;
$e(body, 'mousedown', e=> {
	console.log(e);
	clickStartX = e.clientX;
	clickStartY = e.clientY;
	el = d.createElement('div');
	el.className = 'cf-rule';
	el.style.cssText = 'position: absolute; z-index:9999; background: '+getRandomColor()+';opacity: 0.4;';
	el.left = clickStartX+'px';
	el.top = clickStartY+'px';
});

$e(body, 'mousemove',e=>{
	el.width = e.clientX-clickStartX
	el.height = e.clientX-clickStartY
})

$e(body, 'mouseup', e=> {
	clickStartX = null;
	clickStartY = null;
	body.append(el);

})
