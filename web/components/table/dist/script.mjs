// script.js
var Table = class _Table {
  static classTable = "table";
  static classTableCell = "table__cell";
  static classTableCellChanged = "table__cell--changed";
  static classTableCellWarning = "table__cell--warning";
  static classTableContainer = "table__container";
  static classTableContainerScroll = "table__container--scroll";
  static classTableInnerCell = "table__inner-cell";
  static classTableRow = "table__row";
  static classTableRowNested = "table__row--nested";
  static dataTableEditable = "data-table-editable";
  static dataTableCellEditable = "data-table-cell-editable";
  static dataTableCellEditableOptions = "data-table-cell-editable-options";
  static dataTableCellEditableStep = "data-table-cell-editable-step";
  static initialEditableTableCellMap;
  //
  // Run
  //
  static Run() {
    const tables = document.getElementsByClassName(_Table.classTable);
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      _Table.setWidthNestedTableScrollableContainer(table);
      _Table.addObserverToMonitorTableEditable(table);
    }
  }
  //
  // Add a MutationObserver to monitor changes to the 'data-table-editable' attribute of the table.
  //
  static addObserverToMonitorTableEditable(table) {
    const observer = new MutationObserver((mutations) => {
      for (let j = 0; j < mutations.length; j++) {
        const mutation = mutations[j];
        if (mutation.type !== "attributes" || mutation.attributeName !== _Table.dataTableEditable) {
          continue;
        }
        if (table.hasAttribute(_Table.dataTableEditable)) {
          _Table.startEditingTable(table);
        } else {
          _Table.endEditingTable(table);
        }
      }
    });
    observer.observe(table, {
      attributes: true,
      attributeFilter: [_Table.dataTableEditable]
    });
  }
  //
  // End editing table.
  //
  static endEditingTable(table) {
    const updatedData = {
      table,
      rows: []
    };
    const rows = table.getElementsByClassName(_Table.classTableRow);
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const updatedRowData = {
        row,
        cells: []
      };
      updatedData.rows.push(updatedRowData);
      const cells = row.getElementsByClassName(_Table.classTableCell);
      for (let j = 0; j < cells.length; j++) {
        const cell = cells[j];
        const editableElm = cell.hasAttribute(_Table.dataTableCellEditable) ? cell : cell.querySelector(`[${_Table.dataTableCellEditable}]`);
        if (!editableElm) {
          continue;
        }
        const editType = editableElm.getAttribute(_Table.dataTableCellEditable);
        if (!editType) {
          continue;
        }
        let newValue = "";
        let newEditableElmTextContent = "";
        let input;
        if (["select", "custom-select"].includes(editType)) {
          input = cell.querySelector("select");
          newValue = input.value;
          newEditableElmTextContent = input.options[input.selectedIndex]?.textContent || "";
        } else {
          input = cell.querySelector("input");
          newValue = input.value.trim();
          newEditableElmTextContent = newValue;
        }
        const initialValue = _Table.initialEditableTableCellMap.get(editableElm);
        if (newValue !== initialValue) {
          updatedRowData.cells.push({
            cell,
            value: newValue
          });
        }
        editableElm.replaceChildren();
        editableElm.textContent = newEditableElmTextContent;
        _Table.toggleTableCellChanged(cell, false);
      }
    }
    updatedData.rows = updatedData.rows.filter((row) => row.cells.length > 0);
    const customEvent = new CustomEvent("update", {
      detail: updatedData
    });
    table.dispatchEvent(customEvent);
  }
  //
  // Start editing table.
  //
  // Workflow:
  // 1. Initialize an initial table cell map.
  //
  static startEditingTable(table) {
    _Table.initialEditableTableCellMap = /* @__PURE__ */ new WeakMap();
    const editableTableCells = table.querySelectorAll(`[${_Table.dataTableCellEditable}]`);
    for (let i = 0; i < editableTableCells.length; i++) {
      const cell = editableTableCells[i];
      const editType = cell.getAttribute(_Table.dataTableCellEditable);
      if (!editType) {
        continue;
      }
      const initialTextContent = cell.textContent.trim();
      if (["custom-text", "custom-number", "custom-select"].includes(editType)) {
        _Table.dispatchAppendToTableCellEventOnTable(table, cell, editType);
        if (editType === "custom-select") {
          const options = cell.getElementsByTagName("option");
          for (let j = 0; j < options.length; j++) {
            const option = options[j];
            if (option.textContent === initialTextContent) {
              option.selected = true;
              _Table.initialEditableTableCellMap.set(cell, option.value);
              break;
            }
          }
        } else {
          _Table.initialEditableTableCellMap.set(cell, initialTextContent);
        }
      } else if (["text", "select"].includes(editType)) {
        const f = document.createDocumentFragment();
        if (editType === "text") {
          const input2 = document.createElement("input");
          input2.classList.add("table__input-cell");
          input2.type = "text";
          input2.value = initialTextContent;
          f.appendChild(input2);
          _Table.initialEditableTableCellMap.set(cell, initialTextContent);
        } else if (editType === "select") {
          const options = _Table.getOptionsForTableCell(cell);
          if (options.length === 0) {
            continue;
          }
          const select = document.createElement("select");
          select.classList.add("table__select-cell");
          for (let j = 0; j < options.length; j++) {
            const { value, text } = options[j];
            const option = document.createElement("option");
            option.value = value;
            option.textContent = text;
            if (text === initialTextContent) {
              option.selected = true;
              _Table.initialEditableTableCellMap.set(cell, value);
            }
            select.appendChild(option);
          }
          f.appendChild(select);
        }
        cell.textContent = "";
        cell.appendChild(f);
      } else {
        continue;
      }
      let input = cell.querySelector("input") || cell.querySelector("select");
      input.addEventListener("change", (event) => {
        const initialValue = _Table.initialEditableTableCellMap.get(cell);
        _Table.toggleTableCellChanged(cell, initialValue !== input.value);
      });
    }
  }
  //
  // Toggle the 'table__cell--changed' class on the 'table__cell' element.
  //
  // Arguments:
  // - editableTableCell: Element: It could be TD element but it might not be.
  // - isChanged: bool: The flag whether the editable table cell is changed or not.
  //
  static toggleTableCellChanged(editableTableCell, isChanged) {
    const tableCell = editableTableCell.classList.contains(_Table.classTableCell) ? editableTableCell : editableTableCell.closest(`.${_Table.classTableCell}`);
    if (!tableCell) {
      return;
    }
    if (isChanged) {
      tableCell.classList.add(_Table.classTableCellChanged);
    } else {
      tableCell.classList.remove(_Table.classTableCellChanged);
    }
  }
  //
  // Get options for the table cell with 'data-table-cell-editable-options' attribute.
  //
  // Return:
  // - [{ value, text }, {...}, ...]:
  //   - value: It's supposed to be value attribute of option element.
  //   - text: It's supposed to be text content of option element. If the text doesn't exist, it would be value instead.
  //
  static getOptionsForTableCell(tableCell) {
    const options = [];
    if (!tableCell.hasAttribute(_Table.dataTableCellEditableOptions)) {
      return options;
    }
    const editableOptions = tableCell.getAttribute(_Table.dataTableCellEditableOptions).split(",");
    for (let i = 0; i < editableOptions.length; i++) {
      const editableOption = editableOptions[i];
      const option = { value: "", text: "" };
      if (editableOption.includes(":")) {
        const [value, text] = editableOption.trim().split(":");
        options.push({ value: value.trim(), text: text.trim() });
      } else {
        options.push({ value: editableOption.trim(), text: editableOption.trim() });
      }
    }
    return options;
  }
  //
  // Dispatch a custom append into table cell event on the table.
  //
  static dispatchAppendToTableCellEventOnTable(table, tableCell, customType) {
    const detail = {
      table,
      tableCell,
      customType
    };
    const customEvent = new CustomEvent("append-custom-editable-cell", {
      detail
    });
    if (customType === "custom-number") {
      detail.step = tableCell.getAttribute(_Table.dataTableCellEditableStep);
    }
    if (customType === "custom-select") {
      detail.options = _Table.getOptionsForTableCell(tableCell);
    }
    table.dispatchEvent(customEvent);
  }
  //
  // Set width of nested table scrollable container.
  // 
  static setWidthNestedTableScrollableContainer(table) {
    const tableScrollableContainer = table.closest(`.${_Table.classTableRowNested}`)?.querySelector(`.${_Table.classTableContainerScroll}`) || null;
    if (!tableScrollableContainer) {
      return;
    }
    const parentTableContainerRect = tableScrollableContainer.parentElement.closest(`.${_Table.classTableContainer}`)?.getBoundingClientRect() || null;
    if (!parentTableContainerRect) {
      return;
    }
    const marginLeft = parseFloat(window.getComputedStyle(tableScrollableContainer).marginLeft);
    tableScrollableContainer.style.width = `${parentTableContainerRect.width - marginLeft}px`;
    let timeoutId;
    window.addEventListener("resize", () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        _Table.setWidthNestedTableScrollableContainer(table);
      }, 300);
    });
  }
};
export {
  Table
};
//# sourceMappingURL=script.mjs.map
