//
// script.js
//


//
// Class.
//
class Tab {

    static #DefaultTabContainerClass = 'tab__container';
    static #DefaultTabClass = 'tab';
    static #DefaultTabPanelsClass = 'tab__panels';
    static #DefaultTabPanelClass = 'tab__panel';
    static #initialized = new WeakSet();

    //
    // Constructor.
    //
    constructor(options = null) {
        // Options
        this.options = {
            tabContainerClass: Tab.#DefaultTabContainerClass,
            tabClass: Tab.#DefaultTabClass,
            tabPanelsClass: Tab.#DefaultTabPanelsClass,
            tabPanelClass: Tab.#DefaultTabPanelClass,
            ...options,
        };
    }


    //
    // Run.
    //
    Run() {
        const tabs = document.querySelectorAll(`.${this.options.tabContainerClass} .${this.options.tabClass}`);

        for (let i = 0; i < tabs.length; i++) {
            const tab = tabs[i];

            if (Tab.#initialized.has(tab)) {
                continue;
            }
            Tab.#initialized.add(tab);

            const style = window.getComputedStyle(tab);

            tab.addEventListener('click', (event) => { this.#onClick(event) });
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

        // Activate the tab.
        this.#activateTab(tab);

        let rippleLayer = tab.querySelector('.tab__ripple');
        if (!rippleLayer) {
            rippleLayer = document.createElement('span');
            rippleLayer.className = 'tab__ripple';
            tab.prepend(rippleLayer);
        }

        const rect = tab.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;
 
        rippleLayer.style.setProperty('--ripple-x', `${x}px`);
        rippleLayer.style.setProperty('--ripple-y', `${y}px`);
        rippleLayer.style.setProperty('--ripple-size', `${size}px`);
 
        rippleLayer.classList.remove('tab__ripple--animating');
        requestAnimationFrame(() => {
            rippleLayer.classList.add('tab__ripple--animating');
        });
    }


    //
    // Activate the tab button and related panel.
    //
    #activateTab(tab) {
        // Find the tab container scope.
        const container = tab.closest(`.${this.options.tabContainerClass}`) ?? document;

        // Collect tabs in the same container.
        const tabs = container.querySelectorAll(`.${this.options.tabClass}`);

        // Target panel id from data-tab-target.
        const targetId = tab.getAttribute('data-tab-target');

        // Update tab states (aria-selected, tabindex)
        for (let i = 0; i < tabs.length; i++) {
            const t = tabs[i];
            const isActive = t === tab;

            t.setAttribute('aria-selected', isActive ? 'true' : 'false');
            t.setAttribute('tabindex', isActive ? '0' : '-1');
        }

        // Focus active tab (optional but generally expected for tabs)
        tab.focus({ preventScroll: true });

        // If panels exist, switch them as well.
        if (targetId && targetId.trim() !== '') {
            // Panels are often next to the container; search in a reasonable scope.
            // 1) Prefer same parent (common pattern)
            // 2) Fallback to document
            const parentScope = container.parentElement ?? document;

            const panelsRoot =
                parentScope.querySelector(`.${this.options.tabPanelsClass}`) ??
                document.querySelector(`.${this.options.tabPanelsClass}`) ??
                parentScope;

            const panels = panelsRoot.querySelectorAll(`.${this.options.tabPanelClass}`);
            if (panels && panels.length > 0) {
                for (let i = 0; i < panels.length; i++) {
                    const p = panels[i];
                    const pid = p.getAttribute('data-tab-id');
                    const isActivePanel = pid === targetId;

                    if (isActivePanel) {
                        p.removeAttribute('hidden');
                    } else {
                        p.setAttribute('hidden', '');
                    }

                    const fadeEnabled = panelsRoot.classList.contains('tab__panels--fade');
                    if (fadeEnabled) {
                        if (isActivePanel) {
                            p.classList.add('tab__panel--fade-in');
                            requestAnimationFrame(() => {
                                p.classList.remove('tab__panel--fade-in');
                            });
                        }
                    }
                }
            }
        }
    }

}

export { Tab }
