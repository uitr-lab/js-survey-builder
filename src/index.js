import {
	Graph
} from './Graph.js';

import {
	Element
} from './Element.js';

import {
	Panel
} from './Panel.js';

import {
	JsonExporter
} from './JsonExporter.js';

import {
	JsonImporter
} from './JsonImporter.js';

import {
	ContentBlockItem,
	ContentBlockGroupItem,
	TenplateBlockItem
} from './ContentBlockItem.js';


import {
	SurveySection
} from './helpers/SurveySection.js';


import {
	toDataURL
} from 'qrcode';

import {Overlay} from './Overlay.js'

var graph = (new Graph('survey-builder'));

var toggleView=graph.getContainer().appendChild(new Element('button',{
	"html":"Graph View",
	"class":"view-toggle-btn",
	events:{
		click:()=>{
			if(document.body.classList.contains('graph-view')){
				document.body.classList.remove('graph-view');
				graph.redrawList();
				toggleView.innerHTML='Graph View';
				return;
			}
			document.body.classList.add('graph-view');
			graph.redrawGraph();
			toggleView.innerHTML='List View';
		}
	}
}))


var languageToggle=graph.getContainer().appendChild(new Element('button', {
	"html":"Languages",
	"class":"language-toggle-btn",
	events:{
		click:()=>{
			if(document.body.classList.contains('language-view')){
				document.body.classList.remove('language-view');
				graph.redrawList();
				languageToggle.innerHTML='Languages';
				return;
			}
			document.body.classList.add('language-view');
			var lang=graph.redrawLanguage();

			lang.on('update', (languageMap)=>{
				localStorage.setItem('laguageData', JSON.stringify(languageMap));
			});

			var storedData = localStorage.getItem('laguageData');
			if (storedData) {
				storedData=JSON.parse(storedData);
				lang.updateData(storedData);
			}
			

			
			languageToggle.innerHTML='Form Builder';
		}
	}
}));




var showArrows=graph.getContainer().appendChild(new Element('label',{
	"class":"view-toggle-arrows",
	html:"Show Arrows"
})).appendChild(new Element('input',{
	type:"checkbox",
	checked:false
}));

document.body.classList.add('hide-arrows');

showArrows.addEventListener('change',()=>{

	if(showArrows.checked){
		document.body.classList.remove('hide-arrows');
		return;
	}

	document.body.classList.add('hide-arrows');
})



graph.addMenuItem(new Element('a', {
	html: 'UITR Lab',
	target: "_blank",
	href: "https://uitr.ok.ubc.ca/"
}));


graph.addMenuItem(new Element('a', {
	html: 'Fork this project',
	target: "_blank",
	href: "https://github.com/uitr-lab/js-survey-builder"
}));


graph.addMenuItem(new Element('button', {
	"class":"btn-export",
	html: 'Import/Export JSON',
	events: {
		click: () => {

			(new JsonExporter(graph)).showOverlay();
		}
	}
}));

graph.addMenuItem(new Element('button', {
	"class":'run-btn',
	html: 'Run Survey',
	events: {
		click: () => {

			var renderer=new SurveyRenderer();
			renderer.useLocalStorageLocalizationsMap('laguageData');
			renderer.displayInfo();
			var overlay=new Overlay(renderer.render((new JsonExporter(graph)).getData()));
			overlay.fullscreen();
			renderer.on('complete', ()=>{
				overlay.close();
			});
		}
	}
}));


graph.addMenuItem(new Element('button', {
	"class":'save-btn',
	html: 'Save/Load',
	events: {
		click: () => {

			var overlay=new Overlay('Save');
			overlay.fullscreen();
			
		}
	}
}));


graph.addMenuItem(new Element('button', {
	"class":'publish-btn',
	html: 'Publish',
	events: {
		click: () => {


			var container=new Element('span', {
				html:'<h1>Publish</h1>'
			});

			var text = container.appendChild(new Element('textarea', {
				'class':"import-json publish"
			}));

			

			text.innerHTML='<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Uitr Survey</title>'+
			'<link rel="stylesheet" type="text/css" href="'+document.location.origin+'/runner/style.css"></head><body></body>'+"\n\n\n\n";


			text.innerHTML+='<script src="'+document.location.origin+'/runner/main.js"></script>'+"\n";
			text.innerHTML+='<script type="text/javascript">'+"\n\n";
			text.innerHTML+='(function(){ '+"\n\n";

			text.innerHTML+='   var renderer=new SurveyRenderer();'+"\n";
			text.innerHTML+='   var survey='+JSON.stringify((new JsonExporter(graph)).getData())+';'+"\n\n\n";


			var storedData = localStorage.getItem('laguageData');
			if (storedData) {
				storedData=JSON.parse(storedData);
				text.innerHTML+='   var lang='+JSON.stringify(storedData)+';'+"\n";
				text.innerHTML+='   renderer.addLocalizationsMap(lang);'+"\n\n";
			}

			
			text.innerHTML+='   document.body.appendChild(renderer.render(survey));'+"\n\n";
			text.innerHTML+='})();'+"\n\n";
			text.innerHTML+='</script>';

			text.innerHTML+="\n\n\n\n"+'</html>';
			
			var overlay=new Overlay(container,[
				new Element('button', {
					html: "Copy",
					"class": "copy-btn",
					events: {
						click: () => {
							navigator.clipboard.writeText(text.value);
						}
					}
				})
				]);

			overlay.setSize({
				width:'800px',
				height:'600px'
			});
			
		}
	}
}));

