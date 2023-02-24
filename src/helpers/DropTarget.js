export class DropTarget{







 closestDropzone(el, dropZones){

		var rect=el.getBoundingClientRect();
		var center={
			x:rect.x+rect.width/2, y:rect.y+rect.height/2
		}

		var bestFit=null;
		var bestDist=Infinity;

		var validTargets=dropZones.filter((dz)=>{

			var dzRect=dz.getBoundingClientRect();



			return (dzRect.x<center.x&&center.x<dzRect.right)&&(dzRect.y<center.y&&center.y<dzRect.bottom);

		});

		
		validTargets=validTargets.filter((target)=>{

			/**
			 * remove any targets that contain another valid target (only allow deepest nested item)
			 */

			return validTargets.filter((otherTarget)=>{
				return target!==otherTarget&&target.contains(otherTarget);
			}).length==0
		});

		validTargets.forEach((dz)=>{

			var dzRect=dz.getBoundingClientRect();

			var dzCenter={
				x:dzRect.x+dzRect.width/2, y:dzRect.y+dzRect.height/2
			}

			var d=Math.pow(dzCenter.x-center.x, 2)+Math.pow(dzCenter.y-center.y, 2);
			if(d<bestDist){
				bestDist=d;
				bestFit=dz;
			}

		});	

		return bestFit;
	}





}