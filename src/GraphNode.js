import {
	Element
} from './Element.js';
import {
	EventEmitter
} from 'events';


import { v4 as uuidv4 } from 'uuid';




export class GraphNode extends EventEmitter {

	addNode(data) {

		if (!this._nodes) {
			this._nodes = [];
		}
		if (!this._arrows) {
			this._arrows = [];
		}

		var node = data instanceof GraphNode?data:this._instantiateNode(this, data);
		this._nodes.push(node);
		this._arrows.push(null);
		this._formatAddNode(node);
		return node;

	}

	addNodeAt(index, data) {

		if (!this._nodes) {
			this._nodes = [];
		}
		if (!this._arrows) {
			this._arrows = [];
		}

		var node = data instanceof GraphNode?data:this._instantiateNode(this, data);
		this._nodes.splice(index, 0, node);
		this._arrows.splice(index, 0, null); //placeholder
		this._formatAddNode(node);
		return node;

	}

	_formatAddNode(node) {

		if (!node.getData()) {
			return;
		}


		this.emit('addNode', node);
		this._addChildNodeEvents(node);


		if (this.isRoot()) {
			return;
		}
		

		this._drawArrow(node);
		
	

	}

	redrawArrows(){

		(this._arrows||[]).forEach((arrow)=>{
			arrow.clear();
		});


		this.realChildNodes().forEach((node)=>{
			this._drawArrow(node);
		});

	}


	_drawArrow(node){

		var arrow=this.getRoot().renderArrow(this, node);
		this._arrows[this.indexOfNode(node)]=arrow;
		document.body.appendChild(arrow.node);

	}


	indexOfNode(childNode){

		var dataNodes = this.realChildNodes();
		return dataNodes.indexOf(childNode);																																											``

	}

	getInputElement(){
		return this._nodeInput||this.getElement();
	}

	getOutputElement(){
		return this._nodeOutput||this.getElement();
	}

	_addChildNodeEvents(node) {

		node.on('remove', () => {

			var i = this._nodes.indexOf(node);
			this._nodes.splice(i, 1);
			var arrow=this._arrows[i];
			if(arrow){
				arrow.clear();
			}
			this._arrows.splice(i, 1);

			this.emit('removeNode');
		})

		node.on('addNode', () => {
			this.emit('addChildNode');
		});

		node.on('addChildNode', () => {
			this.emit('addChildNode');
		});

		node.on('removeNode', () => {
			this.emit('removeChildNode');
		});

		node.on('removeChildNode', () => {
			this.emit('removeChildNode');
		});

		node.on('updateNode', () => {
			this.emit('updateChildNode');
		});

		node.on('updateChildNode', () => {
			this.emit('updateChildNode');
		});
	}

	_instantiateNode(parent, data) {
		throw 'Must implement'
	}


	isRoot() {
		return !this.getParent();
	}



	getRoot() {
		var root = this;
		while (root.getParent()) {
			root = root.getParent();
		}
		return root;
	}

	getParent() {
		return this._parent || null;
	}

	getElement() {

		return this._element;

	}


	getDepth() {

		var root = this;
		var depth = 0;
		while (root.getParent()) {
			depth++;
			root = root.getParent();
		}
		return depth;

	}

	getNodesRecurse(mode){
		return this._getNodesRecurse(mode, []);
	}

	_getNodesRecurse(mode, skip){

		/*
		 * depth first search
		 */

		var nodes=[];

		if(mode!=='breadth'){

			this.getNodes().forEach((node)=>{



				if(node==this&&nodes.indexOf(node)>=0||skip.indexOf(node)>=0){
					//found cycle or duplicate
					return;
				}
				nodes.push(node);
				skip.push(node);
				nodes=nodes.concat(node._getNodesRecurse(mode, skip));
			});

			return nodes;

		}



		/**
		 * breath first search
		 */

		var processList=this.getNodes();

		while(processList.length>0){

			if(nodes.indexOf(processList[0])>=0){
				//found cycle or duplicate
				continue;
			}

			processList=processList.concat(processList[0].getNodes())
			nodes.push(processList.shift());
		}

		return nodes;

	}


	getFirstParent(){
		return this.getRoot().getNodesFirstParent(this);
	}


	getNodes(){
		/*
		 * non recursive
		 */
		return (this._nodes||[]).slice(0);
	}

	getContainer() {
		return this._container;
	}

	addClass(name) {
		this._element.classList.add(name);
	}

	addContainerClass(name) {
		this._container.classList.add(name);
	}


	realChildNodes() {

		return (this._nodes || []).filter((node) => {
			return node.hasData();
		}).filter((nodeData) => {
			return !!nodeData;
		});

	}

	clear() {

		(this._nodes || []).forEach((node) => {
			node.remove();
		});

		this._nodes = [];

	}

	remove() {


		if (this._container.parentNode) {
			this._container.parentNode.removeChild(this._container);
		}
		this.clear();
		this.emit('remove');
		this.removeAllListeners();
	}



	hasTarget(target){

		if(typeof target=='string'){
			return target===this.getUUID();
		}


		if(target instanceof HTMLElement){

			return ([this._container, this._element]).indexOf(target)>=0;

		}

		return false;
	}


	getUUID(){

		return this._uuid||uuidv4();;

	}

	hasData(){
		return !!this._getNodeData;
	}

	getData() {

		var data = null;

		if (this._getNodeData) {
			data = this._getNodeData();
		}


		if(data){
			data.uuid=this.getUUID();
		}


		var nodes = this.realChildNodes();

		if (nodes.length > 0) {

			data = data || {};
			data.then = "goto node 0";
			if (nodes.length > 1) {
				data.then = 'goto linkLogic() or node 0'
				data.linkLogic = 'some logic to define which node to traverse';
			}
			data.nodes = nodes.map((node)=>{
				var parentNode=node.getFirstParent();
				if(parentNode&&parentNode!==this){
					return node.getUUID(); 
				}

				return node.getData(); 
			});


		}


		if (nodes.length == 0) {
			if (this._linksTo) {

				data = data || {};
				data.then = 'go to child 0';
				data.linksToWarning = "only child 0 is reachable without logic";

			} else {

				if (data) {
					data.then = 'terminate';
				}

			}
		}



		return data;


	}

	setData(data) {

		if(data.uuid){
			this._uuid=data.uuid;
		}

		(data.nodes || []).forEach((nodeData) => {

			if(typeof nodeData=='string'){

				setTimeout(()=>{

					var matches=this.getRoot().getNodesRecurse().filter((n)=>{
						return n.getUUID()===nodeData;
					});

					if(matches.length==0){
						console.warn('Failed to find node: '+nodeData);
						return;
					}
					this.addNode(matches[0]);

				}, 500);

				return;
			}

			var node = this.add(nodeData.type);
			node.setData(nodeData);
		});

		if (this._setNodeData) {
			data = this._setNodeData(data);
		}

	}



}