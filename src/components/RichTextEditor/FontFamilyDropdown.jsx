import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';

const FONT_FAMILIES = [
  { label: 'Inter', value: 'Inter, sans-serif' },
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Courier New', value: '"Courier New", Courier, monospace' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Instrument Serif', value: '"Instrument Serif", serif' },
  { label: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
  { label: 'DM Sans', value: '"DM Sans", sans-serif' },
  { label: 'Nabla', value: '"Nabla", system-ui' },
  { label: 'Climate Crisis', value: '"Climate Crisis", sans-serif' },
  { label: 'Kablammo', value: '"Kablammo", system-ui' },
  { label: 'Honk', value: '"Honk", system-ui' },
  { label: 'Rampart One', value: '"Rampart One", cursive' },
  { label: 'Grenze Gotisch', value: '"Grenze Gotisch", serif' },
  { label: 'Monoton', value: '"Monoton", cursive' },
  { label: 'Oi', value: '"Oi", cursive' },
  { label: 'Fruktur', value: '"Fruktur", cursive' },
  { label: 'Ceviche One', value: '"Ceviche One", cursive' },
];

export default function FontFamilyDropdown({ editor, mode = 'selection', globalFont, onGlobalFontChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCurrentFont = useCallback(() => {
    if (mode === 'global') {
      if (!globalFont) return 'Default';
      const match = FONT_FAMILIES.find((f) => f.value === globalFont);
      return match ? match.label : 'Default';
    }
    if (!editor) return 'Default';
    const attrs = editor.getAttributes('textStyle');
    if (attrs.fontFamily) {
      const match = FONT_FAMILIES.find((f) => f.value === attrs.fontFamily);
      return match ? match.label : attrs.fontFamily;
    }
    return 'Default';
  }, [editor, mode, globalFont]);

  const handleSelect = (font) => {
    if (mode === 'global') {
      onGlobalFontChange?.(font.value);
    } else if (editor) {
      editor.chain().focus().setFontFamily(font.value).run();
    }
    setOpen(false);
  };

  const handleReset = () => {
    if (mode === 'global') {
      onGlobalFontChange?.('');
    } else if (editor) {
      editor.chain().focus().unsetFontFamily().run();
    }
    setOpen(false);
  };

  const isGlobal = mode === 'global';

  return (
    <div className={`rte-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className={`rte-dropdown-trigger ${isGlobal ? 'global-font' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
        title={isGlobal ? 'Global Font Family' : 'Font Family'}
      >
        <span className="font-label">{isGlobal ? `⊕ ${getCurrentFont()}` : getCurrentFont()}</span>
        <ChevronDown className="chevron" />
      </button>
      <div className="rte-dropdown-menu">
        <button
          type="button"
          className={`rte-dropdown-item ${getCurrentFont() === 'Default' ? 'active' : ''}`}
          onClick={handleReset}
        >
          Default
        </button>
        {FONT_FAMILIES.map((font) => (
          <button
            key={font.value}
            type="button"
            className={`rte-dropdown-item font-preview ${getCurrentFont() === font.label ? 'active' : ''}`}
            style={{ fontFamily: font.value }}
            onClick={() => handleSelect(font)}
          >
            {font.label}
          </button>
        ))}
      </div>
    </div>
  );
}
