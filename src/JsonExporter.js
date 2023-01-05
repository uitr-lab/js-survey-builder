
import {Element} from './Element.js'

export class JsonExporter{


	constructor(exportable){

		console.log(JSON.stringify(exportable.getData().nodes[0], null, '   '));

		var overlay=document.body.appendChild(new Element('div', {"class":"window-overlay"}))
		overlay.appendChild(new Element('button'))

	}


}

