import {
	Element
} from './Element.js'

export class Overlay{



	constructor(content, buttons){


		var overlay=document.body.appendChild(new Element('div', {
			"class":"window-overlay",
			events:{
				click:()=>{
					overlay.parentNode.removeChild(overlay);
				}
			}
		}));

		var main=overlay.appendChild(new Element('div',{
			"class":"content",
			events:{
				click:(e)=>{
					e.stopPropagation();
				}
			}
		}));


		var contentArea;


		if(content instanceof HTMLElement||Array.isArray(content)){

			contentArea=main.appendChild(new Element('div',{
				"class":"content-area",
			}));

			if(Array.isArray(content)){

				content.forEach((c)=>{
					contentArea.appendChild(c);
				});

			}else{
				contentArea.appendChild(content);
			}

			

		}else{
		
			contentArea=main.appendChild(new Element('div',{
				html:content,
				"class":"content-area",
			}));
		}

		

		main.appendChild(new Element('button',{
			html:"Close",
			"class":"close-btn",
			events:{
				click:(e)=>{
					overlay.parentNode.removeChild(overlay);
				}
			}
		}));


		(buttons||[]).forEach((b)=>{
			main.appendChild(b);
		});

		this._contentArea=contentArea;
		this._overlay=overlay;


	}

	fullscreen(){
		this._overlay.classList.add('fullscreen');
	}


	close(){
		if(this._overlay.parentNode){
			this._overlay.parentNode.removeChild(this._overlay);
		}
	}

	setSize(arg){

		this._overlay.style.cssText='';

		this._sizeArg=arg;

		Object.keys(arg).forEach((key)=>{
			if((['width', 'height']).indexOf(key)==-1){
				return;
			}

			this._overlay.style.cssText+=' --'+key+':'+arg[key]+';';

			if(key=='width'){
				this._overlay.style.cssText+=' --left'+': calc( 50% - '+(parseInt(arg[key])/2)+'px );';
			}

			if(key=='height'){
				this._overlay.style.cssText+=' --top'+': calc( 50% - '+(parseInt(arg[key])/2)+'px );';
			}


		})

		return this;

	}

	fitContent(){


		this._interval=setInterval(()=>{


			if(!document.contains(this._contentArea)){
				clearInterval(this._interval);
				return;
			}

			this._fitContent();
		
		}, 1000);

		this._fitContent();
		setTimeout(this._fitContent.bind(this), 50);
		setTimeout(this._fitContent.bind(this), 500);

	}

	_fitContent(){


		if(!document.contains(this._contentArea)){
			return;
		}

		var frame=this._contentArea.parentNode;
		var frameHeight=frame.clientHeight;
		var frameWidth=frame.clientWidth;


		var diffX=this._contentArea.scrollWidth-this._contentArea.clientWidth;
		var diffY=this._contentArea.scrollHeight-this._contentArea.clientHeight;

		if(diffX===0&&diffY===0){
			return;
		}

		if(this._sizeArg){

			if(this._sizeArg.height){
				var h=parseInt(this._sizeArg.height);
				this._sizeArg.height=Math.min(window.innerHeight-100, h+diffY)+"px";
			}

			if(this._sizeArg.width){
				var w=parseInt(this._sizeArg.width);
				this._sizeArg.width=Math.min(window.innerWidth-100, h+diffX)+"px";
			}

			this.setSize(this._sizeArg);
			return;
		}

		this.setSize({
			"height":Math.min(window.innerHeight-100, frameHeight+diffY)+"px",
			"width":Math.min(window.innerWidth-100, frameWidth+diffX)+"px"
		});


	}


}

Overlay.Element = Element;

window.Overlay = Overlay;