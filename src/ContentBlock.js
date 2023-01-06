
import {
	Element
} from './Element.js'

import  { EventEmitter } from  'events';


class ContenBlockList extends EventEmitter {

	constructor(){
		super();
	}

	addBlock(item){

		if(!this._items){
			this._items=[];
		}

		this._items.push(item);

		item.on('addContentBlock', ()=>{
			this.emit('update');
		});

		item.on('removeContentBlock', ()=>{
			this.emit('update');
		});

		item.on('udpateContentBlock', ()=>{
			this.emit('update');
		});

		this.on('sort', ()=>{
			this.emit('update');
		});

	}


	getBlockWithTarget(target){

		var matches=(this._items||[]).filter((item)=>{
			return item===target||item.getElement()===target;
		});

		if(matches.length==0){
			throw 'Invalid target';
		}

		return matches.shift();


	}

}


export const ContentBlocks=new ContenBlockList();


export class ContentBlock extends EventEmitter {


	constructor(node, container, data){

		super();

		this._element=container.appendChild(new Element('section', {
			"class":"content-item empty"
		}));

		this._data=data;

		this._node=node;

		this.on('addContentBlock',()=>{
			node.emit('updateNode');
		});

		this.on('removeContentBlock',()=>{
			node.emit('updateNode');
		});

		this.on('updateContentBlock',()=>{
			node.emit('updateNode');
		});

		ContentBlocks.addBlock(this);

		node.emit('updateNode');
	
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


		item.on('remove', ()=>{

			var i=this._items.indexOf(item);
			this._items.splice(i, 1);
			this._element.removeChild(el);
			this._els.splice(i, 1);
			this.emit('removeContentBlock');

		});





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


