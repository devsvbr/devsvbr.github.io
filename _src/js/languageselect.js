var languageSelect = document.getElementById('footer-language-select');
if (languageSelect) {
  languageSelect.onchange = function() {
    window.location = languageSelect.options[languageSelect.selectedIndex].value;
  }
}
