
import {Element} from './Element.js';
import  { EventEmitter } from  'events';

export  class GraphNode extends EventEmitter{

	addNode(data) {

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = this._instantiateNode(this, data);
		this._nodes.push(node);
		this._formatAddNode(node);
		return node;

	}

	addNodeAt(index, data){

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = this._instantiateNode(this, data);
		this._nodes.splice(index, 0, node);
		this._formatAddNode(node);
		return node;

	}

	_formatAddNode(node){

		if(node.getData()){

			var dataNodes=this._nodes.filter((n)=>{
				return !!n.getData();
			});
			var i=dataNodes.indexOf(node);

			node.addContainerClass((['a', 'b', 'c'])[i]);
			node.addContainerClass('with-'+dataNodes.length);


			this.emit('addNode', node);
			this._addChildNodeEvents(node);


			

		}

	}

	_addChildNodeEvents(node){
		
		node.on('remove',()=>{

			var i = this._nodes.indexOf(node);
			this._nodes.splice(i,1);

			this.emit('removeNode');
		})

		node.on('addNode', ()=>{
			this.emit('addChildNode');
		});

		node.on('addChildNode', ()=>{
			this.emit('addChildNode');
		});

		node.on('removeNode',()=>{
			this.emit('removeChildNode');
		});

		node.on('removeChildNode',()=>{
			this.emit('removeChildNode');
		});

		node.on('updateNode',()=>{
			this.emit('updateChildNode');
		});

		node.on('updateChildNode',()=>{
			this.emit('updateChildNode');
		});
	}

	_instantiateNode(parent, data){
		throw 'Must implement'
	}


	isRoot(){
		return !this.getParent();
	}

	getRoot(){
		var root=this;
		while(root.getParent()){
			root=root.getParent();
		}
		return root;
	}

	getParent(){
		return  this._parent||null;
	}

	getElement() {

		return this._element;

	}


	getDepth(){

		var root=this;
		var depth=0;
		while(root.getParent()){
			depth++;
			root=root.getParent();
		}
		return depth;

	}

	getContainer() {
		return this._container;
	}

	addClass(name){
		this._element.classList.add(name);
	}

	addContainerClass(name){
		this._container.classList.add(name);
	}


	numberOfRealChildNodes(){

		return (this._nodes||[]).map((node)=>{
			return node.getData()
		}).filter((nodeData)=>{
			return !!nodeData;
		});

	}
	
	clear(){

		(this._nodes||[]).forEach((node)=>{
			node.remove();
		});

		this._nodes=[];

	}

	remove(){

		
		if(this._container.parentNode){
			this._container.parentNode.removeChild(this._container);
		}
		this.clear();
		this.emit('remove');
		this.removeAllListeners();
	}

	getData(){

		var data=null;

		if(this._getNodeData){
			data=this._getNodeData();
		}

		var nodes=this.numberOfRealChildNodes();

		if(nodes.length>0){
			
			data=data||{};
			data.then="goto node 0";
			if(nodes.length>1){
				data.then='goto linkLogic() or node 0'
				data.linkLogic='some logic to define which node to traverse';
			}
			data.nodes=nodes;


		}

	
		if(nodes.length==0){
			if(this._linksTo){
			
				data=data||{};
				data.then='go to child 0';
				data.linksToWarning="only child 0 is reachable without logic";
			
			}else{

				if(data){
					data.then='terminate';
				}
				
			}
		}




		return data;


	}

	setData(data){

		(data.nodes||[]).forEach((nodeData)=>{
			var node=this.add(nodeData.type);
			node.setData(nodeData);
		});

		if(this._setNodeData){
			data=this._setNodeData(data);
		}

	}



}