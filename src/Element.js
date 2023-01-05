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

				el.classList.add(v);
				return;
			}


			if((['type', 'value']).indexOf(key)>=0){
				el[key]=v
			}


		});

		//returns a html element, not a class instance

		return el;
	}


}
