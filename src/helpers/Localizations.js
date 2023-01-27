
import {
	Element
} from '../Element.js'

import  { EventEmitter } from  'events';


import  { MD5 } from  'crypto-js';

export class Localizations extends EventEmitter{


	constructor(node, element){

		super();

		this._node=node;
		this._parentContainer=element;

		this._forms={};

		this.renderLabels();




	}


	getCSRF(){

		if(this._csrf){
			return Promise.resolve(this._csrf);
		}

		return new Promise((resolve)=>{

			this.on('csrf',()=>{
				resolve(this._csrf);
			});
		});


	}

	translate(list, from, to){

	

			const formData = new FormData();
			formData.append('json', JSON.stringify({
			    	'widget': "translate","text":list,"to":to,"from":from
			    }));


			return fetch('https://jobs.geoforms.ca/php-core-app/core.php?format=ajax&iam=surveybuilder&task=user_function',{
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
			    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			    // headers: {
			    //   'Content-Type': 'multipart/form-data'
			    // },
			    body: formData,
			    credentials: "same-origin",
			    referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			})
			.then((response) => { return response.json(); })
			.then((data) => {
				return data.translation;
			});

	
		
	}



	remove(){




		if(this._container){

			this.store();
				
			this._parentContainer.removeChild(this._container);
			delete this._container;

		}



	}


	store(){

		var map=this.getLabels().map((text)=>{
			return MD5(text);
		});


		Object.keys(this._forms).forEach((code)=>{

			var form=this._forms[code];
			

			
		})

	}

	renderLabels(){

		var container=this._parentContainer.appendChild(new Element('div',{"class":"graph-labels"}));
		this._container=container;


		container.appendChild(new Element('h2',{
			html:"Localizations"
		}));

		this._labelsContainer=container;

		var add=container.appendChild(new Element('div',{
			"class":"add-lang"
		}));

		this._addButton=add;

		var newLang=add.appendChild(new Element('input', {
			"class":"new-lang",
			type:"text",
			placeholder:"{lng}"
		}))

		add.appendChild(new Element('button',{
			"class":"btn-new-lang",
			html:"Add Language",
			events:{
				click:()=>{

					if(newLang.value){

						this.addLang(newLang.value)
						newLang.value='';
						return;
					}

					newLang.focus();

				}
			}
		}));


		

		(['en']).forEach((lang, i)=>{

			this.addLang(lang);
			

		});



	}


	addLang(code){

		var form=this._labelsContainer.insertBefore(new Element('form'), this._addButton);


		form.appendChild(new Element('input',{
				"class":"lang-key",
				type:"text",
				value:code
			}));



		var labels=this.getLabels();

		var inputs=labels.map((label)=>{

			var opt={
				type:"text",
				value:code=='en'?label:""
			};

			if(code=='en'){
				opt.disabled=true;
			}

			return form.appendChild(new Element('input',opt));


		});

		if(code!=='en'){

			this._forms[code]=form;

			this.translate(labels, 'en', code).then((values)=>{

				values.forEach((value, i)=>{
					inputs[i].value=value;
				})


				this.store();

			})
		}

	}

	getLabels(){
		
		var labels=[];
		var items=[];


		this._node.getNodesRecurse().forEach((node)=>{
			items=items.concat(node.getData().items);
		});


		while(items.length){
			var item=items.shift();


			if(item.items){
				items=items.concat(item.items);
			}

			if(item.label){
				labels.push(item.label);
			}

			if(item.labels){
				labels=labels.concat(item.labels);
			}

			if(item.text){
				labels.push(item.text);
			}

			if(item.html){
				labels.push(item.html);
			}

		}


		
		return labels;


	}


	


}