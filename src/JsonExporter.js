import {
	Element
} from './Element.js'
import {
	Overlay
} from './Overlay.js'


export class JsonExporter {


	constructor(exportable) {

		this._exportable=exportable;

	}

	getData(){

		return JSON.parse(JSON.stringify(this._exportable.getData().nodes[0]));

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