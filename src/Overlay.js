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


		if(content instanceof HTMLElement){

			contentArea=main.appendChild(new Element('div',{
				"class":"content-area",
			}));
			contentArea.appendChild(content);

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

	}


}