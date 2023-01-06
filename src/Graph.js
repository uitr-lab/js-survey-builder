
import {GraphNode} from './GraphNode.js'
import {Node} from './Node.js'
import {JsonExporter} from './JsonExporter.js'
import {Element} from './Element.js'

import {Overlay} from './Overlay.js'


export class Graph extends GraphNode{

	constructor(id) {

		super();

		this._parentContainer = id instanceof HTMLElement ? id : document.getElementById(id);
		this._container = new Element('div', {
			"class": "graph-root"
		})
		this._element=this._container;
		this._parentContainer.appendChild(this._element);

		this._menu = new Element('div', {
			"class": "graph-menu"
		});


		this._menu.appendChild(new Element('a', {
			html:'UITR Lab',
			target:"_blank",
			href:"https://uitr.ok.ubc.ca/"
		}));

		this._menu.appendChild(new Element('a', {
			html:'Fork this project',
			target:"_blank",
			href:"https://github.com/uitr-lab/js-survey-builder"
		}));

		this._menu.appendChild(new Element('button', {
			html:'Export JSON',
			events:{
				click:()=>{
					new JsonExporter(this);
				}
			}

		}));


		this._menu.appendChild(new Element('button', {
			html:'Run Survey',
			events:{
				click:()=>{
					new Overlay('This is not implemented yet');
				}
			}

		}));

		this._parentContainer.appendChild(this._menu);

	}

	static render(el) {
		return new Graph(el);

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
		this._templates[template](node);
	}


	_instantiateNode(parent, data){
		return new Node(parent, data);
	}



}
