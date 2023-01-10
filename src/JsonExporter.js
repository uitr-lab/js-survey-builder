import {
	Element
} from './Element.js'

import {
	Overlay
} from './Overlay.js'


import {
	Graph
} from './Graph.js'

export class JsonExporter {


	constructor(exportable) {

		this._exportable=exportable;

	}

	getData(){

		var rawData=this._exportable.getData();

		if(this._exportable instanceof Graph){
			return JSON.parse(JSON.stringify(rawData.nodes[0]));
		}

		return JSON.parse(JSON.stringify(rawData));

	}

	getJson(){

		return JSON.stringify(this.getData(), null, '   ');

	}

	showOverlay(){

		var content = this.getJson();

		console.log(content);

		new Overlay('<pre>' + content + '</pre>', [
			new Element('button', {
				html: "Copy",
				"class": "copy-btn",
				events: {
					click: () => {
						navigator.clipboard.writeText(content);
					}
				}
			})

		]);


	}


}