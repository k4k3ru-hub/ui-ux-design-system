//
// script.js
//


//
// Class.
//
class Menu {

    static #defaultContainerClass = 'menu__container';
    static #dataMenuID = 'data-menu-id';
    static #dataMenuTarget = 'data-menu-target';

    #options;
    #didBindOnDocument = false;
    #menuContainerMap = new Map();
    #menuTargetMap = new WeakMap();
    #menuStack = [];
    #isMenuOpen = false;
    #menuContainerHoverTimer;
    #menuTargetHoverTimer;
    #activatedMenuTarget;

    //
    // Constructor.
    //
    constructor(options = null) {
        // Options
        this.#options = {
            containerClass: Menu.#defaultContainerClass,
            ...options,
        };
    }


    //
    // Run.
    //
    Run() {
        // Initialize manu_map.
        this.#initManuMap();

        if (this.#didBindOnDocument) return;
        this.#didBindOnDocument = true;

        // Add click event listener to document.
        document.addEventListener('click', (event) => this.#clickOnDocument(event));

        // Add keydown event listener to document.
        document.addEventListener('keydown', (event) => { this.#handleDocumentKeyDown(event) });
    }


    //
    // Get menu_container by menu_id.
    //
    GetMenuContainer(menuID) {
        return this.#menuContainerMap.get(menuID) ?? null;
    }


    //
    // Get activatedMenuTarget.
    //
    GetActivatedMenuTarget() {
        return this.#activatedMenuTarget ?? null;
    }


    //
    // Get selected_values from menu_target.
    //
    GetSelectedValues(menuTarget) {
        return this.#menuTargetMap.get(menuTarget)?.selectedValues ?? [];
    }


    //
    // Refresh activatedMenuTarget.
    //
    RefreshActiveMenuTarget() {
        this.#handleActivatedMenuTargetChenge();
    }


    //
    // Register menu_target_map.
    //
    RegisterMenuTargetMap(menuTarget) {
        if (this.#menuTargetMap.has(menuTarget)) {
            return this.#menuTargetMap.get(menuTarget);
        }

        const menuID = menuTarget.getAttribute(Menu.#dataMenuTarget);
        if (!menuID) return {};

        const menuContainer = this.#menuContainerMap.get(menuID);
        if (!menuContainer) {
            return { menuID };
        }

//        // Add click event listener to menu_target.
//        menuTarget.addEventListener('click', (event) => { this.#clickOnMenuTarget(menuTarget) });

//        // Add pointerover event listener to menu_target.
//        menuTarget.addEventListener('pointerover', (event) => { this.#hoverOnMenuTarget(menuTarget) });

        const syncIcon = menuTarget.querySelector('[data-menu-sync="icon"]') || null;
        const syncLabel = menuTarget.querySelector('[data-menu-sync="label"]') || null;

        // Set selectedValues from dataset.menuInitialValues.
        let selectedValues = [];
        const raw = menuTarget.dataset.menuInitialValues ?? '';
        const values = raw.split(',').map(v => v.trim()).filter(Boolean);
        selectedValues = values.map(value => ({ value }));

        this.#menuTargetMap.set(menuTarget, { menuID, menuContainer, syncIcon, syncLabel, selectedValues });

        return { menuID, menuContainer, syncIcon, syncLabel, selectedValues };
    }


    //
    // Register menu_container_map.
    //
    RegisterMenuContainerMap(menuContainer) {
        const menuID = menuContainer.getAttribute(Menu.#dataMenuID);
        if (!menuID) return;
        this.#menuContainerMap.set(menuID, menuContainer);

        // Add pointerhover event listener on menu_container.
        menuContainer.addEventListener('pointerover', (event) => { this.#hoverOnMenuContainer(event, menuContainer) });

        // Add pointerdown event listener on menu_container.
        menuContainer.addEventListener('pointerdown', (event) => { this.#pointerdownOnMenuContainer(event, menuContainer) });

        // Add click event listener on menu_container.
        menuContainer.addEventListener('click', (event) => { this.#clickOnMenuContainer(event, menuContainer) });

        const input = menuContainer.querySelector('.menu__search-filter-input');
        if (input) {
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                }
            });
            input.addEventListener('input', (event) => { this.#handleSearchFilterInput(input, menuContainer) });
        }
    }


    //
    // Click on document.
    //
    #clickOnDocument(event) {
        const target = event.target;

        const menuTarget = target.closest?.(`[${Menu.#dataMenuTarget}]`);
        if (menuTarget) {
            this.RegisterMenuTargetMap(menuTarget);
            this.#clickOnMenuTarget(menuTarget);
        }

        if (!this.#isMenuOpen) return;

        const inOpenedMenu = this.#menuStack.some(x => x.menuContainer.contains(target));

        if (!inOpenedMenu && !menuTarget) {
            this.#closeFromDepth(0);
        }
    }


    //
    // Initialize manu_map.
    //
    #initManuMap() {
        // Collect menu_containers.
        const menuContainers = document.querySelectorAll(`.${this.#options.containerClass}`);
        for (let i = 0; i < menuContainers.length; i++) {
            this.RegisterMenuContainerMap(menuContainers[i]);
        }

        // Collect menu_targets.
        const menuTargetElms = document.querySelectorAll(`[${Menu.#dataMenuTarget}]`);
        for (let i = 0; i < menuTargetElms.length; i++) {
            this.RegisterMenuTargetMap(menuTargetElms[i]);
        }
    }


    //
    // Get depth for menu_container.
    //
    #getDepthForContainer(menuContainer) {
        for (let i = this.#menuStack.length - 1; i >= 0; i--) {
            if (this.#menuStack[i].menuContainer === menuContainer) {
                return i;
            }
        }
        return -1;
    }


    //
    // Get depth for menu_target.
    //
    #getDepthForTarget(menuTarget) {
        for (let i = this.#menuStack.length - 1; i >= 0; i--) {
            if (this.#menuStack[i].menuContainer.contains(menuTarget)) {
                return i + 1;
            }
        }
        return 0;
    }


    //
    // Open menu_container at given depth.
    //
    #openAtDepth(depth, menuTarget, menuID, menuContainer) {
        // Close same depth od menu_container.
        this.#closeFromDepth(depth);

        this.#isMenuOpen = true;
        this.#menuStack.push({ menuTarget, menuID, menuContainer });

        // Position menu_container.
        if (depth === 0) {
            this.#positionMenuContainer(menuTarget, menuContainer);
        } else {
            const parentMenuContainer = this.#menuStack[depth - 1]?.menuContainer;
            if (parentMenuContainer) {
                this.#positionSubMenuContainer(parentMenuContainer, menuTarget, menuContainer);
            }
        }

        // Toggle menu_container.
        requestAnimationFrame(() => {
            menuContainer.classList.add('menu__container--activated');
        });
    }    


    //
    // Close menu_containers from given depth.
    //
    #closeFromDepth(depth) {
        for (let i = this.#menuStack.length - 1; i >= depth; i--) {
            const { menuContainer } = this.#menuStack[i];
            if (!menuContainer) continue;
            menuContainer.classList.remove('menu__container--activated');
            this.#menuStack.pop();
        }
        if (this.#menuStack.length === 0) {
            this.#isMenuOpen = false;
        }
    }


    //
    // Handle menuTarget click.
    //
    #clickOnMenuTarget(menuTarget) {
        const { menuID, menuContainer } = this.#menuTargetMap.get(menuTarget);
        if (!menuID || !menuContainer) return;

        const depth = this.#getDepthForTarget(menuTarget);

        if (this.#menuStack[depth]?.menuTarget === menuTarget) {
            this.#closeFromDepth(depth);
            return;
        }

        this.#activatedMenuTarget = menuTarget;

        // Sync menuContainer select.
        this.#syncMenuContainerSelect(menuTarget);

        this.#openAtDepth(depth, menuTarget, menuID, menuContainer);
    }


    //
    // Sync menuContainer select.
    //
    #syncMenuContainerSelect(menuTarget) {
        const refs = this.#menuTargetMap.get(menuTarget);
        if (!refs) {
            return;
        }

        const { menuContainer, selectedValues = [] } = refs;
        if (!menuContainer) {
            return;
        }

        const isMultiple = menuContainer.dataset.menuSelectMode === 'multiple';

        const selectedValueSet = new Set(
            selectedValues.map(item => String(item?.value ?? '')).filter(Boolean)
        );

        const menuItems = menuContainer.querySelectorAll('.menu__item');
        let firstSelectedItem = null;

        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];
            const value = String(item.getAttribute('data-menu-item-value') ?? '');
            const isSelected = selectedValueSet.has(value);
 
            item.setAttribute('aria-selected', isSelected ? 'true' : 'false');
            item.setAttribute('tabindex', isSelected ? '0' : '-1');
        }
    }


    //
    // Pointerdown event on menu_container.
    //
    #pointerdownOnMenuContainer(event, menuContainer) {
        const item = event.target?.closest?.('.menu__item');
        if (!item) return;
        if (!menuContainer.contains(item)) return;
        if (item.hasAttribute('data-menu-target')) return;

        this.#spawnRipple(event, item);
    }


    //
    // Click event on menu_container.
    //
    #clickOnMenuContainer(event, menuContainer) {
        const item = event.target?.closest?.('.menu__item');
        if (!item || !menuContainer.contains(item)) {
            return;
        }

        this.#handleMenuItemAttributes(menuContainer, item);

        if (item.hasAttribute('data-menu-target')) return;

        // Handle activatedMenuTarget change.
        this.#handleActivatedMenuTargetChenge();

        // Not close if menuContainer is multiple select mode.
        if (menuContainer.dataset.menuSelectMode === 'multiple') return;

        // Close menu_container.
        setTimeout(() => {
            this.#closeFromDepth(0);
        }, 200);
    }


    //
    // Handle activatedMenuTarget change.
    //
    #handleActivatedMenuTargetChenge() {
        if (!this.#activatedMenuTarget) {
            return;
        }
        const refs = this.#menuTargetMap.get(this.#activatedMenuTarget);
        if (!refs) {
            return;
        }

        const { menuContainer, syncIcon, syncLabel } = refs;

        const item = menuContainer?.querySelector('.menu__item[aria-selected="true"]');
        if (!item) {
            return;
        }

        // Sync icon.
        if (syncIcon) {
            const copiedIcon = item.querySelector(':scope > .menu__item-icon')?.cloneNode(true);
            if (copiedIcon) {
                syncIcon.replaceChildren(...copiedIcon.childNodes);
            }
        }

        // Sync label.
        if (syncLabel) {
            const copiedLabel = item.querySelector(':scope > .menu__item-label')?.cloneNode(true);
            if (copiedLabel) {
                syncLabel.replaceChildren(...copiedLabel.childNodes);
            }
        }

        // Delegate menu-change event.
        const selectedValues = [];
        for (let i = 0; i < this.#menuStack.length; i++) {
            const currentMenuContainer = this.#menuStack[i]?.menuContainer;
            if (!currentMenuContainer) continue;

            const selectedItems = currentMenuContainer.querySelectorAll('.menu__item[aria-selected="true"]');
            for (let j = 0; j < selectedItems.length; j++) {
                const selectedItem = selectedItems[j];
                const value = selectedItem.getAttribute('data-menu-item-value') ?? null;
                const text = selectedItem.querySelector('.menu__item-label')?.textContent?.trim() ?? '';
                selectedValues.push({ text, value });
            }
        }
        refs.selectedValues = selectedValues;
        this.#activatedMenuTarget.dispatchEvent(new CustomEvent('menu-change', {
            bubbles: true,
            detail: selectedValues
        }));
    }


    //
    // Handle menu_item attributes.
    //
    #handleMenuItemAttributes(menuContainer, clickedMenuItem) {
        const isMultiple = menuContainer.dataset.menuSelectMode === 'multiple';

        if (isMultiple) {
            const isSelected = clickedMenuItem.getAttribute('aria-selected') === 'true';
            clickedMenuItem.setAttribute('aria-selected', isSelected ? 'false' : 'true');
            clickedMenuItem.setAttribute('tabindex', '0');
            return;
        }

        const menuItems = menuContainer.querySelectorAll('.menu__item');
        for (let i = 0; i < menuItems.length; i++) {
            const menuItem = menuItems[i];
            if (menuItem !== clickedMenuItem) {
                menuItem.setAttribute('tabindex', '-1');
                menuItem.setAttribute('aria-selected', 'false');
            }
        }

        clickedMenuItem.setAttribute('tabindex', '0');
        clickedMenuItem.setAttribute('aria-selected', 'true');
    }


    //
    // Spawn ripple.
    //
    #spawnRipple(event, menuItem) {
        const rect = menuItem.getBoundingClientRect();

        // Get the click position.
        const x = (event.clientX ?? (rect.left + rect.width / 2)) - rect.left;
        const y = (event.clientY ?? (rect.top + rect.height / 2)) - rect.top;

        const size = Math.max(rect.width, rect.height) * 2;
        const d = Math.hypot(rect.width, rect.height);

        const ripple = document.createElement('span');
        ripple.className = 'menu__ripple';
        menuItem.prepend(ripple);

        ripple.style.setProperty('--ripple-x', `${x}px`);
        ripple.style.setProperty('--ripple-y', `${y}px`);
        ripple.style.setProperty('--ripple-size', `${size}px`);

        ripple.addEventListener('animationend', () => {
            ripple.remove();
        }, { once: true });

        requestAnimationFrame(() => {
            ripple.classList.add('menu__ripple--animating');
        });
    }


    //
    // Hover event on menu_container.
    //
    #hoverOnMenuContainer(event, menuContainer) {
        clearTimeout(this.#menuContainerHoverTimer);
        this.#menuContainerHoverTimer = setTimeout(() => {
            if (!this.#isMenuOpen) return;

            const item = event.target?.closest?.('.menu__item');
            if (!item) return;
            if (!menuContainer.contains(item)) return;
 
            const depth = this.#getDepthForContainer(menuContainer);
            if (depth < 0) return;
 
            const menuID = item.getAttribute(Menu.#dataMenuTarget);
            if (menuID) {
                const childMenuContainer = this.#menuContainerMap.get(menuID);
                if (childMenuContainer.classList.contains('menu__container--activated')) return;
                this.#openAtDepth(depth + 1, item, menuID, childMenuContainer);
                this.#handleMenuItemAttributes(menuContainer, item);
            } else {
                this.#closeFromDepth(depth + 1);
            }
        }, 100);
    }


