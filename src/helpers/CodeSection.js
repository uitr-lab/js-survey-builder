
import {
	Overlay
} from '../Overlay.js'

import {
	Element
} from '../Element.js';

import {
	JsonExporter
} from '../JsonExporter.js';


import {
	ScriptExporter
} from './ScriptExporter.js';

import {
	EventEmitter
} from 'events';



export class CodeSection extends EventEmitter {



	constructor(options) {

		super();

        this._options=options||{};
        this._options.title=this._options.title||"Code Block";
        this._options.comment=this._options.comment||"";
        this._options.header=this._options.header||'';
        this._options["class"]=this._options["class"]||"";
 		this._options.defaultValue=this._options.defaultValue||'';

	}

	getValue(){

		if(this._codeInput){
			return this._codeInput.value;
		}

		return "";
	}

	setValue(value){
		
		this._setValue(value);
		this.emit('update');
		return this;

	}
	_setValue(value){

		if(this._codeInput){

			if(typeof this._codeInput=='string'){

				//in case value is set before input is rendered;

				this._codeInput=value;
				return;
			}
			
			this._codeInput.value=value;
			return;
		}

		this._codeInput=value;
		
	}

	getTitle(){
		return this._options.title;
	}

	getElementAreaBeforeInput(){
		return this._beforeInputEl;
	}

	getElement(parentNode) {

        if(this._codeSection){
            return this._codeSection;
        }


		var codeSection = new Element('section', {
			html: "<label>"+this._options.title+"</label>" +
				"<p>"+this._options.comment+"</p><p>"+this._options.header+"</p>",
			"class": "code-content-item collapse"
		});

		this._options["class"].split(" ").forEach((c)=>{
			codeSection.classList.add(c);
		}) 


		var childNodeLinks = codeSection.appendChild(new Element('p'));
		this._beforeInputEl=childNodeLinks;

		var codeNavigation = codeSection.appendChild(new Element('textarea', {
			value: this._options.defaultValue,
			"class": "code-block"
		}));

		if(typeof this._codeInput=="string"){
			codeNavigation.value=this._codeInput;
		}

		this._codeInput=codeNavigation;


		codeNavigation.addEventListener('change', () => {
			this.emit('update');
		});

		var codeToggle = codeSection.appendChild(new Element('button', {
			"class": "toggle-btn",
			"html": 'Show',
			events: {
				click: () => {

					if (codeSection.classList.contains('collapse')) {
						codeSection.classList.remove('collapse');
						codeToggle.innerHTML = "Hide"
					} else {
						codeSection.classList.add('collapse');
						codeToggle.innerHTML = "Show"
					}

				}
			}
		}));


		var expandEdit = codeSection.appendChild(new Element('button', {
			"class": "code-btn",
			"html": 'Edit',
			events: {
				click: () => {

					var exporter=(new ScriptExporter(()=>{ return this.getValue(); }, (script)=>{ this.setValue(script); }));

					exporter.setHeading([
						new Element('h1', {"html":this.getTitle()}), 
					]);

					// allow caller to modify exporter before display
					this.emit('export', exporter);

					exporter.showOverlay();
				}
			}
		}));

		this._codeSection=codeSection;
        return this._codeSection;




	}



}