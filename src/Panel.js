import {
	Element
} from './Element.js'


import {
	DropTarget
} from './helpers/DropTarget.js'


import {
	ContentBlockItem,
} from './ContentBlockItem.js';



import * as dragNdrop from 'npm-dragndrop/src/dragNdrop.js';

export class Panel {


	constructor(container) {


		var overlay = container.appendChild(new Element('div', {
			"class": "panel-overlay",
			events: {
				click: () => {
					//this.toggle();
				}
			}
		}));

		overlay.appendChild(new Element('button', {
			html:"Toggle Sidebar",
			events:{
				click:()=>{
					this.toggle();
				}
			}
		}))


		this._container = overlay;

		this._blockItems=[];
		this._itemEls = [];
		this._dragndrops = [];
		this._callbacks = [];

	}


	hide() {
		document.body.classList.remove('show-panel');
	}


	show() {
		document.body.classList.add('show-panel');
	}


	enable(){
		delete this._disabled;
		this._container.classList.remove('disabled');
		this.show();
	}

	disable(){
		this.hide()
		this._container.classList.add('disabled');
		this._disabled=true;
	}


	toggle() {
		if (document.body.classList.contains('show-panel')) {
			this.hide();
			return;
		}
		this.show();
	}

	removeItem(contentBlockItem){

		/**
		 * TODO: implement this. Template items should be automatically removed if they are deleted from
		 * the survey page. But could be an issue if it has been instantiated elsewhere
		 */

	}

	addItem(contentBlockItem, callback) {



		if(contentBlockItem.createInstance){
			callback=(target)=>{
				contentBlockItem.createInstance(target);
			}
		}

		if (contentBlockItem.getDisplayElement) {
			var item = this._container.appendChild(contentBlockItem.getDisplayElement());
			
			this._blockItems.push(contentBlockItem);
			this._addDraggable(item, callback);
			
			return this;
		}

		var item = this._container.appendChild(new Element('div', {
			"html": '<label>' + contentBlockItem.name + '</label><p class="description">' + contentBlockItem.description + '</p>',
			"class": "panel-item"
		}));

		this._blockItems.push(contentBlockItem);
		this._addDraggable(item, callback);

		return this;



	}

	getItem(type){

		var matches=(this._blockItems||[]).filter((item)=>{
			return item.getType()===type;
		});

		if(matches.length==0){

			if(type.indexOf('template.')===0){
				return this.createTemplatePlaceholder(type.split('template.').pop());
			}

			throw 'Not found';
		}

		return matches.shift();

	}


	createTemplatePlaceholder(name){


		var panelItem=new ContentBlockItem({
	
			name: "Template - "+name,
			description: "user template",
			type: "template."+name,
			variables:'{ "variable1":true, "variable2":false }',
			formHtml:'<label> Variables: </label><textarea name="variables">'+'{ "variable1":true, "variable2":false }'+'</textarea>'

		});

		return panelItem;

	}



	updateDropTargets() {

		this._itemEls.forEach((el, i) => {

			this._dragndrops[i].stop();
			this._dragndrops[i] = dragNdrop({
				element: el,
				dropZones: ['.content-item'],

				callback: (event) =>{
					this._dropEl(event);
				}
			});

			// el.addEventListener('dragNdrop:start', console.log);
			// el.addEventListener('dragNdrop:drag', console.log);
			// el.addEventListener('dragNdrop:stop', console.log);
			// el.addEventListener('dragNdrop:dropped', console.log);


		})


	}

	_dropEl( event){

		var el=event.element;
		

		if(event.dropZones&&event.dropZones.length>0){

			var dropZone=this._closestDropzone(el, event.dropZones);

			if(dropZone){
				this._callbacks[this._itemEls.indexOf(el)](dropZone);
			}
		}

		el.style.cssText = '';
		console.log(event);

	}

	_closestDropzone(el, dropZones){

		return (new DropTarget()).closestDropzone(el, dropZones);
	}


	_addDraggable(el, cb) {


		var dnd = dragNdrop({
			element: el,
			dropZones: ['.content-item'],

			callback: (event) => {
				this._dropEl(event);
				// (optional)
				// event.element, event.dropped, event.dropZones, event.constraints, event.customStyles
				
			}
		});


		this._itemEls.push(el);
		this._dragndrops.push(dnd);
		this._callbacks.push(cb);

	}

}