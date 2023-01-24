import * as dragNdrop from 'npm-dragndrop/src/dragNdrop.js';

import  { EventEmitter } from  'events';

export class DragOrderElements extends EventEmitter{


	constructor(listEl){

		super();

		this._listEl=listEl;


	}

	addItem(item){


		return;

		var element=item.getElementDragContainer?item.getElementDragContainer():item.getElement()


		dragNdrop({
			element:element,
			elementHandle:item.getElementDragHandle?item.getElementDragHandle():item.getElement(),
			constraints:this._listEl,
			callback: (event) =>{

				var items=Array.prototype.slice.call(this._listEl.childNodes, 0);

				var currentIndex=items.indexOf(element);

				items.sort((a, b)=>{

					var ar= a.getBoundingClientRect();
					ar=ar.y+ar.height/2;

					var br= b.getBoundingClientRect();
					br=br.y+br.height/2;

					return ar-br;

				});

				var finalIndex=items.indexOf(element);

				console.log(items);

				if(finalIndex!=currentIndex){

					this.emit('order', [currentIndex, finalIndex]);

					if(finalIndex==items.length-1){
						this._listEl.appendChild(element); //move to end;
					}else{
						this._listEl.insertBefore(element, items[finalIndex+1]);
					}

					
				}

				event.element.style.cssText = '';
			}
		});



	}

	removeItem(item){


		
	}



}