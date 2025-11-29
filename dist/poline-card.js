function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:l,defineProperty:c,getOwnPropertyDescriptor:h,getOwnPropertyNames:p,getOwnPropertySymbols:d,getPrototypeOf:u}=Object,g=globalThis,_=g.trustedTypes,f=_?_.emptyScript:"",v=g.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!l(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let P=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&c(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...p(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const o=this.constructor,s=this[t];if(i??=o.getPropertyOptions(t),!((i.hasChanged??$)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};P.elementStyles=[],P.shadowRootOptions={mode:"open"},P[m("elementProperties")]=new Map,P[m("finalized")]=new Map,v?.({ReactiveElement:P}),(g.reactiveElementVersions??=[]).push("2.1.1");const x=globalThis,w=x.trustedTypes,A=w?w.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",S=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+S,k=`<${C}>`,F=document,L=()=>F.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,z=Array.isArray,O="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,T=/-->/g,D=/>/g,U=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,I=/"/g,H=/^(?:script|style|textarea|title)$/i,j=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),W=j(1),q=j(2),Z=Symbol.for("lit-noChange"),X=Symbol.for("lit-nothing"),Y=new WeakMap,V=F.createTreeWalker(F,129);function B(t,e){if(!z(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(r.lastIndex=h,l=r.exec(i),null!==l);)h=r.lastIndex,r===N?"!--"===l[1]?r=T:void 0!==l[1]?r=D:void 0!==l[2]?(H.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=U):void 0!==l[3]&&(r=U):r===U?">"===l[0]?(r=s??N,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?U:'"'===l[3]?I:R):r===I||r===R?r=U:r===T||r===D?r=N:(r=U,s=void 0);const p=r===U&&t[e+1].startsWith("/>")?" ":"";n+=r===N?i+k:c>=0?(o.push(a),i.slice(0,c)+E+i.slice(c)+S+p):i+S+(-2===c?e:p)}return[B(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Q{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[l,c]=J(t,e);if(this.el=Q.createElement(l,i),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=V.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=c[n++],i=o.getAttribute(t).split(S),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?st:et}),o.removeAttribute(t)}else t.startsWith(S)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(H.test(o.tagName)){const t=o.textContent.split(S),e=t.length-1;if(e>0){o.textContent=w?w.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],L()),V.nextNode(),a.push({type:2,index:++s});o.append(t[e],L())}}}else if(8===o.nodeType)if(o.data===C)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(S,t+1));)a.push({type:7,index:s}),t+=S.length-1}s++}}static createElement(t,e){const i=F.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,o){if(e===Z)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=M(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=K(t,s._$AS(t,e.values),s,o)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??F).importNode(e,!0);V.currentNode=o;let s=V.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new tt(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new nt(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=V.nextNode(),n++)}return V.currentNode=F,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=X,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),M(t)?t===X||null==t||""===t?(this._$AH!==X&&this._$AR(),this._$AH=X):t!==this._$AH&&t!==Z&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>z(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==X&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(F.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(B(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new G(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Y.get(t.strings);return void 0===e&&Y.set(t.strings,e=new Q(t)),e}k(t){z(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new tt(this.O(L()),this.O(L()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=X,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=X}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=K(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==Z,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=K(this,o[i+r],e,r),a===Z&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===X?t=X:t!==X&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===X?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===X?void 0:t}}class ot extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==X)}}class st extends et{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??X)===Z)return;const i=this._$AH,o=t===X&&i!==X||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==X&&(i===X||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const rt=x.litHtmlPolyfillSupport;rt?.(Q,tt),(x.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class lt extends P{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new tt(e.insertBefore(L(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return Z}}lt._$litElement$=!0,lt.finalized=!0,at.litElementHydrateSupport?.({LitElement:lt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:lt}),(at.litElementVersions??=[]).push("4.2.1");const ht=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:$},dt=(t=pt,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t)}}throw Error("Unsupported decorator location: "+o)};function ut(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function gt(t){return ut({...t,state:!0,attribute:!1})}var _t=Math.pow,ft=(t,e)=>{const[i,o,s]=t;let n=Math.atan2(o-.5,i-.5)*(180/Math.PI);n=(360+n)%360;const r=s,a=Math.sqrt(Math.pow(o-.5,2)+Math.pow(i-.5,2))/.5;return[n,r,e?1-a:a]},vt=(t,e)=>{const[i,o,s]=t,n=i/(180/Math.PI),r=.5*(e?1-s:s);return[.5+r*Math.cos(n),.5+r*Math.sin(n),o]},mt=(t=360*Math.random(),e=[Math.random(),Math.random()],i=[.75+.2*Math.random(),.3+.2*Math.random()])=>[[t,e[0],i[0]],[(t+60+180*Math.random())%360,e[1],i[1]]],yt=(t,e,i,o=!1,s=(t,e)=>e?1-t:t,n=(t,e)=>e?1-t:t,r=(t,e)=>e?1-t:t)=>{const a=s(t,o),l=n(t,o),c=r(t,o);return[(1-a)*e[0]+a*i[0],(1-l)*e[1]+l*i[1],(1-c)*e[2]+c*i[2]]},$t=(t,e=!1)=>e?1-Math.sin((1-t)*Math.PI/2):Math.sin(t*Math.PI/2),bt={linearPosition:t=>t,exponentialPosition:(t,e=!1)=>e?1-_t(1-t,2):_t(t,2),quadraticPosition:(t,e=!1)=>e?1-_t(1-t,3):_t(t,3),cubicPosition:(t,e=!1)=>e?1-_t(1-t,4):_t(t,4),quarticPosition:(t,e=!1)=>e?1-_t(1-t,5):_t(t,5),sinusoidalPosition:$t,asinusoidalPosition:(t,e=!1)=>e?1-Math.asin(1-t)/(Math.PI/2):Math.asin(t)/(Math.PI/2),arcPosition:(t,e=!1)=>e?1-Math.sqrt(1-_t(t,2)):1-Math.sqrt(1-t),smoothStepPosition:t=>_t(t,2)*(3-2*t)},Pt=(t,e,i=!1)=>{const o=t[0],s=e[0];let n=0;i&&null!==o&&null!==s?(n=Math.min(Math.abs(o-s),360-Math.abs(o-s)),n/=360):n=null===o||null===s?0:o-s;const r=n,a=null===t[1]||null===e[1]?0:e[1]-t[1],l=null===t[2]||null===e[2]?0:e[2]-t[2];return Math.sqrt(r*r+a*a+l*l)},xt=class{constructor({xyz:t,color:e,invertedLightness:i=!1}={}){this.x=0,this.y=0,this.z=0,this.color=[0,0,0],this._invertedLightness=!1,this._invertedLightness=i,this.positionOrColor({xyz:t,color:e,invertedLightness:i})}positionOrColor({xyz:t,color:e,invertedLightness:i=!1}){if(t&&e||!t&&!e)throw new Error("Point must be initialized with either x,y,z or hsl");t?(this.x=t[0],this.y=t[1],this.z=t[2],this.color=ft([this.x,this.y,this.z],i)):e&&(this.color=e,[this.x,this.y,this.z]=vt(e,i))}set position([t,e,i]){this.x=t,this.y=e,this.z=i,this.color=ft([this.x,this.y,this.z],this._invertedLightness)}get position(){return[this.x,this.y,this.z]}set hsl([t,e,i]){this.color=[t,e,i],[this.x,this.y,this.z]=vt(this.color,this._invertedLightness)}get hsl(){return this.color}get hslCSS(){const[t,e,i]=this.color;return`hsl(${t.toFixed(2)}, ${(100*e).toFixed(2)}%, ${(100*i).toFixed(2)}%)`}get oklchCSS(){const[t,e,i]=this.color;return`oklch(${(100*i).toFixed(2)}% ${(.4*e).toFixed(3)} ${t.toFixed(2)})`}get lchCSS(){const[t,e,i]=this.color;return`lch(${(100*i).toFixed(2)}% ${(150*e).toFixed(2)} ${t.toFixed(2)})`}shiftHue(t){this.color[0]=(360+(this.color[0]+t))%360,[this.x,this.y,this.z]=vt(this.color,this._invertedLightness)}},wt=class{constructor({anchorColors:t=mt(),numPoints:e=4,positionFunction:i=$t,positionFunctionX:o,positionFunctionY:s,positionFunctionZ:n,closedLoop:r,invertedLightness:a}={anchorColors:mt(),numPoints:4,positionFunction:$t,closedLoop:!1}){if(this._needsUpdate=!0,this._positionFunctionX=$t,this._positionFunctionY=$t,this._positionFunctionZ=$t,this.connectLastAndFirstAnchor=!1,this._animationFrame=null,this._invertedLightness=!1,!t||t.length<2)throw new Error("Must have at least two anchor colors");this._anchorPoints=t.map(t=>new xt({color:t,invertedLightness:a})),this._numPoints=e+2,this._positionFunctionX=o||i||$t,this._positionFunctionY=s||i||$t,this._positionFunctionZ=n||i||$t,this.connectLastAndFirstAnchor=r||!1,this._invertedLightness=a||!1,this.updateAnchorPairs()}get numPoints(){return this._numPoints-2}set numPoints(t){if(t<1)throw new Error("Must have at least one point");this._numPoints=t+2,this.updateAnchorPairs()}set positionFunction(t){if(Array.isArray(t)){if(3!==t.length)throw new Error("Position function array must have 3 elements");if("function"!=typeof t[0]||"function"!=typeof t[1]||"function"!=typeof t[2])throw new Error("Position function array must have 3 functions");this._positionFunctionX=t[0],this._positionFunctionY=t[1],this._positionFunctionZ=t[2]}else this._positionFunctionX=t,this._positionFunctionY=t,this._positionFunctionZ=t;this.updateAnchorPairs()}get positionFunction(){return this._positionFunctionX===this._positionFunctionY&&this._positionFunctionX===this._positionFunctionZ?this._positionFunctionX:[this._positionFunctionX,this._positionFunctionY,this._positionFunctionZ]}set positionFunctionX(t){this._positionFunctionX=t,this.updateAnchorPairs()}get positionFunctionX(){return this._positionFunctionX}set positionFunctionY(t){this._positionFunctionY=t,this.updateAnchorPairs()}get positionFunctionY(){return this._positionFunctionY}set positionFunctionZ(t){this._positionFunctionZ=t,this.updateAnchorPairs()}get positionFunctionZ(){return this._positionFunctionZ}get anchorPoints(){return this._anchorPoints}set anchorPoints(t){this._anchorPoints=t,this.updateAnchorPairs()}updateAnchorPairs(){this._anchorPairs=[];const t=this.connectLastAndFirstAnchor?this.anchorPoints.length:this.anchorPoints.length-1;for(let e=0;e<t;e++){const t=[this.anchorPoints[e],this.anchorPoints[(e+1)%this.anchorPoints.length]];this._anchorPairs.push(t)}this.points=this._anchorPairs.map((t,e)=>{const i=t[0]?t[0].position:[0,0,0],o=t[1]?t[1].position:[0,0,0],s=this.shouldInvertEaseForSegment(e);return((t,e,i=4,o=!1,s=(t,e)=>e?1-t:t,n=(t,e)=>e?1-t:t,r=(t,e)=>e?1-t:t)=>{const a=[];for(let l=0;l<i;l++){const[c,h,p]=yt(l/(i-1),t,e,o,s,n,r);a.push([c,h,p])}return a})(i,o,this._numPoints,!!s,this.positionFunctionX,this.positionFunctionY,this.positionFunctionZ).map(t=>new xt({xyz:t,invertedLightness:this._invertedLightness}))})}addAnchorPoint({xyz:t,color:e,insertAtIndex:i}){const o=new xt({xyz:t,color:e,invertedLightness:this._invertedLightness});return void 0!==i?this.anchorPoints.splice(i,0,o):this.anchorPoints.push(o),this.updateAnchorPairs(),o}removeAnchorPoint({point:t,index:e}){if(!t&&void 0===e)throw new Error("Must provide a point or index");if(this.anchorPoints.length<3)throw new Error("Must have at least two anchor points");let i;if(void 0!==e?i=e:t&&(i=this.anchorPoints.indexOf(t)),!(i>-1&&i<this.anchorPoints.length))throw new Error("Point not found");this.anchorPoints.splice(i,1),this.updateAnchorPairs()}updateAnchorPoint({point:t,pointIndex:e,xyz:i,color:o}){if(void 0!==e&&(t=this.anchorPoints[e]),!t)throw new Error("Must provide a point or pointIndex");if(!i&&!o)throw new Error("Must provide a new xyz position or color");return i&&(t.position=i),o&&(t.hsl=o),this.updateAnchorPairs(),t}getClosestAnchorPoint({xyz:t,hsl:e,maxDistance:i=1}){if(!t&&!e)throw new Error("Must provide a xyz or hsl");let o;t?o=this.anchorPoints.map(e=>Pt(e.position,t)):e&&(o=this.anchorPoints.map(t=>Pt(t.hsl,e,!0)));const s=Math.min(...o);if(s>i)return null;const n=o.indexOf(s);return this.anchorPoints[n]||null}set closedLoop(t){this.connectLastAndFirstAnchor=t,this.updateAnchorPairs()}get closedLoop(){return this.connectLastAndFirstAnchor}set invertedLightness(t){this._invertedLightness=t,this.updateAnchorPairs()}get invertedLightness(){return this._invertedLightness}get flattenedPoints(){return this.points.flat().filter((t,e)=>0==e||e%this._numPoints)}get colors(){const t=this.flattenedPoints.map(t=>t.color);return this.connectLastAndFirstAnchor&&2!==this._anchorPoints.length&&t.pop(),t}cssColors(t="hsl"){const e=this.flattenedPoints.map({hsl:t=>t.hslCSS,oklch:t=>t.oklchCSS,lch:t=>t.lchCSS}[t]);return this.connectLastAndFirstAnchor&&e.pop(),e}get colorsCSS(){return this.cssColors("hsl")}get colorsCSSlch(){return this.cssColors("lch")}get colorsCSSoklch(){return this.cssColors("oklch")}shiftHue(t=20){this.anchorPoints.forEach(e=>e.shiftHue(t)),this.updateAnchorPairs()}getColorAt(t){var e;if(t<0||t>1)throw new Error("Position must be between 0 and 1");if(0===this.anchorPoints.length)throw new Error("No anchor points available");const i=this.connectLastAndFirstAnchor?this.anchorPoints.length:this.anchorPoints.length-1,o=this.connectLastAndFirstAnchor&&2===this.anchorPoints.length?2:i,s=t*o,n=Math.floor(s),r=n>=o?o-1:n,a=n>=o?1:s-n,l=this._anchorPairs[r];if(!l||l.length<2||!l[0]||!l[1])return new xt({color:(null==(e=this.anchorPoints[0])?void 0:e.color)||[0,0,0],invertedLightness:this._invertedLightness});const c=l[0].position,h=l[1].position,p=this.shouldInvertEaseForSegment(r),d=yt(a,c,h,p,this._positionFunctionX,this._positionFunctionY,this._positionFunctionZ);return new xt({xyz:d,invertedLightness:this._invertedLightness})}shouldInvertEaseForSegment(t){return!!(t%2||this.connectLastAndFirstAnchor&&2===this.anchorPoints.length&&0===t)}},{p5:At}=globalThis;if(At&&At.VERSION&&At.VERSION.startsWith("1.")){console.info("p5 < 1.x detected, adding poline to p5 prototype");const t=new wt;At.prototype.poline=t;const e=()=>t.colors.map(t=>`hsl(${Math.round(t[0])},${100*t[1]}%,${100*t[2]}%)`);At.prototype.registerMethod("polineColors",e),globalThis.poline=t,globalThis.polineColors=e}let Et=class extends lt{setConfig(t){this._config=t}_getLightEntities(){return this.hass?Object.keys(this.hass.states).filter(t=>t.startsWith("light.")).sort():[]}_valueChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.value,o=e.configValue;if(!o||this._config[o]===i)return;const s={...this._config,[o]:""===i?void 0:i},n=new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0});this.dispatchEvent(n)}_toggleChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=e.checked,o=e.configValue;if(!o)return;const s={...this._config,[o]:i},n=new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0});this.dispatchEvent(n)}_numberChanged(t){if(!this._config||!this.hass)return;const e=t.target,i=parseInt(e.value),o=e.configValue;if(isNaN(i)||!o)return;const s={...this._config,[o]:i},n=new CustomEvent("config-changed",{detail:{config:s},bubbles:!0,composed:!0});this.dispatchEvent(n)}_addEntity(t){if(!this._config||!this.hass)return;const e=this._config[t]||[],i={...this._config,[t]:[...e,""]},o=new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0});this.dispatchEvent(o)}_removeEntity(t,e){if(!this._config||!this.hass)return;const i=(this._config[t]||[]).filter((t,i)=>i!==e),o={...this._config,[t]:i.length>0?i:void 0},s=new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0});this.dispatchEvent(s)}_entityChanged(t,e,i){if(!this._config||!this.hass)return;const o=t.detail?.value??t.target?.value??"",s=[...this._config[e]||[]];s[i]=o;const n={...this._config,[e]:s},r=new CustomEvent("config-changed",{detail:{config:n},bubbles:!0,composed:!0});this.dispatchEvent(r)}render(){return this._config&&this.hass?W`
      <div class="card-config">
        <div class="section-header">Basic Settings</div>

        <div class="option">
          <label for="title">Title (optional)</label>
          <input
            id="title"
            type="text"
            .value=${this._config.title||""}
            .configValue=${"title"}
            @change=${this._valueChanged}
            placeholder="Poline Color Picker"
          />
        </div>

        <div class="option">
          <label for="num_points">Number of Points</label>
          <input
            id="num_points"
            type="number"
            min="2"
            max="20"
            .value=${this._config.num_points||4}
            .configValue=${"num_points"}
            @change=${this._numberChanged}
          />
          <div class="hint">Number of color points between anchors (2-20). For the most predictable results, set this to equal the number of regular lights, or to a multiple. For example, if you have 4 lights, choose 4, 8, 12, etc.</div>
        </div>

        <div class="section-header">Light Entities</div>

        <div class="option">
          <label>Regular Light Entities</label>
          <div class="entity-list">
            ${(this._config.entities||[]).map((t,e)=>W`
                <div class="entity-row">
                  <input
                    type="text"
                    .value=${t||""}
                    @input=${t=>{const i=t.target;this._entityChanged(new CustomEvent("value-changed",{detail:{value:i.value}}),"entities",e)}}
                    list="light-entities-list"
                    placeholder="light.example"
                  />
                  <mwc-button
                    @click=${()=>this._removeEntity("entities",e)}
                  >
                    Delete
                  </mwc-button>
                </div>
              `)}
          </div>
          <datalist id="light-entities-list">
            ${this._getLightEntities().map(t=>W`<option value=${t}></option>`)}
          </datalist>
          <mwc-button
            class="add-entity-button"
            @click=${()=>this._addEntity("entities")}
          >
            Add Entity
          </mwc-button>
          <div class="hint">Light entities to control with generated colors. Each light will be assigned one color from the palette.</div>
        </div>

        <div class="option">
          <label>WLED Light Entities</label>
          <div class="entity-list">
            ${(this._config.wled_entities||[]).map((t,e)=>W`
                <div class="entity-row">
                  <input
                    type="text"
                    .value=${t||""}
                    @input=${t=>{const i=t.target;this._entityChanged(new CustomEvent("value-changed",{detail:{value:i.value}}),"wled_entities",e)}}
                    list="light-entities-list"
                    placeholder="light.wled_example"
                  />
                  <mwc-button
                    @click=${()=>this._removeEntity("wled_entities",e)}
                  >
                    Delete
                  </mwc-button>
                </div>
              `)}
          </div>
          <mwc-button
            class="add-entity-button"
            @click=${()=>this._addEntity("wled_entities")}
          >
            Add WLED Entity
          </mwc-button>
          <div class="hint">WLED lights to upload palette to. Each WLED instance will recieve the full color palette.</div>
        </div>

        <div class="option">
          <label for="palette_size">WLED Palette Size</label>
          <input
            id="palette_size"
            type="number"
            min="2"
            max="256"
            .value=${this._config.palette_size||16}
            .configValue=${"palette_size"}
            @change=${this._numberChanged}
          />
          <div class="hint">Number of colors in WLED palette (2-256)</div>
        </div>

        <div class="section-header">Storage Settings</div>

        <div class="option">
          <label for="storage_state_entity">State Storage Entity</label>
          <input
            id="storage_state_entity"
            type="text"
            .value=${this._config.storage_state_entity||""}
            .configValue=${"storage_state_entity"}
            @change=${this._valueChanged}
            placeholder="input_text.poline_card_state"
          />
          <div class="hint">
            input_text entity to store card state (create with max: 255)
          </div>
        </div>

        <div class="option">
          <label for="storage_palettes_entity">Palettes Storage Entity</label>
          <input
            id="storage_palettes_entity"
            type="text"
            .value=${this._config.storage_palettes_entity||""}
            .configValue=${"storage_palettes_entity"}
            @change=${this._valueChanged}
            placeholder="input_text.poline_saved_palettes"
          />
          <div class="hint">
            input_text entity to store saved palettes (create with max: 255)
          </div>
        </div>

        <div class="section-header">Advanced Settings</div>

        <div class="option">
          <label class="checkbox-label">
            <input
              type="checkbox"
              .checked=${this._config.closed_loop||!1}
              .configValue=${"closed_loop"}
              @change=${this._toggleChanged}
            />
            Closed Loop Palette
          </label>
          <div class="hint">Last color connects back to first color</div>
        </div>

        <div class="option">
          <label class="checkbox-label">
            <input
              type="checkbox"
              .checked=${this._config.invert_lightness||!1}
              .configValue=${"invert_lightness"}
              @change=${this._toggleChanged}
            />
            Invert Lightness
          </label>
          <div class="hint">Invert the lightness calculation</div>
        </div>

        <div class="option">
          <label for="position_function_x">Position Function X</label>
          <select
            id="position_function_x"
            .value=${this._config.position_function_x||"sinusoidalPosition"}
            .configValue=${"position_function_x"}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>

        <div class="option">
          <label for="position_function_y">Position Function Y</label>
          <select
            id="position_function_y"
            .value=${this._config.position_function_y||"quadraticPosition"}
            .configValue=${"position_function_y"}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>

        <div class="option">
          <label for="position_function_z">Position Function Z</label>
          <select
            id="position_function_z"
            .value=${this._config.position_function_z||"linearPosition"}
            .configValue=${"position_function_z"}
            @change=${this._valueChanged}
          >
            <option value="linearPosition">Linear</option>
            <option value="exponentialPosition">Exponential</option>
            <option value="quadraticPosition">Quadratic</option>
            <option value="cubicPosition">Cubic</option>
            <option value="quarticPosition">Quartic</option>
            <option value="sinusoidalPosition">Sinusoidal</option>
            <option value="asinusoidalPosition">Asinusoidal</option>
            <option value="arcPosition">Arc</option>
            <option value="smoothStepPosition">Smooth Step</option>
          </select>
        </div>
      </div>
    `:W``}};Et.styles=r`
    .card-config {
      padding: 16px;
    }

    .option {
      margin-bottom: 16px;
    }

    .option label {
      display: block;
      margin-bottom: 4px;
      font-weight: 500;
      font-size: 14px;
    }

    .option input[type="text"],
    .option input[type="number"],
    .option textarea,
    .option select {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
      box-sizing: border-box;
    }

    .option input[type="checkbox"] {
      margin-right: 8px;
    }

    .option .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }

    .option textarea {
      min-height: 60px;
      resize: vertical;
    }

    .hint {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 4px;
    }

    .section-header {
      font-size: 16px;
      font-weight: 600;
      margin: 24px 0 12px 0;
      color: var(--primary-text-color);
    }

    .section-header:first-child {
      margin-top: 0;
    }

    .entity-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .entity-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .entity-row ha-entity-picker {
      flex: 1;
      min-width: 0;
    }

    .entity-row input {
      flex: 1;
      min-width: 0;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    ha-entity-picker {
      display: block;
      width: 100%;
    }

    .entity-row mwc-button {
      --mdc-theme-primary: var(--error-color);
    }

    .add-entity-button {
      margin-top: 8px;
      background: var(--primary-color);
      color: var(--text-primary-color);
      border: none;
      border-radius: 4px;
      padding: 10px 16px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
      display: inline-block;
      width: auto;
    }

    .add-entity-button:hover {
      background: var(--primary-color);
      opacity: 0.9;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .add-entity-button:active {
      transform: translateY(1px);
    }
  `,t([ut({attribute:!1})],Et.prototype,"hass",void 0),t([gt()],Et.prototype,"_config",void 0),Et=t([ht("poline-card-editor")],Et);let St=class extends lt{constructor(){super(...arguments),this._savedPalettes=[],this._showPalettesDialog=!1,this._paletteName=""}static getStubConfig(){return{type:"custom:poline-card",title:"Poline Color Picker",num_points:4,palette_size:16}}static getConfigElement(){return document.createElement("poline-card-editor")}setConfig(t){if(!t)throw new Error("Invalid configuration");this._config=t,this._initializePoline()}getCardSize(){return 5}_getStorageKey(){return`poline-card-${this._config?.type||"default"}`}_saveState(){if(!this._poline)return;const t=this._poline.anchorPoints.map(t=>t.hsl.map(t=>Math.round(100*t)/100)),e={invertedLightness:this._poline.invertedLightness||!1,anchorColors:t,numPoints:this._poline.numPoints,closedLoop:this._poline.closedLoop,positionFunctionX:this._config?.position_function_x||"sinusoidalPosition",positionFunctionY:this._config?.position_function_y||"quadraticPosition",positionFunctionZ:this._config?.position_function_z||"linearPosition"};try{localStorage.setItem(this._getStorageKey(),JSON.stringify(e))}catch(t){console.warn("Failed to save poline-card state:",t)}if(this.hass&&this._config?.storage_state_entity){const t=JSON.stringify(e);this.hass.callService("input_text","set_value",{entity_id:this._config.storage_state_entity,value:t}).catch(t=>{console.error("Failed to save state to server:",t)})}}_loadState(){try{let t=null;if(this.hass&&this._config?.storage_state_entity){const e=this.hass.states[this._config.storage_state_entity];if(e?.state&&"unknown"!==e.state&&""!==e.state)try{t=JSON.parse(e.state)}catch(t){console.warn("Failed to parse state from server:",t)}}if(!t){const e=localStorage.getItem(this._getStorageKey());e&&(t=JSON.parse(e))}if(t&&this._poline&&("boolean"==typeof t.invertedLightness&&(this._poline.invertedLightness=t.invertedLightness),"boolean"==typeof t.closedLoop&&(this._poline.closedLoop=t.closedLoop),t.anchorColors&&Array.isArray(t.anchorColors))){const e=t.positionFunctionX?bt[t.positionFunctionX]:this._poline.positionFunctionX,i=t.positionFunctionY?bt[t.positionFunctionY]:this._poline.positionFunctionY,o=t.positionFunctionZ?bt[t.positionFunctionZ]:this._poline.positionFunctionZ;this._poline=new wt({anchorColors:t.anchorColors,numPoints:t.numPoints||this._poline.numPoints,positionFunctionX:e,positionFunctionY:i,positionFunctionZ:o}),"boolean"==typeof t.invertedLightness&&(this._poline.invertedLightness=t.invertedLightness),"boolean"==typeof t.closedLoop&&(this._poline.closedLoop=t.closedLoop),this._picker&&"function"==typeof this._picker.setPoline&&this._picker.setPoline(this._poline)}}catch(t){console.warn("Failed to load poline-card state:",t)}this._loadSavedPalettes()}async _loadSavedPalettes(){try{let t=[];if(this.hass&&this._config?.storage_palettes_entity){const e=this.hass.states[this._config.storage_palettes_entity];if(e?.state&&"unknown"!==e.state&&""!==e.state)try{t=JSON.parse(e.state)}catch(t){console.warn("Failed to parse palettes from server:",t)}}if(0===t.length){const e=localStorage.getItem("poline-saved-palettes");e&&(t=JSON.parse(e))}this._savedPalettes=t}catch(t){console.warn("Failed to load saved palettes:",t)}}async _savePalettesToServer(){try{const t=JSON.stringify(this._savedPalettes);localStorage.setItem("poline-saved-palettes",t),this.hass&&this._config?.storage_palettes_entity&&await this.hass.callService("input_text","set_value",{entity_id:this._config.storage_palettes_entity,value:t})}catch(t){console.error("Failed to save palettes:",t),alert("Failed to save palette. The palette data may be too large for the configured storage entity.")}}_initializePoline(){if(!this._config)return;const t=this._config.anchor_colors||[[30,.8,.6],[210,.7,.5]],e=this._config.num_points||4,i=bt[this._config.position_function_x]||bt.sinusoidalPosition,o=bt[this._config.position_function_y]||bt.quadraticPosition,s=bt[this._config.position_function_z]||bt.linearPosition;this._poline=new wt({anchorColors:t,numPoints:e,positionFunctionX:i,positionFunctionY:o,positionFunctionZ:s}),void 0!==this._config.closed_loop&&(this._poline.closedLoop=this._config.closed_loop),void 0!==this._config.invert_lightness&&(this._poline.invertedLightness=this._config.invert_lightness),this._loadState()}updated(t){super.updated(t),t.has("_config")&&this._config&&this._initializePoline(),t.has("hass")&&this.hass&&this._loadSavedPalettes()}firstUpdated(){this._loadPickerComponent()}async _loadPickerComponent(){try{await import("https://unpkg.com/poline/dist/picker.mjs"),this._picker&&this._poline&&"function"==typeof this._picker.setPoline&&this._picker.setPoline(this._poline),this._picker?.addEventListener("poline-change",t=>{t.detail?.poline&&(this._poline=t.detail.poline,this.requestUpdate())})}catch(t){console.error("Failed to load poline-picker component:",t)}}_applyColorToEntity(){if(!this.hass||!this._poline||!this._config?.entities)return;const t=this._config.entities;if(0===t.length)return;const e=this._poline.colors.length,i=[];for(let o=0;o<t.length;o++){const s=o/(t.length-1),n=Math.round(s*(e-1));i.push(n)}t.forEach((t,e)=>{const o=this._poline.colors[i[e]],[s,n,r]=o,a=this._hslToRgb(s,n,r);this.hass.callService("light","turn_on",{entity_id:t,rgb_color:a,brightness:Math.round(255*r)})})}async _applyPaletteToWled(){if(!this.hass||!this._poline||!this._config?.wled_entities)return;const t=this._config.wled_entities;if(0===t.length)return;const e=this._config.palette_size||16,i=[];for(let t=0;t<e;t++){const o=t/(e-1),s=this._poline.getColorAt(o),[n,r,a]=s.hsl,l=this._hslToRgb(n,r,a);i.push(l)}await Promise.all(t.map(t=>this._setWledCustomPalette(t,i)))}async _setWledCustomPalette(t,e){if(this.hass)try{const i=t.replace("light.","sensor.")+"_ip",o=this.hass.states[i];if(!o)return console.error(`IP sensor ${i} not found for ${t}`),void this.hass.callService("light","turn_on",{entity_id:t,rgb_color:e[0]});const s=o.state;if(!s||"unknown"===s||"unavailable"===s)return console.error(`No valid IP address in ${i}: ${s}`),void this.hass.callService("light","turn_on",{entity_id:t,rgb_color:e[0]});let n=!1;try{const t=await fetch(`http://${s}/json/info`);if(t.ok){const e=await t.json();e.fs&&0!==e.fs.u||(console.log(`WLED at ${s} has no filesystem, using /upload`),n=!0)}}catch(t){console.warn(`Could not check WLED capabilities at ${s}:`,t)}const r=[];e.forEach((t,i)=>{const o=Math.round(i/(e.length-1)*255),s=t.map(t=>t.toString(16).padStart(2,"0")).join("");r.push(o),r.push(s)});const a={palette:r},l=JSON.stringify(a),c=new FormData,h=new Blob([l],{type:"application/json"});c.append("data",h,"/palette0.json");const p=n?"/upload":"/edit",d=await fetch(`http://${s}${p}`,{method:"POST",body:c});if(!d.ok)throw new Error(`WLED upload error: ${d.status}`);const u=await fetch(`http://${s}/win&RB`,{method:"GET"});u.ok||console.warn(`WLED reboot warning: ${u.status}`);let g=!1;const _=30;for(let t=0;t<_;t++){await new Promise(t=>setTimeout(t,1e3));try{if((await fetch(`http://${s}/json/state`,{method:"GET"})).ok){g=!0;break}}catch{}}if(!g)throw new Error("WLED did not restart in time");console.log(`WLED at ${s} has restarted`);const f={seg:[{id:0,pal:0,fx:38}],on:!0},v=await fetch(`http://${s}/json/state`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(f)});if(!v.ok)throw new Error(`WLED state error: ${v.status}`);console.log(`Successfully applied custom palette to WLED at ${s}`)}catch(i){console.error(`Failed to set WLED palette for ${t}:`,i),this.hass.callService("light","turn_on",{entity_id:t,rgb_color:e[0]})}}_applyColors(){this._saveState(),this._applyColorToEntity(),this._applyPaletteToWled().catch(t=>{console.error("Error applying WLED palette:",t)})}_openPalettesDialog(){this._paletteName="",this._showPalettesDialog=!0}_closePalettesDialog(){this._showPalettesDialog=!1,this._paletteName=""}async _savePalette(){if(!this._poline||!this._paletteName.trim())return;const t={name:this._paletteName.trim(),anchorColors:this._poline.anchorPoints.map(t=>t.hsl),numPoints:this._poline.numPoints,positionFunctionX:this._config?.position_function_x,positionFunctionY:this._config?.position_function_y,positionFunctionZ:this._config?.position_function_z,closedLoop:this._poline.closedLoop,invertedLightness:this._poline.invertedLightness},e=this._savedPalettes.findIndex(e=>e.name===t.name);e>=0?this._savedPalettes[e]=t:this._savedPalettes=[...this._savedPalettes,t],await this._savePalettesToServer(),this._paletteName=""}async _loadPalette(t){if(!this._poline)return;const e=t.positionFunctionX?bt[t.positionFunctionX]:bt.sinusoidalPosition,i=t.positionFunctionY?bt[t.positionFunctionY]:bt.quadraticPosition,o=t.positionFunctionZ?bt[t.positionFunctionZ]:bt.linearPosition;this._poline=new wt({anchorColors:t.anchorColors,numPoints:t.numPoints,positionFunctionX:e,positionFunctionY:i,positionFunctionZ:o}),void 0!==t.closedLoop&&(this._poline.closedLoop=t.closedLoop),void 0!==t.invertedLightness&&(this._poline.invertedLightness=t.invertedLightness),this._picker&&"function"==typeof this._picker.setPoline&&this._picker.setPoline(this._poline),this._closePalettesDialog(),this.requestUpdate()}async _deletePalette(t){this._savedPalettes=this._savedPalettes.filter(e=>e.name!==t.name),await this._savePalettesToServer()}_hslToRgb(t,e,i){let o,s,n;if(t/=360,0===e)o=s=n=i;else{const r=(t,e,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t),a=i<.5?i*(1+e):i+e-i*e,l=2*i-a;o=r(l,a,t+1/3),s=r(l,a,t),n=r(l,a,t-1/3)}return[Math.round(255*o),Math.round(255*s),Math.round(255*n)]}_getPalettePreviewColors(t){const e=bt[t.positionFunctionX]||bt.sinusoidalPosition,i=bt[t.positionFunctionY]||bt.quadraticPosition,o=bt[t.positionFunctionZ]||bt.linearPosition,s=new wt({anchorColors:t.anchorColors,numPoints:t.numPoints,positionFunctionX:e,positionFunctionY:i,positionFunctionZ:o});void 0!==t.closedLoop&&(s.closedLoop=t.closedLoop),void 0!==t.invertedLightness&&(s.invertedLightness=t.invertedLightness);const n=Math.min(8,s.colors.length),r=[];for(let t=0;t<n;t++){const e=Math.floor(t/(n-1)*(s.colors.length-1));r.push(s.colorsCSS[e])}return r}render(){if(!this._config||!this._poline)return W``;const t=this._poline.colorsCSS;return W`
      <ha-card>
        ${this._config.title?W`<div class="card-header">${this._config.title}</div>`:""}

        <div class="main-content">
          <div class="picker-container">
            <poline-picker interactive></poline-picker>
          </div>
        </div>

        <div class="controls">
          <div class="button-group">
            <svg class="palette-icon" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              ${q`
                <circle cx="50" cy="50" r="50" fill="#ffffff" />
                ${t.map((e,i)=>{const o=360/t.length,s=i*o-90,n=s+o,r=s*Math.PI/180,a=n*Math.PI/180,l=50+50*Math.cos(r),c=50+50*Math.sin(r),h=50+50*Math.cos(a),p=50+50*Math.sin(a);return q`
                    <path
                      d="M 50 50 L ${l} ${c} A 50 50 0 ${o>180?1:0} 1 ${h} ${p} Z"
                      fill="${e}"
                    >
                      <title>Color ${i+1}</title>
                    </path>
                  `})}
              `}
            </svg>
            <button @click=${this._applyColors}>Apply</button>
            <button class="secondary" @click=${this._openPalettesDialog}>
              Saved Palettes (${this._savedPalettes.length})
            </button>
          </div>
        </div>

        ${this._showPalettesDialog?W`
              <div class="dialog-overlay" @click=${this._closePalettesDialog}>
                <div class="dialog" @click=${t=>t.stopPropagation()}>
                  <div class="dialog-header">Saved Palettes</div>
                  <div class="dialog-content">
                    <div class="save-section">
                      <input
                        type="text"
                        placeholder="Enter palette name to save current"
                        .value=${this._paletteName}
                        @input=${t=>this._paletteName=t.target.value}
                        @keydown=${t=>{"Enter"===t.key&&this._paletteName.trim()&&this._savePalette(),"Escape"===t.key&&this._closePalettesDialog()}}
                      />
                      <button 
                        @click=${this._savePalette} 
                        ?disabled=${!this._paletteName.trim()}
                        style="margin-top: 8px;"
                      >
                        Save Current Palette
                      </button>
                    </div>
                    
                    ${0===this._savedPalettes.length?W`<p style="margin-top: 16px; color: var(--secondary-text-color);">No saved palettes yet</p>`:W`
                          <div class="palette-list" style="margin-top: 16px;">
                            ${this._savedPalettes.map(t=>W`
                                <div class="palette-item">
                                  <div
                                    class="palette-item-content"
                                    @click=${()=>this._loadPalette(t)}
                                  >
                                    <div class="palette-item-name">
                                      ${t.name}
                                    </div>
                                    <div class="palette-item-colors">
                                      ${this._getPalettePreviewColors(t).map(t=>W`
                                          <div
                                            class="palette-preview-swatch"
                                            style="background-color: ${t}"
                                          ></div>
                                        `)}
                                    </div>
                                  </div>
                                  <div class="palette-item-actions">
                                    <button
                                      class="danger"
                                      @click=${()=>this._deletePalette(t)}
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </div>
                              `)}
                          </div>
                        `}
                  </div>
                  <div class="dialog-actions">
                    <button class="secondary" @click=${this._closePalettesDialog}>Close</button>
                  </div>
                </div>
              </div>
            `:""}
      </ha-card>
    `}};St.styles=r`
    :host {
      display: block;
    }

    ha-card {
      padding: 16px;
    }

    .card-header {
      font-size: 1.2em;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .main-content {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;
      overflow: hidden;
    }

    .picker-container {
      flex-shrink: 0;
      max-width: 100%;
    }

    poline-picker {
      width: 100%;
      max-width: 350px;
      height: 310px;
      --poline-picker-bg-color: var(--card-background-color, #fff);
      --poline-picker-line-color: var(--primary-text-color, #333);
    }

    .palette-icon {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      flex-shrink: 0;
    }

    .controls {
      display: flex;
      justify-content: center;
      margin-top: 8px;
    }

    .button-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    button {
      padding: 8px 16px;
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background 0.2s;
    }

    button:hover {
      opacity: 0.9;
    }

    button.compact {
      padding: 8px 12px;
      font-size: 13px;
      min-width: auto;
    }

    button.active {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
    }

    button.inactive {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    .info-text {
      font-size: 12px;
      color: var(--secondary-text-color);
      margin-top: 8px;
      text-align: center;
    }

    .dialog-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .dialog {
      background: var(--card-background-color);
      border-radius: 8px;
      padding: 20px;
      min-width: 300px;
      max-width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .dialog-header {
      font-size: 1.1em;
      font-weight: 500;
      margin-bottom: 16px;
    }

    .dialog-content {
      margin-bottom: 16px;
    }

    .save-section {
      padding-bottom: 16px;
      border-bottom: 1px solid var(--divider-color);
    }

    .settings-section {
      padding: 12px 0;
    }

    .settings-section h4 {
      margin: 0 0 12px 0;
      font-size: 0.95em;
      font-weight: 500;
      color: var(--primary-text-color);
    }

    .settings-section label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 14px;
    }

    .dialog-actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;
    }

    input[type="text"] {
      width: 100%;
      padding: 8px;
      border: 1px solid var(--divider-color);
      border-radius: 4px;
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-size: 14px;
    }

    .palette-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      max-height: 400px;
      overflow-y: auto;
    }

    .palette-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 4px;
    }

    .palette-item-content {
      flex: 1;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .palette-item-name {
      font-weight: 500;
    }

    .palette-item-colors {
      display: flex;
      gap: 4px;
    }

    .palette-preview-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--divider-color);
    }

    .palette-item-actions {
      display: flex;
      gap: 8px;
    }

    button.secondary {
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
    }

    button.danger {
      background: var(--error-color, #f44336);
      color: white;
    }
  `,t([ut({attribute:!1})],St.prototype,"hass",void 0),t([gt()],St.prototype,"_config",void 0),t([gt()],St.prototype,"_poline",void 0),t([gt()],St.prototype,"_savedPalettes",void 0),t([gt()],St.prototype,"_showPalettesDialog",void 0),t([gt()],St.prototype,"_paletteName",void 0),t([function(t){return(e,i,o)=>((t,e,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof e&&Object.defineProperty(t,e,i),i))(e,i,{get(){return(e=>e.renderRoot?.querySelector(t)??null)(this)}})}("poline-picker")],St.prototype,"_picker",void 0),St=t([ht("poline-card")],St);const Ct=window;Ct.customCards=Ct.customCards||[],Ct.customCards.push({type:"poline-card",name:"Poline Color Picker",description:"Esoteric color palette generator for lights and WLED",preview:!0,documentationURL:"https://github.com/meodai/poline"});export{St as PolineCard};
//# sourceMappingURL=poline-card.js.map
