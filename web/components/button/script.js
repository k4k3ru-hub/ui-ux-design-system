//
// script.js
//


//
// Class.
//
class Button {

    static #DefaultButtonClass = 'button';
    static #initialized = new WeakSet();

    //
    // Constructor.
    //
    constructor(options = null) {
        // Options
        this.options = {
            class: Button.#DefaultButtonClass,
            ...options,
        };
    }


    //
    // Run.
    //
    Run() {
        const buttons = document.querySelectorAll(`.${this.options.class}`);

        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];

            if (Button.#initialized.has(btn)) {
                continue;
            }
            Button.#initialized.add(btn);

            const style = window.getComputedStyle(btn);
            if (style.position === 'static') {
                btn.style.position = 'relative';
            }
            if (style.overflow === 'visible') {
                btn.style.overflow = 'hidden';
            }

            btn.addEventListener('click', this.#onClick);
        }
    }


    //
    // Click event on the button.
    //
    #onClick(event) {
        const btn = event.currentTarget;
        if (!btn) {
            return;
        }

        const rect = btn.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.max(rect.width, rect.height) * 2;

        const ripple = document.createElement('span');
        ripple.classList.add('button__ripple');
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x - size / 2}px`;
        ripple.style.top = `${y - size / 2}px`;

        btn.appendChild(ripple);

        requestAnimationFrame(() => {
            ripple.classList.add('button__ripple--animating');
        });

        ripple.addEventListener('transitionend', () => {
            ripple.remove();
        });
    }

}

export { Button }
