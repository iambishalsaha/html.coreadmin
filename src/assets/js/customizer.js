const html = document.getElementsByTagName("HTML")[0];

function resetLayout() {
  if (document.getElementById('reset-layout-settings')) {
    document.getElementById('reset-layout-settings').addEventListener('click', () => {
      sessionStorage.clear();
      window.location.reload();
    });
  }
}

function setLayout() {
  setColorMode();
  setNavbarColorMode();
}

function setColorMode() {

}

function setNavbarColorMode() {
  const customizerNavbarColorModeLight = document.getElementById("customizer-navbar-color-mode-light");
  const customizerNavbarColorModeDark = document.getElementById("customizer-navbar-color-mode-dark");

  function colorMode(colorMode) {
    sessionStorage.setItem('data-navbar-color-mode', colorMode);
    html.setAttribute("data-navbar-color-mode", colorMode)
  }

  // Default setting
  sessionStorage.getItem('data-navbar-color-mode') ? colorMode(sessionStorage.getItem('data-navbar-color-mode')) : colorMode('dark');

  if (customizerNavbarColorModeLight) {
    customizerNavbarColorModeLight.checked = sessionStorage.getItem('data-navbar-color-mode') === 'light';

    customizerNavbarColorModeLight.addEventListener('click', () => {
      colorMode('light')
    });
  }

  if (customizerNavbarColorModeDark) {
    customizerNavbarColorModeDark.checked = sessionStorage.getItem('data-navbar-color-mode') === 'dark';

    customizerNavbarColorModeDark.addEventListener('click', () => {
      colorMode('dark')
    });
  }
}

(function () {
  resetLayout();
  setLayout();
})();