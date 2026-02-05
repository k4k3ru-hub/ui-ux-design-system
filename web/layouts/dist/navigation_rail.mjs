// navigation_rail.js
var NavigationRail = class {
  static ClassNameLayout = "layout";
  static ClassNameLayoutNavigationRail = "layout__navigation-rail";
  static ClassNameLayoutNavigationRailDrawer = "layout__navigation-rail-drawer";
  static ClassNameLayoutNavigationRailDrawerContainer = "layout__navigation-rail-drawer-container";
  static ClassNameLayoutNavigationRailItem = "layout__navigation-rail-item";
  static ClassNameLayoutNavigationRailItemDropdown = "layout__navigation-rail-drawer-item--dropdown";
  static ClassNameLayoutNavigationRailDrawerContainerDropdown = "layout__navigation-rail-drawer-container--dropdown";
  static HeightLayoutNavigationRailItem = 3.5;
  // 3.5rem = 56px
  //
  // Constructor.
  //
  constructor() {
    this.layout = document.querySelector(`.${Layout.ClassNameLayout}`);
  }
  //
  // Run.
  //
  Run() {
    if (!this.layout) {
      return;
    }
    this.setUpNavDrawer();
    this.setUpNavRailDrawer();
  }
  //
  // Set up the navigation drawer.
  //
  setUpNavDrawer() {
    const navDrawerTargets = document.querySelectorAll("[data-layout-navigation-drawer-target]");
    for (let i = 0; i < navDrawerTargets.length; i++) {
      const targetElm = navDrawerTargets[i];
      const id = targetElm.dataset.layoutNavigationDrawerTarget;
      const idElm = document.querySelector(`[data-layout-navigation-drawer-id="${id}"]`);
      if (idElm === null || idElm === void 0) {
        continue;
      }
      targetElm.addEventListener("click", (event) => {
        idElm.classList.add("activated");
      });
      idElm.addEventListener("click", (event) => {
        if (event.target.closest(`[data-layout-navigation-drawer-id="${id}"] .drawer`)) {
          return;
        }
        idElm.classList.remove("activated");
      });
    }
  }
  //
  // Set up the navigation rail drawer.
  //
  setUpNavRailDrawer() {
    this.navigationRailDrawer = this.layout.querySelector(`.${Layout.ClassNameLayoutNavigationRailDrawer}`);
    this.navigationRailItems = this.layout.querySelectorAll(`.${Layout.ClassNameLayoutNavigationRailItem}`);
    this.navigationRailItemsDropdown = this.layout.querySelectorAll(`.${Layout.ClassNameLayoutNavigationRailItemDropdown}`);
    if (this.navigationRailDrawer === void 0 || this.navigationRailDrawer === null) {
      return;
    }
    for (let i = 0; i < this.navigationRailItems.length; i++) {
      const itemElm = this.navigationRailItems[i];
      itemElm.addEventListener("mouseover", () => {
        this.closeNavRailDrawer();
        const id = itemElm.dataset.layoutNavigationRailDrawerContainerTarget;
        const idElm = document.querySelector(`[data-layout-navigation-rail-drawer-container-id="${id}"]`);
        if (idElm === null || idElm === void 0) {
          return;
        }
        this.navigationRailDrawer.classList.add("activated");
        idElm.classList.add("activated");
      });
    }
    this.layout.addEventListener("mouseover", (event) => {
      if (event.target.closest(`.${Layout.ClassNameLayoutNavigationRailDrawer}`) || event.target.closest(`.${Layout.ClassNameLayoutNavigationRail}`)) {
        return;
      } else {
        this.closeNavRailDrawer();
      }
    });
    for (let i = 0; i < this.navigationRailItemsDropdown.length; i++) {
      const e = this.navigationRailItemsDropdown[i];
      const dropdownContainer = e.nextElementSibling;
      if (dropdownContainer === null || dropdownContainer === void 0 || !dropdownContainer.classList.contains(Layout.ClassNameLayoutNavigationRailDrawerContainerDropdown)) {
        continue;
      }
      let height = `${Layout.HeightLayoutNavigationRailItem * dropdownContainer.children.length}`;
      if (e.classList.contains("activated")) {
        dropdownContainer.style.height = `${height}rem`;
      }
      e.addEventListener("click", () => {
        if (e.classList.contains("activated")) {
          dropdownContainer.style.height = null;
          e.classList.remove("activated");
        } else {
          dropdownContainer.style.height = `${height}rem`;
          e.classList.add("activated");
        }
      });
    }
  }
  //
  // Close the navigation rail drawer.
  //
  closeNavRailDrawer() {
    const elms = document.querySelectorAll(`.${Layout.ClassNameLayoutNavigationRailDrawerContainer}.activated`);
    for (let i = 0; i < elms.length; i++) {
      elms[i].classList.remove("activated");
    }
    this.navigationRailDrawer.classList.remove("activated");
  }
};
export {
  NavigationRail
};
//# sourceMappingURL=navigation_rail.mjs.map
