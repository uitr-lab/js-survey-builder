export class QParser{


	chain(items){

		var first=items.shift();
		var current=first;

		while(items.length){
			var next=items.shift();
			current.nodes=[next];
			current=next;
		}


		return first;

	}


	layoutBlocks(data){

		var blocklayout=data.filter((item)=>{
			return item.name==='Survey Blocks'
		}).pop();


		var sections= blocklayout.blocks.map((block)=>{



			var sectionData= block.items.map((blockItem)=>{

				console.log(blockItem);

				var blockData= data.filter((item)=>{


					return item.name===blockItem.name;
					
				}).pop();

				if(!blockData){
					return null;
				}


				blockData.type='fieldset';
				
				return blockData;


			}).filter((blockData)=>{
				return !!blockData;
			})

			
			return {
				type:'set',
				items:sectionData
			}

		});


		return sections;



	}


	parse(data){




		var def = data.SurveyElements.map((element)=>{
			var dat= {
				type:"set"
			}

			if(element.Element){
				dat.qType=element.Element;
			}

			if(element.PrimaryAttribute){
				dat.name=element.PrimaryAttribute;
			}

			if(element.SecondaryAttribute){
				dat.label=element.SecondaryAttribute;
			}

			if(element.Payload){



				var label={	
						type:'label',
						text:dat.name
					};
			
				var item={
						html:'<h2>'+(element.Payload.QuestionText||'')+'</h2>',
						type:'html',
						qType:element.Payload.QuestionType||"undefined"
					};


				if(item.qType=='DB'){
					item.html=(element.Payload.QuestionText||'');
				}


				dat.items=[
					label, 
					item	
				];



				if(dat.qType==='BL'){

					dat.blocks=Object.values(element.Payload).map((page)=>{

						return {
							description:page.Description,
							items:page.BlockElements.map((block)=>{

								return {name: block.QuestionID }

							})
						}

					});

				}




				if(item.qType==='Matrix'){




					dat.items=dat.items.concat(Object.values(element.Payload.Choices).map((choice, index)=>{

						return {
							type:'radio',
							label:choice.Display,
							fieldName:dat.name+'-'+index,
							labels:Object.values(element.Payload.Answers).map((value)=>{
								return value.Display
							}),
							values:Object.keys(element.Payload.Answers)
							//values
						};

					}));

				}


				if(item.qType==='MC'){



					
					var radio={
						type:'radio',
						label:element.Payload.QuestionDescription,
						fieldName:dat.name,
						labels:Object.values(element.Payload.Choices).map((value)=>{
							return value.Display
						}),
						values:Object.keys(element.Payload.Choices)
						//values
					};

					if(element.Payload.Configuration.QuestionDescriptionOption==="UseText"){
						delete radio.label;
					}
			



					dat.items=dat.items.concat([radio]);

				}


				if(item.qType==='TE'){


					dat.items=dat.items.concat([{
							type:'textfield',
							label:element.Payload.QuestionDescription,
							fieldName:dat.name,
						}]);


				}

			}

			return dat;


		});

		//console.log(JSON.stringify(
		return {
		   "name": data.SurveyEntry.SurveyName,
		   "type": "section",
		   "uuid": "47d62025-602c-4926-9304-e14da54f53a5",
		   "items": this.layoutBlocks(def)
		}
		//	,  null, '   '));
	}

}



//(new QParser()).parse(require('../../examples/railtrail.json'));