export interface ButtonOptions {
    className?: string;
    document?: Document;
}

export class Button {
  static readonly defaultButtonClass = 'button';

  readonly #className: string;
  readonly #document: Document;
  #isRunning = false;

  constructor(options: ButtonOptions = {}) {
    this.#className = options.className ?? Button.defaultButtonClass;
    this.#document = options.document ?? document;
  }

  /** Start handling button interactions in the configured document. */
  run(): void {
    if (this.#isRunning) return;

    this.#document.addEventListener('pointerdown', this.#handlePointerDown);
    this.#isRunning = true;
  }

  /** Remove event listeners registered by run(). */
  destroy(): void {
    if (!this.#isRunning) return;

    this.#document.removeEventListener('pointerdown', this.#handlePointerDown);
    this.#isRunning = false;
  }

  readonly #handlePointerDown = (event: PointerEvent): void => {
    const view = this.#document.defaultView;
    if (!view || event.button !== 0 || !(event.target instanceof view.Element)) return;

    const button = event.target.closest<HTMLElement>(`.${this.#className}`);
    if (!button || this.#isDisabled(button) || this.#prefersReducedMotion()) return;

    this.#spawnRipple(event, button, view);
  };

  #isDisabled(button: HTMLElement): boolean {
    return button.matches(':disabled, [aria-disabled="true"]');
  }

  #prefersReducedMotion(): boolean {
    return this.#document.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  }

  #spawnRipple(event: PointerEvent, button: HTMLElement, view: Window): void {
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
