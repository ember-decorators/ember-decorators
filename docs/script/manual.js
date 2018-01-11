(function(){var a=location.pathname.match(/\/(manual\/.*\.html)$/)
if(a){var t='.navigation .manual-toc li[data-link="'+a[1]+'"]',n=t+"{ display: block; }\n"
n+=t+".indent-h1 a { color: #039BE5 }"
var e=document.createElement("style")
e.textContent=n,document.querySelector("head").appendChild(e)}})()
