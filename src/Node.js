
import {GraphNode} from './GraphNode.js'
import {Element} from './Element.js'

import * as dragNdrop from 'npm-dragndrop/src/dragNdrop.js';

import arrowCreate, {
	DIRECTION, HEAD
} from 'arrows-svg'

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

		this._nodeInput=this._element.appendChild(new Element('div', {
			html: "",
			"class":"node-input"
		}));

		var inputHandle=this._nodeInput.appendChild(new Element('div',{
			"class":"handle input"
		}));





		this._inputHandleDrag = dragNdrop({
			element: inputHandle,
			dropZones: ['.handle.output'],
			callback: (event) =>{

				var rect=inputHandle.getBoundingClientRect()
				var center={x:rect.x+rect.width/2, y:rect.y+rect.height/2};
				var nearby=event.dropZones.filter((dz)=>{
					var dzRect=dz.getBoundingClientRect();
					var dzCenter={x:dzRect.x+dzRect.width/2, y:dzRect.y+dzRect.height/2}

					var d=Math.pow(dzCenter.x-center.x, 2)+Math.pow(dzCenter.y-center.y, 2);
					return d<200;

				});

				if(nearby.length){
					var node=this.getRoot().getNodeWithTarget(nearby.shift());
					console.log(node);
					node.addNode(this);
				}

				console.log(nearby);


				event.element.style.cssText = '';
			}
		});

		inputHandle.addEventListener('dragNdrop:start', ()=>{

			document.body.classList.add('drag-input');

			this._dragArrow=arrowCreate({

				from:this._nodeInput,
				to:inputHandle,
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});


			document.body.appendChild(this._dragArrow.node);

		});

		inputHandle.addEventListener('dragNdrop:stop', ()=>{
			this._dragArrow.clear();
			document.body.classList.remove('drag-input');
		});




		this._nodeOutput=this._element.appendChild(new Element('div', {
			html: "",
			"class":"node-output"
		}));


		var outputHandle=this._nodeOutput.appendChild(new Element('div',{
			"class":"handle output"
		}));



		this._outputHandleDrag = dragNdrop({
			element: outputHandle,
			dropZones: ['.handle.input'],
			callback: (event) =>{
				

				var rect=outputHandle.getBoundingClientRect()
				var center={x:rect.x+rect.width/2, y:rect.y+rect.height/2};
				var nearby=event.dropZones.filter((dz)=>{
					var dzRect=dz.getBoundingClientRect();
					var dzCenter={x:dzRect.x+dzRect.width/2, y:dzRect.y+dzRect.height/2}

					var d=Math.pow(dzCenter.x-center.x, 2)+Math.pow(dzCenter.y-center.y, 2);
					return d<200;

				});

				if(nearby.length){
					var node=this.getRoot().getNodeWithTarget(nearby.shift());
					console.log(node);
					this.addNode(node);
				}

				console.log(nearby);
				event.element.style.cssText = '';

			}
		});

		outputHandle.addEventListener('dragNdrop:start', ()=>{
			document.body.classList.add('drag-output');

			this._dragArrow=arrowCreate({

				from:this._nodeOutput,
				to:outputHandle,
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});


			document.body.appendChild(this._dragArrow.node);

		});

		outputHandle.addEventListener('dragNdrop:stop', ()=>{
			this._dragArrow.clear();
			document.body.classList.remove('drag-output');
		});



	}

	hasTarget(target){
		return super.hasTarget(target)||([this._nodeOutput.firstChild, this._nodeInput.firstChild]).indexOf(target)>=0;
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

