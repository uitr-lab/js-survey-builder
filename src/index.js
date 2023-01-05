

import {Graph} from './Graph.js'
import {Element} from './Element.js'
import {Panel} from './Panel.js'

import {ContentBlock} from './ContentBlock.js'
import {ContentBlockItem} from './ContentBlockItem.js'

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
					items:contentBlocks.map((item, i)=>{
						return item.getData();
					})

				};

			},
			elements: [
				name,
				contentBlocksContainer,
				new Element('button', {
					html: "Add Question Block",
					events: {
						click: function() {
								
							contentBlocks.push(new ContentBlock(contentBlocksContainer, {
								name:"Question Set "+toNum(contentBlocks.length)
							}));


						}
					}
				})
			]


		});


	section.add('section-placeholder');


});

var panel=new Panel(graph.getContainer().parentNode);
panel.addItem(new ContentBlockItem({

	name:"Markdown",
	description:"display html from markdown content"

}));

panel.addItem(new ContentBlockItem({

	name:"text input",
	description:"display a text field for user input"

}));


graph.add('section');
