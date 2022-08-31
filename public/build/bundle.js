var app=function(){"use strict";function e(){}function t(e){return e()}function n(){return Object.create(null)}function s(e){e.forEach(t)}function l(e){return"function"==typeof e}function i(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let o,r;function c(e,t){return o||(o=document.createElement("a")),o.href=t,e===o.href}function a(e){return null==e?"":e}function u(e,t){e.appendChild(t)}function d(e,t,n){e.insertBefore(t,n||null)}function g(e){e.parentNode.removeChild(e)}function m(e){return document.createElement(e)}function p(e){return document.createTextNode(e)}function v(){return p(" ")}function f(){return p("")}function h(e,t,n,s){return e.addEventListener(t,n,s),()=>e.removeEventListener(t,n,s)}function $(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function w(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function b(e,t){e.value=null==t?"":t}function x(e){r=e}function _(){if(!r)throw new Error("Function called outside component initialization");return r}function q(e){_().$$.on_mount.push(e)}function k(){const e=_();return(t,n,{cancelable:s=!1}={})=>{const l=e.$$.callbacks[t];if(l){const i=function(e,t,{bubbles:n=!1,cancelable:s=!1}={}){const l=document.createEvent("CustomEvent");return l.initCustomEvent(e,n,s,t),l}(t,n,{cancelable:s});return l.slice().forEach((t=>{t.call(e,i)})),!i.defaultPrevented}return!0}}const z=[],T=[],y=[],M=[],L=Promise.resolve();let H=!1;function E(e){y.push(e)}const C=new Set;let I=0;function N(){const e=r;do{for(;I<z.length;){const e=z[I];I++,x(e),A(e.$$)}for(x(null),z.length=0,I=0;T.length;)T.pop()();for(let e=0;e<y.length;e+=1){const t=y[e];C.has(t)||(C.add(t),t())}y.length=0}while(z.length);for(;M.length;)M.pop()();H=!1,C.clear(),x(e)}function A(e){if(null!==e.fragment){e.update(),s(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(E)}}const G=new Set;let J;function P(){J={r:0,c:[],p:J}}function j(){J.r||s(J.c),J=J.p}function O(e,t){e&&e.i&&(G.delete(e),e.i(t))}function S(e,t,n,s){if(e&&e.o){if(G.has(e))return;G.add(e),J.c.push((()=>{G.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}else s&&s()}function Y(e){e&&e.c()}function W(e,n,i,o){const{fragment:r,on_mount:c,on_destroy:a,after_update:u}=e.$$;r&&r.m(n,i),o||E((()=>{const n=c.map(t).filter(l);a?a.push(...n):s(n),e.$$.on_mount=[]})),u.forEach(E)}function B(e,t){const n=e.$$;null!==n.fragment&&(s(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function D(e,t){-1===e.$$.dirty[0]&&(z.push(e),H||(H=!0,L.then(N)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function Z(t,l,i,o,c,a,u,d=[-1]){const m=r;x(t);const p=t.$$={fragment:null,ctx:null,props:a,update:e,not_equal:c,bound:n(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(l.context||(m?m.$$.context:[])),callbacks:n(),dirty:d,skip_bound:!1,root:l.target||m.$$.root};u&&u(p.root);let v=!1;if(p.ctx=i?i(t,l.props||{},((e,n,...s)=>{const l=s.length?s[0]:n;return p.ctx&&c(p.ctx[e],p.ctx[e]=l)&&(!p.skip_bound&&p.bound[e]&&p.bound[e](l),v&&D(t,e)),n})):[],p.update(),v=!0,s(p.before_update),p.fragment=!!o&&o(p.ctx),l.target){if(l.hydrate){const e=function(e){return Array.from(e.childNodes)}(l.target);p.fragment&&p.fragment.l(e),e.forEach(g)}else p.fragment&&p.fragment.c();l.intro&&O(t.$$.fragment),W(t,l.target,l.anchor,l.customElement),N()}x(m)}class F{$destroy(){B(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function R(e){let t,n;return{c(){t=m("img"),c(t.src,n="/icons/svgs/Jae_footer.svg")||$(t,"src","/icons/svgs/Jae_footer.svg"),$(t,"height","27"),$(t,"alt","JAE")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function U(e){let t,n;return{c(){t=m("img"),c(t.src,n="/icons/svgs/Me.svg")||$(t,"src","/icons/svgs/Me.svg"),$(t,"height","30"),$(t,"alt","JAE")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function K(e){let t,n,s;return{c(){t=m("div"),t.innerHTML='<img src="/icons/svgs/Home.svg" height="28" alt="home"/>',n=v(),s=m("div"),s.innerHTML='<img src="/icons/svgs/Global.svg" height="28" alt="global"/>',$(t,"class","home-wrap"),$(s,"class","global-wrap")},m(e,l){d(e,t,l),d(e,n,l),d(e,s,l)},d(e){e&&g(t),e&&g(n),e&&g(s)}}}function Q(t){let n,s,l,i,o,r,c;function a(e,t){return e[0]?R:U}let p=a(t),f=p(t),h=!t[0]&&K();return{c(){n=m("div"),s=m("div"),l=m("div"),f.c(),i=v(),o=m("div"),h&&h.c(),r=v(),c=m("div"),c.innerHTML='<img src="/icons/svgs/Dm.svg" height="28" alt="dm"/>',$(l,"class","logo-wrap svelte-u9wn43"),$(c,"class","dm-wrap"),$(o,"class","menu-wrap svelte-u9wn43"),$(s,"class","nav-content-wrap svelte-u9wn43"),$(n,"class","navbar svelte-u9wn43")},m(e,t){d(e,n,t),u(n,s),u(s,l),f.m(l,null),u(s,i),u(s,o),h&&h.m(o,null),u(o,r),u(o,c)},p(e,[t]){p!==(p=a(e))&&(f.d(1),f=p(e),f&&(f.c(),f.m(l,null))),e[0]?h&&(h.d(1),h=null):h||(h=K(),h.c(),h.m(o,r))},i:e,o:e,d(e){e&&g(n),f.d(),h&&h.d()}}}function V(e,t,n){let{loggedIn:s}=t;return e.$$set=e=>{"loggedIn"in e&&n(0,s=e.loggedIn)},[s]}class X extends F{constructor(e){super(),Z(this,e,V,Q,i,{loggedIn:0})}}function ee(t){let n,l,i,o,r,f,w,x,_,q,k,z,T,y,M,L,H,E,C,I,N,A,G,J,P,j,O,S,Y,W,B,D,Z,F,R,U,K;return{c(){n=m("div"),l=m("div"),i=m("div"),o=m("div"),r=m("div"),r.innerHTML='<img src="/icons/svgs/Jae.svg" height="55"/>',f=v(),w=m("div"),x=m("form"),_=m("div"),q=m("label"),k=p("Your email"),T=v(),y=m("input"),M=v(),L=m("img"),E=v(),C=m("div"),I=m("label"),N=p("Password"),G=v(),J=m("input"),P=v(),j=m("img"),S=v(),Y=m("div"),W=m("div"),W.innerHTML='<button class="login-button svelte-o82d3k" type="submit"></button>',B=v(),D=m("div"),D.innerHTML='<hr class="first svelte-o82d3k"/> \n                              <p class="middle svelte-o82d3k">OR</p> \n                              <hr class="second svelte-o82d3k"/>',Z=v(),F=m("div"),R=m("button"),$(r,"class","login-title svelte-o82d3k"),$(q,"for","username"),$(q,"class",z=a(0==t[0].length?"username-label":"username-label-filled")+" svelte-o82d3k"),$(y,"class","email-input svelte-o82d3k"),$(y,"type","text"),$(y,"name","username"),y.required=!0,c(L.src,H="/icons/crop_bar.png")||$(L,"src","/icons/crop_bar.png"),$(L,"height","4"),$(L,"width","200"),$(_,"class","login-input svelte-o82d3k"),$(I,"for","password"),$(I,"class",A=a(0==t[1].length?"password-label":"password-label-filled")+" svelte-o82d3k"),$(J,"class","password-input svelte-o82d3k"),$(J,"type","password"),$(J,"name","password"),J.required=!0,c(j.src,O="/icons/crop_bar.png")||$(j,"src","/icons/crop_bar.png"),$(j,"height","4"),$(j,"width","200"),$(C,"class","login-input svelte-o82d3k"),$(W,"class","login-button-wrap svelte-o82d3k"),$(D,"class","or svelte-o82d3k"),$(R,"class","signin-button svelte-o82d3k"),$(F,"class","signin-button-wrap svelte-o82d3k"),$(Y,"class","actions svelte-o82d3k"),$(x,"action","/login"),$(x,"method","POST"),$(w,"class","login-form svelte-o82d3k"),$(o,"class","login svelte-o82d3k"),$(i,"class","login-wrap svelte-o82d3k"),$(l,"class","login-container svelte-o82d3k"),$(n,"class","content-wrap svelte-o82d3k")},m(e,s){d(e,n,s),u(n,l),u(l,i),u(i,o),u(o,r),u(o,f),u(o,w),u(w,x),u(x,_),u(_,q),u(q,k),u(_,T),u(_,y),b(y,t[0]),u(_,M),u(_,L),u(x,E),u(x,C),u(C,I),u(I,N),u(C,G),u(C,J),b(J,t[1]),u(C,P),u(C,j),u(x,S),u(x,Y),u(Y,W),u(Y,B),u(Y,D),u(Y,Z),u(Y,F),u(F,R),U||(K=[h(y,"input",t[3]),h(J,"input",t[4]),h(R,"click",t[2])],U=!0)},p(e,[t]){1&t&&z!==(z=a(0==e[0].length?"username-label":"username-label-filled")+" svelte-o82d3k")&&$(q,"class",z),1&t&&y.value!==e[0]&&b(y,e[0]),2&t&&A!==(A=a(0==e[1].length?"password-label":"password-label-filled")+" svelte-o82d3k")&&$(I,"class",A),2&t&&J.value!==e[1]&&b(J,e[1])},i:e,o:e,d(e){e&&g(n),U=!1,s(K)}}}function te(e,t,n){var s=k();let l="",i="";return[l,i,function(){console.log("switching to signIn"),s("mode",{signIn:!0})},function(){l=this.value,n(0,l)},function(){i=this.value,n(1,i)}]}class ne extends F{constructor(e){super(),Z(this,e,te,ee,i,{})}}function se(t){let n;return{c(){n=m("h2"),n.textContent="Name is not valid enough..."},m(e,t){d(e,n,t)},p:e,d(e){e&&g(n)}}}function le(e){let t,n,s,l;return{c(){t=m("h1"),n=p(e[0]),s=v(),l=m("h2"),l.textContent="are you sure?"},m(e,i){d(e,t,i),u(t,n),d(e,s,i),d(e,l,i)},p(e,t){1&t&&w(n,e[0])},d(e){e&&g(t),e&&g(s),e&&g(l)}}}function ie(t){let n;return{c(){n=m("h2"),n.textContent="What are you called?"},m(e,t){d(e,n,t)},p:e,d(e){e&&g(n)}}}function oe(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1x4d1sa"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-1x4d1sa">Too short! Make it longer than 2 letters.</p>',$(t,"class","requirement-wrap svelte-1x4d1sa")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function re(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1x4d1sa"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-1x4d1sa">Too long! Make it shorter than 11 letters.</p>',$(t,"class","requirement-wrap svelte-1x4d1sa")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function ce(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1x4d1sa"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                <p class="svelte-1x4d1sa">No whitespace is allowed.</p>',$(t,"class","requirement-wrap svelte-1x4d1sa")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function ae(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1x4d1sa"><img src="/icons/svgs/check.svg" width="13px" height="13px"/></div> \n                <p class="svelte-1x4d1sa">Good to go!</p>',$(t,"class","requirement-wrap-check svelte-1x4d1sa")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function ue(e){let t;return{c(){t=m("button"),$(t,"class","nav-left svelte-1x4d1sa")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function de(t){let n,s,l;return{c(){n=m("button"),$(n,"class","nav-right svelte-1x4d1sa")},m(e,i){d(e,n,i),s||(l=h(n,"click",t[4]),s=!0)},p:e,d(e){e&&g(n),s=!1,l()}}}function ge(t){let n,s,l,i,o,r,a,p,f,w,x,_,q,k,z,T,y,M,L,H,E,C;function I(e,t){return""==e[0]?ie:e[3]?le:se}let N=I(t),A=N(t),G=!t[2].is_long_enough&&oe(),J=!t[2].is_short_enough&&re(),P=!t[2].no_whitespace&&ce(),j=t[3]&&ae(),O=0!=t[1]&&ue(),S=0==t[1]&&""!=t[0]&&t[3]&&de(t);return{c(){n=m("div"),s=m("div"),l=m("div"),A.c(),i=v(),o=m("div"),r=m("div"),a=m("input"),p=v(),f=m("img"),x=v(),_=m("div"),G&&G.c(),q=v(),J&&J.c(),k=v(),P&&P.c(),z=v(),j&&j.c(),T=v(),y=m("div"),M=m("div"),O&&O.c(),L=v(),H=m("div"),S&&S.c(),$(l,"class","questionair-container svelte-1x4d1sa"),$(a,"id","name"),$(a,"name","name"),$(a,"class","name-field svelte-1x4d1sa"),$(r,"class","field-wrap svelte-1x4d1sa"),c(f.src,w="/icons/crop_bar.png")||$(f,"src","/icons/crop_bar.png"),$(f,"height","4"),$(f,"width","200"),$(o,"class","form-wrap svelte-1x4d1sa"),$(_,"class","name-requirement-container svelte-1x4d1sa"),$(s,"class","container svelte-1x4d1sa"),$(n,"class","set-user-name-wrap svelte-1x4d1sa"),$(M,"class","sub-navbar-left svelte-1x4d1sa"),$(H,"class","sub-navbar-right svelte-1x4d1sa"),$(y,"class","sub-navbar-wrap svelte-1x4d1sa")},m(e,c){d(e,n,c),u(n,s),u(s,l),A.m(l,null),u(s,i),u(s,o),u(o,r),u(r,a),b(a,t[0]),u(o,p),u(o,f),u(s,x),u(s,_),G&&G.m(_,null),u(_,q),J&&J.m(_,null),u(_,k),P&&P.m(_,null),u(_,z),j&&j.m(_,null),d(e,T,c),d(e,y,c),u(y,M),O&&O.m(M,null),u(y,L),u(y,H),S&&S.m(H,null),E||(C=h(a,"input",t[5]),E=!0)},p(e,[t]){N===(N=I(e))&&A?A.p(e,t):(A.d(1),A=N(e),A&&(A.c(),A.m(l,null))),1&t&&a.value!==e[0]&&b(a,e[0]),e[2].is_long_enough?G&&(G.d(1),G=null):G||(G=oe(),G.c(),G.m(_,q)),e[2].is_short_enough?J&&(J.d(1),J=null):J||(J=re(),J.c(),J.m(_,k)),e[2].no_whitespace?P&&(P.d(1),P=null):P||(P=ce(),P.c(),P.m(_,z)),e[3]?j||(j=ae(),j.c(),j.m(_,null)):j&&(j.d(1),j=null),0!=e[1]?O||(O=ue(),O.c(),O.m(M,null)):O&&(O.d(1),O=null),0==e[1]&&""!=e[0]&&e[3]?S?S.p(e,t):(S=de(e),S.c(),S.m(H,null)):S&&(S.d(1),S=null)},i:e,o:e,d(e){e&&g(n),A.d(),G&&G.d(),J&&J.d(),P&&P.d(),j&&j.d(),e&&g(T),e&&g(y),O&&O.d(),S&&S.d(),E=!1,C()}}}function me(e,t,n){let{stage:s=0}=t,{name:l}=t;var i=k();let o={is_long_enough:!1,is_short_enough:!0,no_whitespace:!0},r=!1;return e.$$set=e=>{"stage"in e&&n(1,s=e.stage),"name"in e&&n(0,l=e.name)},e.$$.update=()=>{5&e.$$.dirty&&(!function(e){let t=!/\s/.test(e),s=e.length,l={};l.is_long_enough=s>=3,l.is_short_enough=s<=10,l.no_whitespace=t,n(2,o=l),console.log(e)}(l),n(3,r=o.is_long_enough&&o.is_short_enough&&o.no_whitespace))},[l,s,o,r,function(){console.log("bubble up name..."),n(1,s=1),i("userName",{name:l,stage:s})},function(){l=this.value,n(0,l)}]}class pe extends F{constructor(e){super(),Z(this,e,me,ge,i,{stage:1,name:0})}}function ve(e){let t;return{c(){t=m("h2"),t.textContent="Email is not valid enough..."},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function fe(e){let t;return{c(){t=m("h2"),t.textContent="You sure this is your email?"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function he(e){let t;return{c(){t=m("h2"),t.textContent="What email address do you use?"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function $e(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1e2qs0c"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-1e2qs0c">This is not a valid email format.</p>',$(t,"class","requirement-wrap svelte-1e2qs0c")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function we(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-1e2qs0c"><img src="/icons/svgs/check.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-1e2qs0c">Good to go!</p>',$(t,"class","requirement-wrap-check svelte-1e2qs0c")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function be(t){let n,s,l;return{c(){n=m("button"),$(n,"class","nav-left svelte-1e2qs0c")},m(e,i){d(e,n,i),s||(l=h(n,"click",t[4],{once:!0}),s=!0)},p:e,d(e){e&&g(n),s=!1,l()}}}function xe(t){let n,s,l;return{c(){n=m("button"),$(n,"class","nav-right svelte-1e2qs0c")},m(e,i){d(e,n,i),s||(l=h(n,"click",t[3],{once:!0}),s=!0)},p:e,d(e){e&&g(n),s=!1,l()}}}function _e(t){let n,s,l,i,o,r,a,p,f,w,x,_,q,k,z,T,y,M,L,H;function E(e,t){return""==e[0]?he:e[2]?fe:ve}let C=E(t),I=C(t),N=!t[2]&&$e(),A=t[2]&&we(),G=0!=t[1]&&be(t),J=1==t[1]&&""!=t[0]&&t[2]&&xe(t);return{c(){n=m("div"),s=m("div"),l=m("div"),I.c(),i=v(),o=m("div"),r=m("div"),a=m("input"),p=v(),f=m("img"),x=v(),_=m("div"),N&&N.c(),q=v(),A&&A.c(),k=v(),z=m("div"),T=m("div"),G&&G.c(),y=v(),M=m("div"),J&&J.c(),$(l,"class","questionair-container svelte-1e2qs0c"),$(a,"id","email"),$(a,"name","email"),$(a,"class","email-field svelte-1e2qs0c"),$(r,"class","field-wrap svelte-1e2qs0c"),c(f.src,w="/icons/crop_bar.png")||$(f,"src","/icons/crop_bar.png"),$(f,"height","4"),$(f,"width","200"),$(o,"class","form-wrap svelte-1e2qs0c"),$(_,"class","email-requirement-container svelte-1e2qs0c"),$(s,"class","container svelte-1e2qs0c"),$(n,"class","set-user-email-wrap svelte-1e2qs0c"),$(T,"class","sub-navbar-left svelte-1e2qs0c"),$(M,"class","sub-navbar-right svelte-1e2qs0c"),$(z,"class","sub-navbar-wrap svelte-1e2qs0c")},m(e,c){d(e,n,c),u(n,s),u(s,l),I.m(l,null),u(s,i),u(s,o),u(o,r),u(r,a),b(a,t[0]),u(o,p),u(o,f),u(s,x),u(s,_),N&&N.m(_,null),u(_,q),A&&A.m(_,null),d(e,k,c),d(e,z,c),u(z,T),G&&G.m(T,null),u(z,y),u(z,M),J&&J.m(M,null),L||(H=h(a,"input",t[5]),L=!0)},p(e,[t]){C!==(C=E(e))&&(I.d(1),I=C(e),I&&(I.c(),I.m(l,null))),1&t&&a.value!==e[0]&&b(a,e[0]),e[2]?N&&(N.d(1),N=null):N||(N=$e(),N.c(),N.m(_,q)),e[2]?A||(A=we(),A.c(),A.m(_,null)):A&&(A.d(1),A=null),0!=e[1]?G?G.p(e,t):(G=be(e),G.c(),G.m(T,null)):G&&(G.d(1),G=null),1==e[1]&&""!=e[0]&&e[2]?J?J.p(e,t):(J=xe(e),J.c(),J.m(M,null)):J&&(J.d(1),J=null)},i:e,o:e,d(e){e&&g(n),I.d(),N&&N.d(),A&&A.d(),e&&g(k),e&&g(z),G&&G.d(),J&&J.d(),L=!1,H()}}}function qe(e,t,n){let s,{stage:l=1}=t,{email:i}=t;var o=k();return e.$$set=e=>{"stage"in e&&n(1,l=e.stage),"email"in e&&n(0,i=e.email)},e.$$.update=()=>{5&e.$$.dirty&&(!function(e){let t=/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/.test(e);n(2,s=t)}(i),console.log("email:",i),console.log("email rule result:",s))},n(2,s=!1),[i,l,s,function(){console.log("bubble up email..."),n(1,l=2),o("userEmail",{email:i,stage:l})},function(){console.log("Go back to stage",l-1),n(1,l-=1),o("userEmail",{email:i,stage:l})},function(){i=this.value,n(0,i)}]}class ke extends F{constructor(e){super(),Z(this,e,qe,_e,i,{stage:1,email:0})}}function ze(t){let n;return{c(){n=m("h2"),n.textContent="Mode Error. Something went wrong ..."},m(e,t){d(e,n,t)},p:e,d(e){e&&g(n)}}}function Te(e){let t;function n(e,t){return""==e[4]?He:e[3]==e[4]?Le:Me}let s=n(e),l=s(e);return{c(){l.c(),t=f()},m(e,n){l.m(e,n),d(e,t,n)},p(e,i){s!==(s=n(e))&&(l.d(1),l=s(e),l&&(l.c(),l.m(t.parentNode,t)))},d(e){l.d(e),e&&g(t)}}}function ye(e){let t;function n(e,t){return""==e[4]?Ie:e[2]?Ce:Ee}let s=n(e),l=s(e);return{c(){l.c(),t=f()},m(e,n){l.m(e,n),d(e,t,n)},p(e,i){s!==(s=n(e))&&(l.d(1),l=s(e),l&&(l.c(),l.m(t.parentNode,t)))},d(e){l.d(e),e&&g(t)}}}function Me(e){let t;return{c(){t=m("h2"),t.textContent="Password doesn't seem to match ... You sure ?"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Le(e){let t;return{c(){t=m("h2"),t.textContent="LASTLY !"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function He(e){let t;return{c(){t=m("h2"),t.textContent="Now is time to check. Type again !"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ee(e){let t;return{c(){t=m("h2"),t.textContent="Password not strong enough ..."},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ce(e){let t;return{c(){t=m("h2"),t.textContent="Make sure you internalize this magic password"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ie(e){let t;return{c(){t=m("h2"),t.textContent="Set a magic password !"},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ne(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-2z43ps"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-2z43ps">You need at least one uppercase.</p>',$(t,"class","requirement-wrap svelte-2z43ps")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ae(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-2z43ps"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-2z43ps">Password need to be longer than nine characters.</p>',$(t,"class","requirement-wrap svelte-2z43ps")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Ge(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-2z43ps"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-2z43ps">You need at least one special case.</p>',$(t,"class","requirement-wrap svelte-2z43ps")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Je(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-2z43ps"><img src="/icons/svgs/cross.svg" width="13px" height="13px"/></div> \n                    <p class="svelte-2z43ps">No whitespace is allowed!</p>',$(t,"class","requirement-wrap svelte-2z43ps")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function Pe(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="icon-wrap svelte-2z43ps"><img src="/icons/svgs/check.svg" width="13px" height="13px"/></div> \n                <p class="svelte-2z43ps">Good to go!</p>',$(t,"class","requirement-wrap-check svelte-2z43ps")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function je(t){let n,s,l;return{c(){n=m("button"),$(n,"class","nav-left svelte-2z43ps")},m(e,i){d(e,n,i),s||(l=h(n,"click",t[7]),s=!0)},p:e,d(e){e&&g(n),s=!1,l()}}}function Oe(t){let n,s,l;return{c(){n=m("button"),$(n,"class","nav-right svelte-2z43ps")},m(e,i){d(e,n,i),s||(l=h(n,"click",t[6]),s=!0)},p:e,d(e){e&&g(n),s=!1,l()}}}function Se(t){let n,s,l,i,o,r,a,p,f,w,x,_,q,k,z,T,y,M,L,H,E,C,I;function N(e,t){return 0==e[5]?ye:1==e[5]?Te:ze}let A=N(t),G=A(t),J=!t[2]&&!t[1].has_uppercase&&Ne(),P=!t[2]&&!t[1].long_enough&&Ae(),j=!t[2]&&!t[1].has_specialcase&&Ge(),O=!t[2]&&!t[1].no_whitespace&&Je(),S=t[2]&&Pe(),Y=0!=t[0]&&je(t),W=2==t[0]&&""!=t[4]&&t[2]&&Oe(t);return{c(){n=m("div"),s=m("div"),l=m("div"),G.c(),i=v(),o=m("div"),r=m("div"),a=m("input"),p=v(),f=m("img"),x=v(),_=m("div"),J&&J.c(),q=v(),P&&P.c(),k=v(),j&&j.c(),z=v(),O&&O.c(),T=v(),S&&S.c(),y=v(),M=m("div"),L=m("div"),Y&&Y.c(),H=v(),E=m("div"),W&&W.c(),$(l,"class","questionair-container svelte-2z43ps"),$(a,"id","password"),$(a,"name","password"),$(a,"class","password-field svelte-2z43ps"),$(a,"type","password"),$(r,"class","field-wrap svelte-2z43ps"),c(f.src,w="/icons/crop_bar.png")||$(f,"src","/icons/crop_bar.png"),$(f,"height","4"),$(f,"width","200"),$(o,"class","form-wrap svelte-2z43ps"),$(_,"class","password-requirement-container svelte-2z43ps"),$(s,"class","container svelte-2z43ps"),$(n,"class","set-user-password-wrap svelte-2z43ps"),$(L,"class","sub-navbar-left svelte-2z43ps"),$(E,"class","sub-navbar-right svelte-2z43ps"),$(M,"class","sub-navbar-wrap svelte-2z43ps")},m(e,c){d(e,n,c),u(n,s),u(s,l),G.m(l,null),u(s,i),u(s,o),u(o,r),u(r,a),b(a,t[4]),u(o,p),u(o,f),u(s,x),u(s,_),J&&J.m(_,null),u(_,q),P&&P.m(_,null),u(_,k),j&&j.m(_,null),u(_,z),O&&O.m(_,null),u(_,T),S&&S.m(_,null),d(e,y,c),d(e,M,c),u(M,L),Y&&Y.m(L,null),u(M,H),u(M,E),W&&W.m(E,null),C||(I=h(a,"input",t[8]),C=!0)},p(e,[t]){A===(A=N(e))&&G?G.p(e,t):(G.d(1),G=A(e),G&&(G.c(),G.m(l,null))),16&t&&a.value!==e[4]&&b(a,e[4]),e[2]||e[1].has_uppercase?J&&(J.d(1),J=null):J||(J=Ne(),J.c(),J.m(_,q)),e[2]||e[1].long_enough?P&&(P.d(1),P=null):P||(P=Ae(),P.c(),P.m(_,k)),e[2]||e[1].has_specialcase?j&&(j.d(1),j=null):j||(j=Ge(),j.c(),j.m(_,z)),e[2]||e[1].no_whitespace?O&&(O.d(1),O=null):O||(O=Je(),O.c(),O.m(_,T)),e[2]?S||(S=Pe(),S.c(),S.m(_,null)):S&&(S.d(1),S=null),0!=e[0]?Y?Y.p(e,t):(Y=je(e),Y.c(),Y.m(L,null)):Y&&(Y.d(1),Y=null),2==e[0]&&""!=e[4]&&e[2]?W?W.p(e,t):(W=Oe(e),W.c(),W.m(E,null)):W&&(W.d(1),W=null)},i:e,o:e,d(e){e&&g(n),G.d(),J&&J.d(),P&&P.d(),j&&j.d(),O&&O.d(),S&&S.d(),e&&g(y),e&&g(M),Y&&Y.d(),W&&W.d(),C=!1,I()}}}function Ye(e,t,n){let s,l,i,o,r,{stage:c=2}=t;var a=k();return e.$$set=e=>{"stage"in e&&n(0,c=e.stage)},e.$$.update=()=>{2&e.$$.dirty&&n(2,o=r.has_uppercase&&r.long_enough&&r.has_specialcase&&r.no_whitespace),30&e.$$.dirty&&(!function(e){let t=e.length>=9,s={};s.has_uppercase=/[A-Z]/.test(e),s.long_enough=t,s.has_specialcase=/[^A-Za-z0-9]/.test(e),s.no_whitespace=!/\s/.test(e),n(1,r=s)}(i),console.log("password:",l),console.log("password rule result:",o),n(2,o=r.has_uppercase&&r.long_enough&&r.has_specialcase&&r.no_whitespace))},n(5,s=0),n(3,l=""),n(4,i=""),n(1,r={has_uppercase:!1,long_enough:!1,has_specialcase:!1,no_whitespace:!0}),[c,r,o,l,i,s,function(){2==c&&0==s?(console.log("password initialized to",i),n(3,l=i),n(4,i=""),n(5,s=1)):2==c&&1==s&&(console.log("checking if password matches ..."),i==l&&""!=l?(console.log("password matches"),n(0,c=3),a("userPassword",{password:l,stage:c}),n(4,i="")):(console.log("password match failed"),n(5,s=0),n(4,i=""),n(3,l="")))},function(){0==s&&2==c?(console.log("Go back to stage",c-1),n(0,c-=1),a("goBack",{stage:c})):1==s&&2==c&&(console.log("Go back to change the draft password"),n(5,s=0),n(4,i=""),n(3,l=""))},function(){i=this.value,n(4,i)}]}class We extends F{constructor(e){super(),Z(this,e,Ye,Se,i,{stage:0})}}function Be(t){let n,s,l,i;return{c(){n=m("h3"),n.textContent="WELCOME TO",s=v(),l=m("img"),$(n,"class","svelte-1pasrog"),c(l.src,i="/icons/svgs/Jae.svg")||$(l,"src","/icons/svgs/Jae.svg"),$(l,"height","60")},m(e,t){d(e,n,t),d(e,s,t),d(e,l,t)},p:e,i:e,o:e,d(e){e&&g(n),e&&g(s),e&&g(l)}}}function De(e){let t,n;return t=new We({props:{stage:e[0]}}),t.$on("userPassword",e[5]),t.$on("goBack",e[6]),{c(){Y(t.$$.fragment)},m(e,s){W(t,e,s),n=!0},p(e,n){const s={};1&n&&(s.stage=e[0]),t.$set(s)},i(e){n||(O(t.$$.fragment,e),n=!0)},o(e){S(t.$$.fragment,e),n=!1},d(e){B(t,e)}}}function Ze(e){let t,n;return t=new ke({props:{email:e[2],stage:e[0]}}),t.$on("userEmail",e[4]),{c(){Y(t.$$.fragment)},m(e,s){W(t,e,s),n=!0},p(e,n){const s={};4&n&&(s.email=e[2]),1&n&&(s.stage=e[0]),t.$set(s)},i(e){n||(O(t.$$.fragment,e),n=!0)},o(e){S(t.$$.fragment,e),n=!1},d(e){B(t,e)}}}function Fe(e){let t,n;return t=new pe({props:{name:e[1],stage:e[0]}}),t.$on("userName",e[3]),{c(){Y(t.$$.fragment)},m(e,s){W(t,e,s),n=!0},p(e,n){const s={};2&n&&(s.name=e[1]),1&n&&(s.stage=e[0]),t.$set(s)},i(e){n||(O(t.$$.fragment,e),n=!0)},o(e){S(t.$$.fragment,e),n=!1},d(e){B(t,e)}}}function Re(e){let t,n,s,l,i;const o=[Fe,Ze,De,Be],r=[];function c(e,t){return 0==e[0]?0:1==e[0]?1:2==e[0]?2:3}return s=c(e),l=r[s]=o[s](e),{c(){t=m("div"),n=m("div"),l.c(),$(n,"class","signin-container svelte-1pasrog"),$(t,"class","content-wrap svelte-1pasrog")},m(e,l){d(e,t,l),u(t,n),r[s].m(n,null),i=!0},p(e,[t]){let i=s;s=c(e),s===i?r[s].p(e,t):(P(),S(r[i],1,1,(()=>{r[i]=null})),j(),l=r[s],l?l.p(e,t):(l=r[s]=o[s](e),l.c()),O(l,1),l.m(n,null))},i(e){i||(O(l),i=!0)},o(e){S(l),i=!1},d(e){e&&g(t),r[s].d()}}}function Ue(e,t,n){let s,l="",i="",o="";var r=k();return e.$$.update=()=>{1&e.$$.dirty&&3==s&&setTimeout((()=>{r("mode",{signIn:!1})}),5e3)},n(0,s=0),[s,l,i,function(e){n(1,l=e.detail.name),n(0,s=e.detail.stage),console.log("name reset:",l)},function(e){n(2,i=e.detail.email),n(0,s=e.detail.stage),console.log("email reset:",i)},function(e){o=e.detail.password,n(0,s=e.detail.stage),console.log("password reset:",o)},function(e){n(0,s=e.detail.stage),console.log("going back from password stage")}]}class Ke extends F{constructor(e){super(),Z(this,e,Ue,Re,i,{})}}function Qe(t){let n;return{c(){n=m("div"),n.innerHTML='<img src="/icons/svgs/pizzaSpinner.svg" height="60" width="60" class="pizza-spinner svelte-rykrrj"/>',$(n,"class","pizza-spinner-wrap")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&g(n)}}}class Ve extends F{constructor(e){super(),Z(this,e,null,Qe,i,{})}}function Xe(t){let n,s,l,i,o,r,a,f,h,b,x,_,q,k,z,T,y,M,L,H,E,C;return{c(){n=m("div"),s=m("div"),l=m("div"),i=m("div"),o=p(t[0]),r=v(),a=m("div"),f=m("div"),h=m("div"),b=m("div"),x=p(t[1]),_=v(),q=m("div"),k=p(t[3]),z=v(),T=m("div"),T.textContent="DM",y=v(),M=m("div"),L=m("img"),E=v(),C=m("div"),C.innerHTML='<div class="first-meme svelte-1n7qq3i"></div> \n        <div class="second-meme svelte-1n7qq3i"></div> \n        <div class="third-meme svelte-1n7qq3i"></div> \n        <div class="forth-meme svelte-1n7qq3i"></div> \n        <div class="add-meme svelte-1n7qq3i"><img src="/icons/svgs/addWithOutBorder.svg" height="40"/></div>',$(i,"class","blogger-default blogger svelte-1n7qq3i"),$(l,"class","bloggers svelte-1n7qq3i"),$(b,"class","title-container-long svelte-1n7qq3i"),$(h,"class","title-wrap svelte-1n7qq3i"),$(q,"class","date-wrap svelte-1n7qq3i"),$(f,"class","title-date-wrap svelte-1n7qq3i"),$(T,"class","dm-wrap svelte-1n7qq3i"),$(a,"class","title-date-dm-container svelte-1n7qq3i"),$(s,"class","blog-header svelte-1n7qq3i"),c(L.src,H=t[2])||$(L,"src",H),$(L,"class","sample svelte-1n7qq3i"),$(M,"class","blog svelte-1n7qq3i"),$(C,"class","memes svelte-1n7qq3i"),$(n,"class","home-container svelte-1n7qq3i")},m(e,c){d(e,n,c),u(n,s),u(s,l),u(l,i),u(i,o),u(s,r),u(s,a),u(a,f),u(f,h),u(h,b),u(b,x),t[6](b),u(f,_),u(f,q),u(q,k),u(a,z),u(a,T),u(n,y),u(n,M),u(M,L),u(n,E),u(n,C)},p(e,[t]){1&t&&w(o,e[0]),2&t&&w(x,e[1]),8&t&&w(k,e[3]),4&t&&!c(L.src,H=e[2])&&$(L,"src",H)},i:e,o:e,d(e){e&&g(n),t[6](null)}}}function et(e,t,n){let s,{blogger:l="Jae"}=t,{title:i="mocking jae mocking jay"}=t,{memes:o={}}=t,{blog:r="/icons/svgs/Global_panel.svg"}=t,{date:c="2022.12.12"}=t;return q((()=>{i.length>=30?n(4,s.innerHTML=i.slice(0,30)+"...",s):n(4,s.innerHTML=i,s)})),e.$$set=e=>{"blogger"in e&&n(0,l=e.blogger),"title"in e&&n(1,i=e.title),"memes"in e&&n(5,o=e.memes),"blog"in e&&n(2,r=e.blog),"date"in e&&n(3,c=e.date)},[l,i,r,c,s,o,function(e){T[e?"unshift":"push"]((()=>{s=e,n(4,s)}))}]}class tt extends F{constructor(e){super(),Z(this,e,et,Xe,i,{blogger:0,title:1,memes:5,blog:2,date:3})}}function nt(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="refresher-inner-wrap svelte-1ldfq4i"><img src="/icons/svgs/pizzaSpinner.svg" height="25" width="25" class="pizza-spinner-refresh svelte-1ldfq4i"/></div>',$(t,"class","refresher svelte-1ldfq4i")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function st(e){let t;return{c(){t=m("div"),t.innerHTML='<div class="pull-wrap svelte-1ldfq4i"><h4 class="pull-line svelte-1ldfq4i">Pull to load more<h4></h4></h4></div>',$(t,"class","pull-container svelte-1ldfq4i")},m(e,n){d(e,t,n)},d(e){e&&g(t)}}}function lt(e){let t,n,l,i,o,r,c,a,p,f,w,b,x,_,q,k,z,T,y,M,L,H,E,C,I,N;function A(e,t){return e[0]?e[0]?nt:void 0:st}n=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),i=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),r=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),a=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),f=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),_=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),k=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),M=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}}),H=new tt({props:{blogger:it,title:ot,date:ct,memes:e[2],blog:rt}});let G=A(e),J=G&&G(e);return{c(){t=m("div"),Y(n.$$.fragment),l=v(),Y(i.$$.fragment),o=v(),Y(r.$$.fragment),c=v(),Y(a.$$.fragment),p=v(),Y(f.$$.fragment),w=v(),b=m("div"),b.innerHTML='<div class="date-line-wrap svelte-1ldfq4i"><img src="/icons/svgs/DATE_word.svg" height="9px"/> \n            <h4 class="date-line svelte-1ldfq4i">- June. 3. 2020<h4></h4></h4></div>',x=v(),Y(_.$$.fragment),q=v(),Y(k.$$.fragment),z=v(),T=m("div"),T.innerHTML='<div class="date-line-wrap svelte-1ldfq4i"><img src="/icons/svgs/DATE_word.svg" height="9px"/> \n            <h4 class="date-line svelte-1ldfq4i">- June. 4. 2020<h4></h4></h4></div>',y=v(),Y(M.$$.fragment),L=v(),Y(H.$$.fragment),E=v(),J&&J.c(),$(b,"class","date-line-container svelte-1ldfq4i"),$(T,"class","date-line-container svelte-1ldfq4i"),$(t,"class","home-wrap svelte-1ldfq4i")},m(s,g){d(s,t,g),W(n,t,null),u(t,l),W(i,t,null),u(t,o),W(r,t,null),u(t,c),W(a,t,null),u(t,p),W(f,t,null),u(t,w),u(t,b),u(t,x),W(_,t,null),u(t,q),W(k,t,null),u(t,z),u(t,T),u(t,y),W(M,t,null),u(t,L),W(H,t,null),u(t,E),J&&J.m(t,null),e[6](t),C=!0,I||(N=[h(t,"wheel",e[3]),h(t,"touchmove",e[3])],I=!0)},p(e,[n]){G!==(G=A(e))&&(J&&J.d(1),J=G&&G(e),J&&(J.c(),J.m(t,null)))},i(e){C||(O(n.$$.fragment,e),O(i.$$.fragment,e),O(r.$$.fragment,e),O(a.$$.fragment,e),O(f.$$.fragment,e),O(_.$$.fragment,e),O(k.$$.fragment,e),O(M.$$.fragment,e),O(H.$$.fragment,e),C=!0)},o(e){S(n.$$.fragment,e),S(i.$$.fragment,e),S(r.$$.fragment,e),S(a.$$.fragment,e),S(f.$$.fragment,e),S(_.$$.fragment,e),S(k.$$.fragment,e),S(M.$$.fragment,e),S(H.$$.fragment,e),C=!1},d(l){l&&g(t),B(n),B(i),B(r),B(a),B(f),B(_),B(k),B(M),B(H),J&&J.d(),e[6](null),I=!1,s(N)}}}let it="jae",ot="When you went seoul and saw mom and dad having sex",rt="/icons/svgs/Global_panel.svg",ct="4 hours ago";function at(e,t,n){let s,l,i,o;return q((()=>{n(4,o=i.offsetHeight)})),e.$$.update=()=>{49&e.$$.dirty&&s<=840&&!l&&(n(0,l=!0),n(5,s=1e3),setTimeout((()=>{window.scrollTo(0,o-700),n(0,l=!1)}),2e3))},n(5,s=1e4),n(0,l=!1),[l,i,{},function(e){i&&n(5,s=o-window.scrollY)},o,s,function(e){T[e?"unshift":"push"]((()=>{i=e,n(1,i)}))}]}class ut extends F{constructor(e){super(),Z(this,e,at,lt,i,{})}}function dt(t){let n,s;return n=new ut({}),{c(){Y(n.$$.fragment)},m(e,t){W(n,e,t),s=!0},p:e,i(e){s||(O(n.$$.fragment,e),s=!0)},o(e){S(n.$$.fragment,e),s=!1},d(e){B(n,e)}}}function gt(t){let n,s;return n=new Ve({}),{c(){Y(n.$$.fragment)},m(e,t){W(n,e,t),s=!0},p:e,i(e){s||(O(n.$$.fragment,e),s=!0)},o(e){S(n.$$.fragment,e),s=!1},d(e){B(n,e)}}}function mt(t){let n,s;return n=new Ke({}),n.$on("mode",t[3]),{c(){Y(n.$$.fragment)},m(e,t){W(n,e,t),s=!0},p:e,i(e){s||(O(n.$$.fragment,e),s=!0)},o(e){S(n.$$.fragment,e),s=!1},d(e){B(n,e)}}}function pt(t){let n,s;return n=new ne({}),n.$on("mode",t[3]),{c(){Y(n.$$.fragment)},m(e,t){W(n,e,t),s=!0},p:e,i(e){s||(O(n.$$.fragment,e),s=!0)},o(e){S(n.$$.fragment,e),s=!1},d(e){B(n,e)}}}function vt(e){let t,n,s,l;const i=[pt,mt,gt,dt],o=[];function r(e,t){return!e[1]||e[2]||e[0]?e[2]&&e[1]&&!e[0]?1:e[1]?e[0]&&e[1]?3:-1:2:0}return~(n=r(e))&&(s=o[n]=i[n](e)),{c(){t=m("div"),s&&s.c(),$(t,"class","content-container svelte-1oj33b5")},m(e,s){d(e,t,s),~n&&o[n].m(t,null),l=!0},p(e,[l]){let c=n;n=r(e),n===c?~n&&o[n].p(e,l):(s&&(P(),S(o[c],1,1,(()=>{o[c]=null})),j()),~n?(s=o[n],s?s.p(e,l):(s=o[n]=i[n](e),s.c()),O(s,1),s.m(t,null)):s=null)},i(e){l||(O(s),l=!0)},o(e){S(s),l=!1},d(e){e&&g(t),~n&&o[n].d()}}}function ft(e,t,n){let s,l=!1;k();let{dev:i=!0}=t,{loggedIn:o=!1}=t,r=0;return i||(r=5e3),e.$$set=e=>{"dev"in e&&n(4,i=e.dev),"loggedIn"in e&&n(0,o=e.loggedIn)},e.$$.update=()=>{34&e.$$.dirty&&(l||setTimeout((()=>{n(1,l=!0)}),r),console.log("loaded: ",l))},n(2,s=!1),[o,l,s,function(e){n(2,s=e.detail.signIn),n(1,l=!1),console.log("loaded: ",l,"signIn: ",s)},i,r]}class ht extends F{constructor(e){super(),Z(this,e,ft,vt,i,{dev:4,loggedIn:0})}}function $t(t){let n;return{c(){n=m("div"),n.innerHTML='<div class="footer-wrap svelte-1yr01se"><div class="footer svelte-1yr01se"><p>SIGNITURE OF</p> \n            <img src="/icons/svgs/Jae_footer.svg" height="40" class="svelte-1yr01se"/></div></div>',$(n,"class","footer-container svelte-1yr01se")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&g(n)}}}class wt extends F{constructor(e){super(),Z(this,e,null,$t,i,{})}}function bt(t){let n;return{c(){n=m("div"),n.innerHTML='<div class="panel-wrap svelte-1n1b9o"><a><img src="/icons/svgs/Home_panel.svg" height="28"/></a> \n\t\t<a><img src="/icons/svgs/addWithBorder.svg" height="28"/></a> \n\t\t<a><img src="/icons/svgs/Global_panel.svg" height="28"/></a> \n\t\t<a><img src="/icons/svgs/locked.svg" height="28"/></a></div>',$(n,"class","panel-container svelte-1n1b9o")},m(e,t){d(e,n,t)},p:e,i:e,o:e,d(e){e&&g(n)}}}class xt extends F{constructor(e){super(),Z(this,e,null,bt,i,{})}}function _t(e){let t,n,s,l,i,o,r,c;t=new X({props:{loggedIn:e[0]}}),s=new ht({props:{dev:yt,loggedIn:e[0]}}),s.$on("login",e[2]);const a=[zt,kt],u=[];function m(e,t){return e[0]?1:0}return i=m(e),o=u[i]=a[i](e),{c(){Y(t.$$.fragment),n=v(),Y(s.$$.fragment),l=v(),o.c(),r=f()},m(e,o){W(t,e,o),d(e,n,o),W(s,e,o),d(e,l,o),u[i].m(e,o),d(e,r,o),c=!0},p(e,n){const l={};1&n&&(l.loggedIn=e[0]),t.$set(l);const c={};1&n&&(c.loggedIn=e[0]),s.$set(c);let d=i;i=m(e),i!==d&&(P(),S(u[d],1,1,(()=>{u[d]=null})),j(),o=u[i],o||(o=u[i]=a[i](e),o.c()),O(o,1),o.m(r.parentNode,r))},i(e){c||(O(t.$$.fragment,e),O(s.$$.fragment,e),O(o),c=!0)},o(e){S(t.$$.fragment,e),S(s.$$.fragment,e),S(o),c=!1},d(e){B(t,e),e&&g(n),B(s,e),e&&g(l),u[i].d(e),e&&g(r)}}}function qt(t){let n,s,l;return s=new Ve({props:{dev:yt}}),{c(){n=m("div"),Y(s.$$.fragment),$(n,"class","spin-container svelte-pk6adf")},m(e,t){d(e,n,t),W(s,n,null),l=!0},p:e,i(e){l||(O(s.$$.fragment,e),l=!0)},o(e){S(s.$$.fragment,e),l=!1},d(e){e&&g(n),B(s)}}}function kt(e){let t,n;return t=new xt({}),{c(){Y(t.$$.fragment)},m(e,s){W(t,e,s),n=!0},i(e){n||(O(t.$$.fragment,e),n=!0)},o(e){S(t.$$.fragment,e),n=!1},d(e){B(t,e)}}}function zt(e){let t,n;return t=new wt({}),{c(){Y(t.$$.fragment)},m(e,s){W(t,e,s),n=!0},i(e){n||(O(t.$$.fragment,e),n=!0)},o(e){S(t.$$.fragment,e),n=!1},d(e){B(t,e)}}}function Tt(e){let t,n,s,l;const i=[qt,_t],o=[];function r(e,t){return e[1]?0:1}return n=r(e),s=o[n]=i[n](e),{c(){t=m("main"),s.c(),$(t,"class","svelte-pk6adf")},m(e,s){d(e,t,s),o[n].m(t,null),l=!0},p(e,[l]){let c=n;n=r(e),n===c?o[n].p(e,l):(P(),S(o[c],1,1,(()=>{o[c]=null})),j(),s=o[n],s?s.p(e,l):(s=o[n]=i[n](e),s.c()),O(s,1),s.m(t,null))},i(e){l||(O(s),l=!0)},o(e){S(s),l=!1},d(e){e&&g(t),o[n].d()}}}let yt=!0;function Mt(e,t,n){let s,l;return setTimeout((()=>{n(1,l=!1)}),0),n(0,s=!0),n(1,l=!0),[s,l,function(e){n(0,s=e.detail.loggedIn),console.log("login status:",s)}]}return new class extends F{constructor(e){super(),Z(this,e,Mt,Tt,i,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map
