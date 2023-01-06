import {
	Element
} from './Element.js'


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


		this._items = [];
		this._dragndrops = [];
		this._callbacks = [];

	}


	hide() {
		document.body.classList.remove('show-panel');
	}


	show() {
		document.body.classList.add('show-panel');
	}


	toggle() {
		if (document.body.classList.contains('show-panel')) {
			this.hide();
			return;
		}
		this.show();
	}



	addItem(selectable, callback) {


		if(selectable.createInstance){
			callback=(target)=>{
				selectable.createInstance(target);
			}
		}

		if (selectable.getDisplayElement) {
			var item = this._container.appendChild(selectable.getDisplayElement());
			this._addDraggable(item, callback);
			return this;
		}


		var item = this._container.appendChild(new Element('div', {
			"html": '<label>' + selectable.name + '</label><p class="description">' + selectable.description + '</p>',
			"class": "panel-item"
		}));

		this._addDraggable(item, callback);

		return this;



	}



	updateDropTargets() {

		this._items.forEach((el, i) => {

			this._dragndrops[i].stop();
			this._dragndrops[i] = dragNdrop({
				element: el,
				dropZones: ['.content-item'],

				callback: (event) =>{
					this._dropEl(event);
				}
			});

		})


	}

	_dropEl( event){

		var el=event.element;
		el.style.cssText = '';
		console.log(event);

		if(event.dropZones&&event.dropZones.length>0){
			this._callbacks[this._items.indexOf(el)](event.dropZones[0]);
		}

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


		this._items.push(el);
		this._dragndrops.push(dnd);
		this._callbacks.push(cb);

	}

}