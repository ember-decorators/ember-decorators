(function(){prettyPrint()
for(var e=document.querySelectorAll('.prettyprint.linenums li[class^="L"]'),r=0;r<e.length;r++)e[r].id="lineNumber"+(r+1)
var t=location.hash.match(/errorLines=([\d,]+)/)
if(t)for(e=t[1].split(","),r=0;r<e.length;r++){var l="#lineNumber"+e[r]
document.querySelector(l).classList.add("error-line")}else if(location.hash){l=location.hash.replace(/([\[\].'"@$])/g,"\\$1")
var i=document.querySelector(l)
i&&i.classList.add("active")}})()
