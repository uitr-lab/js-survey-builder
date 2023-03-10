import {
	GraphNode
} from './GraphNode.js'
import {
	Node
} from './Node.js'

import {
	Element
} from './Element.js'

import {
	GraphNodeArrow
} from './GraphNodeArrow.js'

import {
	SectionTemplate
} from './SectionTemplate.js'

import {
	Localizations
} from './helpers/Localizations.js'

export class Graph extends GraphNode {

	constructor(id) {

		super();

		this._displayMode = 'list';

		this._parentContainer = id instanceof HTMLElement ? id : document.getElementById(id);
		this._container = new Element('div', {
			"class": "graph-root"
		})
		this._element = this._container;
		this._parentContainer.appendChild(this._element);

		this._menu = new Element('div', {
			"class": "graph-menu"
		});



		this._parentContainer.appendChild(this._menu);

		this.on('addNode', () => {
			this.emit('update');
		});

		this.on('addChildNode', () => {
			this.emit('update');
		});

		this.on('removeNode', () => {
			this.emit('update');
		});

		this.on('removeChildNode', () => {
			this.emit('update');
		});

		this.on('updateNode', () => {
			this.emit('update');
		});

		this.on('updateChildNode', () => {
			this.emit('update');
		});


		this.on('modeGraph',()=>{

			if(this._localizations){
				this._localizations.remove();
				this._localizations=null;
			}
			this._container.classList.remove('disabled');

		});
		this.on('modeList',()=>{

			if(this._localizations){
				this._localizations.remove();
				this._localizations=null;
			}
			this._container.classList.remove('disabled');

		});
		this.on('modeLang',()=>{

			this._container.classList.add('disabled');

		});

	}

	static render(el) {
		return new Graph(el);

	}


	getLocalizations(){
		return this._localizations||null;
	}


	getNodeWithTarget(target) {

		var matches = this.getNodesRecurse().filter((node) => {
			return node.hasTarget(target);
		});

		if (matches.length == 0) {
			throw 'Invalid target';
		}

		return matches.shift();

	}

	getDisplayMode() {
		return this._displayMode;
	}

	renderNode(node) {



		if (this._displayMode !== 'graph') {
			node.getParent().getContainer().appendChild(node.getContainer());
			node.redrawArrows();
			return;
		}



		this._getDepthContainer(node.getDepth()).appendChild(node.getContainer());
		node.redrawArrows();
	}


	renderArrow(a, b, callback) {

		(new GraphNodeArrow(this)).renderArrow(a, b, callback);

	}


	getNodesFirstParent(node) {

		for (var parentNode of this.getNodesRecurse()) {

			if (parentNode.realChildNodes().indexOf(node) >= 0) {
				return parentNode;
			}

		}

		return null;

	}


	getNodesParents(node) {

		return this.getNodesRecurse().filter((parentNode) => {
			return parentNode.realChildNodes().indexOf(node) >= 0;
		});

	}



	_getDepthContainer(i) {

		if (!this._depthEls) {
			this._depthEls = [];
		}


		if (this._depthEls.length <= i || (!this._depthEls[i])) {
			this._depthEls[i] = this._container.appendChild(new Element('div', {
				"class": "depth-item depth-" + i
			}));
		}


		return this._depthEls[i];
	}


	redrawList() {

		this._displayMode = 'list';

		this.getNodesRecurse().forEach((node) => {
			this.renderNode(node);
		});

		(this._depthEls || []).forEach((el) => {
			el.parentNode.removeChild(el);
		})

		this._depthEls = [];

		this.emit('modeList');
	}

	redrawGraph() {

		
		this._displayMode = 'graph';
		this.getNodesRecurse().forEach((node) => {
			this.renderNode(node);
		});

		this.emit('modeGraph');
	}


	redrawLanguage() {
		
		this._displayMode = 'lang';
		this._localizations=new Localizations(this, this._parentContainer);

		this.emit('modeLang');

		return this._localizations;

	}


	addMenuItem(el) {
		this._menu.appendChild(el);
	}



	addTemplate(name, fn) {

		if (name instanceof SectionTemplate) {

			fn = name.renderSection.bind(name)
			name = name.getName();

		}


		if (!this._templates) {
			this._templates = {};
		}

		this._templates[name] = fn;
		return this;
	}

	add(template, toNode) {
		var node = (toNode || this)
		return this._templates[template](node);
	}


	_instantiateNode(parent, data) {
		return new Node(parent, data);
	}



}