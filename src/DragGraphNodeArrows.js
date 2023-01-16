import * as dragNdrop from 'npm-dragndrop/src/dragNdrop.js';

import arrowCreate, {
	DIRECTION, HEAD
} from 'arrows-svg'

import {Element} from './Element.js'


export class DragGraphNodeArrows{

	constructor(node){

		this._node=node;
		this._graph=node.getRoot();


		this._graph.on('addChildNode', ()=>{
			this._render();
		});

		this._graph.on('removeChildNode', ()=>{
			this._render();
		});


		this._render();

	}


	getInputElement(){
		return this._nodeInput||this._node.getElement();
	}

	getOutputElement(){
		return this._nodeOutput||this._node.getElement();
	}

	hasTarget(target){
		return ([this._nodeOutput.firstChild, this._nodeInput.firstChild]).indexOf(target)>=0;
	}


	_render(){

		if(this._throttle){
			clearTimeout(this._throttle);
		}

		this._throttle=setTimeout(()=>{
			this._throttle=null;
			this.render();

		}, 5);


	}

	render(){


		if(!this._nodeInput){

			this._nodeInput=this._node.getElement().appendChild(new Element('div', {
				html: "",
				"class":"node-input"
			}));

			this._inputHandle=this._nodeInput.appendChild(new Element('div',{
				"class":"handle input"
			}));

			this._inputHandle.addEventListener('dragNdrop:start', ()=>{

				document.body.classList.add('drag-input');

				this._dragArrow=arrowCreate({

					from:this._nodeInput,
					to:this._inputHandle,
					head: {
					    func: HEAD.THIN,
					    size: 7, // custom options that will be passed to head function
					  }
				});


				document.body.appendChild(this._dragArrow.node);

			});

			this._inputHandle.addEventListener('dragNdrop:stop', ()=>{
				this._dragArrow.clear();
				document.body.classList.remove('drag-input');
			});


		}

		if(this._inputHandleDrag){
			this._inputHandleDrag.stop();
		}


		this._inputHandleDrag = dragNdrop({
			element: this._inputHandle,
			dropZones: ['.handle.output'],
			callback: (event) =>{

				var rect=this._inputHandle.getBoundingClientRect()
				var center={x:rect.x+rect.width/2, y:rect.y+rect.height/2};
				var nearby=event.dropZones.filter((dz)=>{
					var dzRect=dz.getBoundingClientRect();
					var dzCenter={x:dzRect.x+dzRect.width/2, y:dzRect.y+dzRect.height/2}

					var d=Math.pow(dzCenter.x-center.x, 2)+Math.pow(dzCenter.y-center.y, 2);
					return d<200;

				});

				if(nearby.length){
					var node=this._graph.getNodeWithTarget(nearby.shift());
					console.log(node);
					node.addNode(this._node);
				}

				console.log(nearby);


				event.element.style.cssText = '';
			}
		});

		

		if(!this._nodeOutput){

			this._nodeOutput=this._node.getElement().appendChild(new Element('div', {
				html: "",
				"class":"node-output"
			}));


			this._outputHandle=this._nodeOutput.appendChild(new Element('div',{
				"class":"handle output"
			}));

			this._outputHandle.addEventListener('dragNdrop:start', ()=>{
				document.body.classList.add('drag-output');

				this._dragArrow=arrowCreate({

					from:this._nodeOutput,
					to:this._outputHandle,
					head: {
					    func: HEAD.THIN,
					    size: 7, // custom options that will be passed to head function
					  }
				});


				document.body.appendChild(this._dragArrow.node);

			});

			this._outputHandle.addEventListener('dragNdrop:stop', ()=>{
				this._dragArrow.clear();
				document.body.classList.remove('drag-output');
			});


		}

		if(this._outputHandleDrag){
			this._outputHandleDrag.stop();
		}


		this._outputHandleDrag = dragNdrop({
			element: this._outputHandle,
			dropZones: ['.handle.input'],
			callback: (event) =>{
				

				var rect=this._outputHandle.getBoundingClientRect()
				var center={x:rect.x+rect.width/2, y:rect.y+rect.height/2};
				var nearby=event.dropZones.filter((dz)=>{
					var dzRect=dz.getBoundingClientRect();
					var dzCenter={x:dzRect.x+dzRect.width/2, y:dzRect.y+dzRect.height/2}

					var d=Math.pow(dzCenter.x-center.x, 2)+Math.pow(dzCenter.y-center.y, 2);
					return d<200;

				});

				if(nearby.length){
					var node=this._graph.getNodeWithTarget(nearby.shift());
					console.log(node);
					this._node.addNode(node);
				}

				console.log(nearby);
				event.element.style.cssText = '';

			}
		});

		


	}




}