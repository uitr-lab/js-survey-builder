
(function(){


	class Element{

		constructor(type, options){

			var el=document.createElement(type);
			Object.keys(options||{}).forEach((key)=>{

				var v=options[k];

				if(key=='html'){
					el.innerHTML=v;
					return;
				}

				if(key=='events'){
					Object.keys(v).forEach((event)=>{
						el.addEventListener(event, v[event]);
					});
					return;
				}

				if(key=='class'){
					
					el.classList.add(v);
					return;
				}

			})


		}


	}

	class Graph{

		constructor(id){

			this._container=document.document.getElementById(id);
			this._element=new Element('div', {"class":"graph-root"})
			this._container.appendChild(this._element);

		}

		addNode(data){

			if(!this._nodes){
				this._nodes=[];
			}

			var node=new Node(this, data);
			this._nodes.push(node);
			return node;

		}

		getElement(){

			return this._element;

		}

	}


	class Node{


		constructor(parent, data){

			this._parent=parent;
			this._element=new Element('div', 'graph-node');
			this._parent.appendChild(this._element);
		}

		getParent(){

			return this.parent||null;

		}

		getElement(){

			return this._element;

		}


		addNode(data){

			if(!this._nodes){
				this._nodes=[];
			}

			var node=new Node(this, data);
			this._nodes.push(node);
			return node;

		}


	}



	var graph=(new Graph('survey-builder'));

	graph.addNode({

		elements:[
			new Element('button', {
				html:"Add Question",
				events:{
					click:function(){

					}
				}
			})
		]


	})

})();



