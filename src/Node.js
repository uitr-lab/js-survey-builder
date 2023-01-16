
import {GraphNode} from './GraphNode.js'
import {Element} from './Element.js'

import {DragGraphNodeArrows} from './DragGraphNodeArrows.js'


export class Node extends GraphNode{



	constructor(parent, data) {

		super();

		this._parent = parent;
		this._element = new Element('div', {
			"class": 'graph-node'
		});

		this._childNodeLimit=1;
		
		this._container=new Element('div', {
			"class": 'node-container'
		});
		this._container.appendChild(this._element);
		this._element.appendChild(new Element('button',{
			"class":"remove-btn",
			html:"Remove",
			events:{
				click:()=>{

					this.remove();
				}
			}
		}))

		
		
		this._addDraggableNodes();
		



		this.on("addNode",()=>{

			var count=this.realChildNodes().length;

			this._container.setAttribute('data-children-count', count);

			this._container.classList.add('has-children');
			this._container.classList.remove('no-children');

			this.emit('updateNode');
		});

		this.on("removeNode",()=>{

			var count=this.realChildNodes().length;

			this._container.setAttribute('data-children-count', count);

			if(count==0){
				this._container.classList.remove('has-children');
				this._container.classList.add('no-children');
			}

			this.emit('updateNode');

		})


		

		var addNode=this._container.appendChild(new Element('button', {
			html: "Add Section",
			"class":"add-node-btn",
			events: {
				click: () => {
					this.add('section');
					if(this._childNodeLimit>0&&this.realChildNodes().length>=this._childNodeLimit){
						addNode.classList.add('hidden');
					}
					
				}
			}
		}));






		/*

		this.on('addNode', ()=>{
			if(this._insertNode){
				return;
			}
			this._insertNode=this._container.insertBefore(new Element('button', {
				html: "Insert Section",
				"class":"insert-node-btn",
				events: {
					click: () => {
						
					}
				}
			}), addNode);

		});

		this.on('removeNode',()=>{

			if(this.realChildNodes()<=1){

				if(this._insertNode){
					this._insertNode.parentNode.removeChild(this._insertNode);
					delete this._insertNode;
				}
			}

		})

		*/
			
		this.renderElement();

		Object.keys(data).forEach((key) => {
			var v = data[key];

			if (key === 'elements') {
				v.forEach((el) => {
					this._element.appendChild(el);
				});
			}

			// if (key == 'events') {
			// 	Object.keys(v).forEach((event) => {
			// 		el.addEventListener(event, v[event]);
			// 	});
			// 	return;
			// }

			if (key == 'class') {

				this._element.classList.add(v);
				return;
			}

			if(key == 'getNodeData'){
				this._getNodeData=v;
			}

			if(key == 'setNodeData'){
				this._setNodeData=v;
			}

		});

	}

	_addDraggableNodes(){
		this._draggableNodes=new DragGraphNodeArrows(this);
	}

	getInputElement(){
		return this._draggableNodes.getInputElement();
	}

	getOutputElement(){
		return this._draggableNodes.getOutputElement();
	}

	hasTarget(target){
		return super.hasTarget(target)||this._draggableNodes.hasTarget(target);
	}

	limitChildNodes(count){
		this._childNodeLimit=count;
	}

	add(template, toNode){
		return this.getRoot().add(template, toNode||this);
	}

	renderElement(){

		this.getRoot().renderNode(this);

	}


	_instantiateNode(parent, data){
		return new Node(parent, data);
	}

}

