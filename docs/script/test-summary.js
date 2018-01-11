(function(){function e(e){for(var t=e.target,s=e.target.parentElement;s&&("TR"!==s.tagName||!s.classList.contains("test-interface"));)s=s.parentElement
if(s){var a
t.classList.contains("opened")?(t.classList.remove("opened"),t.classList.add("closed"),a="closed"):(t.classList.remove("closed"),t.classList.add("opened"),a="opened")
for(var l=parseInt(s.dataset.testDepth,10)+1,n=s.nextElementSibling;n;){var r=parseInt(n.dataset.testDepth,10)
if(!(r>=l))break
if("opened"===a)r===l&&(n.style.display="")
else if("closed"===a){n.style.display="none"
var o=n.querySelector(".toggle")
o&&o.classList.contains("opened")&&(o.classList.remove("opened"),o.classList.add("closed"))}n=n.nextElementSibling}}}for(var t=document.querySelectorAll(".test-summary tr.test-interface .toggle"),s=0;s<t.length;s++)t[s].addEventListener("click",e)
var a=document.querySelectorAll('.test-summary tr[data-test-depth="0"]')
for(s=0;s<a.length;s++)a[s].style.display=""})()
