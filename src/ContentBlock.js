
import {
	Element
} from './Element.js'



class ContenBlockList{


	addBlock(item){

		if(!this._items){
			this._items=[];
		}

		this._items.push(item);

	}


	getBlockWithTarget(target){

		var matches=(this._items||[]).filter((item)=>{
			return item.getElement()===target;
		});

		if(matches.length==0){
			throw 'Invalid target';
		}

		return matches.shift();


	}

}


export const ContentBlocks=new ContenBlockList();


export class ContentBlock{

	constructor(container, data){

		this._element=container.appendChild(new Element('section', {
			"class":"content-item empty"
		}));

		this._data=data;

		ContentBlocks.addBlock(this);

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

	}

	getElement(){
		return this._element;
	}


	getData(){


		var data={};
		
		Object.keys(this._data).forEach((k)=>{
			data[k]=this._data[k]
		});


		data.items=(this._items||[]).map((item)=>{
			return item.getData();
		});

		return data;


	}


}


