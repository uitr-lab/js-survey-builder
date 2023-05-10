
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


export class SurveySection {



	constructor(options) {

        this._options=options||{};
        this._options.title=this._options.title||"Code Block";
        this._options.title=this._options.subtitle||"";
        this._options.header=this._options.header||'';
		

	}

	getElement(parentNode) {

        if(this._codeSection){
            return this._codeSection;
        }


		var codeSection = new Element('section', {
			html: "<label>"+this._options.title+"</label>" +
				"<p>return the child index, or a child nodes uuid (or prefix)</p><p>(formData:object, pageData:object, renderer:SurveyRenderer)=>{</p>",
			"class": "code-content-item collapse"
		})


		var childNodeLinks = codeSection.appendChild(new Element('p'));

		var codeNavigation = codeSection.appendChild(new Element('textarea', {
			value: 'return 0;',
			"class": "code-block"
		}))

		var codeToggle = codeSection.appendChild(new Element('button', {
			"class": "toggle-btn",
			"html": 'Hide',
			events: {
				click: () => {

					if (codeSection.classList.contains('collapse')) {
						codeSection.classList.remove('collapse');
						toggle.innerHTML = "Hide"
					} else {
						codeSection.classList.add('collapse');
						toggle.innerHTML = "Show"
					}

				}
			}
		}));


		var expandEdit = codeSection.appendChild(new Element('button', {
			"class": "code-btn",
			"html": 'Edit',
			events: {
				click: () => {
					var codeContentHints=new Element('p');
					new ChildNodeLinks(codeContentHints, section);

					(new ScriptExporter(()=>{ return codeNavigation.value; }, (script)=>{ codeNavigation.value=script; })).setHeading([
						new Element('h1', {"html":this._options.title}), 
						codeContentHints
					]).showOverlay();
				}
			}
		}));

		this._codeSection=codeSection;
        return this._codeSection;




	}



}