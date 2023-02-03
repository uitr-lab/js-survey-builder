import {
	Element
} from '../Element.js'

import {
	Overlay
} from '../Overlay.js'



export class ScriptExporter {


	constructor(getScript, setScript) {

		this._getScript=getScript;
		this._setScript=setScript;

	}

	getScript(){
		return this._getScript();
	}

	setScript(script){
		this._setScript(script);
	}

	setHeading(els){

		if(!Array.isArray(els)){
			els=[els];
		}

		this._heading=els;
		return this;


	}

	showOverlay(){

		var content = this.getScript();

		console.log(content);

		var textarea=new Element('textarea', {
			"class":"import-script import-json",
			value:content
		});

		var heading=(this._heading||[new Element('h1', {"html":"Navigation Logic"})]);

		(new Overlay(heading.concat([textarea]), [
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
						
						var script=textarea.value;
						
						if(!script){
							throw 'Invalid Script';
						}


						this.setScript(script);
					}
				}
			})

		]))
		.setSize({
			width:'800px',
			height:'600px'
		})
		.fitContent();


	}


}