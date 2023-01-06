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

		return data;
	}


	createInstance(target){

		ContentBlocks.getBlockWithTarget(target).addContentBlockItem(new ContentBlockItem(JSON.parse(JSON.stringify(this._data))));

	}

}



export class ContentBlockGroupItem extends ContentBlockItem{


	createInstance(target){

		var contentBlockItem=new ContentBlockGroupItem(JSON.parse(JSON.stringify(this._data)));
		ContentBlocks.getBlockWithTarget(target).addContentBlockItem(contentBlockItem);
		ContentBlocks.addBlock(contentBlockItem);
	
	}

	getInstanceElement(){


		var el=super.getInstanceElement()	

		this._element=el.appendChild(new Element('section', {
			"class":"content-item empty"
		}));


		return el;
	}

	getElement(){
		return this._element;
	}

	getData(){

		var data=super.getData();



		return data;
	}


}