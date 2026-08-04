export class Button {
    static defaultButtonClass = 'button';
    #className;
    #document;
    #isRunning = false;
    constructor(options = {}) {
        this.#className = options.className ?? Button.defaultButtonClass;
        this.#document = options.document ?? document;
    }
    /** Start handling button interactions in the configured document. */
    run() {
        if (this.#isRunning)
            return;
        this.#document.addEventListener('pointerdown', this.#handlePointerDown);
        this.#isRunning = true;
    }
    /** Remove event listeners registered by run(). */
    destroy() {
        if (!this.#isRunning)
            return;
        this.#document.removeEventListener('pointerdown', this.#handlePointerDown);
        this.#isRunning = false;
    }
    #handlePointerDown = (event) => {
        const view = this.#document.defaultView;
        if (!view || event.button !== 0 || !(event.target instanceof view.Element))
            return;
        const button = event.target.closest(`.${this.#className}`);
        if (!button || this.#isDisabled(button) || this.#prefersReducedMotion())
            return;
        this.#spawnRipple(event, button, view);
    };
    #isDisabled(button) {
        return button.matches(':disabled, [aria-disabled="true"]');
    }
    #prefersReducedMotion() {
        return this.#document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
    }
    #spawnRipple(event, button, view) {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const size = Math.hypot(rect.width, rect.height) * 2;
        button.querySelectorAll(':scope > .button__ripple').forEach((ripple) => ripple.remove());
        const ripple = this.#document.createElement('span');
        ripple.className = 'button__ripple';
        ripple.setAttribute('aria-hidden', 'true');
        ripple.style.setProperty('--ripple-x', `${x}px`);
        ripple.style.setProperty('--ripple-y', `${y}px`);
        ripple.style.setProperty('--ripple-size', `${size}px`);
        button.prepend(ripple);
        const cleanupTimer = view.setTimeout(() => ripple.remove(), 600);
        ripple.addEventListener('animationend', () => {
            view.clearTimeout(cleanupTimer);
            ripple.remove();
        }, { once: true });
        view.requestAnimationFrame(() => ripple.classList.add('button__ripple--animating'));
    }
}
//# sourceMappingURL=script.js.map