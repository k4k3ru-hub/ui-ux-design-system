// script.js
var Toaster = class _Toaster {
  static classNameContainer = "toaster";
  static classNameItem = "toast";
  static optionKeyActionHtml = "actionHtml";
  static optionKeyIconHtml = "iconHtml";
  static optionKeyInline = "inline";
  static optionKeyMessageHtml = "messageHtml";
  static optionKeyPosition = "position";
  static optionKeyShowDuration = "showDuration";
  static optionValPositionBottomCenter = "bottom-center";
  static optionValPositionBottomRight = "bottom-right";
  static optionValPositionTopRight = "top-right";
  static optionValPositionTopCenter = "top-center";
  static optionValShowDuration = 5e3;
  static typeClose = "close";
  static typeError = "error";
  static typeInfo = "info";
  static typeSuccess = "success";
  static typeWarning = "warning";
  //
  // Toast for error.
  //
  static Error(title, option = null) {
    _Toaster.Toast(_Toaster.typeError, title, option);
  }
  //
  // Toast for information.
  //
  static Info(title, option = null) {
    _Toaster.Toast(_Toaster.typeInfo, title, option);
  }
  //
  // Toast for successful.
  //
  static Success(title, option = null) {
    _Toaster.Toast(_Toaster.typeSuccess, title, option);
  }
  //
  // Toast for warning.
  //
  static Warning(title, option = null) {
    _Toaster.Toast(_Toaster.typeWarning, title, option);
  }
  //
  // Toast a notification.
  //
  static Toast(type, title, option = null) {
    const container = _Toaster.generateContainer(option);
    const toastElm = document.createElement("DIV");
    toastElm.classList.add(_Toaster.classNameItem);
    toastElm.classList.add(type);
    const typeBox = document.createElement("DIV");
    typeBox.classList.add("type");
    toastElm.appendChild(typeBox);
    if (option === null || !option.hasOwnProperty(_Toaster.optionKeyIconHtml)) {
      typeBox.insertAdjacentElement("afterbegin", _Toaster.generateIconHtml(type));
    } else {
      typeBox.insertAdjacentHTML("afterbegin", option[_Toaster.optionKeyIconHtml]);
    }
    const contentBox = document.createElement("DIV");
    contentBox.classList.add("content");
    toastElm.appendChild(contentBox);
    const titleElm = document.createElement("P");
    titleElm.classList.add("title");
    titleElm.textContent = title;
    contentBox.appendChild(titleElm);
    if (option !== null && option.hasOwnProperty(_Toaster.optionKeyMessageHtml)) {
      const message = document.createElement("P");
      message.classList.add("message");
      message.insertAdjacentHTML("afterbegin", option[_Toaster.optionKeyMessageHtml]);
      contentBox.appendChild(message);
    }
    if (option !== null && option.hasOwnProperty(_Toaster.optionKeyActionHtml)) {
      const action = document.createElement("P");
      action.classList.add("action");
      action.insertAdjacentHTML("afterbegin", option[_Toaster.optionKeyActionHtml]);
      contentBox.appendChild(action);
    }
    const closeBox = document.createElement("DIV");
    closeBox.classList.add("close");
    toastElm.appendChild(closeBox);
    const closeIconElm = _Toaster.generateIconHtml(_Toaster.typeClose);
    closeBox.appendChild(closeIconElm);
    container.appendChild(toastElm);
    closeIconElm.addEventListener("click", () => {
      _Toaster.fadeOut(toastElm);
    });
    if (option !== null && option.hasOwnProperty(_Toaster.optionKeyInline) && option[_Toaster.optionKeyInline]) {
      toastElm.classList.add("inline");
    }
    toastElm.addEventListener("mouseover", (event) => {
      toastElm.isSkipShowDuration = true;
    });
    toastElm.addEventListener("mouseleave", (event) => {
      toastElm.isSkipShowDuration = false;
    });
    let progressBarElm;
    let isprogressBar = false;
    if (option === null || !option.hasOwnProperty(_Toaster.optionKeyShowDuration) || option[_Toaster.optionKeyShowDuration]) {
      progressBarElm = document.createElement("DIV");
      progressBarElm.classList.add("progress-bar");
      toastElm.appendChild(progressBarElm);
      isprogressBar = true;
    }
    let progressBarWidth = 100;
    let showDuration = _Toaster.optionValShowDuration;
    if (option !== null && option.hasOwnProperty(_Toaster.optionKeyShowDuration) && !isNaN(parseInt(option[_Toaster.optionKeyShowDuration]))) {
      showDuration = parseInt(option[_Toaster.optionKeyShowDuration]);
    }
    let progressWidth = progressBarWidth / (showDuration / 10);
    let progressBarId = setInterval(() => {
      if (progressBarWidth <= 0) {
        clearInterval(progressBarId);
        _Toaster.fadeOut(toastElm);
      } else {
        if (!toastElm.isSkipShowDuration) {
          progressBarWidth = progressBarWidth - progressWidth;
          if (isprogressBar) {
            progressBarElm.style.width = `${progressBarWidth}%`;
          }
        }
      }
    }, 10);
  }
  //
  // Generate a conteiner.
  //
  static generateContainer(option = null) {
    let position = _Toaster.optionValPositionTopRight;
    if (option !== null && option.hasOwnProperty(_Toaster.optionKeyPosition)) {
      if (option[_Toaster.optionKeyPosition] === _Toaster.optionValPositionBottomCenter) {
        position = _Toaster.optionValPositionBottomCenter;
      } else if (option[_Toaster.optionKeyPosition] === _Toaster.optionValPositionBottomRight) {
        position = _Toaster.optionValPositionBottomRight;
      } else if (option[_Toaster.optionKeyPosition] === _Toaster.optionValPositionTopCenter) {
        position = _Toaster.optionValPositionTopCenter;
      }
    }
    let container = document.querySelector(`body > .${_Toaster.classNameContainer}`);
    if (container === null) {
      container = document.createElement("DIV");
      container.classList.add(_Toaster.classNameContainer);
      document.body.appendChild(container);
    }
    container.classList.remove(_Toaster.optionValPositionTopRight);
    container.classList.remove(_Toaster.optionValPositionTopCenter);
    container.classList.remove(_Toaster.optionValPositionBottomCenter);
    container.classList.remove(_Toaster.optionValPositionBottomRight);
    container.classList.add(position);
    return container;
  }
  //
  // Generate an icon HTML.
  //
  static generateIconHtml(type) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("height", "24");
    svg.setAttribute("width", "24");
    svg.setAttribute("viewBox", "0 -960 960 960");
    svg.classList.add("icon");
    if (type === _Toaster.typeClose) {
      svg.insertAdjacentHTML("afterbegin", '<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>');
    } else if (type === _Toaster.typeError) {
      svg.insertAdjacentHTML("afterbegin", '<path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>');
    } else if (type === _Toaster.typeInfo) {
      svg.insertAdjacentHTML("afterbegin", '<path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/>');
    } else if (type === _Toaster.typeSuccess) {
      svg.insertAdjacentHTML("afterbegin", '<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>');
    } else if (type === _Toaster.typeWarning) {
      svg.insertAdjacentHTML("afterbegin", '<path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/>');
    } else {
      svg.insertAdjacentHTML("afterbegin", '<path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>');
    }
    return svg;
  }
  //
  // Fade out the toast.
  //
  static fadeOut(toastElm) {
    const step = 0.05;
    toastElm.style.opacity = 1;
    let closeId = setInterval(() => {
      const current = parseFloat(toastElm.style.opacity || "1");
      if (current <= 0) {
        clearInterval(closeId);
        toastElm.remove();
        return;
      }
      toastElm.style.opacity = String(current - step);
    }, 10);
  }
};
export {
  Toaster
};
//# sourceMappingURL=script.mjs.map
