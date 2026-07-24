import { BubbleMenu } from '@tiptap/react/menus';
import { useState, useCallback } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  PanelLeft,
  PanelRight,
  MonitorOff,
  Highlighter,
  Link,
  Unlink,
  RemoveFormatting,
  Check,
  X,
} from 'lucide-react';
import FontFamilyDropdown from './FontFamilyDropdown';
import BgColorPicker from './BgColorPicker';

export default function BubbleToolbar({ editor }) {
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const isImageMenu = ({ editor }) => editor.isActive('image');
  const isTextMenu = ({ editor }) => !editor.isActive('image') && !editor.state.selection.empty;

  const handleSetLink = useCallback(() => {
    if (!linkUrl) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor.chain().focus().setLink({ href: linkUrl }).run();
    }
    setLinkMode(false);
    setLinkUrl('');
  }, [editor, linkUrl]);

  const handleOpenLinkInput = useCallback(() => {
    const existingHref = editor.getAttributes('link').href || '';
    setLinkUrl(existingHref);
    setLinkMode(true);
  }, [editor]);

  const handleCancelLink = useCallback(() => {
    setLinkMode(false);
    setLinkUrl('');
  }, []);

  if (!editor) return null;

  return (
    <>
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 200, placement: 'top', offset: [0, 8] }}
        shouldShow={isTextMenu}
        className="rte-bubble-menu"
      >
        {linkMode ? (

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 4px' }}>
            <input
              type="url"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSetLink();
                if (e.key === 'Escape') handleCancelLink();
              }}
              autoFocus
              style={{
                width: '200px',
                height: '26px',
                fontSize: '12px',
                background: 'var(--toolbar-bg-hover)',
                border: '1px solid var(--toolbar-border)',
                borderRadius: '4px',
                color: 'var(--text-primary)',
                padding: '0 8px',
                outline: 'none',
              }}
            />
            <button
              type="button"
              className="rte-toolbar-btn"
              onClick={handleSetLink}
              title="Apply Link"
            >
              <Check />
            </button>
            <button
              type="button"
              className="rte-toolbar-btn"
              onClick={handleCancelLink}
              title="Cancel"
            >
              <X />
            </button>
          </div>
        ) : (

          <>
            <button
              type="button"
              className={`rte-toolbar-btn ${editor.isActive('bold') ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleBold().run()}
              title="Bold"
            >
              <Bold />
            </button>
            <button
              type="button"
              className={`rte-toolbar-btn ${editor.isActive('italic') ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleItalic().run()}
              title="Italic"
            >
              <Italic />
            </button>
            <button
              type="button"
              className={`rte-toolbar-btn ${editor.isActive('underline') ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              title="Underline"
            >
              <Underline />
            </button>
            <button
              type="button"
              className={`rte-toolbar-btn ${editor.isActive('strike') ? 'active' : ''}`}
              onClick={() => editor.chain().focus().toggleStrike().run()}
              title="Strikethrough"
            >
              <Strikethrough />
            </button>
            <button
              type="button"
              className={`rte-toolbar-btn ${editor.getAttributes('textStyle').backgroundColor === '#ffff00' ? 'active' : ''}`}
              onClick={() => {
                const isHighlighted = editor.getAttributes('textStyle').backgroundColor === '#ffff00';
                if (isHighlighted) {
                  editor.chain().focus().unsetBackgroundColor().run();
                } else {
                  editor.chain().focus().setBackgroundColor('#ffff00').run();
                }
              }}
              title="Highlight"
            >
              <Highlighter />
            </button>

            <div className="rte-toolbar-divider" />

            <button
              type="button"
              className={`rte-toolbar-btn ${editor.isActive('link') ? 'active' : ''}`}
              onClick={handleOpenLinkInput}
              title="Insert Link"
            >
              <Link />
            </button>
            {editor.isActive('link') && (
              <button
                type="button"
                className="rte-toolbar-btn"
                onClick={() => editor.chain().focus().unsetLink().run()}
                title="Remove Link"
              >
                <Unlink />
              </button>
            )}

            <div className="rte-toolbar-divider" />
            <FontFamilyDropdown editor={editor} mode="selection" />
            
            <div className="rte-toolbar-divider" />
            <BgColorPicker editor={editor} />

            <div className="rte-toolbar-divider" />

            <button
              type="button"
              className="rte-toolbar-btn"
              onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
              title="Clear Formatting"
            >
              <RemoveFormatting />
            </button>

            <button
              type="button"
              className="rte-toolbar-btn"
              onClick={() => editor.chain().focus().deleteSelection().run()}
              title="Delete Selection"
            >
              <Trash2 />
            </button>
          </>
        )}
      </BubbleMenu>

      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 200, placement: 'bottom', offset: [0, 8] }}
        shouldShow={isImageMenu}
        className="rte-bubble-menu"
      >
        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').align === 'left' && editor.getAttributes('image').float === 'none' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left', float: 'none' }).run()}
          title="Align Left"
        >
          <AlignLeft />
        </button>
        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').align === 'center' && editor.getAttributes('image').float === 'none' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center', float: 'none' }).run()}
          title="Align Center"
        >
          <AlignCenter />
        </button>
        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').align === 'right' && editor.getAttributes('image').float === 'none' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right', float: 'none' }).run()}
          title="Align Right"
        >
          <AlignRight />
        </button>

        <div className="rte-toolbar-divider" />

        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').float === 'left' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { align: 'none', float: 'left' }).run()}
          title="Float Left (Text Wraps)"
        >
          <PanelLeft />
        </button>
        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').float === 'right' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { align: 'none', float: 'right' }).run()}
          title="Float Right (Text Wraps)"
        >
          <PanelRight />
        </button>
        <button
          type="button"
          className={`rte-toolbar-btn ${editor.getAttributes('image').float === 'none' ? 'active' : ''}`}
          onClick={() => editor.chain().focus().updateAttributes('image', { float: 'none' }).run()}
          title="Reset Float"
        >
          <MonitorOff />
        </button>
        <div className="rte-toolbar-divider" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '0 6px' }}>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>Gap:</span>
          <input
            type="number"
            value={editor.getAttributes('image').gap ?? 8}
            onChange={(e) => {
              let val = parseInt(e.target.value, 10);
              if (isNaN(val)) val = 0;
              editor.chain().updateAttributes('image', { gap: val }).run();
            }}
            style={{
              width: '44px',
              height: '24px',
              fontSize: '12px',
              background: 'var(--toolbar-bg-hover)',
              border: '1px solid var(--toolbar-border)',
              borderRadius: '4px',
              color: 'var(--text-primary)',
              textAlign: 'center',
              outline: 'none',
            }}
          />
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>px</span>
        </div>

        <div className="rte-toolbar-divider" />

        <button
          type="button"
          className="rte-toolbar-btn"
          onClick={() => editor.chain().focus().deleteSelection().run()}
          title="Delete Image"
        >
          <Trash2 />
        </button>
      </BubbleMenu>
    </>
  );
}

