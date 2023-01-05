/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Element.js":
/*!************************!*\
  !*** ./src/Element.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Element\": () => (/* binding */ Element)\n/* harmony export */ });\nclass Element {\n\n\tconstructor(type, options) {\n\n\t\tvar el = document.createElement(type);\n\t\tObject.keys(options || {}).forEach((key) => {\n\n\t\t\tvar v = options[key];\n\n\t\t\tif (key == 'html') {\n\t\t\t\tel.innerHTML = v;\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (key == 'events') {\n\t\t\t\tObject.keys(v).forEach((event) => {\n\t\t\t\t\tel.addEventListener(event, v[event]);\n\t\t\t\t});\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (key == 'class') {\n\n\t\t\t\tel.classList.add(v);\n\t\t\t\treturn;\n\t\t\t}\n\n\n\t\t\tif((['type', 'value', 'href', 'target']).indexOf(key)>=0){\n\t\t\t\tel[key]=v\n\t\t\t}\n\n\n\t\t});\n\n\t\t//returns a html element, not a class instance\n\n\t\treturn el;\n\t}\n\n\n}\n\n\n//# sourceURL=webpack://js-survey-builder/./src/Element.js?");

/***/ }),

/***/ "./src/Graph.js":
/*!**********************!*\
  !*** ./src/Graph.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Graph\": () => (/* binding */ Graph)\n/* harmony export */ });\n/* harmony import */ var _GraphNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphNode.js */ \"./src/GraphNode.js\");\n/* harmony import */ var _Node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Node.js */ \"./src/Node.js\");\n/* harmony import */ var _JsonExporter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./JsonExporter.js */ \"./src/JsonExporter.js\");\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\n\n\n\n\nclass Graph extends _GraphNode_js__WEBPACK_IMPORTED_MODULE_0__.GraphNode{\n\n\tconstructor(id) {\n\n\t\tsuper();\n\n\t\tthis._parentContainer = id instanceof HTMLElement ? id : document.getElementById(id);\n\t\tthis._container = new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('div', {\n\t\t\t\"class\": \"graph-root\"\n\t\t})\n\t\tthis._element=this._container;\n\t\tthis._parentContainer.appendChild(this._element);\n\n\t\tthis._menu = new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('div', {\n\t\t\t\"class\": \"graph-menu\"\n\t\t});\n\n\n\t\tthis._menu.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('a', {\n\t\t\thtml:'UITR Lab',\n\t\t\ttarget:\"_blank\",\n\t\t\thref:\"https://uitr.ok.ubc.ca/\"\n\t\t}));\n\n\t\tthis._menu.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('a', {\n\t\t\thtml:'Fork this project',\n\t\t\ttarget:\"_blank\",\n\t\t\thref:\"https://github.com/uitr-lab/js-survey-builder\"\n\t\t}));\n\n\t\tthis._menu.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('button', {\n\t\t\thtml:'Export JSON',\n\t\t\tevents:{\n\t\t\t\tclick:()=>{\n\t\t\t\t\tnew _JsonExporter_js__WEBPACK_IMPORTED_MODULE_2__.JsonExporter(this);\n\t\t\t\t}\n\t\t\t}\n\n\t\t}));\n\n\n\t\tthis._menu.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_3__.Element('button', {\n\t\t\thtml:'Run Survey',\n\t\t\tevents:{\n\t\t\t\tclick:()=>{\n\t\t\t\t\tnew _JsonExporter_js__WEBPACK_IMPORTED_MODULE_2__.JsonExporter(this);\n\t\t\t\t}\n\t\t\t}\n\n\t\t}));\n\n\t\tthis._parentContainer.appendChild(this._menu);\n\n\t}\n\n\tstatic render(el) {\n\t\treturn new Graph(el);\n\n\t}\n\n\t\n\n\n\taddTemplate(name, fn){\n\n\t\tif(!this._templates){\n\t\t\tthis._templates={};\n\t\t}\n\n\t\tthis._templates[name]=fn;\n\t\treturn this;\n\t}\n\n\tadd(template, toNode){\n\t\tvar node=(toNode||this)\n\t\tthis._templates[template](node);\n\t}\n\n\n\t_instantiateNode(parent, data){\n\t\treturn new _Node_js__WEBPACK_IMPORTED_MODULE_1__.Node(parent, data);\n\t}\n\n\n\n}\n\n\n\n//# sourceURL=webpack://js-survey-builder/./src/Graph.js?");

