//
// table.js
//


//
// Class
//
class Table {

    static classTable = 'table';
    static classTableCell = 'table__cell';
    static classTableCellChanged = 'table__cell--changed';
    static classTableCellWarning = 'table__cell--warning';
    static classTableContainer = 'table__container';
    static classTableContainerScroll = 'table__container--scroll';
    static classTableInnerCell = 'table__inner-cell';
    static classTableRow = 'table__row';
    static classTableRowNested = 'table__row--nested';
    static dataTableEditable = 'data-table-editable';
    static dataTableCellEditable = 'data-table-cell-editable';
    static dataTableCellEditableOptions = 'data-table-cell-editable-options';
    static dataTableCellEditableStep = 'data-table-cell-editable-step';


    static initialEditableTableCellMap;

    //
    // Run
    //
    static Run() {
        // Get table elements by class name.
        const tables = document.getElementsByClassName(Table.classTable);
        for(let i = 0; i < tables.length; i++) {
            const table = tables[i];

            // Set width of nested table.
            Table.setWidthNestedTableScrollableContainer(table);

            // Add a MutationObserver to monitor changes to the 'data-table-editable' attribute of the table.
            Table.addObserverToMonitorTableEditable(table);
        }
    }


    //
    // Add a MutationObserver to monitor changes to the 'data-table-editable' attribute of the table.
    //
    static addObserverToMonitorTableEditable(table) {
        const observer = new MutationObserver((mutations) => {
            for(let j = 0; j < mutations.length; j++) {
                const mutation = mutations[j];
                if(mutation.type !== 'attributes' || mutation.attributeName !== Table.dataTableEditable) {
                    continue;
                }
                if(table.hasAttribute(Table.dataTableEditable)) {
                    Table.startEditingTable(table);
                } else {
                    Table.endEditingTable(table);
                }
            }
        });
        observer.observe(table, {
            attributes: true,
            attributeFilter: [Table.dataTableEditable],
        });
    }


