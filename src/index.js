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
	ContentBlock
} from './ContentBlock.js';

import {
	ContentBlockItem,
	ContentBlockGroupItem
} from './ContentBlockItem.js';



import {
	ChildNodeLinks
} from './helpers/ChildNodeLinks.js';

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




var showArrows=graph.getContainer().appendChild(new Element('label',{
	"class":"view-toggle-arrows",
	html:"Show Arrows"
})).appendChild(new Element('input',{
	type:"checkbox",
	checked:true
}));

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
			var overlay=new Overlay(renderer.render((new JsonExporter(graph)).getData()));
			overlay.fullscreen();
			renderer.on('complete', ()=>{
				overlay.close();
			});
		}
	}
}));



graph.addMenuItem(new Element('button', {
	"class":'publish-btn',
	html: 'Publish',
	events: {
		click: () => {

			
			var overlay=new Overlay('<article><h1>Publish</h1></article>');
			
		}
	}
}));


graph.addTemplate('section', function(parentNode) {

	var numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

	var toNum = (i) => {

		return numbers[i];
	}

	var name = new Element('input', {
		"type": "text",
		value: (["Section", toNum(parentNode.getDepth())]).join(' ')
	});



	var codeSection = new Element('section', {
		html:"<label>Navigation Script</label>"+
			"<p>return the child index, or a child nodes uuid (or prefix)</p><p>(formData)=>{</p>",
		"class":"code-content-item collapse"
	})


	var childNodeLinks=codeSection.appendChild(new Element('p'));

	var codeNavigation = codeSection.appendChild(new Element('textarea', {
		value: 'return 0;',
		"class":"code-block"
	}))

	var codeToggle=codeSection.appendChild(new Element('button', {
		"class":"toggle-btn",
		"html":'Hide',
		events:{
			click:()=>{

				if(codeSection.classList.contains('collapse')){
					codeSection.classList.remove('collapse');
					toggle.innerHTML="Hide"
				}else{
					codeSection.classList.add('collapse');
					toggle.innerHTML="Show"
				}

			}
		}
	}));

	var contentBlocksContainer = new Element('div', {
		"class": "blocks"
	});

	var contentBlocks = [];

	var toggle;


	var addContentBlockSection=(itemData)=>{

		var block = new ContentBlock(section, contentBlocksContainer, itemData);

		contentBlocks.push(block);
		
		(itemData.items || []).forEach((blockData) => {
			panel.getItem(blockData.type).createInstance(block, blockData);
		})

		block.on('remove', ()=>{
			var i=contentBlocks.indexOf(block);
			contentBlocks.splice(i, 1);
			panel.updateDropTargets();

			if(contentBlocks.length===0){
				addContentBlockSection({
					name: "Page " + toNum(contentBlocks.length)
				});
			}

		});


		panel.show();
		panel.updateDropTargets();

		block.on('preview',()=>{
			var renderer=new SurveyRenderer();
			var overlay=new Overlay(renderer.render((new JsonExporter(block)).getData()));
			overlay.fullscreen();
			renderer.on('complete', ()=>{
				overlay.close();
			})
		});


	}

	var section = parentNode.addNode({
		"class": "section-node",
		getNodeData: () => {
			return {
				name: name.value,
				type: 'section',
				uuid:'', //placeholder
				items: contentBlocks.map((item, i) => {
					return item.getData();
				}),
				navigationLogic:codeNavigation.value
			};

		},
		setNodeData(data) {

			if(data.name){
				name.value=data.name;
			}

			if(data.navigationLogic){
				codeNavigation.value=data.navigationLogic;
			}

			(data.items&&data.items.length>0?data.items: [{
				name: "Page " + toNum(contentBlocks.length)
			}]).forEach((itemData) => {

				addContentBlockSection(itemData);

			});

		},
		elements: [
			name,
			contentBlocksContainer,
			codeSection,
			new Element('button', {
				"class":"add-block-btn",
				html: "Add Page",
				events: {
					click: function() {

						addContentBlockSection({
							name: "Page " + toNum(contentBlocks.length)
						});
					}
				}
			}),

			new Element('button',{
				"class":"test-btn",
				"html":'Test',
				events:{
					click:()=>{
						var sectionData=(new JsonExporter(section)).getData();
						delete sectionData.nodes;

						var renderer=new SurveyRenderer();
						var overlay=new Overlay(renderer.render(sectionData));
						overlay.fullscreen();
						renderer.on('complete', ()=>{
							overlay.close();
						});
					}
				}
					
			}),
			toggle=new Element('button', {
				"class":"toggle-btn",
				"html":'Hide',
				events:{
					click:()=>{

						if(section.getContainer().classList.contains('collapse')){
							section.getContainer().classList.remove('collapse');
							toggle.innerHTML="Hide"
						}else{
							section.getContainer().classList.add('collapse');
							toggle.innerHTML="Show"
						}

					}
				}
			})
		]


	});


	//Draw links
	(new ChildNodeLinks(childNodeLinks, section));


	name.addEventListener('change',()=>{
		section.emit('updateNode');
	});

	return section;

});



var panel = new Panel(graph.getContainer().parentNode);

panel.show();

graph.on('modeGraph', ()=>{
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

	fieldName: "radioOption{i}",

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
	}

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