/***/ }),

/***/ "./src/GraphNode.js":
/*!**************************!*\
  !*** ./src/GraphNode.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"GraphNode\": () => (/* binding */ GraphNode)\n/* harmony export */ });\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\n\n\nclass GraphNode{\n\n\taddNode(data) {\n\n\t\tif (!this._nodes) {\n\t\t\tthis._nodes = [];\n\t\t}\n\n\t\tvar node = this._instantiateNode(this, data);\n\t\tthis._nodes.push(node);\n\t\tthis._formatAddNode(node);\n\t\treturn node;\n\n\t}\n\n\taddNodeAt(index, data){\n\n\t\tif (!this._nodes) {\n\t\t\tthis._nodes = [];\n\t\t}\n\n\t\tvar node = this._instantiateNode(this, data);\n\t\tthis._nodes.splice(index, 0, node);\n\t\tthis._formatAddNode(node);\n\t\treturn node;\n\n\t}\n\n\t_formatAddNode(node){\n\n\t\tif(node.getData()){\n\n\t\t\tvar dataNodes=this._nodes.filter((n)=>{\n\t\t\t\treturn !!n.getData();\n\t\t\t});\n\t\t\tvar i=dataNodes.indexOf(node);\n\n\t\t\tnode.addContainerClass((['a', 'b', 'c'])[i]);\n\t\t\tnode.addContainerClass('with-'+dataNodes.length);\n\n\t\t}\n\n\t}\n\n\t_instantiateNode(parent, data){\n\t\tthrow 'Must implement'\n\t}\n\n\n\tisRoot(){\n\t\treturn !this.getParent();\n\t}\n\n\tgetRoot(){\n\t\tvar root=this;\n\t\twhile(root.getParent()){\n\t\t\troot=root.getParent();\n\t\t}\n\t\treturn root;\n\t}\n\n\tgetParent(){\n\t\treturn  this._parent||null;\n\t}\n\n\tgetElement() {\n\n\t\treturn this._element;\n\n\t}\n\n\n\tgetDepth(){\n\n\t\tvar root=this;\n\t\tvar depth=0;\n\t\twhile(root.getParent()){\n\t\t\tdepth++;\n\t\t\troot=root.getParent();\n\t\t}\n\t\treturn depth;\n\n\t}\n\n\tgetContainer() {\n\t\treturn this._container;\n\t}\n\n\taddClass(name){\n\t\tthis._element.classList.add(name);\n\t}\n\n\taddContainerClass(name){\n\t\tthis._container.classList.add(name);\n\t}\n\n\n\tnumberOfRealChildNodes(){\n\n\t\treturn (this._nodes||[]).map((node)=>{\n\t\t\treturn node.getData()\n\t\t}).filter((nodeData)=>{\n\t\t\treturn !!nodeData;\n\t\t});\n\n\t}\n\t\n\n\n\tgetData(){\n\n\t\tvar data=null;\n\n\t\tif(this._getNodeData){\n\t\t\tdata=this._getNodeData();\n\t\t}\n\n\t\tvar nodes=this.numberOfRealChildNodes();\n\n\t\tif(nodes.length>0){\n\t\t\t\n\t\t\tdata=data||{};\n\t\t\tdata.then=\"goto node 0\";\n\t\t\tdata.nodes=nodes;\n\n\n\t\t}\n\n\t\tif(nodes.length>1){\n\t\t\tdata=data||{};\n\t\t\tdata.linkLogic='some logic to define which node to traverse';\n\t\t}\n\n\t\tif(nodes.length==0){\n\t\t\tif(this._linksTo){\n\t\t\t\n\t\t\t\tdata=data||{};\n\t\t\t\tdata.then='go to child 0';\n\t\t\t\tdata.linksToWarning=\"only child 0 is reachable without logic\";\n\t\t\t\n\t\t\t}else{\n\n\t\t\t\tif(data){\n\t\t\t\t\tdata.then='terminate';\n\t\t\t\t}\n\t\t\t\t\n\t\t\t}\n\t\t}\n\n\n\n\n\t\treturn data;\n\n\n\t}\n\n\n\n}\n\n//# sourceURL=webpack://js-survey-builder/./src/GraphNode.js?");

/***/ }),

