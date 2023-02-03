import {
	Element
} from '../Element.js';

export class ChildNodeLinks{


	/**
	 * draw links to child nodes to assist script
	 */

	constructor(el, node){


	
		this._el=el;
		this._node=node;

		el.classList.add('node-hints');

		node.on('updateNode', ()=>{
			this._throttleUpdate();
		});

		this._update();


		el.addEventListener('mouseover', ()=>{
			this._over();
		});

		el.addEventListener('mouseout', ()=>{
			this._throttleOut();
		});

	}


	_throttleOut(){

		if(this._throttleOutTimeout){
			clearTimeout(this._throttleOutTimeout);
		}
		this._throttleOutTimeout=setTimeout(()=>{
			this._throttleOut=null;
			this._out();
		}, 500);


	}

	_over(){
		if(this._throttleOutTimeout){
			clearTimeout(this._throttleOutTimeout);
		}

		this._node.getArrowsOut().forEach((arrow)=>{
			var el=arrow.node.firstChild;
			if(el){
				el.classList.add('hover');
				return;
			}

			console.log(this._node.getArrowsOut());
		});

	}

	_out(){
		
		this._node.getArrowsOut().forEach((arrow)=>{
			var el=arrow.node.firstChild;
			if(el){
				el.classList.remove('hover');
				return;
			}

			console.log(this._node.getArrowsOut());
		});

	}

	_throttleUpdate(){

		if(this._throttle){
			clearTimeout(this._throttle);
		}

		this._throttle=setTimeout(()=>{
			this._throttle=null;
			this._update();
		}, 200);

	}

	_update(){

		this._el.innerHTML='';

		this._node.realChildNodes().forEach((child)=>{

			var label=this._el.appendChild(new Element('label',{
				html:child.getUUID().substring(0, 5)
			}));


			label.appendChild(new Element('div',{
				'class':"popover",
				html:'<label>'+child.getData().name+'</label><p>'+child.getUUID()+'</p>'
			}))

			label.appendChild(new Element('button', {
				html:"Unlink",
				"class":"unlink-btn",
				events:{
					click:()=>{

						if(child.getParentNodes().length==1){
							if(confirm('This will delete the child node/branch')){
								child.remove();

							}

							return;
						}

						this._node.removeChildNode(child);


					}
				}
			}));

		})

	}

}