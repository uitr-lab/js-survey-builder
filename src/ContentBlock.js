
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


		item.on('remove', ()=>{
			var i=this._items.indexOf(item);
			this._items.splice(i, 1);
			this.emit('update');
		});

	}


	getBlockWithTarget(target){

		var matches=(this._items||[]).filter((item)=>{
			return item===target||item.getElement()===target||item.getContainer()===target;
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

		this._container=container.appendChild(new Element('section', {
			html:'<label>'+data.name+'</label>',
			"class":"content-item empty"
		}));


		this._element=this._container.appendChild(new Element('div', {
			"class":"wrap"
		}));

		this._container.appendChild(new Element('button',{
			"class":"remove-btn",
			html:"Remove",
			events:{
				click:()=>{

					this.remove();
				}
			}
		}));

		this._container.appendChild(new Element('button', {
			"class":"test-btn",
			"html":'Test',
			events:{
				click:()=>{

					this.emit('preview');

				}
			}
		}));

		var toggle=this._container.appendChild(new Element('button', {
			"class":"toggle-btn",
			"html":'Hide',
			events:{
				click:()=>{

					if(this._container.classList.contains('collapse')){
						this._container.classList.remove('collapse');
						toggle.innerHTML="Hide"
					}else{
						this._container.classList.add('collapse');
						toggle.innerHTML="Show"
					}

				}
			}
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
		this._container.classList.remove('empty');

		this._items.push(item);
		this._els.push(el);


		item.on('remove', ()=>{

			var i=this._items.indexOf(item);
			this._items.splice(i, 1);
			this._element.removeChild(el);
			this._els.splice(i, 1);
			this.emit('removeContentBlock');

		});


		item.on('update',()=>{
			this.emit('updateContentBlock');
		});

		this.emit('addContentBlock');


	}

	remove(){

		(this._items||[]).slice(0).forEach((item)=>{
			item.remove();
		});

		this._container.parentNode.removeChild(this._container);

		this.emit('remove');
		this.removeAllListeners();
		node.emit('updateNode');

		

	}

	getElement(){
		return this._element;
	}

	getContainer(){
		return this._container;
	}


	getData(){


		var data={
			name:"Page",
			type:"set"
		};

		Object.keys(this._data).forEach((k)=>{
			data[k]=this._data[k]
		});


		data.items=(this._items||[]).map((item)=>{
			return item.getData();
		});

		return data;


	}


}


