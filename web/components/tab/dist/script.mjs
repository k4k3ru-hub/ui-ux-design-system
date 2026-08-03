// script.js
var Tab = class _Tab {
  static #DefaultTabContainerClass = "tab__container";
  static #DefaultTabClass = "tab";
  static #DefaultTabPanelsClass = "tab__panels";
  static #DefaultTabPanelClass = "tab__panel";
  static #initialized = /* @__PURE__ */ new WeakSet();
  //
  // Constructor.
  //
  constructor(options = null) {
    this.options = {
      tabContainerClass: _Tab.#DefaultTabContainerClass,
      tabClass: _Tab.#DefaultTabClass,
      tabPanelsClass: _Tab.#DefaultTabPanelsClass,
      tabPanelClass: _Tab.#DefaultTabPanelClass,
      ...options
    };
  }
  //
  // Run.
  //
  Run() {
    const tabs = document.querySelectorAll(`.${this.options.tabContainerClass} .${this.options.tabClass}`);
    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      if (_Tab.#initialized.has(tab)) {
        continue;
      }
      _Tab.#initialized.add(tab);
      const style = window.getComputedStyle(tab);
      tab.addEventListener("click", (event) => {
        this.#onClick(event);
      });
    }
  }
  //
  // Click event on the button.
  //
  #onClick(event) {
    const tab = event.currentTarget;
    if (!tab) {
      return;
    }
    this.#activateTab(tab);
    let rippleLayer = tab.querySelector(".tab__ripple");
    if (!rippleLayer) {
      rippleLayer = document.createElement("span");
      rippleLayer.className = "tab__ripple";
      tab.prepend(rippleLayer);
    }
    const rect = tab.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;
    rippleLayer.style.setProperty("--ripple-x", `${x}px`);
    rippleLayer.style.setProperty("--ripple-y", `${y}px`);
    rippleLayer.style.setProperty("--ripple-size", `${size}px`);
    rippleLayer.classList.remove("tab__ripple--animating");
    requestAnimationFrame(() => {
      rippleLayer.classList.add("tab__ripple--animating");
    });
  }
  //
  // Activate the tab button and related panel.
  //
  #activateTab(tab) {
    const container = tab.closest(`.${this.options.tabContainerClass}`) ?? document;
    const tabs = container.querySelectorAll(`.${this.options.tabClass}`);
    const targetId = tab.getAttribute("data-tab-target");
    for (let i = 0; i < tabs.length; i++) {
      const t = tabs[i];
      const isActive = t === tab;
      t.setAttribute("aria-selected", isActive ? "true" : "false");
      t.setAttribute("tabindex", isActive ? "0" : "-1");
    }
    tab.focus({ preventScroll: true });
    if (targetId && targetId.trim() !== "") {
      const parentScope = container.parentElement ?? document;
      const panelsRoot = parentScope.querySelector(`.${this.options.tabPanelsClass}`) ?? document.querySelector(`.${this.options.tabPanelsClass}`) ?? parentScope;
      const panels = panelsRoot.querySelectorAll(`.${this.options.tabPanelClass}`);
      if (panels && panels.length > 0) {
        for (let i = 0; i < panels.length; i++) {
          const p = panels[i];
          const pid = p.getAttribute("data-tab-id");
          const isActivePanel = pid === targetId;
          if (isActivePanel) {
            p.removeAttribute("hidden");
          } else {
            p.setAttribute("hidden", "");
          }
          const fadeEnabled = panelsRoot.classList.contains("tab__panels--fade");
          if (fadeEnabled) {
            if (isActivePanel) {
              p.classList.add("tab__panel--fade-in");
              requestAnimationFrame(() => {
                p.classList.remove("tab__panel--fade-in");
              });
            }
          }
        }
      }
    }
  }
};
export {
  Tab
};
//# sourceMappingURL=script.mjs.map