graph.addMenuItem(new Element('button', {
	"class":'reset-btn',
	html: 'Reset',
	events: {
		click: () => {

			if(graph.getDisplayMode()==='lang'){
				graph.getLocalizations().clear();
				return;
			}

			graph.clear();
			graph.add('section');
			
		}
	}
}));

var panel = new Panel(graph.getContainer().parentNode);

graph.addTemplate(new SurveySection(graph, panel));


panel.show();

graph.on('modeGraph', ()=>{
	panel.disable();
})

graph.on('modeLang', ()=>{
	panel.disable();
})


graph.on('modeList', ()=>{
	panel.enable();
})


panel.addItem(new ContentBlockItem({

	name: "Markdown",
	description: "display html from markdown content",
	type: "markdown",
	text: "## Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
	previewHtml:'## Lorem ipsum >> <h2 style="display:inline">Lorem ipsum</h2>',
	formHtml:'<label> Markdown: </label><textarea name="text">'+"## Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqu"+'</textarea>'

}));

panel.addItem(new ContentBlockItem({


	name: "Label",
	description: "displays a simple label",
	type: "label",
	text: 'Some label',
	formHtml:'<label> Label Text: <input name="text"/></label>'

}));

panel.addItem(new ContentBlockItem({

	fieldName: "textInput{i}",

	name: "Text Input",
	description: "display a text field for user input",
	type: "textfield",
	label:"Some Label",
	placeholder: "answer here",
	previewHtml:'<label>Prompt <input type="text" placeholder="type here" /> ... </label>',
	formHtml:'<label> FieldName: <input name="fieldName" value="{auto}"/></label><label> Label: <input name="label" value="Some Label"/></label><label> Placeholder: <input name="placeholder" value="add text"/></label>'


}));


panel.addItem(new ContentBlockItem({

	fieldName: "radioOption",

	name: "Radio Buttons",
	description: "displays radio button selection",
	type: "radio",
	values: ['a', 'b', 'c'],
	defaultValue: '',
	labels: ['A', 'B', 'C'],
	previewHtml:'<input type="radio" name="radioA" value="a" checked="1" /><label for="radioA">A</label><input type="radio" name="radioB" value="b" /><label for="radioB">B</label><input type="radio" name="radioC" value="c" /><label for="radioC">C</label>',
	formHtml:'<label> FieldName: <input name="fieldName" value="checkBox{{auto}}"/></label><label> Label: <input name="label" value="Some Label"/></label><label> Options: <input name="values" value="A, B, C"/></label><label> Labels: <input name="labels" value="A, B, C"/></label><label> Default: <input name="defaultValue" value="a"/></label>'

}));


panel.addItem(new ContentBlockItem({

	fieldName: "optionList",

	name: "Option List",
	description: "displays option list selection",
	type: "option",
	values: ['a', 'b', 'c'],
	defaultValue: '',
	labels: ['A', 'B', 'C'],
	previewHtml:'<select><option>Option A</option></select>',
	formHtml:'<label> FieldName: <input name="fieldName" value="checkBox{{auto}}"/></label><label> Label: <input name="label" value="Some Label"/></label><label> Options: <input name="values" value="A, B, C"/></label><label> Labels: <input name="labels" value="A, B, C"/></label><label> Default: <input name="defaultValue" value="a"/></label>'

}));

panel.addItem(new ContentBlockItem({

	fieldName: "checkboxOption{i}",

	name: "Checkbox",
	description: "displays a checkbox field for boolean selection",
	value: "Some Value",
	type: "checkbox",
	label: 'Yes',
	defaultValue: false,
	previewHtml:'<label for="checkboxA">Checkbox <input type="checkbox" name="checkboxA" value="a" checked="1" /> ... </label>',
	formHtml:'<label> FieldName: <input name="fieldName" value="checkBox{{auto}}"/></label><label> Label: <input name="label" value="Some Label"/></label><label> Show Yes/No: <input type="checkbox" name="showYesNo"/></label><label> True Label: <input name="trueLabel" value="Yes" /></label><label> False Label: <input name="falseLabel" value="No" /></label>'

}));