/***/ "./src/JsonExporter.js":
/*!*****************************!*\
  !*** ./src/JsonExporter.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"JsonExporter\": () => (/* binding */ JsonExporter)\n/* harmony export */ });\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n/* harmony import */ var _Overlay_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Overlay.js */ \"./src/Overlay.js\");\n\n\n\n\nclass JsonExporter {\n\n\n\tconstructor(exportable) {\n\n\n\t\tvar content = JSON.stringify(exportable.getData().nodes[0], null, '   ');\n\n\t\tconsole.log(content);\n\n\t\tnew _Overlay_js__WEBPACK_IMPORTED_MODULE_1__.Overlay('<pre>' + content + '</pre>', [\n\t\t\tnew _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('button', {\n\t\t\t\thtml: \"Copy\",\n\t\t\t\t\"class\": \"copy-btn\",\n\t\t\t\tevents: {\n\t\t\t\t\tclick: () => {\n\t\t\t\t\t\tnavigator.clipboard.writeText(content);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t})\n\n\t\t]);\n\n\t}\n\n\n}\n\n//# sourceURL=webpack://js-survey-builder/./src/JsonExporter.js?");

/***/ }),

/***/ "./src/Node.js":
/*!*********************!*\
  !*** ./src/Node.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Node\": () => (/* binding */ Node)\n/* harmony export */ });\n/* harmony import */ var _GraphNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GraphNode.js */ \"./src/GraphNode.js\");\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\n\n\nclass Node extends _GraphNode_js__WEBPACK_IMPORTED_MODULE_0__.GraphNode{\n\n\n\n\tconstructor(parent, data) {\n\n\t\tsuper();\n\n\t\tthis._parent = parent;\n\t\tthis._element = new _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('div', {\n\t\t\t\"class\": 'graph-node'\n\t\t});\n\n\t\t\n\t\tthis._container=new _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('div', {\n\t\t\t\"class\": 'node-container'\n\t\t});\n\t\tthis._container.appendChild(this._element);\n\t\t\t\n\t\tthis.renderElement();\n\n\t\tObject.keys(data).forEach((key) => {\n\t\t\tvar v = data[key];\n\n\t\t\tif (key === 'elements') {\n\t\t\t\tv.forEach((el) => {\n\t\t\t\t\tthis._element.appendChild(el);\n\t\t\t\t});\n\t\t\t}\n\n\t\t\t// if (key == 'events') {\n\t\t\t// \tObject.keys(v).forEach((event) => {\n\t\t\t// \t\tel.addEventListener(event, v[event]);\n\t\t\t// \t});\n\t\t\t// \treturn;\n\t\t\t// }\n\n\t\t\tif (key == 'class') {\n\n\t\t\t\tthis._element.classList.add(v);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif(key == 'getNodeData'){\n\t\t\t\tthis._getNodeData=v;\n\t\t\t}\n\n\t\t});\n\n\t}\n\n\tadd(template, toNode){\n\t\tthis.getRoot().add(template, toNode||this);\n\t}\n\n\trenderElement(){\n\n\t\tthis.getParent().getContainer().appendChild(this._container);\n\t}\n\n\n\t_instantiateNode(parent, data){\n\t\treturn new Node(parent, data);\n\t}\n\n}\n\n\n\n//# sourceURL=webpack://js-survey-builder/./src/Node.js?");

/***/ }),

