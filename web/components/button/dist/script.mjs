// script.js
var Button = class _Button {
  static #DefaultButtonClass = "button";
  static #initialized = /* @__PURE__ */ new WeakSet();
  //
  // Constructor.
  //
  constructor(options = null) {
    this.options = {
      class: _Button.#DefaultButtonClass,
      ...options
    };
  }
  //
  // Run.
  //
  Run() {
    const buttons = document.querySelectorAll(`.${this.options.class}`);
    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      if (_Button.#initialized.has(btn)) {
        continue;
      }
      _Button.#initialized.add(btn);
      const style = window.getComputedStyle(btn);
      if (style.position === "static") {
        btn.style.position = "relative";
      }
      if (style.overflow === "visible") {
        btn.style.overflow = "hidden";
      }
      btn.addEventListener("click", this.#onClick);
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
    const ripple = document.createElement("span");
    ripple.classList.add("button__ripple");
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    btn.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.classList.add("button__ripple--animating");
    });
    ripple.addEventListener("transitionend", () => {
      ripple.remove();
    });
  }
};
export {
  Button
};
//# sourceMappingURL=script.mjs.map
