import {
	Element
} from './Element.js'


import {
	ContentBlocks
} from './ContentBlock.js'

import  { EventEmitter } from  'events';

export class ContentBlockItem extends EventEmitter{

	constructor(data, panel){
		super();
		this._data=data;

	}

	getType(){
		return this._data.type;
	}


	getDisplayElement(){


		return new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"panel-item"
		});

	}


	getInstanceElement(){


		var el= new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"block-item"
		});

		el.appendChild(new Element('buttom', {
			"class":"remove-btn",
			"html":'Remove',
			events:{
				click:()=>{

					this.remove();

				}
			}
		}));

		return el;




	}

	remove(){

		this.emit('remove');
		this.removeAllListeners();

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

	addContentBlockItem(item){


		if(!this._items){
			this._items=[];
		}

		if(!this._els){
			this._els=[];
		}


		var el=this._element.appendChild(item.getInstanceElement());
		this._element.classList.remove('empty');

		this._items.push(item);
		this._els.push(el);

		this.emit('addContentBlock');

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


		data.items=(this._items||[]).map((item)=>{
			return item.getData();
		});

		return data;
	}


}