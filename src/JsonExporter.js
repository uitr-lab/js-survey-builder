import {
	Element
} from './Element.js'

import {
	Overlay
} from './Overlay.js'

import {
	JsonImporter
} from './JsonImporter.js'

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

			if(this._exportable.getDisplayMode()==='lang'){
				return JSON.parse(JSON.stringify(this._exportable.getLocalizations().getData()));
			}


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

		var textarea=new Element('textarea', {
			"class":"import-json",
			value:content
		});

		(new Overlay(textarea, [
			new Element('button', {
				html: "Copy",
				"class": "copy-btn",
				events: {
					click: () => {
						navigator.clipboard.writeText(content);
					}
				}
			}),
			new Element('button', {
				html: "Update",
				"class": "update-btn",
				events: {
					click: () => {
						
						var data=JSON.parse(textarea.value);
						
						if(!data){
							throw 'Invalid JSON';
						}


						if(this._exportable instanceof Graph){

							if(this._exportable.getDisplayMode()==='lang'){
								this._exportable.getLocalizations().updateData(data);
								return;
							}
						}


						(new JsonImporter(this._exportable)).loadFromObject(data);
					}
				}
			})

		])).setSize({
			width:'800px',
			height:'600px'
		});


	}


}