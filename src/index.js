class Element {

	constructor(type, options) {

		var el = document.createElement(type);
		Object.keys(options || {}).forEach((key) => {

			var v = options[key];

			if (key == 'html') {
				el.innerHTML = v;
				return;
			}

			if (key == 'events') {
				Object.keys(v).forEach((event) => {
					el.addEventListener(event, v[event]);
				});
				return;
			}

			if (key == 'class') {

				el.classList.add(v);
				return;
			}

		});

		//returns a html element, not a class instance

		return el;
	}


}

export class Graph {

	constructor(id) {



		this._container = id instanceof HTMLElement ? id : document.getElementById(id);
		this._element = new Element('div', {
			"class": "graph-root"
		})
		this._container.appendChild(this._element);

	}

	static render(el) {
		return new Graph(el);

	}

	addNode(data) {

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = new Node(this, data);
		this._nodes.push(node);
		return node;

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


	addNodeAt(index, data){

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = new Node(this, data);
		this._nodes.splice(index, 0 [node]);
		return node;

	}

	getElement() {

		return this._element;

	}

}


class Node {


	constructor(parent, data) {

		this._parent = parent;
		this._element = new Element('div', {
			"class": 'graph-node'
		});
		this._parent.getElement().appendChild(this._element);

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

		});

	}

	addClass(name){
		this._element.classList.add(name);
	}

	getParent() {
		return this.parent || null;
	}

	getElement() {

		return this._element;

	}


	addNode(data) {

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = new Node(this, data);
		this._nodes.push(node);
		return node;

	}

	addNodeAt(index, data){

		if (!this._nodes) {
			this._nodes = [];
		}

		var node = new Node(this, data);
		this._nodes.splice(index, 0 [node]);
		return node;

	}


}



var graph = (new Graph('survey-builder'));
graph.addTemplate('section-placeholder', function(parentNode){

	var placeholder = parentNode.addNode({
	"class": "empty-node",
	elements: [
		new Element('button', {
			html: "Add Section",
			events: {
				click: function() {
					parentNode.add('section')
					placehoder.addClass('hidden')
				}
			}
		})
	]


})


});

graph.addTemplate('section', function(parentNode){

	var section = parentNode.addNodeAt(0,{
			"class": "section-node",
			elements: [
				new Element('p', {
					html: "Section Name",
					
				})
			]


		});


	graph.add('section-placeholder', parentNode);


});


graph.add('section-placeholder');


