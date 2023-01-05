import {
	Element
} from './Element.js'
import {
	Overlay
} from './Overlay.js'


export class JsonExporter {


	constructor(exportable) {


		var content = JSON.stringify(exportable.getData().nodes[0], null, '   ');

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