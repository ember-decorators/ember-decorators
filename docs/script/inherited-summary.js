(function(){function e(e){for(var t=e.target,s=e.target.parentElement;s&&("TABLE"!==s.tagName||!s.classList.contains("summary"));)s=s.parentElement
if(s){var a=s.querySelector("tbody")
t.classList.contains("opened")?(t.classList.remove("opened"),t.classList.add("closed"),a.style.display="none"):(t.classList.remove("closed"),t.classList.add("opened"),a.style.display="block")}}for(var t=document.querySelectorAll(".inherited-summary thead .toggle"),s=0;s<t.length;s++)t[s].addEventListener("click",e)})()
