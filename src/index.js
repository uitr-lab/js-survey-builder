

import {Graph} from './Graph.js'
import {Element} from './Element.js'
import {Panel} from './Panel.js'
import {JsonExporter} from './JsonExporter.js'
import {JsonImporter} from './JsonImporter.js'

import {ContentBlock} from './ContentBlock.js'
import {ContentBlockItem, ContentBlockGroupItem} from './ContentBlockItem.js'

var graph = (new Graph('survey-builder'));
graph.addTemplate('section-placeholder', function(parentNode){

	var placeholder = parentNode.addNode({
		"class": "empty-node",
		elements: [
			new Element('button', {
				html: "Add Section",
				events: {
					click: function() {
						parentNode.add('section');
						if(parentNode.numberOfRealChildNodes()==2){
							//parentNode.add('navigationLogic');
						}
						
					}
				}
			})
		]
	})

	return placeholder;


});





graph.addTemplate('section', function(parentNode){

	var numbers=['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

	var toNum=(i)=>{

		return numbers[i];
	}

	var name=new Element('input', {
					"type":"text",
					value: (["Section", toNum(parentNode.getDepth())]).join(' ')
				});

	var contentBlocksContainer=new Element('div', {
					"class":"blocks"
				});

	var contentBlocks=[];

	var section = parentNode.addNode({
			"class": "section-node",
			getNodeData:()=>{
				return {
					name:name.value,
					type:'section',
					items:contentBlocks.map((item, i)=>{
						return item.getData();
					})

				};

			},
			setNodeData(data){

				(data.items||[]).forEach((itemData)=>{
					var block=new ContentBlock(section, contentBlocksContainer, itemData);
					contentBlocks.push(block);
					(itemData.items||[]).forEach((blockData)=>{

						panel.getItem(blockData.type).createInstance(block, blockData);

					})

					panel.show();
					panel.updateDropTargets();
				});

			},
			elements: [
				name,
				contentBlocksContainer,
				new Element('button', {
					html: "Add Question Block",
					events: {
						click: function() {
								
							contentBlocks.push(new ContentBlock(section, contentBlocksContainer, {
								name:"Question Set "+toNum(contentBlocks.length)
							}));



							panel.show();
							panel.updateDropTargets();

						}
					}
				})
			]


		});


	//section.add('section-placeholder');
	return section;

});




var panel=new Panel(graph.getContainer().parentNode);






panel.addItem(new ContentBlockItem({

	name:"Markdown",
	description:"display html from markdown content",
	type:"markdown",
	text:"## Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"

}));

panel.addItem(new ContentBlockItem({


	name:"Label",
	description:"displays a simple label",
	type:"label",
	text:'Some label'

}));

panel.addItem(new ContentBlockItem({

	fieldName:"textInput{i}",

	name:"Text Input",
	description:"display a text field for user input",
	type:"textfield",
	value:"",
	placeholder:"answer here"

}));


panel.addItem(new ContentBlockItem({

	fieldName:"radioOption{i}",

	name:"Radio Buttons",
	description:"displays radio button selection",
	type:"radio",
	values:['a', 'b', 'c'],
	default:'none',
	labels:['A', 'B', 'C']

}));

panel.addItem(new ContentBlockItem({

	fieldName:"checkboxOption{i}",

	name:"Checkbox",
	description:"displays a checkbox field for boolean selection",
	type:"checkbox",
	label:'Yes',
	default:false

}));


panel.addItem(new ContentBlockGroupItem({

	name:"Fieldset",
	description:"displays a group of items",
	type:"fieldset"

}));






var storedData=localStorage.getItem('formData');
if(storedData){
	(new JsonImporter(graph)).loadFromObject(JSON.parse(storedData));
}else{
	graph.add('section');
}


graph.on('update', function(){
	setTimeout(()=>{
		//need to delay this update for content sections which are added to a list after update event is fired
		localStorage.setItem('formData', (new JsonExporter(graph)).getJson());
		console.log('update');
	}, 500);
	
});


