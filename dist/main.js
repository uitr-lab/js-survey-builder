!function(){class e{constructor(e,t){var n=document.createElement(e);Object.keys(t||{}).forEach((e=>{var s=t[k];"html"!=e?"events"!=e?"class"!=e||n.classList.add(s):Object.keys(s).forEach((e=>{n.addEventListener(e,s[e])})):n.innerHTML=s}))}}class t{constructor(t,n){this._parent=t,this._element=new e("div","graph-node"),this._parent.appendChild(this._element)}getParent(){return this.parent||null}getElement(){return this._element}addNode(e){this._nodes||(this._nodes=[]);var n=new t(this,e);return this._nodes.push(n),n}}new class{constructor(t){this._container=document.getElementById(t),this._element=new e("div",{class:"graph-root"}),this._container.appendChild(this._element)}addNode(e){this._nodes||(this._nodes=[]);var n=new t(this,e);return this._nodes.push(n),n}getElement(){return this._element}}("survey-builder").addNode({elements:[new e("button",{html:"Add Question",events:{click:function(){}}})]})}();