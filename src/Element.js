export class Element {

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
				v.split(' ').forEach((name)=>{
					if(name.length==0){
						return;
					}
					el.classList.add(name);
				})
				
				return;
			}


			if((['type', 'value', 'href', 'target']).indexOf(key)>=0){
				el[key]=v
			}


		});

		//returns a html element, not a class instance

		return el;
	}


}