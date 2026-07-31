import {
  X,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Code,
  Minus,
  ImagePlus,
  Table as TableIcon,
  FileText,
  FileDown,
  Type,
  Palette,
  Droplet,
  Heading,
  MoveVertical
} from 'lucide-react';
import './RichTextEditor.scss';

export default function ToolbarHelpModal({ onClose }) {
  const tools = [
    { icon: <Undo2 size={18} />, name: 'Undo', desc: 'Revert the last action.' },
    { icon: <Redo2 size={18} />, name: 'Redo', desc: 'Re-apply the last undone action.' },
    { icon: <Heading size={18} />, name: 'Headings', desc: 'Change text into a heading structure.' },
    { icon: <Bold size={18} />, name: 'Bold', desc: 'Make text bold.' },
    { icon: <Italic size={18} />, name: 'Italic', desc: 'Italicize text.' },
    { icon: <Underline size={18} />, name: 'Underline', desc: 'Underline text.' },
    { icon: <Strikethrough size={18} />, name: 'Strikethrough', desc: 'Cross out text.' },
    { icon: <Type size={18} />, name: 'Font Family', desc: 'Change font of text or whole page.' },
    { icon: <Palette size={18} />, name: 'Text Color', desc: 'Change the color of the text.' },
    { icon: <Droplet size={18} />, name: 'Page Color', desc: 'Change page background color.' },
    { icon: <AlignLeft size={18} />, name: 'Align Left', desc: 'Align text to the left.' },
    { icon: <AlignCenter size={18} />, name: 'Align Center', desc: 'Center text.' },
    { icon: <AlignRight size={18} />, name: 'Align Right', desc: 'Align text to the right.' },
    { icon: <AlignJustify size={18} />, name: 'Justify', desc: 'Stretch lines to margins.' },
    { icon: <MoveVertical size={18} />, name: 'Line Height', desc: 'Adjust space between lines.' },
    { icon: <List size={18} />, name: 'Bullet List', desc: 'Create a bulleted list.' },
    { icon: <ListOrdered size={18} />, name: 'Ordered List', desc: 'Create a numbered list.' },
    { icon: <ListTodo size={18} />, name: 'Task List', desc: 'Create an interactive checklist.' },
    { icon: <Quote size={18} />, name: 'Blockquote', desc: 'Insert a quote block.' },
    { icon: <Code size={18} />, name: 'Code Block', desc: 'Insert a block of formatted code.' },
    { icon: <Minus size={18} />, name: 'Horizontal Rule', desc: 'Insert a horizontal divider line.' },
    { icon: <ImagePlus size={18} />, name: 'Insert Image', desc: 'Upload and insert an image.' },
    { icon: <TableIcon size={18} />, name: 'Insert Table', desc: 'Insert a customizable table.' },
    { icon: <FileText size={18} />, name: 'Export TXT', desc: 'Download document as plain text.' },
    { icon: <FileDown size={18} />, name: 'Export PDF', desc: 'Download document as a PDF file.' },
  ];

  return (
    <div className="rte-help-modal-overlay" onClick={onClose}>
      <div className="rte-help-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="rte-help-modal-header">
          <h3>Editor Toolbar Guide</h3>
          <button className="rte-help-modal-close" onClick={onClose} aria-label="Close Guide">
            <X size={20} />
          </button>
        </div>
        <div className="rte-help-modal-body">
          <div className="rte-help-grid">
            {tools.map((tool, index) => (
              <div key={index} className="rte-help-item">
                <div className="rte-help-icon-wrapper">{tool.icon}</div>
                <div className="rte-help-info">
                  <strong>{tool.name}</strong>
                  <p>{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
