
import {GraphNode} from './GraphNode.js'
import {Element} from './Element.js'

export class Node extends GraphNode{



	constructor(parent, data) {

		super();

		this._parent = parent;
		this._element = new Element('div', {
			"class": 'graph-node'
		});

		
		this._container=new Element('div', {
			"class": 'node-container'
		});
		this._container.appendChild(this._element);
			
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

		});

	}

	add(template, toNode){
		this.getRoot().add(template, toNode||this);
	}

	renderElement(){

		this.getParent().getContainer().appendChild(this._container);
	}


	_instantiateNode(parent, data){
		return new Node(parent, data);
	}

}

