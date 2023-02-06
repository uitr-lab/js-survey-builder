# js-survey-builder

A pure js survey builder library/ui for web without any js framework dependencies

 - Drag and drop form builder 
 - Create multi-page forms/wizards
 - Design functional graph/flow diagrams for complex skip/navigation
 - Automatic form translation
 - Import/Export json format

 - Template (twigjs) processing on all text, labels, and input names - use any previously entered form value as a variable
 - Supports asynchronous flow decision scripts and inline form field scripts

 - Publish directly to html template

 ## Built in field types (drag-n-drop)

 - Markdown content block
 - Label
 - Text input
 - Radio button input
 - Checkbox input
 - Fieldset (can drop other types into it)
 - Default data (hidden data to add to the form - json encoded )
 - QRCode display any data as a qr code (can be very flexible if used with previous form data and template syntax)
 - Html content
 - Script can return other field definitions (json definition) or manipulate the form/interaction etc - supports async promises, will prevent next fields from rendering if async
 
 - Transform adds a script to the page that processes the form data during data collection before validation and can be used to compute values and format fields
 - Validation adds rules to the page the prevent the form from completing with invalid user input 


Live demo site: https://survey.geoforms.ca/

See https://github.com/uitr-lab/survey-tool-website

See https://github.com/uitr-lab/js-survey-runner


Uses js-survey-runner to preview pages 

## Form/Page builder
Create pages, and drag-n-drop fields to build single or multi page forms 

![UITR Survey Builder!](https://raw.githubusercontent.com/uitr-lab/js-survey-builder/main/screenshot.png)

## Graph builder
For complex forms and wizards, groups of pages can be organized into nodes of a graph. Visually design the flow of the 
form or wizard by adding and connecting graph nodes. Each node can have custom logic to define branch navigation

![UITR Survey Builder!](https://raw.githubusercontent.com/uitr-lab/js-survey-builder/main/screenshot-graph.png)

## Translation
Labels and text content (including markdown and html) is automatically parsed and added to a list of localization values. Choose which 
languages you support and automatically translate the fields
![UITR Survey Builder!](https://raw.githubusercontent.com/uitr-lab/js-survey-builder/main/screenshot-lang.png)


## Compile
```bash
  npm install
  #npx webpack --mode development
  npx webpack --mode production
  cp ./dist/* /path/to/public/js

```


## Quick start
```html
</html>
  <head>
    ...
    <link rel="stylesheet" type="text/css" href="builder.css">

  </head>
  <body>
    ...
    <div id="survey-builder"></div>
    ...
  </body>
  <script src="main.js"></script>
  <script type="text/javascript">
    // TODO: Provide code instantiation like this and load main.js?onload=window.GraphReady
    window.GraphReady=function(graph){
      Graph.render(document.getElementById('survey-builder'));
    };
  </script>
</html>

```

## Customizing

The survey builder is heavily styled with css, include your own stylesheet to customize

### Sections 

Sections will be used to organize sets of questions into logical groups. Sections also represent the high level flow of the survey and are used to control survey navigation and flow. Sections can also be looped. If, for example, a set of questions should repeated for each item in a group then looping a section 

### Question Blocks

Question blocks are added to sections and can consist of one or more questions, html/markdown content. Question blocks are displayed sequentially and will have a Next button

## JSON survey definitions

The survey JSON is structured as a tree, Survey participants are presented with content/questions from each node as they traverse the tree from root to a terminating leaf node. Each node represents a Section and navigation from each section/node to a child node can be scripted. Leaf nodes can be linked directly to a seperate section/node defining a graph/flow chart  

```js
{
   "name": "Section One",
   "items": [
      {
         "name": "Question Set One",
         "items": [
            {
               "type": "markdown",
               "text": "## Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
            },
            {},
            {
               "fieldName": "textInput{i}",
               "type": "textfield",
               "value": "",
               "placeholder": "answer here"
            }
         ]
      },
      {
         "name": "Question Set Two",
         "items": [
            {
               "type": "label",
               "text": "Some label"
            },
            {
               "fieldName": "radioOption{i}",
               "type": "radio",
               "values": [
                  "a",
                  "b",
                  "c"
               ],
               "default": "none",
               "labels": [
                  "A",
                  "B",
                  "C"
               ]
            }
         ]
      }
   ],
   "then": "goto node 0",
   "nodes": [
      {
         "name": "Section Two",
         "items": [
            {
               "name": "Question Set One",
               "items": [
                  {
                     "type": "label",
                     "text": "Some label"
                  },
                  {
                     "fieldName": "textInput{i}",
                     "type": "textfield",
                     "value": "",
                     "placeholder": "answer here"
                  }
               ]
            },
            {
               "name": "Question Set Two",
               "items": [
                  {
                     "type": "label",
                     "text": "Some label"
                  },
                  {
                     "fieldName": "checkboxOption{i}",
                     "type": "checkbox",
                     "label": "Yes",
                     "default": false
                  }
               ]
            }
         ],
         "then": "goto node 0",
         "nodes": [
            {
               "name": "Section Three",
               "items": [
                  {
                     "name": "Question Set One",
                     "items": [
                        {
                           "type": "markdown",
                           "text": "## Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua"
                        },
                        {
                           "fieldName": "checkboxOption{i}",
                           "type": "checkbox",
                           "label": "Yes",
                           "default": false
                        }
                     ]
                  }
               ],
               "then": "terminate"
            }
         ]
      }
   ]
}

```
