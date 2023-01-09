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

		var contentArea=main.appendChild(new Element('div',{
			html:content,
			"class":"content-area",
		}));

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

		
	


	}





}