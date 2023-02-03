import {
	ChildNodeLinks
} from './ChildNodeLinks.js';

import {
	ContentBlockPage
} from '../ContentBlock.js';

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
	SectionTemplate
} from '../SectionTemplate.js';

export class SurveySection extends SectionTemplate {



	constructor(graph, panel) {

		super();

		this._graph = graph;
		this._panel = panel;

	}

	getName(){
		return 'section';
	}

	renderSection(parentNode) {

		var numbers = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];

		var toNum = (i) => {

			return numbers[i];
		}

		var name = new Element('input', {
			"type": "text",
			value: (["Section", toNum(parentNode.getDepth())]).join(' ')
		});


		var section;


		var codeSection = new Element('section', {
			html: "<label>Navigation Script</label>" +
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
						new Element('h1', {"html":"Navigation Logic"}), 
						codeContentHints
					]).showOverlay();
				}
			}
		}));

		var contentBlocksContainer = new Element('div', {
			"class": "blocks"
		});

		var contentBlocks = [];

		var toggle;


		var addContentBlockSection = (itemData) => {

			var block = new ContentBlockPage(section, contentBlocksContainer, itemData);

			block.setLoader((itemData)=>{

				(itemData.items || []).forEach((blockData) => {
					this._panel.getItem(blockData.type).createInstance(block, blockData);
				});

			}).setData();

			contentBlocks.push(block);



			block.on('remove', () => {
				var i = contentBlocks.indexOf(block);
				contentBlocks.splice(i, 1);
				this._panel.updateDropTargets();

				if (contentBlocks.length === 0) {
					addContentBlockSection({
						name: "Page " + toNum(contentBlocks.length)
					});
				}

			});


			this._panel.show();
			this._panel.updateDropTargets();

			block.on('preview', () => {
				var renderer = new SurveyRenderer();
				renderer.useLocalStorageLocalizationsMap('laguageData');
				renderer.displayInfo();
				var overlay = new Overlay(renderer.render((new JsonExporter(block)).getData()));
				overlay.fullscreen();
				renderer.on('complete', () => {
					overlay.close();
				})
			});


		}

		section = parentNode.addNode({
			"class": "section-node",
			getNodeData: () => {
				return {
					name: name.value,
					type: 'section',
					uuid: '', //placeholder
					items: contentBlocks.map((item, i) => {
						return item.getData();
					}),
					navigationLogic: codeNavigation.value
				};

			},
			setNodeData(data) {

				if (data.name) {
					name.value = data.name;
				}

				if (data.navigationLogic) {
					codeNavigation.value = data.navigationLogic;
				}

				(data.items && data.items.length > 0 ? data.items : [{
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
					"class": "add-block-btn",
					html: "Add Page",
					events: {
						click: function() {

							addContentBlockSection({
								name: "Page " + toNum(contentBlocks.length)
							});
						}
					}
				}),

				new Element('button', {
					"class": "test-btn",
					"html": 'Test',
					events: {
						click: () => {
							var sectionData = (new JsonExporter(section)).getData();
							delete sectionData.nodes;

							var renderer = new SurveyRenderer();
							renderer.useLocalStorageLocalizationsMap('laguageData');
							renderer.displayInfo();
							var overlay = new Overlay(renderer.render(sectionData));
							overlay.fullscreen();
							renderer.on('complete', () => {
								overlay.close();
							});
						}
					}

				}),
				toggle = new Element('button', {
					"class": "toggle-btn",
					"html": 'Hide',
					events: {
						click: () => {

							if (section.getContainer().classList.contains('collapse')) {
								section.getContainer().classList.remove('collapse');
								toggle.innerHTML = "Hide"
							} else {
								section.getContainer().classList.add('collapse');
								toggle.innerHTML = "Show"
							}

						}
					}
				})
			]


		});


		//Draw links
		(new ChildNodeLinks(childNodeLinks, section));


		name.addEventListener('change', () => {
			section.emit('updateNode');
		});

		return section;



	}



}