panel.addItem(new ContentBlockGroupItem({

	name: "Fieldset",
	description: "displays a group of items",
	type: "fieldset",
	setNodeData(itemData, block) {

		if(!itemData){
			return;
		}

		(itemData.items || []).forEach((blockData) => {
			panel.getItem(blockData.type).createInstance(block, blockData);
		})
	},
	legend: '',
	classNames: '',
	conditionScript:'',
	formHtml:'<label> Legend Text: <input name="legend"/></label><label> CSS Class Names: <input name="classNames"/></label><label> Condition: </label><textarea name="conditionScript">return true;</textarea>'


}));


panel.addItem(new TenplateBlockItem({

	name: "Template",
	description: "create a reusable set of items",
	type: "template",
	setNodeData(itemData, block) {

		if(!itemData){
			return;
		}

		(itemData.items || []).forEach((blockData) => {
			panel.getItem(blockData.type).createInstance(block, blockData);
		})
	},
	template: '',
	classNames: '',
	formHtml:'<label>TemplateName: <input name="template"/></label><label> CSS Class Names: <input name="classNames"/></label>'


}, panel));


panel.addItem(new ContentBlockItem({
	
	name: "QRCode",
	description: "display a QR code",
	type: "qrcode",
	previewHtml:()=>{ return toDataURL('https://uitr.ok.ubc.ca/').then((data)=>{ return '<img style="height: 50px; position: absolute; right: 10px; bottom: 10px;" src="'+data+'"/>'; }); },
	formHtml:'<label> Data/Url: </label><textarea name="data">'+'https://uitr.ok.ubc.ca/'+'</textarea>'

}));



// panel.addItem(new ContentBlockItem({
	
// 	name: "Field Tree",
// 	description: "field tree",
// 	type: "fieldtree",
// 	previewHtml:'{ "variable1":true, "variable2":false ... }',	
// 	formHtml:'<label> Definition: </label><textarea name="data">{"field":{"type":"options"}}</textarea>'

// }));

panel.addItem(new ContentBlockItem({

	name: "Default Data",
	description: "adds some default form values",

	type: "defaultData",
	previewHtml:'{ "variable1":true, "variable2":false ... }',
	formHtml:'<label> JSON Data: </label><textarea name="data">'+'{ "variable1":true, "variable2":false }'+'</textarea>'

}));

panel.addItem(new ContentBlockItem({
	
	name: "Script",
	description: "runs a script",

	type: "script",
	previewHtml:'console.log("hello world");',
	formHtml:'<label> Script: </label><textarea name="script">'+'console.log("hello world");'+'</textarea>'

}));

panel.addItem(new ContentBlockItem({
	
	name: "Inline Style",
	description: "adds inline css",

	type: "style",
	previewHtml:'.form{ color:magenta; }',
	formHtml:'<label> Style: </label><textarea name="style">'+'.form{}'+'</textarea>'

}));


var preview=new Element('div');
preview.innerText='<p>Hello world</p>';

panel.addItem(new ContentBlockItem({
	
	name: "Html",
	description: "display raw html",
	type: "html",
	previewHtml:preview.innerHTML,
	formHtml:'<label> Html: </label><textarea name="html">'+preview.innerHTML+'</textarea>'

}));



panel.addItem(new ContentBlockItem({
	
	name: "Validation",
	description: "validate form values",
	type: "validation",
	previewHtml:'{ "variable1":true, "variable2":false ... }',
	formHtml:'<label> Validation Data: </label><textarea name="data">'+'{ "variable1":true, "variable2":false }'+'</textarea>'+
	''//'<label> Validation Rules: </label><textarea name="rules">'+'{}'+'</textarea>'

}));

panel.addItem(new ContentBlockItem({
	
	name: "Transform",
	description: "transform form data",
	type: "transform",
	previewHtml:'pageData.someField=parseInt(pageData.someField);',
	formHtml:'<label> Script: </label><textarea name="script">'+''+'</textarea>'

}));



var storedData = localStorage.getItem('formData');
if (storedData) {
	(new JsonImporter(graph)).loadFromObject(JSON.parse(storedData));
} else {
	graph.add('section');
}

var throttle=null;
graph.on('update', function() {
	if(throttle){
		clearTimeout(throttle);
	}
	throttle=setTimeout(() => {
		throttle=null;
		//need to delay this update for content sections which are added to a list after update event is fired
		localStorage.setItem('formData', (new JsonExporter(graph)).getJson());
		console.log('update');
	}, 500);

});



