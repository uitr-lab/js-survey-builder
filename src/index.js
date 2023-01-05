

import {Graph} from './Graph.js'
import {Element} from './Element.js'


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
						//placeholder.addClass('hidden');
					}
				}
			})
		]
	})


});

graph.addTemplate('section', function(parentNode){

	var names=['One', 'Two', 'Three', 'Four'];

	var name=new Element('input', {
					"type":"text",
					value: (["Section", names[parentNode.getDepth()]]).join(' ')
				});

	var questionBlocks=new Element('div', {
					"class":"blocks"
				});

	var section = parentNode.addNode({
			"class": "section-node",
			getNodeData:()=>{
				return {
					name:name.value,
					items:[]
				};

			},
			elements: [
				name,
				questionBlocks,
				new Element('button', {
					html: "Add Question Block",
					events: {
						click: function() {
								
							questionBlocks.appendChild(new Element('section'))


						}
					}
				})
			]


		});


	section.add('section-placeholder');


});


graph.add('section');


