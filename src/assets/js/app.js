(function () {
  'use strict';

  const defaultLanguage = "us"; // set Default Language
  let language = localStorage.getItem("language");

  function windowLoaded() {
    document.addEventListener('scroll', windowScroll);
  }

  function windowScroll() {
    const header = document.getElementById('header');

    if (header) {
      document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50
        ? header.classList.add("header-shadow")
        : header.classList.remove("header-shadow");
    }
  }

  function setupLanguage() {
    language === null ? setLanguage(defaultLanguage) : setLanguage(language);

    const languageEls = document.getElementsByClassName("language");

    languageEls && Array.from(languageEls).forEach(function (languageEl) {
      languageEl.addEventListener("click", function (event) {
        setLanguage(languageEl.getAttribute("data-language"));
      });
    });
  }

  function setLanguage(lang) {
    const langImgEl = document.getElementById("header-language-img");

    if (langImgEl) {
      langImgEl.src = 'assets/images/flags/' + lang + '.svg';
      localStorage.setItem('language', lang);
      language = localStorage.getItem('language');
      getLanguage();
    }
  }

  function getLanguage() {
    fetch('assets/lang/' + language + '.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error
          (`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        Object.keys(data).forEach((key) => {
          const elements = document.querySelectorAll("[data-key='" + key + "']");
          Array.from(elements).forEach(function (elem) {
            elem.textContent = data[key];
          });
        })
      })
      .catch((error) => console.error("Unable to fetch data:", error));
  }

  function setupNavbar() {
    if (document.documentElement.getAttribute('data-navbar-orientation') === 'vertical') {
      document.getElementById("navbar-scroller").setAttribute("data-simplebar", "");
      document.getElementById("navbar-scroller").classList.add("h-100");
    }
  }

  function setupCollapsableMenu() {
    if (document.querySelectorAll(".navbar-nav .collapse")) {
      const collapsables = document.querySelectorAll(".navbar-nav .collapse");

      Array.from(collapsables).forEach(function (collapse) {
        const collapseInstance = new bootstrap.Collapse(collapse, {
          toggle: false,
        });

        // hide sub menu
        collapse.addEventListener("show.bs.collapse", function (e) {
          e.stopPropagation();
          const closestCollapse = collapse.parentElement.closest(".collapse");
          if (closestCollapse) {
            const siblingCollapses = closestCollapse.querySelectorAll(".collapse");

            Array.from(siblingCollapses).forEach(function (siblingCollapse) {
              const siblingCollapseInstance = bootstrap.Collapse.getInstance(siblingCollapse);
              if (siblingCollapseInstance === collapseInstance) {
                return;
              }
              siblingCollapseInstance.hide();
            });
          } else {
            const getSiblings = function (elem) {
              const siblings = [];
              let sibling = elem.parentNode.firstChild;
              while (sibling) {
                if (sibling.nodeType === 1 && sibling !== elem) {
                  siblings.push(sibling);
                }
                sibling = sibling.nextSibling;
              }
              return siblings;
            };

            const siblings = getSiblings(collapse.parentElement);

            Array.from(siblings).forEach(function (item) {
              if (item.childNodes.length > 2) {
                item.firstElementChild.setAttribute("aria-expanded", "false");
              }

              const ids = item.querySelectorAll("*[id]");

              Array.from(ids).forEach(function (item1) {
                item1.classList.remove("show");
                if (item1.childNodes.length > 2) {
                  const val = item1.querySelectorAll("ul li a");
                  Array.from(val).forEach(function (subitem) {
                    if (subitem.hasAttribute("aria-expanded"))
                      subitem.setAttribute("aria-expanded", "false");
                  });
                }
              });
            });
          }
        });

        // hide nested collapse
        collapse.addEventListener("hide.bs.collapse", function (e) {
          e.stopPropagation();
          const childCollapses = collapse.querySelectorAll(".collapse");

          Array.from(childCollapses).forEach(function (childCollapse) {
            const childCollapseInstance = bootstrap.Collapse.getInstance(childCollapse);
            childCollapseInstance.hide();
          });
        });
      });
    }
  }

  function toggleFullScreen() {
    const fullscreenBtn = document.getElementById('header-fullscreen-btn');

    fullscreenBtn.addEventListener("click", function(e) {
      e.preventDefault();
      if (!document.fullscreenElement) {
        document.getElementById('header-fullscreen-icon').classList.replace('bx-fullscreen', 'bx-exit-fullscreen')
        document.documentElement.requestFullscreen();
      } else {
        document.getElementById('header-fullscreen-icon').classList.replace('bx-exit-fullscreen', 'bx-fullscreen')
        document.exitFullscreen();
      }
    });
  }

  function toggleHamburgerMenu() {

  }

  function setupColorMode() {
    const html = document.getElementsByTagName("HTML")[0];
    const headerColorMode = document.getElementById("header-color-mode");
    const headerColorModeDarkIcon = document.getElementById("header-color-mode-dark-icon");
    const headerColorModeLightIcon = document.getElementById("header-color-mode-light-icon");

    function colorMode(colorMode) {
      sessionStorage.setItem('data-bs-theme', colorMode);
      html.setAttribute("data-bs-theme", colorMode)
    }

    // Default setting
    sessionStorage.getItem('data-bs-theme') ? colorMode(sessionStorage.getItem('data-bs-theme')) : colorMode('light');

    if (headerColorMode) {
      headerColorMode.addEventListener('click', () => {
        if (html.hasAttribute("data-bs-theme") && html.getAttribute("data-bs-theme") === "light") {
          colorMode('dark')
          headerColorModeDarkIcon.classList.add('d-none');
          headerColorModeLightIcon.classList.remove('d-none');
        } else {
          colorMode('light')
          headerColorModeDarkIcon.classList.remove('d-none');
          headerColorModeLightIcon.classList.add('d-none');
        }
      });
    }
  }



  function init() {
    windowLoaded();
    setupLanguage();
    setupNavbar();
    setupCollapsableMenu();
    toggleFullScreen();
    setupColorMode();
  }

  init();
})();