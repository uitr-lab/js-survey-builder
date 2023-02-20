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

			var menu=new Element('div',{
				html:'<h2>Load templates</h2>'
			});

			var item=menu.appendChild(new Element('p', {
				"class":"template-item",
				html:"<h3>Current Survey</h3>the current working prototype"
			}));

			item.appendChild(new Element('button',{
				html:'Load Template',
				"class":"inline-btn",
				events:{
					click:(e)=>{
						e.preventDefault();
						(new JsonImporter(graph)).loadFromObject({
   "name": "Trip Diary Introduction",
   "type": "section",
   "uuid": "ee92c75b-4ff9-4fef-bf18-1b56f17dec29",
   "items": [
      {
         "name": "Page One",
         "type": "set",
         "items": [
            {
               "type": "markdown",
               "text": "## Introduction page\n\n### About this survey\n\nThis survey is being conducted by the UiTR lab\n\n&nbsp;\n\n### Instructions\n\n - Add members of your family\n - Record trips taken every day, for each family member \n\n&nbsp;\n\n### Privacy\n\n - your data is hosted on secure servers at UBC\n - your data will only be accessed by approved researchers\n&nbsp;\n\n&nbsp;\n\n&nbsp;\n\n"
            },
            {
               "type": "defaultData",
               "data": "{\n\"members\":{\"i\":0, \"total\":1},\n\"trips\":{\"i\":0, \"total\":1},\n\"activities\":{\"i\":0, \"total\":1},\n\"vehicles\":{\"i\":0, \"total\":1}\n}"
            }
         ]
      },
      {
         "name": "Page Two",
         "type": "set",
         "items": [
            {
               "type": "markdown",
               "text": "## Access Code"
            },
            {
               "type": "fieldset",
               "legend": "",
               "classNames": "",
               "conditionScript": "",
               "items": [
                  {
                     "type": "label",
                     "text": "Enter your unique access code"
                  },
                  {
                     "fieldName": "accessCode",
                     "type": "textfield",
                     "label": "Access Code",
                     "placeholder": ""
                  }
               ]
            }
         ]
      },
      {
         "name": "Page Three",
         "type": "set",
         "items": [
            {
               "type": "markdown",
               "text": "## Information about the mobile app\nEach member of your family with with a mobile device can participate using their device"
            },
            {
               "type": "qrcode",
               "data": "https://uitr.ok.ubc.ca/{{accessCode}}"
            },
            {
               "type": "html",
               "html": "<br/>\n<a href=\"https://uitr.ok.ubc.ca/{{accessCode}}\">Mobile app link</a>"
            }
         ]
      }
   ],
   "navigationLogic": "return new Promise(function(resolve){ \n   setTimeout(function(){\n\n     if(pageData.accessCode==='abc-abc'){\n       renderer.updateFormValues({\"memberDetails\": [{\n         \"personName\": \"Jack\",\n         \"age\": 43,\n         \"work1\": \"Some Job\",\n         \"address1\": \"\",\n         \"municipality1\": \"\",\n         \"work2\": \"\",\n         \"address2\": \"\",\n         \"municipality2\": \"\",\n         \"school\": \"\",\n         \"addressSchool\": \"\",\n         \"municipalitySchool\": \"\",\n         \"hasLicense\": \"on\"\n      }\n      ]});\n      \n       resolve('b739c');\n      // resolve('cb46d');\n\n     }\n\n\n     if(pageData.accessCode==='abc-def'){\n       renderer.updateFormValues({\"memberDetails\": [{\n         \"personName\": \"Jill\",\n         \"age\": 25,\n         \"work1\": \"Some Job\",\n         \"address1\": \"\",\n         \"municipality1\": \"\",\n         \"work2\": \"\",\n         \"address2\": \"\",\n         \"municipality2\": \"\",\n         \"school\": \"\",\n         \"addressSchool\": \"\",\n         \"municipalitySchool\": \"\",\n         \"hasLicense\": \"on\"\n      }\n      ], \"vehicles\":[{}]});\n      \n       //resolve('b739c');\n       resolve('cb46d');\n\n     }\n\n\n      resolve('4b7f0');\n   }, 400);\n});",
   "then": "goto node 0",
   "nodes": [
      {
         "name": "Household",
         "type": "section",
         "uuid": "6b548368-436e-4698-8228-198907e78ea2",
         "items": [
            {
               "name": "Page One",
               "type": "set",
               "items": []
            }
         ],
         "navigationLogic": "return 0;",
         "then": "goto node 0",
         "nodes": [
            "4b7f002f-f8cd-41a4-8a0c-ab56b6b2a488"
         ]
      },
      {
         "name": " Member Details",
         "type": "section",
         "uuid": "4b7f002f-f8cd-41a4-8a0c-ab56b6b2a488",
         "items": [
            {
               "name": "Page One",
               "type": "set",
               "items": [
                  {
                     "type": "script",
                     "script": "\n\n\n\n  renderer.useFormDataFieldArray(\"memberDetails\", formData.members.i)\n"
                  },
                  {
                     "type": "markdown",
                     "text": "\n\n{% set indexNumbers = [ 'First', 'Second' ,'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'This is ridiculous-th'] %}\n\n\n\n# Person Profile: {{indexNumbers[members.i]}} Household Member\n\n\n&nbsp;\n&nbsp;\n\n> please add a profile for each person in the household.\n\n&nbsp;\n&nbsp;\n"
                  },
                  {
                     "fieldName": "personName",
                     "type": "textfield",
                     "label": "Person Name",
                     "placeholder": "add name or initial"
                  },
                  {
                     "type": "fieldset",
                     "legend": "Some Legend",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "fieldName": "gender",
                           "type": "radio",
                           "values": "male, female",
                           "defaultValue": "",
                           "labels": "Male, Female",
                           "default": "none",
                           "label": "Gender of this person"
                        },
                        {
                           "fieldName": "age",
                           "type": "textfield",
                           "label": "Age of this person",
                           "placeholder": "years"
                        },
                        {
                           "fieldName": "hasLicense",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Person has a valid driver's license?",
                           "defaultValue": false,
                           "default": false,
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        },
                        {
                           "fieldName": "isComercialDriver",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Person is employed as a commercial driver",
                           "defaultValue": false,
                           "default": false,
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        },
                        {
                           "type": "label",
                           "text": "This person is: (Check all that apply)"
                        },
                        {
                           "fieldName": "someOptionA",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Yes",
                           "defaultValue": false,
                           "default": false,
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        },
                        {
                           "fieldName": "someOptionB",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Yes",
                           "defaultValue": false,
                           "default": false,
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        }
                     ]
                  },
                  {
                     "type": "fieldset",
                     "legend": "",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "type": "label",
                           "text": "If this person works, please list thier workplaces"
                        },
                        {
                           "fieldName": "work1",
                           "type": "textfield",
                           "label": "Name of work 1",
                           "placeholder": ""
                        },
                        {
                           "fieldName": "address1",
                           "type": "textfield",
                           "label": "Address",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "municipality1",
                           "type": "textfield",
                           "label": "Municipality",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "work2",
                           "type": "textfield",
                           "label": "Name of work 2",
                           "placeholder": ""
                        },
                        {
                           "fieldName": "address2",
                           "type": "textfield",
                           "label": "Address",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "municipality2",
                           "type": "textfield",
                           "label": "Municipality",
                           "placeholder": "answer here"
                        }
                     ]
                  },
                  {
                     "type": "fieldset",
                     "legend": "Some legend",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "type": "label",
                           "text": "If this person is a student, please list thier school"
                        },
                        {
                           "fieldName": "school",
                           "type": "textfield",
                           "label": "Name of School",
                           "placeholder": ""
                        },
                        {
                           "fieldName": "addressSchool",
                           "type": "textfield",
                           "label": "Address",
                           "placeholder": ""
                        },
                        {
                           "fieldName": "municipalitySchool",
                           "type": "textfield",
                           "label": "Municipality",
                           "placeholder": ""
                        }
                     ]
                  },
                  {
                     "type": "fieldset",
                     "legend": "",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "type": "label",
                           "text": "Does this person drive him/herself to work or school?"
                        },
                        {
                           "fieldName": "drives",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Yes",
                           "defaultValue": false,
                           "default": false,
                           "showYesNo": "on",
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        },
                        {
                           "fieldName": "paysParking",
                           "type": "radio",
                           "values": "free, employer, partial-employer, personal",
                           "defaultValue": "",
                           "labels": "Parking is free, Fully paid for by employee, partial-employer, personal",
                           "default": "none",
                           "label": "Who pays for parking?"
                        }
                     ]
                  },
                  {
                     "type": "fieldset",
                     "legend": "Synchronize this users device",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "type": "qrcode",
                           "data": "https://uitr.ok.ubc.ca/{{accessCode}}/{{formData.members.i}}"
                        },
                        {
                           "type": "html",
                           "html": "{% set indexNumbers = [ 'First', 'Second' ,'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Eighth', 'This is ridiculous-th'] %}\n<br/>\n<a href=\"https://uitr.ok.ubc.ca/{{accessCode}}/{{formData.members.i}}\">{{indexNumbers[members.i]}} Household members mobile link<a>"
                        }
                     ]
                  },
                  {
                     "fieldName": "addAnother",
                     "value": "Some Value",
                     "type": "checkbox",
                     "label": "Add Another Family Member",
                     "defaultValue": false,
                     "trueLabel": "Yes",
                     "falseLabel": "No",
                     "showYesNo": "on"
                  },
                  {
                     "type": "transform",
                     "script": "if(parseInt(pageData.age)+\"\"!=pageData.age.trim()){\n   return;\n}\n\nreturn {\n   age:parseInt(pageData.age)\n}"
                  }
               ]
            }
         ],
         "navigationLogic": "\n\nif(formData.memberDetails[formData.members.i].addAnother==='on'){\n  var members=renderer.getFormValue('members');\n  if(typeof members=='undefined'){\n    members={i:-1, total:1};\n  }\n  members.i++;\n  members.total++;\n  renderer.setFormValue('members', members);\n  renderer.setFormValue('addAnother', 'off');\n  return '4b7f0';\n}\n\nvar members=renderer.getFormValue('members');\nmembers.i=0;\nrenderer.setFormValue('members', members);\n\nreturn 'b739c';\n//return 'cb46d';",
         "then": "goto node 0",
         "nodes": [
            "b739ce6f-a1c5-4ba2-82d8-c91394e7fa5f",
            "cb46d44e-248c-4297-bcf3-e3955220b7a2",
            "4b7f002f-f8cd-41a4-8a0c-ab56b6b2a488"
         ]
      },
      {
         "name": "Member Activities",
         "type": "section",
         "uuid": "cb46d44e-248c-4297-bcf3-e3955220b7a2",
         "items": [
            {
               "name": "Page Two",
               "type": "set",
               "items": [
                  {
                     "type": "script",
                     "script": "renderer.useFormDataFieldArray(\"memberDetails\", formData.members.i)\nrenderer.useFormDataFieldArray(\"tripDetails\", formData.trips.i)"
                  },
                  {
                     "type": "style",
                     "style": ".activity-row>fieldset {\n    display: inline-block;\n    margin: 5px !important;\n    vertical-align: top;\n}\n\n.activity-row>* .option>label, .activity-row>* .option>select {\n    display: block;\n    margin: 5px;\n    min-width: 100px;\n    white-space: nowrap;\n}\n\n\nfieldset.activity-time-location>label>input, fieldset.activity-end-time>label>input{\n    width: 70%;\n    min-width: 200px !important;\n}\n\nfieldset.activity-time-location>label, fieldset.activity-end-time>label{\n    margin-left: 0 !important;\n}\n\nfieldset.activity-time-location>label>span, fieldset.activity-end-time>label>span{\n    min-width: 150px;\n    display: inline-block;\n    font-weight: bold;\n}\n\nfieldset.activity-end-time>label>span{\n text-align:left;\n margin:5px;\n margin-bottom: 0;\n}\n\nfieldset.activity-end-time>label>input{\n margin:5px !important;\n}\n\n\n\nfieldset.activity-time-location {\n    display: block;\n}\n\nfieldset.activity-time-location>label:first-child {\n    width: 35%;\n    white-space: nowrap;\n    display: inline-block;\n}\n\nfieldset.activity-time-location>label:last-child {\n    width: 60%;\n    white-space: nowrap;\n    display: inline-block;\n}\n\n\nfieldset.activity-time-location>label:first-child>input {\n    width: 164px;\n    min-width: unset !important;\n}\n\nfieldset.activity-time-location>label:last-child>input {\n   width: 360px;\n}\n\nfieldset.activity-time-location>label:first-child>span {\n    min-width: 100px;\n   \n}\n\n\n\n\n\n.schedule {\n    width: 100%;\n    background: #d0a9e1;\n    border-radius: 5px;\n    padding: 30px;\n    box-sizing: border-box;\n}\n\n\n.activity-row>fieldset fieldset {\n    margin: unset;\n    display: inline;\n    padding: unset;\n}\n\n\n\n.activity-row>* .option>select {\n    height: 30px;\n    padding: 0 10px;\n    border-radius: 2px;\n}\n\nfieldset.travel-options {\n    white-space: nowrap;\n}\n\nfieldset.travel-options>* {\n    display: inline-block;\n}\n\nfieldset.travel-options fieldset {\n    background: transparent;\n}\n\nfieldset.activity-row {\n    background: transparent !important;\n    margin: 0 !important;\n    padding: 0 !important;\n}\n\n.collapse fieldset.activity-row fieldset {\n    display: none;\n}\n.collapse fieldset.custom-loop {\n    padding: 0 20px;\n}\n.nav.inline-nav {\n    display: none;\n}\n\n\nfieldset.travel-options fieldset .option {\n    display: inline-block;\n}\n\n.collapse {\n    position:relative;\n}\n.collapse .nav.inline-nav {\n    display: block;\n    text-align: right;\n    position: absolute;\n    top: 1px;\n    right: 5px;\n}\n\n.markdown h3 strong {\n    font-size: 30px;\n    color: #386bc6;\n}\n"
                  },
                  {
                     "type": "defaultData",
                     "data": "{ \n\n  \n   \"memberName\":\"Jack\",\n   \"vehicles\":\"a, b, c\",\n   \"vehicleLabels\":\"Toyota Matrix, Ford F150, Nissan LEAF\",\n\n   \"activityTypes\": \"inHome, atWork, atSchool, other\", \n   \"activityTypeLabels\": \"Inasdf, At work, At School, other\",\n\n   \"inHomeActivities\":\"working, online, onlineClass, other\",\n   \"inHomeActivityLabels\":[\n        \"Working at home\", \n        \"Online activities\", \n        \"Online classes\", \n        \"All other - sleeping, meals etc.\"\n   ],\n\n\n   \n\n\n   \"atWorkActivities\":\"working, other\",\n   \"atWorkActivityLabels\":\"Working, All other activities\",\n\n   \"atSchoolActivities\":\"class, other\",\n   \"atSchoolActivityLabels\":\"Attending class, All other activities\",\n\n   \"otherActivities\":\"shopping, errands\",\n   \"otherActivityLabels\":\"Routine shopping, Household errands\",\n\n   \"travelTypes\":\"autoDriver, autoPassenger\",\n   \"travelTypeLabels\":\"Auto Driver, Auto Passenger\",\n \n   \"travelWith\":\"alone, partner\",\n   \"travelWithLabels\":\"Alone, Spouse/Partner\",\n\n\n\n    \"activityCategory0\": \"inHome\",\n    \"inHomeActivity0\": \"other\",\n    \"startTime0\": \"03:00\",\n    \"startLocation0\": \"Home Address\",\n    \"endTime0\": \"09:00\"\n\n\n}"
                  },
                  {
                     "type": "script",
                     "script": "var oneDay=3600*1000*24;\nvar previousDay=new Date((new Date()).getTime()-oneDay);\n\nvar day=previousDay.getDay();\nvar time=previousDay.getTime();\n\nif(day==6){\n  time-=3600*1000*24;\n}\n\nif(day==0){\n  time-=3600*1000*24*2;\n}\n\nconsole.log(new Date(time));\nrenderer.setFormValue('date', Math.round(time/1000))"
                  },
                  {
                     "type": "markdown",
                     "text": "\n### **{{memberDetails[members.i].personName|default('Example Name')}}** Record Activities for {{date|date(\"F jS Y\")}}"
                  },
                  {
                     "type": "html",
                     "html": "<div class=\"schedule\">\n   <h3>{Schedule Visual Placeholder}</h3>\n   <p>{This area will display the time-blocks organized in a way to show the overview of all the tasks occurring in the day. It will not be the colour of pea soup! }</p>\n</div>"
                  },
                  {
                     "type": "template",
                     "template": "Activity Row",
                     "classNames": "activity-row",
                     "items": [
                        {
                           "type": "markdown",
                           "text": "## Place/Activity {{itemIndex+1}}"
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "activity-time-location",
                           "conditionScript": "",
                           "items": [
                              {
                                 "fieldName": "startTime{{itemIndex}}",
                                 "type": "textfield",
                                 "label": "Start Time",
                                 "placeholder": "",
                                 "format": "time"
                              },
                              {
                                 "fieldName": "startLocation{{itemIndex}}",
                                 "type": "textfield",
                                 "label": "StartLocation",
                                 "placeholder": "type address",
                                 "format": "geocode"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "",
                           "items": [
                              {
                                 "fieldName": "activityCategory{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{activityTypes}}",
                                 "defaultValue": "",
                                 "labels": "{{activityTypeLabels}}",
                                 "label": "Activity Location"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "travel-options",
                           "conditionScript": "\nreturn formData.activityCategory{{itemIndex-1}}!==formData.activityCategory{{itemIndex}}&&{{itemIndex}}!==0&&formData.activityCategory{{itemIndex}}&&formData.activityCategory{{itemIndex-1}}",
                           "items": [
                              {
                                 "fieldName": "travelType{{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{travelTypes}}",
                                 "defaultValue": "",
                                 "labels": "{{travelTypeLabels}}",
                                 "label": "Travel Mode"
                              },
                              {
                                 "type": "template.Transit With",
                                 "variables": "{ \"variable1\":true, \"variable2\":false }"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "return formData.activityCategory{{itemIndex}}===\"inHome\"",
                           "items": [
                              {
                                 "fieldName": "inHomeActivity{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{inHomeActivities}}",
                                 "defaultValue": "",
                                 "labels": "{{inHomeActivityLabels}}",
                                 "label": "Home Activity"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "return formData.activityCategory{{itemIndex}}===\"atWork\"",
                           "items": [
                              {
                                 "fieldName": "workActivity{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{atWorkActivities}}",
                                 "defaultValue": "",
                                 "labels": "{{atWorkActivityLabels}}",
                                 "label": "Work Activity"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "return formData.activityCategory{{itemIndex}}===\"atSchool\"",
                           "items": [
                              {
                                 "fieldName": "schoolActivity{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{atSchoolActivities}}",
                                 "defaultValue": "",
                                 "labels": "{{atSchoolActivityLabels}}",
                                 "label": "School Activity"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "return formData.activityCategory{{itemIndex}}===\"other\"",
                           "items": [
                              {
                                 "fieldName": "otherActivity{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{otherActivities}}",
                                 "defaultValue": "",
                                 "labels": "{{otherActivityLabels}}",
                                 "label": "Other Activity"
                              }
                           ]
                        },
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "activity-end-time",
                           "conditionScript": "",
                           "items": [
                              {
                                 "fieldName": "endTime{{itemIndex}}",
                                 "type": "textfield",
                                 "label": "End time",
                                 "placeholder": "answer here",
                                 "format": "time"
                              }
                           ]
                        }
                     ]
                  },
                  {
                     "type": "template",
                     "template": "Transit With",
                     "classNames": "",
                     "items": [
                        {
                           "type": "fieldset",
                           "legend": "",
                           "classNames": "",
                           "conditionScript": "",
                           "items": [
                              {
                                 "fieldName": "transitWith{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{travelWith}}",
                                 "defaultValue": "",
                                 "labels": "{{travelWithLabels}}",
                                 "label": "Travelling with?"
                              },
                              {
                                 "fieldName": "transitVehicle{{itemIndex}}",
                                 "type": "option",
                                 "values": "{{vehicles}}",
                                 "defaultValue": "",
                                 "labels": "{{vehicleLabels}}",
                                 "label": "Which Vehicle"
                              }
                           ]
                        }
                     ]
                  },
                  {
                     "type": "custom",
                     "template": "",
                     "classNames": "custom-loop",
                     "items": [
                        {
                           "type": "template.Activity Row",
                           "variables": "{\"itemIndex\":\"{{loopIndex}}\"}"
                        }
                     ],
                     "renderScript": "\n\nvar wrap=container.appendChild(new Element('div'));\n\nvar previousItems=[];\nvar nextItems=[];\nvar currentItem=null;\n\n\nvar addEdit=function(el, index){\n   var inlineNav=el.appendChild(new Element('div', {\"class\":\"nav inline-nav\"}))\n   inlineNav.appendChild(new Element('button', {\n      html:\"Edit\",\n      events:{\n         click:function(e){\n            e.preventDefault();\n            \n\n            var allItems=previousItems.concat([currentItem], nextItems);\n            allItems.forEach(function(item){\n              item.classList.add('collapse');\n            });\n\n            previousItems=allItems.slice(0,index);\n            nextItems=allItems.slice(index+1);\n            currentItem=allItems[index];\n            currentItem.classList.remove('collapse');\n            \n         }}\n   }));\n}\n\n\nrenderer.withVariables({\"loopIndex\":\"0\"}, ()=>{\n   var activityEl=wrap.appendChild(new Element('div'))\n   defaultRenderFn(activityEl); \n   currentItem=activityEl;\n   addEdit(activityEl, 0);\n});\n\nvar i=1;\n\nvar navigation=container.appendChild(new Element('div', {\"class\":\"activity-nav nav\"}));\n/*\nvar prev=navigation.appendChild(new Element('button', {\n  html:\"Prev\",\n  \"class\":\"empty\",\n  events:{click:function(e){\n    e.preventDefault();\n\n    nextItems.unshift(currentItem);\n    currentItem.classList.add('collapse');\n\n    currentItem=previousItems.pop();\n    currentItem.classList.remove('collapse');\n    \n    if(previousItems.length==0){\n       prev.classList.add('empty');\n    }\n\n  }}\n}));\n*/\n\nvar next=navigation.appendChild(new Element('button', {\n  html:\"Add Activity\",\n  events:{click:function(e){\n    e.preventDefault();\n\n    previousItems.push(currentItem);\n    currentItem.classList.add('collapse');\n    //prev.classList.remove('empty');\n    \n\n    if(nextItems.length>0){\n       currentItem=nextItems.shift();\n       currentItem.classList.remove('collapse');\n       return;\n    }\n\n    renderer.withVariables({\"loopIndex\":i}, ()=>{\n      var activityEl=wrap.appendChild(new Element('div'))\n      defaultRenderFn(activityEl); \n      currentItem=activityEl;\n      addEdit(activityEl, i);\n    });\n   \n    i++;\n   \n  }}\n}));\n\n\n"
                  }
               ]
            }
         ],
         "navigationLogic": "if(formData.members.i<formData.members.total-1){\n   formData.members.i++;\n   renderer.setFormValue('members', formData.members);\n   return 'cb46d';\n}\nreturn '8db4c';",
         "then": "goto node 0",
         "nodes": [
            {
               "name": "Exit",
               "type": "section",
               "uuid": "8db4cf56-5729-4f69-8268-96875ac35431",
               "items": [
                  {
                     "name": "Page One",
                     "type": "set",
                     "items": []
                  }
               ],
               "navigationLogic": "return 0;",
               "then": "terminate"
            },
            "cb46d44e-248c-4297-bcf3-e3955220b7a2"
         ]
      },
      {
         "name": "Vehicles",
         "type": "section",
         "uuid": "b739ce6f-a1c5-4ba2-82d8-c91394e7fa5f",
         "items": [
            {
               "name": "Page One",
               "type": "set",
               "items": [
                  {
                     "type": "script",
                     "script": "renderer.useFormDataFieldArray(\"vehicleDetails\", formData.vehicles.i)"
                  },
                  {
                     "type": "markdown",
                     "text": "## Add Vehicle"
                  },
                  {
                     "type": "fieldset",
                     "legend": "",
                     "classNames": "",
                     "conditionScript": "",
                     "items": [
                        {
                           "type": "label",
                           "text": "Vehicle Details"
                        },
                        {
                           "fieldName": "name",
                           "type": "textfield",
                           "label": "Vehicle label",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "make",
                           "type": "textfield",
                           "label": "Make/Model",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "year",
                           "type": "textfield",
                           "label": "Year",
                           "placeholder": "answer here"
                        },
                        {
                           "fieldName": "type",
                           "type": "radio",
                           "values": "compact, sedan, truck",
                           "defaultValue": "",
                           "labels": "Compact, Sedan, Truck",
                           "label": "Vehicle Type"
                        },
                        {
                           "fieldName": "fuel",
                           "type": "radio",
                           "values": "gas, diesel, electric, hybrid",
                           "defaultValue": "",
                           "labels": "Gas, Diesel, Electric, Hybrid",
                           "label": "Fuel"
                        },
                        {
                           "fieldName": "shared",
                           "value": "Some Value",
                           "type": "checkbox",
                           "label": "Shared vehicle",
                           "defaultValue": false,
                           "trueLabel": "Yes",
                           "falseLabel": "No"
                        }
                     ]
                  },
                  {
                     "fieldName": "addAnother",
                     "value": "Some Value",
                     "type": "checkbox",
                     "label": "Add another vehicle",
                     "defaultValue": false,
                     "trueLabel": "Yes",
                     "falseLabel": "No"
                  }
               ]
            }
         ],
         "navigationLogic": "if(formData.vehicleDetails[formData.vehicles.i].addAnother==='on'){\n  var vehicles=renderer.getFormValue('vehicles');\n  if(typeof vehicles=='undefined'){\n    vehicles={i:-1, total:1};\n  }\n  vehicles.i++;\n  vehicles.total++;\n  renderer.setFormValue('vehicles', vehicles);\n  renderer.setFormValue('addAnother', 'off');\n  return 'b739c';\n}\n\nvar vehicles=renderer.getFormValue('vehicles');\nvehicles.i=0;\nrenderer.setFormValue('vehicles', vehicles);\n\nreturn 'cb46d';\n",
         "then": "goto node 0",
         "nodes": [
            "cb46d44e-248c-4297-bcf3-e3955220b7a2",
            "b739ce6f-a1c5-4ba2-82d8-c91394e7fa5f"
         ]
      }
   ]
});
					}
				}
			}))


			var overlay=new Overlay(menu);
			//overlay.fullscreen();
			
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
	formHtml:'<label> FieldName: <input name="fieldName" value="{auto}"/></label>'+
		'<label> Label: <input name="label" value="Some Label"/></label>'+
		'<label> Placeholder: <input name="placeholder" value="add text"/></label>'+
		'<label> Format: <input name="format" value=""/></label>'


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


panel.addItem(new TenplateBlockItem({

	name: "Custom",
	description: "custom render",
	type: "custom",
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
	formHtml:'<label> Render Script: </label><textarea name="renderScript">return defaultRenderFn();</textarea><label> CSS Class Names: <input name="classNames"/></label>'


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



