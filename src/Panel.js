import {
	Element
} from './Element.js'



export class Panel{


	constructor(container){


			var overlay=container.appendChild(new Element('div', {
				"class":"panel-overlay",
				events:{
					click:()=>{
						this.toggle();
					}
				}
			}));


			this._container=overlay;


	}


	hide(){
		document.body.classList.remove('show-panel');
	}


	show(){
		document.body.classList.add('show-panel');
	}


	toggle(){
		if(document.body.classList.contains('show-panel')){
			this.hide();
			return;
		}
		this.show();
	}



	addItem(selectable){

		if(selectable.getDisplayElement){
			var item=this._container.appendChild(selectable.getDisplayElement());
			return this;
		}


		var item=this._container.appendChild(new Element('div', {
			"html":'<label>'+selectable.name+'</label><p class="description">'+selectable.description+'</p>',
			"class":"panel-item"
		}));


		return this;



	}

}