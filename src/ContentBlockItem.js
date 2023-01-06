import {
	Element
} from './Element.js'


import {
	ContentBlocks
} from './ContentBlock.js'

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


	getInstanceElement(){


		return new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"block-item"
		});

	}


	getData(){

		var data={};
		Object.keys(this._data).forEach((k)=>{

			if((['name', 'description']).indexOf(k)>=0){
				return;
			}

			data[k]=this._data[k];
		});

		return JSON.parse(JSON.stringify(this._data));
	}


	createInstance(target){

		ContentBlocks.getBlockWithTarget(target).addContentBlockItem(new ContentBlockItem(JSON.parse(JSON.stringify(this._data))));

	}

}
