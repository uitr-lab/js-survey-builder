# js-survey-builder

This is a work in progress and is currently not functional, Documentation/Instructions reflects intended use only

Pure js survey builder for web so it can be included in any webpage without any framework/dependencies

Live demo site: https://survey.geoforms.ca/
See https://github.com/uitr-lab/survey-tool-website

![UITR Survey Builder!](https://raw.githubusercontent.com/uitr-lab/js-survey-builder/main/screenshot.png)
![UITR Survey Builder!](https://raw.githubusercontent.com/uitr-lab/js-survey-builder/main/screenshot-graph.png)
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