//    //
//    // Hover event on menu_target.
//    //
//    #hoverOnMenuTarget(menuTarget) {
//        clearTimeout(this.#menuTargetHoverTimer);
//        this.#menuTargetHoverTimer = setTimeout(() => {
//            if (!this.#isMenuOpen) return;
//
//            const { menuID, menuContainer } = this.#menuTargetMap.get(menuTarget);
//            if (!menuID || !menuContainer) return;
//
//            const depth = this.#getDepthForTarget(menuTarget);
//            if (this.#menuStack[depth]?.menuTarget === menuTarget) return;
//
//            this.#openAtDepth(depth, menuTarget, menuID, menuContainer);
//
//            if (!menuTarget.closest(`[${Menu.#dataMenuTarget}]`)) {
//                this.#activatedMenuTarget = menuTarget;
//            }
//        }, 100);
//    }


    //
    // Handle search_filter input.
    //
    #handleSearchFilterInput(input, menuContainer) {
        const keyword = input.value.trim().toLowerCase();

        const field = input.closest('.menu__search-filter-field');
        if (field) {
            field.classList.toggle('menu__search-filter-field--activated', keyword !== '');
        }

        let empty = true;
        const menuItems = menuContainer.querySelectorAll('.menu__item');
        for (let i = 0; i < menuItems.length; i++) {
            const item = menuItems[i];

            const label = item.querySelector('.menu__item-label')?.textContent?.trim().toLowerCase() ?? '';
            const matched = keyword === '' || label.includes(keyword);

            item.hidden = !matched;
        }

        const menuLists = menuContainer.querySelectorAll('.menu__list');
        for (let i = 0; i < menuLists.length; i++) {
            const list = menuLists[i];

            const l = list.querySelectorAll('.menu__item:not([hidden])').length;
            list.classList.toggle('menu__list--empty', l === 0);
        }

        const emptyLabel = menuContainer.querySelector('.menu__search-filter-empty-label');
        if (emptyLabel) {
            const l = menuContainer.querySelectorAll('.menu__item:not([hidden])').length;
            emptyLabel.classList.toggle('menu__search-filter-empty-label--activated', l === 0);
        }
    }


    //
    // Handle document key down.
    //
    #handleDocumentKeyDown(event) {
        if (event.key === 'Escape') {
            this.#closeFromDepth(0);
            return;
        }

        const menuContainer = event.target?.closest?.('.menu__container');
        if (!menuContainer || !menuContainer.classList.contains('menu__container--activated') || !this.#isMenuOpen) {
            return;
        }

        this.#handleMenuContainerKeyDown(event, menuContainer);
    }


    //
    // Handle menuContainer key down.
    //
    #handleMenuContainerKeyDown(event, menuContainer) {
        const items = [...menuContainer.querySelectorAll('.menu__item:not([hidden])')];
        if (items.length === 0) {
            return;
        }

        const activeItem = menuContainer.querySelector('.menu__item[tabindex="0"]:not([hidden])') || items[0];
        let currentIndex = items.indexOf(activeItem);
        if (currentIndex < 0) {
            currentIndex = 0;
        }

        let nextIndex = currentIndex;

        switch (event.key) {
        case 'ArrowDown':
             event.preventDefault();
             nextIndex = Math.min(currentIndex + 1, items.length - 1);
             break;
        case 'ArrowUp':
            event.preventDefault();
            nextIndex = Math.max(currentIndex - 1, 0);
            break;
        case 'Enter':
            event.preventDefault();
            const item = items[currentIndex];
            if (!item) {
                return;
            }
            this.#pointerdownOnMenuContainer(event, menuContainer);
            this.#clickOnMenuContainer(event, menuContainer);
            return;
        default:
            return;
        }

        const nextItem = items[nextIndex];
        if (!nextItem) return;
 
        for (let i = 0; i < items.length; i++) {
            items[i].setAttribute('tabindex', '-1');
        }
 
        nextItem.setAttribute('tabindex', '0');
        nextItem.focus();
    }

    //
    // Position menu_container.
    //
    #positionMenuContainer(menuTarget, menuContainer) {
        // Get menu_container size.
        const cw = menuContainer.offsetWidth;
        const ch = menuContainer.offsetHeight;

        // Get window size.
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Set the position below menu_target as default.
        const rect = menuTarget.getBoundingClientRect();
        const gap = 4;
        let left = rect.left;
        let top = rect.bottom + gap;
        let width = rect.width;

        // Flip vertically if needed.
        let flipped = false;
        if (top + ch > vh - gap) {
            top = rect.top - ch - gap;
            flipped = true;
        }
        if (top < gap) {
            top = gap;
        }
        menuContainer.classList.toggle('menu__container--to-top', flipped);

        // Clamp horizontally.
        if (left + cw > vw - gap) {
            left = vw - cw - gap;
        }
        if (top < gap) {
            top = gap;
        }

        // Position menu_container.
        menuContainer.style.left = `${Math.round(left)}px`;
        menuContainer.style.top = `${Math.round(top)}px`;
        menuContainer.style.minWidth = `${Math.round(width)}px`;
    }


    //
    // Positioning for sub menu.
    //
    #positionSubMenuContainer(parentMenuContainer, menuTarget, menuContainer) {
        // Get parent_menu_container / menu_container size.
        const pr = parentMenuContainer.getBoundingClientRect();
        const cw = menuContainer.offsetWidth;
        const ch = menuContainer.offsetHeight;

        // Get window size.
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Set the position below menu_target as default.
        const tr = menuTarget.getBoundingClientRect();
        const gap = 4;
        let left = pr.right + gap;
        let top  = tr.top;

        // Flip left if overflow
        let flipped = false;
        if (left + cw > vw - gap) {
            left = pr.left - cw - gap;
            flipped = true;
        }
        if (left < gap) {
            left = gap;
        }
        if (flipped) {
            menuContainer.classList.remove('menu__container--to-right');
            menuContainer.classList.add('menu__container--to-left');
        } else {
            menuContainer.classList.remove('menu__container--to-left');
            menuContainer.classList.add('menu__container--to-right');
        }
   
        // Clamp vertically
        if (top + ch > vh - gap) {
            top = vh - ch - gap;
        }
        if (top < gap) {
            top = gap;
        }

        // Position menu_container.
        menuContainer.style.left = `${Math.round(left)}px`;
        menuContainer.style.top  = `${Math.round(top)}px`;
    }

}


//export { Menu }