/***/ "./src/Overlay.js":
/*!************************!*\
  !*** ./src/Overlay.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Overlay\": () => (/* binding */ Overlay)\n/* harmony export */ });\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\nclass Overlay{\n\n\n\n\tconstructor(content, buttons){\n\n\n\t\tvar overlay=document.body.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div', {\n\t\t\t\"class\":\"window-overlay\",\n\t\t\tevents:{\n\t\t\t\tclick:()=>{\n\t\t\t\t\toverlay.parentNode.removeChild(overlay);\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\t\tvar main=overlay.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div',{\n\t\t\thtml:content,\n\t\t\t\"class\":\"content\",\n\t\t\tevents:{\n\t\t\t\tclick:(e)=>{\n\t\t\t\t\te.stopPropagation();\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\t\tmain.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('button',{\n\t\t\thtml:\"Close\",\n\t\t\t\"class\":\"close-btn\",\n\t\t\tevents:{\n\t\t\t\tclick:(e)=>{\n\t\t\t\t\toverlay.parentNode.removeChild(overlay);\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\n\t\tbuttons.forEach((b)=>{\n\t\t\tmain.appendChild(b);\n\t\t});\n\n\t\t\n\t\n\n\n\t}\n\n\n\n\n\n}\n\n//# sourceURL=webpack://js-survey-builder/./src/Overlay.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Graph_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Graph.js */ \"./src/Graph.js\");\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\n\n\n\n\nvar graph = (new _Graph_js__WEBPACK_IMPORTED_MODULE_0__.Graph('survey-builder'));\ngraph.addTemplate('section-placeholder', function(parentNode){\n\n\tvar placeholder = parentNode.addNode({\n\t\t\"class\": \"empty-node\",\n\t\telements: [\n\t\t\tnew _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('button', {\n\t\t\t\thtml: \"Add Section\",\n\t\t\t\tevents: {\n\t\t\t\t\tclick: function() {\n\t\t\t\t\t\tparentNode.add('section');\n\t\t\t\t\t\tif(parentNode.numberOfRealChildNodes()==2){\n\t\t\t\t\t\t\t//parentNode.add('navigationLogic');\n\t\t\t\t\t\t}\n\t\t\t\t\t\t\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t})\n\t\t]\n\t})\n\n\n});\n\n\n\n\n\nclass ContentBlock{\n\n\n\tconstructor(container, data){\n\n\t\tthis._element=container.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('section', {\n\t\t\t\"class\":\"content-item\"\n\t\t}));\n\n\t\tthis._data=data;\n\n\t}\n\n\n\tgetData(){\n\n\n\t\tvar data={};\n\t\t\n\t\tObject.keys(this._data).forEach((k)=>{\n\t\t\tdata[k]=this._data[k]\n\t\t});\n\n\t\tdata .items;\n\t\t\n\n\t\treturn data;\n\n\n\t}\n\n\n}\n\n\n\ngraph.addTemplate('section', function(parentNode){\n\n\tvar numbers=['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight'];\n\n\tvar toNum=(i)=>{\n\n\t\treturn numbers[i];\n\t}\n\n\tvar name=new _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('input', {\n\t\t\t\t\t\"type\":\"text\",\n\t\t\t\t\tvalue: ([\"Section\", toNum(parentNode.getDepth())]).join(' ')\n\t\t\t\t});\n\n\tvar contentBlocksContainer=new _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('div', {\n\t\t\t\t\t\"class\":\"blocks\"\n\t\t\t\t});\n\n\tvar contentBlocks=[];\n\n\tvar section = parentNode.addNode({\n\t\t\t\"class\": \"section-node\",\n\t\t\tgetNodeData:()=>{\n\t\t\t\treturn {\n\t\t\t\t\tname:name.value,\n\t\t\t\t\titems:contentBlocks.map((item, i)=>{\n\t\t\t\t\t\treturn item.getData();\n\t\t\t\t\t})\n\n\t\t\t\t};\n\n\t\t\t},\n\t\t\telements: [\n\t\t\t\tname,\n\t\t\t\tcontentBlocksContainer,\n\t\t\t\tnew _Element_js__WEBPACK_IMPORTED_MODULE_1__.Element('button', {\n\t\t\t\t\thtml: \"Add Question Block\",\n\t\t\t\t\tevents: {\n\t\t\t\t\t\tclick: function() {\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\tcontentBlocks.push(new ContentBlock(contentBlocksContainer, {\n\t\t\t\t\t\t\t\tname:\"Question Set \"+toNum(contentBlocks.length)\n\t\t\t\t\t\t\t}));\n\n\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t})\n\t\t\t]\n\n\n\t\t});\n\n\n\tsection.add('section-placeholder');\n\n\n});\n\n\ngraph.add('section');\n\n\n//# sourceURL=webpack://js-survey-builder/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;