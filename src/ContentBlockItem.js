import {
	Element
} from './Element.js'


import {
	CurrentContentBlockPages, ContentBlockPage
} from './ContentBlock.js'

import  { DragOrderElements } from  './helpers/DragOrderElements.js';

import  { EventEmitter } from  'events';

export class ContentBlockItem extends EventEmitter{

	constructor(data){
		super();
		this._data=data;

	}

	getType(){
		return this._data.type;
	}


	setData(data){

		data=JSON.parse(JSON.stringify(data));
		Object.keys(data).forEach((k)=>{
			this._data[k]=data[k];
		})

		this.emit('update');

	}


	getDisplayElement(){


		var el= new Element('div', {
			"html":'<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>',
			"class":"panel-item"
		});


		this.on('update',()=>{
			el.innerHTML='<label>'+this._data.name+'</label><p class="description">'+this._data.description+'</p>';
		});

		this._displayEl=el;

		if(this._data.previewHtml){

			var html=this._data.previewHtml;

			if(typeof html=='function'){
				html=this._data.previewHtml();
				if(html instanceof Promise){
					var p=el.appendChild(new Element('div', {
						"class":"preview"
					}));
					html.then((html)=>{
						p.innerHTML=html;
					});
					return el;

				}



			}

			el.appendChild(new Element('div', {
				"class":"preview",
				html:html
			}));
		}

		return el;

	}




	getElement(){
		return this._element;
	}

	getContainer(){
		return this._container;
	}

	getElementDragHandle(){
		return this._container.firstChild;

	}

	getContentHintItems(){

		var hintItems=[]

		if(typeof this._data.fieldName =='string'){

			hintItems.push(this._data.fieldName);
		}


		return hintItems;
	}

	getContentHintHtml(){

		var hintItems=this.getContentHintItems();
		return (hintItems.length>0?'<label>'+hintItems.join(', ')+'</label>':'');

	}


	getInstanceElement(){


		var label=new Element('span', {
			"class":"item-detail",
			html:'<label>'+this._data.name+'</label>'+this.getContentHintHtml()+'<p class="description">'+this._data.description+'</p>'
		})


		this.on('update',()=>{
			label.innerHTML='<label>'+this._data.name+'</label>'+this.getContentHintHtml()+'<p class="description">'+this._data.description+'</p>'

		})

		var el= new Element('div', {
			"html":label,
			"class":"block-item item-type-"+this.getType()
		});

		if(this.getType().indexOf('template.')===0){
			el.classList.add('template-instance');
		}


		if(typeof this._data.fieldName =='string'){
			this.on('update', ()=>{
				label.innerHTML='<label>'+this._data.name+'</label>'+(typeof this._data.fieldName =='string'?'<label>'+this._data.fieldName+'</label>':'')+'<p class="description">'+this._data.description+'</p>';
			});
		}

		this._container=el;
		this._element=el;

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

			if((['name', 'description' ,'previewHtml', 'formHtml', 'setNodeData']).indexOf(k)>=0){
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

		var contentBlockItem=new ContentBlockItem(data);
		CurrentContentBlockPages.getPageBlockWithTarget(target).addContentBlockItem(contentBlockItem);

		this.emit('createInstance', contentBlockItem);

		return contentBlockItem;
	}

}



export class ContentBlockGroupItem extends ContentBlockItem{


	constructor(data){
		super(data);
		
		this.on('removeContentBlock',()=>{
			this.emit('update');
		});
		this.on('updateContentBlock',()=>{
			this.emit('update');
		});
		this.on('addContentBlock',()=>{
			this.emit('update');
		});



	}


	getContentHintItems(){

		var list=[]


		if(this._data.template){
			list.push(this._data.template);
		}

		return Array.prototype.concat.apply(list, (this._items||[]).map((item)=>{
			return item.getContentHintItems();
		}));
	}

	createInstance(target, itemData){

		var data=JSON.parse(JSON.stringify(this._data));
		Object.keys(itemData||{}).forEach((key)=>{
			data[key]=itemData[key];
		});

		var contentBlockItem=new ContentBlockGroupItem(data);
		CurrentContentBlockPages.getPageBlockWithTarget(target).addContentBlockItem(contentBlockItem);
		CurrentContentBlockPages.registerPageBlock(contentBlockItem);

		if(this._data.setNodeData){
			this._data.setNodeData(itemData, contentBlockItem);
		}

		this.emit('createInstance', contentBlockItem);

		return contentBlockItem;
	
	}

	addContentBlockItem(item){

		ContentBlockPage.prototype.addContentBlockItem.apply(this, arguments);

	}

	getInstanceElement(){


		var el=super.getInstanceElement()	

		this._target=el.appendChild(new Element('section', {
			"class":"content-item empty"
		}));


		this.on('removeContentBlock',()=>{
			if((this._items||[]).length==0){
				this._target.classList.add('empty');
			}
		});
	
		this.on('addContentBlock',()=>{
			if((this._items||[]).length>0){
				this._target.classList.remove('empty');
			}
		});


		this._element=this._target.appendChild(new Element('div', {
			"class":"wrap"
		}));


		this._dragOrder=new DragOrderElements(this._element);
		this._dragOrder.on('order', (indexes)=>{
			var spliced=this._items.splice(indexes[0], 1);
			this._items.splice(indexes[1], 0, spliced[0]);
			this.emit('update');
		});

		var toggle=this._target.appendChild(new Element('button', {
			"class":"toggle-btn",
			"html":'Hide',
			events:{
				click:()=>{

					if(this._target.classList.contains('collapse')){
						this._target.classList.remove('collapse');
						toggle.innerHTML="Hide"
					}else{
						this._target.classList.add('collapse');
						toggle.innerHTML="Show"
					}

				}
			}
		}));


		return el;
	}

	getTarget(){
		return this._target;
	}

	getElementDragHandle(){
		return this._container.firstChild;

	}

	getElementDragContainer(){
		return this._container;

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


export class TemplateBlockItem extends ContentBlockGroupItem{

	constructor(data, panel){

		super(data);
		this._panel=panel;

	}



	createInstance(target, itemData){

		var contentBlockItem=super.createInstance(target, itemData);

		


		var panelItem=this._panel.createTemplatePlaceholder(contentBlockItem.getData().template)

		this._panel.addItem(panelItem);


		var instances=[];

		panelItem.on('createInstance', (instance)=>{

			instances.push(instance);
			instance.on('remove', ()=>{
				instances.splice(instances.indexOf(instance), 1);
			});

		});


		contentBlockItem.on('remove', ()=>{

			this._panel.removeItem(panelItem);

		});

		contentBlockItem.on('update', ()=>{

			panelItem.setData({
				name: "Template - "+contentBlockItem.getData().template,
				type: "template."+contentBlockItem.getData().template
			});


			instances.forEach((instance)=>{
				instance.setData({
					name: "Template - "+contentBlockItem.getData().template,
					type: "template."+contentBlockItem.getData().template
				})
			});


		});


		



		return contentBlockItem;


	}

}