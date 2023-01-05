import {
	Element
} from './Element.js'


export class ContentBlockItem{

	constructor(data){
		this._data=data;
	}



	getDisplayElement(){


		return new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"panel-item"
		});

	}

}
