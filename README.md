# js-survey-builder
Pure js survey builder for web so it can be included in any webpage without any framework/dependencies

Live demo site: https://survey.geoforms.ca/
See https://github.com/uitr-lab/survey-tool-website

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
