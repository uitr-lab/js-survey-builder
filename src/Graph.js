
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


	getNodeWithTarget(target){

		var matches=this.getNodesRecurse().filter((node)=>{
			return node.hasTarget(target);
		});

		if(matches.length==0){
			throw 'Invalid target';
		}

		return matches.shift();

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


	renderArrow(a, b, callback){

		setTimeout(()=>{

			var arrow=this._renderArrow(a, b);
			if(callback){
				callback(arrow);
			}

			document.body.appendChild(arrow.node);

		}, 10);

	}

	_renderArrow(a,b){

		var i = a.indexOfNode(b);

		var translationFrom= [0, 0.5];
		var translationTo= [0, -0.5];
		var directionFrom=DIRECTION.BOTTOM;
		var directionTo=DIRECTION.TOP


		if(this._displayMode!=='graph'){

			translationFrom= [-3-4*(i), 0];
			translationTo= [-3-4*(i), 0];
			directionFrom=DIRECTION.LEFT;
			directionTo=DIRECTION.LEFT;


			if(a.getDepth()>b.getDepth()){
				
			}

			if(a.getDepth()==b.getDepth()){
				
			}

			return arrowCreate({


				from: {
					direction: directionFrom,
					node: a.getOutputElement(),
					translation: translationFrom,
				},
				to: {
					direction: directionTo,
					node:  b.getInputElement(),
					translation: translationTo,
				},
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});

		}


		var diff=a.getDepth()-b.getDepth();


		if(a===b){


			
			translationFrom= [-8.5, 2];
			translationTo= [-8.5, -2];

		}


		if(diff==0&&a!==b){
			var translationFrom= [0, 1.5];
			var translationTo= [0, -1.5];
		}



		var arrow= arrowCreate({


				from: {
					direction: directionFrom,
					node: a.getOutputElement(),
					translation: translationFrom,
				},
				to: {
					direction: directionTo,
					node:  b.getInputElement(),
					translation: translationTo,
				},
				head: {
				    func: HEAD.THIN,
				    size: 7, // custom options that will be passed to head function
				  }
			});

		if(diff==0&&a!==b){
			arrow.node.classList.add('push');
		}

		return arrow;

	}


	getNodesFirstParent(node){

		for(var parentNode of this.getNodesRecurse()){

			if(parentNode.realChildNodes().indexOf(node)>=0){
				return parentNode;
			}

		}

		return null;

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

		this.emit('modeList');
	}

	redrawGraph(){
		this._displayMode='graph';
		this.getNodesRecurse().forEach((node)=>{
			this.renderNode(node);
		});

		this.emit('modeGraph');
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

