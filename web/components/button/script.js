//
// script.js
//


//
// Class.
//
class Button {

    static #defaultButtonClass = 'button';

    #options = {};
    #didBindOnDocument = false;

    //
    // Constructor.
    //
    constructor(options = null) {
        // Options
        this.#options = {
            class: Button.#defaultButtonClass,
            ...options,
        };
    }


    //
    // Run.
    //
    Run() {
        if (this.#didBindOnDocument) return;
        this.#didBindOnDocument = true;

        // Add pointerdown event listener on document.
        document.addEventListener('pointerdown', (event) => { this.#handleButtonClick(event) });
    }


    #handleButtonClick(event) {
        const btn = event?.target.closest?.(`.${this.#options.class}`) ?? null;
        if (!btn) return;

        this.#spawnRipple(event, btn);
    }


    #spawnRipple(event, btn) {
        const rect = btn.getBoundingClientRect();
    
        // Get the click position.
        const x = (event.clientX ?? (rect.left + rect.width / 2)) - rect.left;
        const y = (event.clientY ?? (rect.top + rect.height / 2)) - rect.top;

        const size = Math.max(rect.width, rect.height) * 2;
        const d = Math.hypot(rect.width, rect.height);
        
        const ripple = document.createElement('span');
        ripple.className = 'button__ripple';
        btn.prepend(ripple);
            
        ripple.style.setProperty('--ripple-x', `${x}px`);
        ripple.style.setProperty('--ripple-y', `${y}px`);
        ripple.style.setProperty('--ripple-size', `${size}px`);
                
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        }, { once: true });

        requestAnimationFrame(() => {
            ripple.classList.add('button__ripple--animating');
        });
    }

}

//export { Button }
