
import {GraphNode} from './GraphNode.js'
import {Node} from './Node.js'

import {Element} from './Element.js'



import arrowCreate, {
	DIRECTION, HEAD
} from 'arrows-svg'


export class Graph extends GraphNode{

	constructor(id) {

		super();

		this._displayMode='list';

		this._parentContainer = id instanceof HTMLElement ? id : document.getElementById(id);
		this._container = new Element('div', {
			"class": "graph-root"
		})
		this._element=this._container;
		this._parentContainer.appendChild(this._element);

		this._menu = new Element('div', {
			"class": "graph-menu"
		});



		

		this._parentContainer.appendChild(this._menu);

		this.on('addNode', ()=>{
			this.emit('update');
		});

		this.on('addChildNode',()=>{
			this.emit('update');
		});

		this.on('removeNode',()=>{
			this.emit('update');
		});

		this.on('removeChildNode',()=>{
			this.emit('update');
		});

		this.on('updateNode',()=>{
			this.emit('update');
		});

		this.on('updateChildNode',()=>{
			this.emit('update');
		});

	}

	static render(el) {
		return new Graph(el);

	}

	getDisplayMode(){
		return this._displayMode;
	}

	renderNode(node){


		if(this._displayMode!=='graph'){
			node.getParent().getContainer().appendChild(node.getContainer());
			node.redrawArrows();
			return;
		}



		this._getDepthContainer(node.getDepth()).appendChild(node.getContainer());
		node.redrawArrows();
	}


	renderArrow(a, b){

		var i = a.indexOfNode(b);
		if(this._displayMode!=='graph'){

			return arrowCreate({


				from: {
					direction: DIRECTION.LEFT,
					node: a.getOutputElement(),
					translation: [-3-4*(i), 0],
				},
				to: {
					direction: DIRECTION.LEFT,
					node:  b.getInputElement(),
					translation: [-3-4*(i), 0],
				},
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});

		}

		return arrowCreate({


				from: {
					direction: DIRECTION.BOTTOM,
					node: a.getOutputElement(),
					translation: [0, 0.5],
				},
				to: {
					direction: DIRECTION.TOP,
					node:  b.getInputElement(),
					translation: [0, -0.5],
				},
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});


		
		return arrow;


	}


	_getDepthContainer(i){

		if(!this._depthEls){
			this._depthEls=[];
		}


		if(this._depthEls.length<=i||(!this._depthEls[i])){
			this._depthEls[i]=this._container.appendChild(new Element('div', {
				"class":"depth-item depth-"+i
			}));
		}


		return this._depthEls[i];
	}


	redrawList(){
		this._displayMode='list';

		this.getNodesRecurse().forEach((node)=>{
			this.renderNode(node);
		});

		(this._depthEls||[]).forEach((el)=>{
			el.parentNode.removeChild(el);
		})

		this._depthEls=[];
	}

	redrawGraph(){
		this._displayMode='graph';
		this.getNodesRecurse().forEach((node)=>{
			this.renderNode(node);
		});
	}



	addMenuItem(el){
		this._menu.appendChild(el);
	}

	


	addTemplate(name, fn){

		if(!this._templates){
			this._templates={};
		}

		this._templates[name]=fn;
		return this;
	}

	add(template, toNode){
		var node=(toNode||this)
		return this._templates[template](node);
	}


	_instantiateNode(parent, data){
		return new Node(parent, data);
	}



}

