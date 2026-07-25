import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

export const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderWidth: {
        default: '1px',
        parseHTML: element => element.style.borderWidth || '1px',
        renderHTML: attributes => {
          return {
            style: `border-width: ${attributes.borderWidth};`,
          };
        },
      },
      borderStyle: {
        default: 'solid',
        parseHTML: element => element.style.borderStyle || 'solid',
        renderHTML: attributes => {
          return {
            style: `border-style: ${attributes.borderStyle};`,
          };
        },
      },
      borderColor: {
        default: '#cccccc',
        parseHTML: element => element.style.borderColor || '#cccccc',
        renderHTML: attributes => {
          return {
            style: `border-color: ${attributes.borderColor};`,
          };
        },
      },
      borderSpacing: {
        default: '0px',
        parseHTML: element => element.style.borderSpacing || '0px',
        renderHTML: attributes => {
          return {
            style: `border-spacing: ${attributes.borderSpacing}; border-collapse: separate;`,
          };
        }
      }
    };
  }
});

const cellAttributes = {
  backgroundColor: {
    default: null,
    parseHTML: element => element.style.backgroundColor || null,
    renderHTML: attributes => {
      if (!attributes.backgroundColor) return {};
      return {
        style: `background-color: ${attributes.backgroundColor};`,
      };
    },
  },
  borderColor: {
    default: null,
    parseHTML: element => element.style.borderColor || null,
    renderHTML: attributes => {
      if (!attributes.borderColor) return {};
      return {
        style: `border-color: ${attributes.borderColor};`,
      };
    },
  },
  borderWidth: {
    default: null,
    parseHTML: element => element.style.borderWidth || null,
    renderHTML: attributes => {
      if (!attributes.borderWidth) return {};
      return {
        style: `border-width: ${attributes.borderWidth};`,
      };
    },
  },
  borderStyle: {
    default: null,
    parseHTML: element => element.style.borderStyle || null,
    renderHTML: attributes => {
      if (!attributes.borderStyle) return {};
      return {
        style: `border-style: ${attributes.borderStyle};`,
      };
    },
  },
  padding: {
    default: null,
    parseHTML: element => element.style.padding || null,
    renderHTML: attributes => {
      if (!attributes.padding) return {};
      return {
        style: `padding: ${attributes.padding};`,
      };
    },
  }
};

export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellAttributes
    };
  }
});

export const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      ...cellAttributes
    };
  }
});

export const CustomTableRow = TableRow;
