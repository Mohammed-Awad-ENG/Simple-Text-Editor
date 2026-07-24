import { useRef, useCallback } from 'react';
import {
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
  ImagePlus,
  Minus,
  Undo2,
  Redo2,
  FileText,
  FileDown,
  Quote,
  Code,
} from 'lucide-react';
import HeadingDropdown from './HeadingDropdown';
import FontFamilyDropdown from './FontFamilyDropdown';
import ColorPicker from './ColorPicker';
import BgColorPicker from './BgColorPicker';
import LineHeightDropdown from './LineHeightDropdown';

export default function Toolbar({ 
  editor, 
  globalFont, 
  onGlobalFontChange, 
  globalBgColor,
  onGlobalBgColorChange,
  onExportTxt, 
  onExportPdf 
}) {
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      const reader = new FileReader();
      reader.onload = () => {
        editor.chain().focus().setImage({ src: reader.result, alt: file.name }).run();
      };
      reader.readAsDataURL(file);

      e.target.value = '';
    },
    [editor]
  );

  if (!editor) return null;

  const btn = (Icon, action, isActive, title, extraClass = '') => (
    <button
      type="button"
      className={`rte-toolbar-btn ${isActive ? 'active' : ''} ${extraClass}`}
      onClick={action}
      title={title}
      disabled={!editor}
    >
      <Icon />
    </button>
  );

  return (
    <div className="rte-toolbar" role="toolbar" aria-label="Editor Toolbar">
      <div className="rte-toolbar-group">
        {btn(Undo2, () => editor.chain().focus().undo().run(), false, 'Undo')}
        {btn(Redo2, () => editor.chain().focus().redo().run(), false, 'Redo')}
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        <HeadingDropdown editor={editor} />
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        {btn(Bold, () => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold')}
        {btn(Italic, () => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic')}
        {btn(Underline, () => editor.chain().focus().toggleUnderline().run(), editor.isActive('underline'), 'Underline')}
        {btn(Strikethrough, () => editor.chain().focus().toggleStrike().run(), editor.isActive('strike'), 'Strikethrough')}
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        <FontFamilyDropdown editor={editor} mode="selection" />
      </div>

      <div className="rte-toolbar-group">
        <FontFamilyDropdown
          editor={editor}
          mode="global"
          globalFont={globalFont}
          onGlobalFontChange={onGlobalFontChange}
        />
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        <ColorPicker editor={editor} />
        <BgColorPicker 
          editor={editor} 
          mode="page" 
          globalBgColor={globalBgColor} 
          onGlobalBgColorChange={onGlobalBgColorChange} 
        />
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        {btn(AlignLeft, () => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Align Left')}
        {btn(AlignCenter, () => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Align Center')}
        {btn(AlignRight, () => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Align Right')}
        {btn(AlignJustify, () => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }), 'Justify')}
        <div style={{ marginLeft: '4px' }}>
          <LineHeightDropdown editor={editor} />
        </div>
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        {btn(List, () => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet List')}
        {btn(ListOrdered, () => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Ordered List')}
        {btn(ListTodo, () => editor.chain().focus().toggleTaskList().run(), editor.isActive('taskList'), 'Task List')}
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        {btn(Quote, () => editor.chain().focus().toggleBlockquote().run(), editor.isActive('blockquote'), 'Blockquote')}
        {btn(Code, () => editor.chain().focus().toggleCodeBlock().run(), editor.isActive('codeBlock'), 'Code Block')}
        {btn(Minus, () => editor.chain().focus().setHorizontalRule().run(), false, 'Horizontal Rule')}
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        <button
          type="button"
          className="rte-toolbar-btn"
          onClick={handleImageUpload}
          title="Insert Image"
        >
          <ImagePlus />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>

      <div className="rte-toolbar-divider" />

      <div className="rte-toolbar-group">
        <button
          type="button"
          className="rte-toolbar-btn export-btn"
          onClick={onExportTxt}
          title="Export as TXT"
        >
          <FileText />
          <span>TXT</span>
        </button>
        <button
          type="button"
          className="rte-toolbar-btn export-btn"
          onClick={onExportPdf}
          title="Export as PDF"
        >
          <FileDown />
          <span>PDF</span>
        </button>
      </div>
    </div>
  );
}
