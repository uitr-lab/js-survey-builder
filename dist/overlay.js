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

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Element\": () => (/* binding */ Element)\n/* harmony export */ });\nclass Element {\n\n\tconstructor(type, options) {\n\n\t\tvar el = document.createElement(type);\n\t\tObject.keys(options || {}).forEach((key) => {\n\n\t\t\tvar v = options[key];\n\n\t\t\tif (key == 'html') {\n\n\t\t\t\tif(v instanceof HTMLElement){\n\t\t\t\t\tel.appendChild(v);\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\t\n\t\t\t\tel.innerHTML = v;\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (key == 'events') {\n\t\t\t\tObject.keys(v).forEach((event) => {\n\t\t\t\t\tel.addEventListener(event, v[event]);\n\t\t\t\t});\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tif (key == 'class') {\n\t\t\t\tv.split(' ').forEach((name)=>{\n\t\t\t\t\tif(name.length==0){\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tel.classList.add(name);\n\t\t\t\t})\n\t\t\t\t\n\t\t\t\treturn;\n\t\t\t}\n\n\n\t\t\tif((['type', 'value', 'href', 'target', 'name', 'for', 'checked', 'placeholder', 'disabled']).indexOf(key)>=0){\n\t\t\t\tel[key]=v\n\t\t\t}\n\n\n\t\t});\n\n\t\t//returns a html element, not a class instance\n\n\t\treturn el;\n\t}\n\n\n}\n\n\n\n\n\n//# sourceURL=webpack://js-survey-builder/./src/Element.js?");

/***/ }),

/***/ "./src/Overlay.js":
/*!************************!*\
  !*** ./src/Overlay.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Overlay\": () => (/* binding */ Overlay)\n/* harmony export */ });\n/* harmony import */ var _Element_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Element.js */ \"./src/Element.js\");\n\n\nclass Overlay{\n\n\n\n\tconstructor(content, buttons){\n\n\n\t\tvar overlay=document.body.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div', {\n\t\t\t\"class\":\"window-overlay\",\n\t\t\tevents:{\n\t\t\t\tclick:()=>{\n\t\t\t\t\toverlay.parentNode.removeChild(overlay);\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\t\tvar main=overlay.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div',{\n\t\t\t\"class\":\"content\",\n\t\t\tevents:{\n\t\t\t\tclick:(e)=>{\n\t\t\t\t\te.stopPropagation();\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\n\t\tvar contentArea;\n\n\n\t\tif(content instanceof HTMLElement||Array.isArray(content)){\n\n\t\t\tcontentArea=main.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div',{\n\t\t\t\t\"class\":\"content-area\",\n\t\t\t}));\n\n\t\t\tif(Array.isArray(content)){\n\n\t\t\t\tcontent.forEach((c)=>{\n\t\t\t\t\tcontentArea.appendChild(c);\n\t\t\t\t});\n\n\t\t\t}else{\n\t\t\t\tcontentArea.appendChild(content);\n\t\t\t}\n\n\t\t\t\n\n\t\t}else{\n\t\t\n\t\t\tcontentArea=main.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('div',{\n\t\t\t\thtml:content,\n\t\t\t\t\"class\":\"content-area\",\n\t\t\t}));\n\t\t}\n\n\t\t\n\n\t\tmain.appendChild(new _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element('button',{\n\t\t\thtml:\"Close\",\n\t\t\t\"class\":\"close-btn\",\n\t\t\tevents:{\n\t\t\t\tclick:(e)=>{\n\t\t\t\t\toverlay.parentNode.removeChild(overlay);\n\t\t\t\t}\n\t\t\t}\n\t\t}));\n\n\n\t\t(buttons||[]).forEach((b)=>{\n\t\t\tmain.appendChild(b);\n\t\t});\n\n\t\tthis._contentArea=contentArea;\n\t\tthis._overlay=overlay;\n\n\n\t}\n\n\tfullscreen(){\n\t\tthis._overlay.classList.add('fullscreen');\n\t}\n\n\n\tclose(){\n\t\tif(this._overlay.parentNode){\n\t\t\tthis._overlay.parentNode.removeChild(this._overlay);\n\t\t}\n\t}\n\n\tsetSize(arg){\n\n\t\tthis._overlay.style.cssText='';\n\n\t\tthis._sizeArg=arg;\n\n\t\tObject.keys(arg).forEach((key)=>{\n\t\t\tif((['width', 'height']).indexOf(key)==-1){\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tthis._overlay.style.cssText+=' --'+key+':'+arg[key]+';';\n\n\t\t\tif(key=='width'){\n\t\t\t\tthis._overlay.style.cssText+=' --left'+': calc( 50% - '+(parseInt(arg[key])/2)+'px );';\n\t\t\t}\n\n\t\t\tif(key=='height'){\n\t\t\t\tthis._overlay.style.cssText+=' --top'+': calc( 50% - '+(parseInt(arg[key])/2)+'px );';\n\t\t\t}\n\n\n\t\t})\n\n\t\treturn this;\n\n\t}\n\n\tfitContent(){\n\n\n\t\tthis._intervel=setInterval(()=>{\n\n\t\t\tvar frame=this._contentArea.parentNode;\n\t\t\tvar frameHeight=frame.clientHeight;\n\n\t\t\tvar scrollHeight=this._contentArea.scrollHeight;\n\t\t\tvar contentHeight=this._contentArea.clientHeight;\n\n\t\t\tvar diff=scrollHeight-contentHeight;\n\n\t\t\tif(this._sizeArg&&this._sizeArg.height){\n\n\t\t\t\tvar h=parseInt(this._sizeArg.height);\n\t\t\t\tthis._sizeArg.height=(h+diff)+\"px\";\n\t\t\t\tthis.setSize(this._sizeArg);\n\t\t\t}\n\n\t\t}, 3000);\n\n\n\n\t}\n\n\n}\n\nOverlay.Element = _Element_js__WEBPACK_IMPORTED_MODULE_0__.Element;\n\nwindow.Overlay = Overlay;\n\n//# sourceURL=webpack://js-survey-builder/./src/Overlay.js?");

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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/Overlay.js");
/******/ 	
/******/ })()
;