document.querySelector(".menu-button").onclick=function(){document.documentElement.classList.toggle("menu-active")&&(document.getElementById("nav-menu").style.top=document.getElementById("navbar").offsetHeight-1+"px")},document.documentElement.onclick=function(e){e.target===document.documentElement&&document.documentElement.classList.remove("menu-active")};