import { useState, useRef, useEffect, useCallback } from 'react';
import {
  FileText,
  Palette,
  Maximize,
  Type,
  RotateCcw,
  Trash2,
} from 'lucide-react';

const PAGE_SIZES = [
  { label: 'A4', width: '816px', minHeight: '1056px' },
  { label: 'Letter', width: '816px', minHeight: '1056px' },
  { label: 'A5', width: '559px', minHeight: '794px' },
  { label: 'Legal', width: '816px', minHeight: '1344px' },
  { label: 'Wide', width: '1056px', minHeight: '816px' },
];

const inputStyle = {
  width: '100%',
  height: '28px',
  background: 'var(--toolbar-bg-hover)',
  border: '1px solid var(--border-dark)',
  color: 'var(--text-primary)',
  padding: '0 8px',
  borderRadius: '4px',
  fontSize: '12px',
};

const labelStyle = {
  display: 'block',
  marginBottom: '4px',
  color: 'var(--text-muted)',
  fontSize: '11px',
  fontWeight: 500,
};

export default function PaperContextMenu({ position, onClose, paperSettings, onApply, onDeletePage }) {
  const menuRef = useRef(null);
  const [view, setView] = useState('main');

  const [bgColor, setBgColor] = useState(paperSettings.bgColor || '#ffffff');
  const [textColor, setTextColor] = useState(paperSettings.textColor || '#1a1a2e');
  const [paddingTop, setPaddingTop] = useState(paperSettings.paddingTop || '96');
  const [paddingRight, setPaddingRight] = useState(paperSettings.paddingRight || '96');
  const [paddingBottom, setPaddingBottom] = useState(paperSettings.paddingBottom || '96');
  const [paddingLeft, setPaddingLeft] = useState(paperSettings.paddingLeft || '96');
  const [pageWidth, setPageWidth] = useState(paperSettings.pageWidth || '816px');
  const [pageMinHeight, setPageMinHeight] = useState(paperSettings.pageMinHeight || '1056px');
  const [fontFamily, setFontFamily] = useState(paperSettings.fontFamily || '');
  const [fontSize, setFontSize] = useState(paperSettings.fontSize || '1.05');
  const [lineHeight, setLineHeight] = useState(paperSettings.lineHeight || '1.5');

  useEffect(() => {
    setBgColor(paperSettings.bgColor || '#ffffff');
    setTextColor(paperSettings.textColor || '#1a1a2e');
    setPaddingTop(paperSettings.paddingTop || '96');
    setPaddingRight(paperSettings.paddingRight || '96');
    setPaddingBottom(paperSettings.paddingBottom || '96');
    setPaddingLeft(paperSettings.paddingLeft || '96');
    setPageWidth(paperSettings.pageWidth || '816px');
    setPageMinHeight(paperSettings.pageMinHeight || '1056px');
    setFontFamily(paperSettings.fontFamily || '');
    setFontSize(paperSettings.fontSize || '1.05');
    setLineHeight(paperSettings.lineHeight || '1.5');
  }, [paperSettings, position.visible]);

  useEffect(() => {
    if (!position.visible) return;
    onApply({
      bgColor,
      textColor,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      pageWidth,
      pageMinHeight,
      fontFamily,
      fontSize,
      lineHeight,
    });
  }, [bgColor, textColor, paddingTop, paddingRight, paddingBottom, paddingLeft, pageWidth, pageMinHeight, fontFamily, fontSize, lineHeight]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
        setView('main');
      }
    };
    if (position.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [position.visible, onClose]);

  if (!position.visible) return null;

  const handleReset = () => {
    const defaults = {
      bgColor: '#ffffff',
      textColor: '#1a1a2e',
      paddingTop: '96',
      paddingRight: '96',
      paddingBottom: '96',
      paddingLeft: '96',
      pageWidth: '816px',
      pageMinHeight: '1056px',
      fontFamily: '',
      fontSize: '1.05',
      lineHeight: '1.5',
    };
    setBgColor(defaults.bgColor);
    setTextColor(defaults.textColor);
    setPaddingTop(defaults.paddingTop);
    setPaddingRight(defaults.paddingRight);
    setPaddingBottom(defaults.paddingBottom);
    setPaddingLeft(defaults.paddingLeft);
    setPageWidth(defaults.pageWidth);
    setPageMinHeight(defaults.pageMinHeight);
    setFontFamily(defaults.fontFamily);
    setFontSize(defaults.fontSize);
    setLineHeight(defaults.lineHeight);
    onApply(defaults);
    setView('main');
    onClose();
  };

  const handlePageSizeSelect = (size) => {
    setPageWidth(size.width);
    setPageMinHeight(size.minHeight);
  };

  const handleMarginPreset = (v) => {
    setPaddingTop(v);
    setPaddingBottom(v);
    setPaddingLeft(v);
    setPaddingRight(v);
  };

  const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontSize: '13px' };
  const iconSize = { width: '14px', height: '14px' };
  const backBtnStyle = { background: 'transparent', border: '1px solid var(--border-dark)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' };

  return (
    <div
      ref={menuRef}
      className="table-properties-menu"
      style={{
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 300),
        top: Math.min(position.y, window.innerHeight - 350),
        zIndex: 9999,
        background: 'var(--toolbar-bg)',
      }}
    >
      {view === 'main' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '6px', minWidth: '220px' }}>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => setView('colors')}>
            <Palette style={iconSize} /> Page Colors
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => setView('margins')}>
            <Maximize style={iconSize} /> Margins & Padding
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => setView('pageSize')}>
            <FileText style={iconSize} /> Page Size
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => setView('typography')}>
            <Type style={iconSize} /> Typography
          </button>
          <div style={{ borderTop: '1px solid var(--border-dark)', margin: '4px 0' }} />
          <button type="button" className="rte-dropdown-item" style={{ ...btnStyle, color: 'var(--text-muted)' }} onClick={handleReset}>
            <RotateCcw style={iconSize} /> Reset to Default
          </button>
          <button type="button" className="rte-dropdown-item" style={{ ...btnStyle, color: '#ef4444' }} onClick={onDeletePage}>
            <Trash2 style={iconSize} /> Delete Page/Image
          </button>
        </div>
      )}

      {view === 'colors' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', width: '260px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Page Colors</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Background</label>
              <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: '100%', height: '32px', cursor: 'pointer', border: 'none', borderRadius: '4px' }} />
            </div>
            <div>
              <label style={labelStyle}>Text Color</label>
              <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} style={{ width: '100%', height: '32px', cursor: 'pointer', border: 'none', borderRadius: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setView('main')} style={backBtnStyle}>Back</button>
          </div>
        </div>
      )}

      {view === 'margins' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', width: '260px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Margins & Padding (px)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Top</label>
              <input type="number" min="0" value={paddingTop} onChange={(e) => setPaddingTop(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Bottom</label>
              <input type="number" min="0" value={paddingBottom} onChange={(e) => setPaddingBottom(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Left</label>
              <input type="number" min="0" value={paddingLeft} onChange={(e) => setPaddingLeft(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Right</label>
              <input type="number" min="0" value={paddingRight} onChange={(e) => setPaddingRight(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { label: 'Narrow', v: '48' },
              { label: 'Normal', v: '96' },
              { label: 'Wide', v: '144' },
            ].map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleMarginPreset(preset.v)}
                style={{ background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-secondary)', padding: '3px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setView('main')} style={backBtnStyle}>Back</button>
          </div>
        </div>
      )}

      {view === 'pageSize' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', width: '260px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Page Size</h4>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {PAGE_SIZES.map((size) => (
              <button
                key={size.label}
                type="button"
                onClick={() => handlePageSizeSelect(size)}
                style={{
                  background: pageWidth === size.width && pageMinHeight === size.minHeight ? 'var(--accent)' : 'var(--toolbar-bg-hover)',
                  border: '1px solid var(--border-dark)',
                  color: pageWidth === size.width && pageMinHeight === size.minHeight ? '#fff' : 'var(--text-secondary)',
                  padding: '4px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Width</label>
              <input type="text" value={pageWidth} onChange={(e) => setPageWidth(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Min Height</label>
              <input type="text" value={pageMinHeight} onChange={(e) => setPageMinHeight(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setView('main')} style={backBtnStyle}>Back</button>
          </div>
        </div>
      )}
      
      {view === 'typography' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', width: '260px' }}>
          <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Typography</h4>
          <div>
            <label style={labelStyle}>Font Family</label>
            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ ...inputStyle, padding: '0 4px' }}>
              <option value="">Default (inherit)</option>
              <option value="'Inter', sans-serif">Inter</option>
              <option value="'Roboto', sans-serif">Roboto</option>
              <option value="'DM Sans', sans-serif">DM Sans</option>
              <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
              <option value="'Courier Prime', monospace">Courier Prime</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="Verdana, sans-serif">Verdana</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <div>
              <label style={labelStyle}>Font Size (rem)</label>
              <input type="number" step="0.05" min="0.5" max="3" value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Line Height</label>
              <input type="number" step="0.1" min="1" max="3" value={lineHeight} onChange={(e) => setLineHeight(e.target.value)} style={inputStyle} />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={() => setView('main')} style={backBtnStyle}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}