    //
    // End editing table.
    //
    static endEditingTable(table) {
        // Initialize a updated data.
        const updatedData = {
            table,
            rows: []
        }

        // Get the table row elements.
        const rows = table.getElementsByClassName(Table.classTableRow);
        for(let i = 0; i < rows.length; i++) {
            const row = rows[i];

            const updatedRowData = {
                row,
                cells: []
            }
            updatedData.rows.push(updatedRowData);

            // Get the table cell elements.
            const cells = row.getElementsByClassName(Table.classTableCell);
            for(let j = 0; j < cells.length; j++) {
                const cell = cells[j];

                // Skip the process if the table cell doesn't have the 'data-table-cell-editable' attribute.
                const editableElm = cell.hasAttribute(Table.dataTableCellEditable) ? cell : cell.querySelector(`[${Table.dataTableCellEditable}]`);
                if(!editableElm) {
                    continue;
                }

                // Get the edit type by 'data-table-cell-editable' attribute.
                const editType = editableElm.getAttribute(Table.dataTableCellEditable);
                if(!editType) {
                    continue;
                }

                // Get the input / select element.
                let newValue = '';
                let newEditableElmTextContent = '';
                let input;
                if(['select', 'custom-select'].includes(editType)) {
                    input = cell.querySelector('select');
                    newValue = input.value;
                    newEditableElmTextContent = input.options[input.selectedIndex]?.textContent || '';
                } else {
                    input = cell.querySelector('input');
                    newValue = input.value.trim();
                    newEditableElmTextContent = newValue;
                }
                const initialValue = Table.initialEditableTableCellMap.get(editableElm);

                // Push the updated data if the value is changed.
                if(newValue !== initialValue) {
                    updatedRowData.cells.push({
                        cell,
                        value: newValue
                    });
                }

                // Replace table cell contents.
                editableElm.replaceChildren();
                editableElm.textContent = newEditableElmTextContent;
         
                // Remove the 'table__cell--changed' class.
                Table.toggleTableCellChanged(cell, false);
            }
        }

        // Optimize the updated data.
        updatedData.rows = updatedData.rows.filter(row => row.cells.length > 0);

        // Dispatch a custom update event on the table.
        const customEvent = new CustomEvent('update', {
            detail: updatedData,
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
        // Initialize an initial table cell map.
        Table.initialEditableTableCellMap = new WeakMap();

        // Get the table cells which have the 'data-table-cell-editable' attribute.
        const editableTableCells = table.querySelectorAll(`[${Table.dataTableCellEditable}]`);
        for(let i = 0; i < editableTableCells.length; i++) {
            const cell = editableTableCells[i];

            // Get the edit type by 'data-table-cell-editable' attribute.
            const editType = cell.getAttribute(Table.dataTableCellEditable);
            if(!editType) {
                continue;
            }

            // Set the initial text content.
            const initialTextContent = cell.textContent.trim();

            if(['custom-text', 'custom-number', 'custom-select'].includes(editType)) {
               Table.dispatchAppendToTableCellEventOnTable(table, cell, editType);
               if(editType === 'custom-select') {
                   const options = cell.getElementsByTagName('option');
                   for(let j = 0; j < options.length; j++) {
                       const option = options[j];
                       if(option.textContent === initialTextContent) {
                           option.selected = true;
                           Table.initialEditableTableCellMap.set(cell, option.value);
                           break;
                       }
                   }
               } else {
                   Table.initialEditableTableCellMap.set(cell, initialTextContent);
               }
            } else if(['text', 'select'].includes(editType)) {
                const f = document.createDocumentFragment();

                // Generate / Append HTML element according to the edit type.
                if (editType === 'text') {
                    const input = document.createElement('input');
                    input.classList.add('table__input-cell');
                    input.type = 'text';
                    input.value = initialTextContent;
                    f.appendChild(input);
                    Table.initialEditableTableCellMap.set(cell, initialTextContent);
                } else if(editType === 'select') {
                    const options = Table.getOptionsForTableCell(cell);
                    if(options.length === 0) {
                        continue;
                    }
                    const select = document.createElement('select');
                    select.classList.add('table__select-cell');
                    for(let j = 0; j < options.length; j++) {
                        const { value, text } = options[j];
                        const option = document.createElement('option');
                        option.value = value;
                        option.textContent = text;
                        if(text === initialTextContent) {
                            option.selected = true;
                            Table.initialEditableTableCellMap.set(cell, value);
                        }
                        select.appendChild(option);
                    }
                    f.appendChild(select);
                }

                // Replace the table cell content.
                cell.textContent = '';
                cell.appendChild(f);
            } else {
                continue;
            }

            // Add change event on input / select elements.
            let input = cell.querySelector('input') || cell.querySelector('select');
            input.addEventListener('change', (event) => {
                const initialValue = Table.initialEditableTableCellMap.get(cell);

                // Toggle the 'table__cell--changed' class on the 'table__cell' element.
                Table.toggleTableCellChanged(cell, initialValue !== input.value);
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
        const tableCell = editableTableCell.classList.contains(Table.classTableCell) ? editableTableCell : editableTableCell.closest(`.${Table.classTableCell}`);
        if(!tableCell) {
            return;
        }
        if(isChanged) {
            tableCell.classList.add(Table.classTableCellChanged);
        } else {
            tableCell.classList.remove(Table.classTableCellChanged);
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
        if(!tableCell.hasAttribute(Table.dataTableCellEditableOptions)) {
            return options;
        }
        const editableOptions = tableCell.getAttribute(Table.dataTableCellEditableOptions).split(',');
        for(let i = 0; i < editableOptions.length; i++) {
            const editableOption = editableOptions[i];
            const option = {value: '', text: '' };
            if(editableOption.includes(':')) {
                const [value, text] = editableOption.trim().split(':');
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
            customType,
        };
        const customEvent = new CustomEvent('append-custom-editable-cell', {
            detail,
        });
        if(customType === 'custom-number') {
            detail.step = tableCell.getAttribute(Table.dataTableCellEditableStep);
        }
        if(customType === 'custom-select') {
            detail.options = Table.getOptionsForTableCell(tableCell);
        }
        table.dispatchEvent(customEvent);
    }


    //
    // Set width of nested table scrollable container.
    // 
    static setWidthNestedTableScrollableContainer(table) {
        // Get the nested table scrollable container.
        const tableScrollableContainer = table.closest(`.${Table.classTableRowNested}`)?.querySelector(`.${Table.classTableContainerScroll}`) || null;
        if(!tableScrollableContainer) {
            return;
        }

        // Set calculated width.
        const parentTableContainerRect = tableScrollableContainer.parentElement.closest(`.${Table.classTableContainer}`)?.getBoundingClientRect() || null;
        if(!parentTableContainerRect) {
            return;
        }
        const marginLeft = parseFloat(window.getComputedStyle(tableScrollableContainer).marginLeft);
        tableScrollableContainer.style.width = `${parentTableContainerRect.width - marginLeft}px`;

        // 
        let timeoutId;
        window.addEventListener('resize', () => {
            if(timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                Table.setWidthNestedTableScrollableContainer(table);
            }, 300);
        });
    }

}
export { Table }
