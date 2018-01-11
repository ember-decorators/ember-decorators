window.PR_SHOULD_USE_CONTINUATION=!0,function(){function e(e,t,n,r,a){n&&(e={h:e,l:1,j:null,m:null,a:n,c:null,i:t,g:null},r(e),a.push.apply(a,e.g))}function t(e){for(var t=void 0,n=e.firstChild;n;n=n.nextSibling){var r=n.nodeType
t=1===r?t?e:n:3===r&&m.test(n.nodeValue)?e:t}return t===e?void 0:t}function n(t,n){function r(t){for(var o=t.i,u=t.h,c=[o,"pln"],p=0,d=t.a.match(a)||[],f={},g=0,h=d.length;g<h;++g){var m,y=d[g],v=f[y],b=void 0
if("string"==typeof v)m=!1
else{var x=l[y.charAt(0)]
if(x)b=y.match(x[1]),v=x[0]
else{for(m=0;m<i;++m)if(x=n[m],b=y.match(x[1])){v=x[0]
break}b||(v="pln")}!(m=5<=v.length&&"lang-"===v.substring(0,5))||b&&"string"==typeof b[1]||(m=!1,v="src"),m||(f[y]=v)}if(x=p,p+=y.length,m){m=b[1]
var w=y.indexOf(m),S=w+m.length
b[2]&&(S=y.length-b[2].length,w=S-m.length),v=v.substring(5),e(u,o+x,y.substring(0,w),r,c),e(u,o+x+w,m,s(v,m),c),e(u,o+x+S,y.substring(S),r,c)}else c.push(o+x,v)}t.g=c}var a,l={};(function(){for(var e=t.concat(n),r=[],s={},i=0,o=e.length;i<o;++i){var u=e[i],c=u[3]
if(c)for(var p=c.length;0<=--p;)l[c.charAt(p)]=u
c=""+(u=u[1]),s.hasOwnProperty(c)||(r.push(u),s[c]=null)}r.push(/[\0-\uffff]/),a=function(e){function t(e){var t=e.charCodeAt(0)
if(92!==t)return t
var n=e.charAt(1)
return(t=p[n])?t:"0"<=n&&"7">=n?parseInt(e.substring(1),8):"u"===n||"x"===n?parseInt(e.substring(2),16):e.charCodeAt(1)}function n(e){return 32>e?(16>e?"\\x0":"\\x")+e.toString(16):"\\"===(e=String.fromCharCode(e))||"-"===e||"]"===e||"^"===e?"\\"+e:e}function r(e){var r=e.substring(1,e.length-1).match(/\\u[0-9A-Fa-f]{4}|\\x[0-9A-Fa-f]{2}|\\[0-3][0-7]{0,2}|\\[0-7]{1,2}|\\[\s\S]|-|[^-\\]/g)
e=[]
var a=["["];(l="^"===r[0])&&a.push("^")
for(var l=l?1:0,s=r.length;l<s;++l){var i=r[l]
if(/\\[bdsw]/i.test(i))a.push(i)
else{var o
i=t(i),l+2<s&&"-"===r[l+1]?(o=t(r[l+2]),l+=2):o=i,e.push([i,o]),65>o||122<i||(65>o||90<i||e.push([32|Math.max(65,i),32|Math.min(o,90)]),97>o||122<i||e.push([-33&Math.max(97,i),-33&Math.min(o,122)]))}}for(e.sort(function(e,t){return e[0]-t[0]||t[1]-e[1]}),r=[],s=[],l=0;l<e.length;++l)(i=e[l])[0]<=s[1]+1?s[1]=Math.max(s[1],i[1]):r.push(s=i)
for(l=0;l<r.length;++l)i=r[l],a.push(n(i[0])),i[1]>i[0]&&(i[1]+1>i[0]&&a.push("-"),a.push(n(i[1])))
return a.push("]"),a.join("")}function a(e){for(var t=e.source.match(/(?:\[(?:[^\x5C\x5D]|\\[\s\S])*\]|\\u[A-Fa-f0-9]{4}|\\x[A-Fa-f0-9]{2}|\\[0-9]+|\\[^ux0-9]|\(\?[:!=]|[\(\)\^]|[^\x5B\x5C\(\)\^]+)/g),a=t.length,i=[],o=0,u=0;o<a;++o){var c=t[o]
"("===c?++u:"\\"===c.charAt(0)&&(c=+c.substring(1))&&(c<=u?i[c]=-1:t[o]=n(c))}for(o=1;o<i.length;++o)-1===i[o]&&(i[o]=++l)
for(u=o=0;o<a;++o)"("===(c=t[o])?(++u,i[u]||(t[o]="(?:")):"\\"===c.charAt(0)&&(c=+c.substring(1))&&c<=u&&(t[o]="\\"+i[c])
for(o=0;o<a;++o)"^"===t[o]&&"^"!==t[o+1]&&(t[o]="")
if(e.ignoreCase&&s)for(o=0;o<a;++o)c=t[o],e=c.charAt(0),2<=c.length&&"["===e?t[o]=r(c):"\\"!==e&&(t[o]=c.replace(/[a-zA-Z]/g,function(e){return e=e.charCodeAt(0),"["+String.fromCharCode(-33&e,32|e)+"]"}))
return t.join("")}for(var l=0,s=!1,i=!1,o=0,u=e.length;o<u;++o){var c=e[o]
if(c.ignoreCase)i=!0
else if(/[a-z]/i.test(c.source.replace(/\\u[0-9a-f]{4}|\\x[0-9a-f]{2}|\\[^ux]/gi,""))){s=!0,i=!1
break}}var p={b:8,t:9,n:10,v:11,f:12,r:13},d=[]
for(o=0,u=e.length;o<u;++o){if((c=e[o]).global||c.multiline)throw Error(""+c)
d.push("(?:"+a(c)+")")}return new RegExp(d.join("|"),i?"gi":"g")}(r)})()
var i=n.length
return r}function r(e){var t=[],r=[]
e.tripleQuotedStrings?t.push(["str",/^(?:\'\'\'(?:[^\'\\]|\\[\s\S]|\'{1,2}(?=[^\']))*(?:\'\'\'|$)|\"\"\"(?:[^\"\\]|\\[\s\S]|\"{1,2}(?=[^\"]))*(?:\"\"\"|$)|\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$))/,null,"'\""]):e.multiLineStrings?t.push(["str",/^(?:\'(?:[^\\\']|\\[\s\S])*(?:\'|$)|\"(?:[^\\\"]|\\[\s\S])*(?:\"|$)|\`(?:[^\\\`]|\\[\s\S])*(?:\`|$))/,null,"'\"`"]):t.push(["str",/^(?:\'(?:[^\\\'\r\n]|\\.)*(?:\'|$)|\"(?:[^\\\"\r\n]|\\.)*(?:\"|$))/,null,"\"'"]),e.verbatimStrings&&r.push(["str",/^@\"(?:[^\"]|\"\")*(?:\"|$)/,null])
var a=e.hashComments
if(a&&(e.cStyleComments?(1<a?t.push(["com",/^#(?:##(?:[^#]|#(?!##))*(?:###|$)|.*)/,null,"#"]):t.push(["com",/^#(?:(?:define|e(?:l|nd)if|else|error|ifn?def|include|line|pragma|undef|warning)\b|[^\r\n]*)/,null,"#"]),r.push(["str",/^<(?:(?:(?:\.\.\/)*|\/?)(?:[\w-]+(?:\/[\w-]+)+)?[\w-]+\.h(?:h|pp|\+\+)?|[a-z]\w*)>/,null])):t.push(["com",/^#[^\r\n]*/,null,"#"])),e.cStyleComments&&(r.push(["com",/^\/\/[^\r\n]*/,null]),r.push(["com",/^\/\*[\s\S]*?(?:\*\/|$)/,null])),a=e.regexLiterals){var l=(a=1<a?"":"\n\r")?".":"[\\S\\s]"
r.push(["lang-regex",RegExp("^(?:^^\\.?|[+-]|[!=]=?=?|\\#|%=?|&&?=?|\\(|\\*=?|[+\\-]=|->|\\/=?|::?|<<?=?|>>?>?=?|,|;|\\?|@|\\[|~|{|\\^\\^?=?|\\|\\|?=?|break|case|continue|delete|do|else|finally|instanceof|return|throw|try|typeof)\\s*(/(?=[^/*"+a+"])(?:[^/\\x5B\\x5C"+a+"]|\\x5C"+l+"|\\x5B(?:[^\\x5C\\x5D"+a+"]|\\x5C"+l+")*(?:\\x5D|$))+/)")])}return(a=e.types)&&r.push(["typ",a]),(a=(""+e.keywords).replace(/^ | $/g,"")).length&&r.push(["kwd",new RegExp("^(?:"+a.replace(/[\s,]+/g,"|")+")\\b"),null]),t.push(["pln",/^\s+/,null," \r\n\t "]),a="^.[^\\s\\w.$@'\"`/\\\\]*",e.regexLiterals&&(a+="(?!s*/)"),r.push(["lit",/^@[a-z_$][a-z_$@0-9]*/i,null],["typ",/^(?:[@_]?[A-Z]+[a-z][A-Za-z_$@0-9]*|\w+_t\b)/,null],["pln",/^[a-z_$][a-z_$@0-9]*/i,null],["lit",/^(?:0x[a-f0-9]+|(?:\d(?:_\d+)*\d*(?:\.\d*)?|\.\d\+)(?:e[+\-]?\d+)?)[a-z]*/i,null,"0123456789"],["pln",/^\\[\s\S]?/,null],["pun",new RegExp(a),null]),n(t,r)}function a(e,t,n){function r(e){var t=e.nodeType
if(1!=t||l.test(e.className)){if((3==t||4==t)&&n){var o=e.nodeValue,u=o.match(s)
u&&(t=o.substring(0,u.index),e.nodeValue=t,(o=o.substring(u.index+u[0].length))&&e.parentNode.insertBefore(i.createTextNode(o),e.nextSibling),a(e),t||e.parentNode.removeChild(e))}}else if("br"===e.nodeName)a(e),e.parentNode&&e.parentNode.removeChild(e)
else for(e=e.firstChild;e;e=e.nextSibling)r(e)}function a(e){function t(e,n){var r=n?e.cloneNode(!1):e
if(a=e.parentNode){var a=t(a,1),l=e.nextSibling
a.appendChild(r)
for(var s=l;s;s=l)l=s.nextSibling,a.appendChild(s)}return r}for(;!e.nextSibling;)if(!(e=e.parentNode))return
e=t(e.nextSibling,0)
for(var n;(n=e.parentNode)&&1===n.nodeType;)e=n
u.push(e)}for(var l=/(?:^|\s)nocode(?:\s|$)/,s=/\r\n?|\n/,i=e.ownerDocument,o=i.createElement("li");e.firstChild;)o.appendChild(e.firstChild)
for(var u=[o],c=0;c<u.length;++c)r(u[c])
t===(0|t)&&u[0].setAttribute("value",t)
var p=i.createElement("ol")
p.className="linenums",t=Math.max(0,t-1|0)||0
c=0
for(var d=u.length;c<d;++c)o=u[c],o.className="L"+(c+t)%10,o.firstChild||o.appendChild(i.createTextNode(" ")),p.appendChild(o)
e.appendChild(p)}function l(e,t){for(var n=t.length;0<=--n;){var r=t[n]
y.hasOwnProperty(r)?c.console&&console.warn("cannot override language handler %s",r):y[r]=e}}function s(e,t){return e&&y.hasOwnProperty(e)||(e=/^\s*</.test(t)?"default-markup":"default-code"),y[e]}function i(e){var t=e.j
try{var n=(i=function(e,t){function n(e){var o=e.nodeType
if(1==o){if(!r.test(e.className)){for(o=e.firstChild;o;o=o.nextSibling)n(o)
"br"!==(o=e.nodeName.toLowerCase())&&"li"!==o||(a[i]="\n",s[i<<1]=l++,s[i++<<1|1]=e)}}else 3!=o&&4!=o||(o=e.nodeValue).length&&(o=t?o.replace(/\r\n?/g,"\n"):o.replace(/[ \t\r\n]+/g," "),a[i]=o,s[i<<1]=l,l+=o.length,s[i++<<1|1]=e)}var r=/(?:^|\s)nocode(?:\s|$)/,a=[],l=0,s=[],i=0
return n(e),{a:a.join("").replace(/\n$/,""),c:s}}(e.h,e.l)).a
e.a=n,e.c=i.c,e.i=0,s(t,n)(e)
var r=(r=/\bMSIE\s(\d+)/.exec(navigator.userAgent))&&8>=+r[1],a=(t=/\n/g,e.a),l=a.length,i=0,o=e.c,u=o.length,p=(n=0,e.g),d=p.length,f=0
p[d]=l
var g,h
for(h=g=0;h<d;)p[h]!==p[h+2]?(p[g++]=p[h++],p[g++]=p[h++]):h+=2
for(d=g,h=g=0;h<d;){for(var m=p[h],y=p[h+1],v=h+2;v+2<=d&&p[v+1]===y;)v+=2
p[g++]=m,p[g++]=y,h=v}p.length=g
var b=e.h
e="",b&&(e=b.style.display,b.style.display="none")
try{for(;n<u;){var x,w=o[n+2]||l,S=p[f+2]||l,C=(v=Math.min(w,S),o[n+1])
if(1!==C.nodeType&&(x=a.substring(i,v))){r&&(x=x.replace(t,"\r")),C.nodeValue=x
var N=C.ownerDocument,_=N.createElement("span")
_.className=p[f+1]
var k=C.parentNode
k.replaceChild(_,C),_.appendChild(C),i<w&&(o[n+1]=C=N.createTextNode(a.substring(v,w)),k.insertBefore(C,_.nextSibling))}(i=v)>=w&&(n+=2),i>=S&&(f+=2)}}finally{b&&(b.style.display=e)}}catch(e){c.console&&console.log(e&&e.stack||e)}}var o,u,c=window,p=[o=[[u=["break,continue,do,else,for,if,return,while"],"auto,case,char,const,default,double,enum,extern,float,goto,inline,int,long,register,restrict,short,signed,sizeof,static,struct,switch,typedef,union,unsigned,void,volatile"],"catch,class,delete,false,import,new,operator,private,protected,public,this,throw,true,try,typeof"],"abstract,assert,boolean,byte,extends,finally,final,implements,import,instanceof,interface,null,native,package,strictfp,super,synchronized,throws,transient"],d=[o,"abstract,add,alias,as,ascending,async,await,base,bool,by,byte,checked,decimal,delegate,descending,dynamic,event,finally,fixed,foreach,from,get,global,group,implicit,in,interface,internal,into,is,join,let,lock,null,object,out,override,orderby,params,partial,readonly,ref,remove,sbyte,sealed,select,set,stackalloc,string,select,uint,ulong,unchecked,unsafe,ushort,value,var,virtual,where,yield"],f=[u,"and,as,assert,class,def,del,elif,except,exec,finally,from,global,import,in,is,lambda,nonlocal,not,or,pass,print,raise,try,with,yield,False,True,None"],g=[u,"alias,and,begin,case,class,def,defined,elsif,end,ensure,false,in,module,next,nil,not,or,redo,rescue,retry,self,super,then,true,undef,unless,until,when,yield,BEGIN,END"],h=/^(DIR|FILE|array|vector|(de|priority_)?queue|(forward_)?list|stack|(const_)?(reverse_)?iterator|(unordered_)?(multi)?(set|map)|bitset|u?(int|float)\d*)\b/,m=/\S/,y={}
l(r({keywords:[v=[o,"alignas,alignof,align_union,asm,axiom,bool,concept,concept_map,const_cast,constexpr,decltype,delegate,dynamic_cast,explicit,export,friend,generic,late_check,mutable,namespace,noexcept,noreturn,nullptr,property,reinterpret_cast,static_assert,static_cast,template,typeid,typename,using,virtual,where"],d,p,o=[o,"abstract,async,await,constructor,debugger,enum,eval,export,function,get,implements,instanceof,interface,let,null,set,undefined,var,with,yield,Infinity,NaN"],"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",f,g,u=[u,"case,done,elif,esac,eval,fi,function,in,local,set,then,until"]],hashComments:!0,cStyleComments:!0,multiLineStrings:!0,regexLiterals:!0}),["default-code"]),l(n([],[["pln",/^[^<?]+/],["dec",/^<!\w[^>]*(?:>|$)/],["com",/^<\!--[\s\S]*?(?:-\->|$)/],["lang-",/^<\?([\s\S]+?)(?:\?>|$)/],["lang-",/^<%([\s\S]+?)(?:%>|$)/],["pun",/^(?:<[%?]|[%?]>)/],["lang-",/^<xmp\b[^>]*>([\s\S]+?)<\/xmp\b[^>]*>/i],["lang-js",/^<script\b[^>]*>([\s\S]*?)(<\/script\b[^>]*>)/i],["lang-css",/^<style\b[^>]*>([\s\S]*?)(<\/style\b[^>]*>)/i],["lang-in.tag",/^(<\/?[a-z][^<>]*>)/i]]),"default-markup htm html mxml xhtml xml xsl".split(" ")),l(n([["pln",/^[\s]+/,null," \t\r\n"],["atv",/^(?:\"[^\"]*\"?|\'[^\']*\'?)/,null,"\"'"]],[["tag",/^^<\/?[a-z](?:[\w.:-]*\w)?|\/?>$/i],["atn",/^(?!style[\s=]|on)[a-z](?:[\w:-]*\w)?/i],["lang-uq.val",/^=\s*([^>\'\"\s]*(?:[^>\'\"\s\/]|\/(?=\s)))/],["pun",/^[=<>\/]+/],["lang-js",/^on\w+\s*=\s*\"([^\"]+)\"/i],["lang-js",/^on\w+\s*=\s*\'([^\']+)\'/i],["lang-js",/^on\w+\s*=\s*([^\"\'>\s]+)/i],["lang-css",/^style\s*=\s*\"([^\"]+)\"/i],["lang-css",/^style\s*=\s*\'([^\']+)\'/i],["lang-css",/^style\s*=\s*([^\"\'>\s]+)/i]]),["in.tag"]),l(n([],[["atv",/^[\s\S]+/]]),["uq.val"]),l(r({keywords:v,hashComments:!0,cStyleComments:!0,types:h}),"c cc cpp cxx cyc m".split(" ")),l(r({keywords:"null,true,false"}),["json"]),l(r({keywords:d,hashComments:!0,cStyleComments:!0,verbatimStrings:!0,types:h}),["cs"]),l(r({keywords:p,cStyleComments:!0}),["java"]),l(r({keywords:u,hashComments:!0,multiLineStrings:!0}),["bash","bsh","csh","sh"]),l(r({keywords:f,hashComments:!0,multiLineStrings:!0,tripleQuotedStrings:!0}),["cv","py","python"]),l(r({keywords:"caller,delete,die,do,dump,elsif,eval,exit,foreach,for,goto,if,import,last,local,my,next,no,our,print,package,redo,require,sub,undef,unless,until,use,wantarray,while,BEGIN,END",hashComments:!0,multiLineStrings:!0,regexLiterals:2}),["perl","pl","pm"]),l(r({keywords:g,hashComments:!0,multiLineStrings:!0,regexLiterals:!0}),["rb","ruby"]),l(r({keywords:o,cStyleComments:!0,regexLiterals:!0}),["javascript","js","ts","typescript"]),l(r({keywords:"all,and,by,catch,class,else,extends,false,finally,for,if,in,is,isnt,loop,new,no,not,null,of,off,on,or,return,super,then,throw,true,try,unless,until,when,while,yes",hashComments:3,cStyleComments:!0,multilineStrings:!0,tripleQuotedStrings:!0,regexLiterals:!0}),["coffee"]),l(n([],[["str",/^[\s\S]+/]]),["regex"])
var v,b=c.PR={createSimpleLexer:n,registerLangHandler:l,sourceDecorator:r,PR_ATTRIB_NAME:"atn",PR_ATTRIB_VALUE:"atv",PR_COMMENT:"com",PR_DECLARATION:"dec",PR_KEYWORD:"kwd",PR_LITERAL:"lit",PR_NOCODE:"nocode",PR_PLAIN:"pln",PR_PUNCTUATION:"pun",PR_SOURCE:"src",PR_STRING:"str",PR_TAG:"tag",PR_TYPE:"typ",prettyPrintOne:c.prettyPrintOne=function(e,t,n){n=n||!1,t=t||null
var r=document.createElement("div")
return r.innerHTML="<pre>"+e+"</pre>",r=r.firstChild,n&&a(r,n,!0),i({j:t,m:n,h:r,l:1,a:null,i:null,c:null,g:null}),r.innerHTML},prettyPrint:c.prettyPrint=function(e,n){function r(){for(var n=c.PR_SHOULD_USE_CONTINUATION?f.now()+250:1/0;g<o.length&&f.now()<n;g++){for(var s=o[g],u=w,p=s;p=p.previousSibling;){if((C=(7===(d=p.nodeType)||8===d)&&p.nodeValue)?!/^\??prettify\b/.test(C):3!==d||/\S/.test(p.nodeValue))break
if(C){u={},C.replace(/\b(\w+)=([\w:.%+-]+)/g,function(e,t,n){u[t]=n})
break}}if(p=s.className,(u!==w||m.test(p))&&!y.test(p)){for(d=!1,C=s.parentNode;C;C=C.parentNode)if(x.test(C.tagName)&&C.className&&m.test(C.className)){d=!0
break}if(!d){if(s.className+=" prettyprinted",!(d=u.lang)){var d,S
!(d=p.match(h))&&(S=t(s))&&b.test(S.tagName)&&(d=S.className.match(h)),d&&(d=d[1])}if(v.test(s.tagName))C=1
else{var C=s.currentStyle,N=l.defaultView
C=(C=C?C.whiteSpace:N&&N.getComputedStyle?N.getComputedStyle(s,null).getPropertyValue("white-space"):0)&&"pre"===C.substring(0,3)}(N="true"===(N=u.linenums)||+N)||(N=!!(N=p.match(/\blinenums\b(?::(\d+))?/))&&(!N[1]||!N[1].length||+N[1])),N&&a(s,N,C),i({j:d,h:s,m:N,l:C,a:null,i:null,c:null,g:null})}}}g<o.length?c.setTimeout(r,250):"function"==typeof e&&e()}for(var l=(s=n||document.body).ownerDocument||document,s=[s.getElementsByTagName("pre"),s.getElementsByTagName("code"),s.getElementsByTagName("xmp")],o=[],u=0;u<s.length;++u)for(var p=0,d=s[u].length;p<d;++p)o.push(s[u][p])
s=null
var f=Date
f.now||(f={now:function(){return+new Date}})
var g=0,h=/\blang(?:uage)?-([\w.]+)(?!\S)/,m=/\bprettyprint\b/,y=/\bprettyprinted\b/,v=/pre|xmp/i,b=/^code$/i,x=/^(?:pre|code|xmp)$/i,w={}
r()}}
"function"==typeof(v=c.define)&&v.amd&&v("google-code-prettify",[],function(){return b})}()
