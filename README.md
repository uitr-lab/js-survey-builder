# js-survey-builder
Pure js survey builder for web so it can be included in any webpage without any framework/dependencies
Demo site: https://survey.geoforms.ca/
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
