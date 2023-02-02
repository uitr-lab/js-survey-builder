
import {
	Element
} from './Element.js'

import  { EventEmitter } from  'events';

import  { DragOrderElements } from  './helpers/DragOrderElements.js';

import {
	JsonExporter
} from './JsonExporter.js';

class SharedContentBlockList extends EventEmitter {

	constructor(){
		super();
	}

	registerPageBlock(item){

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


	getPageBlockWithTarget(target){

		var matches=(this._items||[]).filter((item)=>{
			return item===target||item.getElement()===target||item.getContainer()===target||(item.getTarget&&item.getTarget()===target);
		});

		if(matches.length==0){
			throw 'Invalid target';
		}

		return matches.shift();


	}

}


export const CurrentContentBlockPages=new SharedContentBlockList();


export class ContentBlockPage extends EventEmitter {


	constructor(node, container, data){

		super();

		this._container=container.appendChild(new Element('section', {
			"class":"content-item empty"
		}));


		this._label=this._container.appendChild(new Element('label',{
			html:data.name
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


		this._container.appendChild(new Element('button', {
			"class":"json-btn",
			"html":'Edit/Import',
			events:{
				click:()=>{
					(new JsonExporter(this)).showOverlay();
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

		this._dragOrder=new DragOrderElements(this._element);
		this._dragOrder.on('order', (indexes)=>{
			var spliced=this._items.splice(indexes[0], 1);
			this._items.splice(indexes[1], 0, spliced[0]);

			node.emit('updateNode');
		});

		this.on('addContentBlock',()=>{
			node.emit('updateNode');
		});

		this.on('removeContentBlock',()=>{
			node.emit('updateNode');
		});

		this.on('updateContentBlock',()=>{
			node.emit('updateNode');
		});

		CurrentContentBlockPages.registerPageBlock(this);

		node.emit('updateNode');



		
	
	}

	setLoader(loader){
		this._loader=loader;
		return this;
	}

	clear(){
		(this._items||[]).slice(0).forEach((item)=>{
			item.remove();
		});
	}

	setData(data){

		data=data||this._data;

		if(this._loader){
			this._loader(data);
		}

		this._label.innerHTML=data.name||this._label.innerHTML;

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


		if(this._dragOrder){
			this._dragOrder.addItem(item);
		}

		item.on('remove', ()=>{

			var i=this._items.indexOf(item);
			this._items.splice(i, 1);
			this._element.removeChild(el);
			this._els.splice(i, 1);
			this.emit('removeContentBlock');

			if(this._dragOrder){
				this._dragOrder.removeItem(item);
			}

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
		this._node.emit('updateNode');

		

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


