import { useState, useRef, useEffect } from 'react';
import { PaintBucket, AppWindow } from 'lucide-react';

const COLOR_PALETTE = [
  '#000000', '#434343', '#666666', '#999999', '#cccccc', '#efefef', '#f3f3f3', '#ffffff',
  '#ff0000', '#ff4d4d', '#ff9900', '#ffcc00', '#00cc00', '#009999', '#3366ff', '#7c3aed',
  '#cc0066', '#e91e63', '#ff6600', '#ffeb3b', '#4caf50', '#00bcd4', '#2196f3', '#9c27b0',
  '#800000', '#b71c1c', '#e65100', '#f57f17', '#1b5e20', '#006064', '#0d47a1', '#4a148c',
];

export default function BgColorPicker({ editor, mode = 'text', globalBgColor, onGlobalBgColorChange }) {
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

  const currentColor = mode === 'page' 
    ? (globalBgColor || 'transparent')
    : (editor?.getAttributes('textStyle')?.backgroundColor || 'transparent');

  const handleSelect = (color) => {
    if (mode === 'page') {
      onGlobalBgColorChange?.(color);
    } else {
      editor?.chain().focus().setBackgroundColor(color).run();
    }
    setOpen(false);
  };

  const handleReset = () => {
    if (mode === 'page') {
      onGlobalBgColorChange?.('');
    } else {
      editor?.chain().focus().unsetBackgroundColor().run();
    }
    setOpen(false);
  };

  const Icon = mode === 'page' ? AppWindow : PaintBucket;

  return (
    <div className="rte-color-picker" ref={ref}>
      <button
        type="button"
        className="rte-color-btn"
        onClick={() => setOpen((prev) => !prev)}
        title={mode === 'page' ? 'Page Background Color' : 'Text Background Color'}
      >
        <Icon />
        <span className="rte-color-indicator" style={{ background: currentColor === 'transparent' ? (mode === 'page' ? '#ffffff' : '#ccc') : currentColor }} />
      </button>
      {open && (
        <div className="rte-color-palette">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color}
              type="button"
              className={`rte-color-swatch ${currentColor === color ? 'active' : ''}`}
              style={{ background: color }}
              title={color}
              onClick={() => handleSelect(color)}
            />
          ))}
          <button
            type="button"
            className="rte-color-swatch"
            style={{ background: 'linear-gradient(135deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%)', backgroundSize: '8px 8px' }}
            title="Remove Background Color"
            onClick={handleReset}
          />
        </div>
      )}
    </div>
  );
}
