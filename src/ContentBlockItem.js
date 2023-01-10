import {
	Element
} from './Element.js'


import {
	ContentBlocks
} from './ContentBlock.js'

import  { EventEmitter } from  'events';

export class ContentBlockItem extends EventEmitter{

	constructor(data){
		super();
		this._data=data;

	}

	getType(){
		return this._data.type;
	}


	getDisplayElement(){


		var el= new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"panel-item"
		});

		if(this._data.previewHtml){
			el.appendChild(new Element('div', {
				"class":"preview",
				html:this._data.previewHtml
			}));
		}

		return el;

	}


	getInstanceElement(){


		var el= new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"block-item"
		});

		var editBtn=el.appendChild(new Element('button', {
			"class":"edit-btn",
			"html":'Edit',
			events:{
				click:()=>{

					editBtn.classList.add('hidden');


					var form=el.appendChild(new Element('form', {
						html:this._data.formHtml,
					}));


				

					Array.prototype.slice.call(form.querySelectorAll("*")).forEach((el)=>{

						if(typeof el.name=='string'&&typeof this._data[el.name]!='undefined'){
							el.value=this._data[el.name];
						}
						
					});


					form.addEventListener('change', ()=>{


						var data={};
						var formData=new FormData(form);
						for (const key of formData.keys()) {
							this._data[key]=formData.get(key);
						}
					
						this.emit('update');




					});
					
					var cancel=form.appendChild(new Element('button', {
						"class":"hide-btn",
						html:"Close",
						events:{
							click:()=>{
								editBtn.classList.remove('hidden');
								el.removeChild(form);
							}
						}
					}));



				}
			}
		}));

		el.appendChild(new Element('button', {
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

			if((['name', 'description' ,'previewHtml', 'formHtml']).indexOf(k)>=0){
				return;
			}

			data[k]=this._data[k];
		});

		return data;
	}


	createInstance(target, itemData){

		var data=JSON.parse(JSON.stringify(this._data));
		Object.keys(itemData||{}).forEach((key)=>{
			data[key]=itemData[key];
		});

		ContentBlocks.getBlockWithTarget(target).addContentBlockItem(new ContentBlockItem(data));

	}

}



export class ContentBlockGroupItem extends ContentBlockItem{


	createInstance(target, itemData){

		var data=JSON.parse(JSON.stringify(this._data));
		Object.keys(itemData||{}).forEach((key)=>{
			data[key]=itemData[key];
		});

		var contentBlockItem=new ContentBlockGroupItem(data);
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