document.querySelector('.menu-button').onclick = function() {
  if (document.documentElement.classList.toggle('menu-active')) {
    document.getElementById('nav-menu').style.top = (document.getElementById('navbar').offsetHeight - 1) + 'px';
  }
}
document.documentElement.onclick = function(event) {
  if (event.target === document.documentElement) {
    document.documentElement.classList.remove('menu-active');
  }
}
