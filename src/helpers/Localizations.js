import {
	Element
} from '../Element.js'

import {
	EventEmitter
} from 'events';


import {
	MD5,
	enc
} from 'crypto-js';

export class Localizations extends EventEmitter {


	constructor(node, element) {

		super();

		this._node = node;
		this._parentContainer = element;

		this._forms = {};

		this.renderLabels();



	}



	translate(list, from, to) {



		const formData = new FormData();
		formData.append('json', JSON.stringify({
			'widget': "translate",
			"text": list,
			"to": to,
			"from": from
		}));


		return fetch('https://jobs.geoforms.ca/php-core-app/core.php?format=ajax&iam=surveybuilder&task=user_function', {
				method: 'POST', // *GET, POST, PUT, DELETE, etc.
				cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
				// headers: {
				//   'Content-Type': 'multipart/form-data'
				// },
				body: formData,
				credentials: "same-origin",
				referrerPolicy: 'origin', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
			})
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				return data.translation;
			});



	}



	remove() {



		if (this._container) {

			this._update();

			this._parentContainer.removeChild(this._container);
			delete this._container;

		}



	}


	_labelsMap(labels) {
		labels = labels || this.getLabels();

		var map = labels.map((text) => {
			return MD5(text).toString();
		});


		var simplified = [];

		map.map((md5) => {
			var shortened = md5.substring(0, 3);
			var len = 5;
			while (simplified.indexOf(shortened) >= 0) {
				len++;
				shortened = md5.substring(0, len);
			}

			simplified.push(shortened);

		});

		return simplified;

	}


	_update() {

		var languageMap=this.getData();
		this.emit('update', languageMap);

	}s


	getData(){

		var labels = this.getLabels();
		var map = this._labelsMap(labels);

		var en = {};
		labels.forEach((label, i) => {
			en[map[i]] = label;
		});

		var languageMap = {
			en: en
		}

		Object.keys(this._forms).forEach((code) => {

			var form = this._forms[code];

			var formValues = Array.prototype.slice.call(form.querySelectorAll("*")).map((el) => {
				return el.value;
			});

			var langCode = formValues.shift();

			var langLabels = {};
			formValues.forEach((label, i) => {
				langLabels[map[i]] = label;
			});

			languageMap[langCode] = langLabels;

		});

		return languageMap;



	}


	updateData(data) {


		var labels = this.getLabels();
		var map = this._labelsMap(labels);


		var langs = Object.keys(data);
		var defaultLang = langs.shift();


		langs.forEach((code)=>{



			var langData=data[code];
			var mappedData=[];


			if(this._forms[code]){

				var form = this._forms[code];
				var formFields = Array.prototype.slice.call(form.querySelectorAll("*"));

				map.forEach((key, index)=>{
					if(langData[key]){
						//formFields has the language code as the first index
						formFields[index+1].value=langData[key];
					}
				});

				return;
			}


			map.forEach((key)=>{

				if(langData[key]){
					mappedData.push(langData[key]);
					return;
				}

				mappedData.push('');

			});



			this.addLang(code, mappedData);



		});



	}

	clear(){

		Object.keys(this._forms).forEach((code)=>{

			this._forms[code].parentNode.removeChild(this._forms[code]);

		});

		this._forms={};


	}

	renderLabels() {

		var container = this._parentContainer.appendChild(new Element('div', {
			"class": "graph-labels"
		}));
		this._container = container;


		container.appendChild(new Element('h2', {
			html: "Localizations"
		}));

		this._labelsContainer = container;

		var add = container.appendChild(new Element('div', {
			"class": "add-lang"
		}));

		this._addButton = add;

		var newLang = add.appendChild(new Element('input', {
			"class": "new-lang",
			type: "text",
			placeholder: "{lng}"
		}))

		add.appendChild(new Element('button', {
			"class": "btn-new-lang",
			html: "Add Language",
			events: {
				click: () => {

					if (newLang.value) {

						this.addLang(newLang.value)
						newLang.value = '';
						return;
					}

					newLang.focus();

				}
			}
		}));



		(['en']).forEach((lang, i) => {

			this.addLang(lang);


		});



	}


	addLang(code, values) {

		var form = this._labelsContainer.insertBefore(new Element('form'), this._addButton);


		form.appendChild(new Element('input', {
			"class": "lang-key",
			type: "text",
			value: code
		}));



		var labels = this.getLabels();

		var inputs = labels.map((label, i) => {

			var opt = {
				type: "text",
				value: code == 'en' ? label : (values?values[i]:'')
			};

			if (code == 'en') {
				opt.disabled = true;
			}

			return form.appendChild(new Element('input', opt));


		});

		if (code !== 'en') {

			this._forms[code] = form;

			this.translate(labels.map((label, i)=>{
				return values&&values[i]?'':label; //leave blank if set from data
			}), 'en', code).then((values) => {

				values.forEach((value, i) => {
					if(value){
						inputs[i].value = value;
					}
				})

				this.emit('translate', code, values);

				this._update();

			})
		}

	}

	getLabels() {

		var labels = [];
		var items = [];


		this._node.getNodesRecurse().forEach((node) => {
			items = items.concat(node.getData().items);
		});


		while (items.length) {
			var item = items.shift();


			if (item.items) {
				items = items.concat(item.items);
			}

			if (item.label) {
				labels.push(item.label);
			}

			if (item.labels) {
				labels = labels.concat(item.labels);
			}

			if (item.text) {
				labels.push(item.text);
			}

			if (item.html) {
				labels.push(item.html);
			}

		}

		return labels;
	}

}