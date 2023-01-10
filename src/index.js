import {
	Graph
} from './Graph.js'

import {
	Element
} from './Element.js'

import {
	Panel
} from './Panel.js'

import {
	JsonExporter
} from './JsonExporter.js'

import {
	JsonImporter
} from './JsonImporter.js'

import {
	ContentBlock
} from './ContentBlock.js'

import {
	ContentBlockItem,
	ContentBlockGroupItem
} from './ContentBlockItem.js'

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
	html: 'Export JSON',
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
			(new Overlay((new SurveyRenderer()).render((new JsonExporter(graph)).getData()))).fullscreen();
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

	var contentBlocksContainer = new Element('div', {
		"class": "blocks"
	});

	var contentBlocks = [];

	var section = parentNode.addNode({
		"class": "section-node",
		getNodeData: () => {
			return {
				name: name.value,
				type: 'section',
				uuid:'', //placeholder
				items: contentBlocks.map((item, i) => {
					return item.getData();
				})

			};

		},
		setNodeData(data) {

			(data.items || []).forEach((itemData) => {
				var block = new ContentBlock(section, contentBlocksContainer, itemData);
				contentBlocks.push(block);
				(itemData.items || []).forEach((blockData) => {

					panel.getItem(blockData.type).createInstance(block, blockData);

				})

				block.on('remove', ()=>{

					var i=contentBlocks.indexOf(block);
					contentBlocks.splice(i, 1);
					panel.updateDropTargets();
				});

				panel.show();
				panel.updateDropTargets();

				block.on('preview',()=>{
					(new Overlay((new SurveyRenderer()).render((new JsonExporter(block)).getData()))).fullscreen()
				})

			});

		},
		elements: [
			name,
			contentBlocksContainer,
			new Element('button', {
				html: "Add Question Block",
				events: {
					click: function() {


						/**
						 * TODO: DUPLICATE CODE BLOCK 
						 */

						var block = new ContentBlock(section, contentBlocksContainer, {
							name: "Question Set " + toNum(contentBlocks.length)
						});
						contentBlocks.push(block);
						
						block.on('remove', ()=>{
							var i=contentBlocks.indexOf(block);
							contentBlocks.splice(i, 1);
							panel.updateDropTargets();
						});


						panel.show();
						panel.updateDropTargets();

						block.on('preview',()=>{
							(new Overlay((new SurveyRenderer()).render((new JsonExporter(block)).getData()))).fullscreen()
						})

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
						(new Overlay((new SurveyRenderer()).render(sectionData))).fullscreen()
					}
				}
					
			})
		]


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
	default: 'none',
	labels: ['A', 'B', 'C'],
	previewHtml:'<input type="radio" name="radioA" value="a" checked="1" /><label for="radioA">A</label><input type="radio" name="radioB" value="b" /><label for="radioB">B</label><input type="radio" name="radioC" value="c" /><label for="radioC">C</label>',
	formHtml:'<label> FieldName: <input name="fieldName"/></label>'

}));

panel.addItem(new ContentBlockItem({

	fieldName: "checkboxOption{i}",

	name: "Checkbox",
	description: "displays a checkbox field for boolean selection",
	value: "Some Value",
	type: "checkbox",
	label: 'Yes',
	default: false,
	previewHtml:'<label for="checkboxA">Checkbox <input type="checkbox" name="checkboxA" value="a" checked="1" /> ... </label>'

}));


panel.addItem(new ContentBlockGroupItem({

	name: "Fieldset",
	description: "displays a group of items",
	type: "fieldset"

}));



var storedData = localStorage.getItem('formData');
if (storedData) {
	(new JsonImporter(graph)).loadFromObject(JSON.parse(storedData));
} else {
	graph.add('section');
}


graph.on('update', function() {
	setTimeout(() => {
		//need to delay this update for content sections which are added to a list after update event is fired
		localStorage.setItem('formData', (new JsonExporter(graph)).getJson());
		console.log('update');
	}, 500);

});