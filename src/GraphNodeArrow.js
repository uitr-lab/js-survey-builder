
import arrowCreate, {
	DIRECTION, HEAD
} from 'arrows-svg'


export class GraphNodeArrow{

	constructor(graph){

		this._graph=graph;

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


		if(this._graph._displayMode!=='graph'){

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


		var diff=b.getDepth()-a.getDepth();


		if(a===b){


			
			translationFrom= [-8.5, 2];
			translationTo= [-8.5, -2];

		}


		if(diff==0&&a!==b){
			translationFrom= [0, 1.5];
			translationTo= [0, -1.5];
		}


		if(diff<0){

			var ar=a.getOutputElement().getBoundingClientRect();
			var br=b.getOutputElement().getBoundingClientRect();

			var offset=Math.abs(ar.x-br.x);

			if(offset>50){

				translationFrom= [0, 0.5];
				translationTo= [0, -0.5];

			}else{

				translationFrom= [-1+diff, 0.5];
				translationTo= [-1+diff, -0.5];

			}
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

		if(a==b){
			arrow.node.firstChild.classList.add('loop');
		}

		if(diff==0&&a!==b){
			arrow.node.firstChild.classList.add('depth-sibling');
		}

		if(diff<0){
			arrow.node.firstChild.classList.add('reverse');
		}

		if(diff<-1){
			arrow.node.firstChild.classList.add('reverse-multi');
		}

		if(diff>1){
			arrow.node.firstChild.classList.add('skip-multi');
		}

		return arrow;

	}


}