import { useState, useRef, useEffect } from 'react';
import {
  Columns,
  Rows,
  Trash2,
  Combine,
  SplitSquareHorizontal,
  Settings2,
  MinusSquare,
  Palette,
  LayoutGrid,
} from 'lucide-react';

export default function TableContextMenu({ editor, position, onClose }) {
  const [showSettings, setShowSettings] = useState('none');
  const settingsRef = useRef(null);

  // Form states for table properties
  const [cellBgColor, setCellBgColor] = useState('');
  const [cellBorderColor, setCellBorderColor] = useState('');
  const [cellBorderWidth, setCellBorderWidth] = useState('1px');
  const [cellBorderStyle, setCellBorderStyle] = useState('solid');
  const [cellPadding, setCellPadding] = useState('8px');
  const [tableBorderSpacing, setTableBorderSpacing] = useState('0px');
  const [tableBorderColor, setTableBorderColor] = useState('');
  const [tableBorderWidth, setTableBorderWidth] = useState('');
  const [tableBorderStyle, setTableBorderStyle] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        onClose();
        setShowSettings('none');
      }
    };
    if (position.visible) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [position.visible, onClose]);

  // Load active attributes when settings opens
  useEffect(() => {
    if (showSettings !== 'none' && editor) {
      const cell = editor.getAttributes('tableCell');
      const header = editor.getAttributes('tableHeader');
      const table = editor.getAttributes('table');

      const activeCell = Object.keys(cell).length ? cell : header;

      if (activeCell) {
        setCellBgColor(activeCell.backgroundColor || '');
        setCellBorderColor(activeCell.borderColor || '');
        setCellBorderWidth(activeCell.borderWidth || '1px');
        setCellBorderStyle(activeCell.borderStyle || 'solid');
        setCellPadding(activeCell.padding || '8px');
      }
      if (table && Object.keys(table).length) {
        setTableBorderSpacing(table.borderSpacing || '0px');
        setTableBorderColor(table.borderColor || '');
        setTableBorderWidth(table.borderWidth || '');
        setTableBorderStyle(table.borderStyle || '');
      }
    }
  }, [showSettings, editor]);

  if (!editor || !position.visible) return null;

  const applyTableProperties = (e) => {
    e.preventDefault();
    if (!editor) return;

    editor.chain().focus()
      .setCellAttribute('backgroundColor', cellBgColor || null)
      .setCellAttribute('borderColor', cellBorderColor || null)
      .setCellAttribute('borderWidth', cellBorderWidth || null)
      .setCellAttribute('borderStyle', cellBorderStyle || null)
      .setCellAttribute('padding', cellPadding || null)
      .updateAttributes('table', {
        borderSpacing: tableBorderSpacing || null,
        borderColor: tableBorderColor || null,
        borderWidth: tableBorderWidth || null,
        borderStyle: tableBorderStyle || null,
      })
      .run();

    setShowSettings('none');
    onClose();
  };

  const btnStyle = { display: 'flex', alignItems: 'center', gap: '8px', width: '100%', fontSize: '13px' };

  return (
    <div
      ref={settingsRef}
      className="table-properties-menu"
      style={{
        position: 'fixed',
        left: Math.min(position.x, window.innerWidth - 320),
        top: Math.min(position.y, window.innerHeight - 300),
        zIndex: 9999,
        background: 'var(--toolbar-bg)',
      }}
    >
      {showSettings === 'none' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', padding: '6px', minWidth: '320px', background: 'var(--toolbar-bg)' }}>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().addColumnBefore().run()}>
            <Columns style={{ width: '14px', height: '14px' }} /> Add Col Before
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().addColumnAfter().run()}>
            <Columns style={{ width: '14px', height: '14px' }} /> Add Col After
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().deleteColumn().run()}>
            <MinusSquare style={{ width: '14px', height: '14px' }} /> Delete Col
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().mergeCells().run()}>
            <Combine style={{ width: '14px', height: '14px' }} /> Merge Cells
          </button>

          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().addRowBefore().run()}>
            <Rows style={{ width: '14px', height: '14px' }} /> Add Row Before
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().addRowAfter().run()}>
            <Rows style={{ width: '14px', height: '14px' }} /> Add Row After
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().deleteRow().run()}>
            <Trash2 style={{ width: '14px', height: '14px' }} /> Delete Row
          </button>
          <button type="button" className="rte-dropdown-item" style={btnStyle} onClick={() => editor.chain().focus().splitCell().run()}>
            <SplitSquareHorizontal style={{ width: '14px', height: '14px' }} /> Split Cell
          </button>

          <button type="button" className="rte-dropdown-item" style={{ ...btnStyle, borderTop: '1px solid var(--border-dark)', marginTop: '4px', paddingTop: '8px' }} onClick={() => setShowSettings('cell')}>
            <Palette style={{ width: '14px', height: '14px' }} /> Cell Properties
          </button>
          <button type="button" className="rte-dropdown-item" style={{ ...btnStyle, borderTop: '1px solid var(--border-dark)', marginTop: '4px', paddingTop: '8px' }} onClick={() => setShowSettings('table')}>
            <LayoutGrid style={{ width: '14px', height: '14px' }} /> Table Properties
          </button>
          <button type="button" className="rte-dropdown-item" style={{ ...btnStyle, gridColumn: '1 / -1', color: '#ef4444' }} onClick={() => editor.chain().focus().deleteTable().run()}>
            <Trash2 style={{ width: '14px', height: '14px' }} /> Delete Entire Table
          </button>
        </div>
      ) : (
        <div>
          <form onSubmit={applyTableProperties} style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '12px', width: '260px' }}>
            {showSettings === 'cell' && (
              <>
                <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Cell Properties</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Bg Color</label>
                    <input type="color" value={cellBgColor || '#ffffff'} onChange={(e) => setCellBgColor(e.target.value)} style={{ width: '100%', height: '28px', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Padding</label>
                    <input type="text" value={cellPadding} onChange={(e) => setCellPadding(e.target.value)} placeholder="e.g. 8px" style={{ width: '100%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 8px', borderRadius: '4px' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Border Color</label>
                    <input type="color" value={cellBorderColor || '#cccccc'} onChange={(e) => setCellBorderColor(e.target.value)} style={{ width: '100%', height: '28px', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Border Width</label>
                    <input type="text" value={cellBorderWidth} onChange={(e) => setCellBorderWidth(e.target.value)} placeholder="e.g. 1px" style={{ width: '100%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 8px', borderRadius: '4px' }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Border Style</label>
                    <select value={cellBorderStyle} onChange={(e) => setCellBorderStyle(e.target.value)} style={{ width: '100%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 4px', borderRadius: '4px' }}>
                      <option value="solid">Solid</option>
                      <option value="dashed">Dashed</option>
                      <option value="dotted">Dotted</option>
                      <option value="double">Double</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                </div>
              </>
            )}

            {showSettings === 'table' && (
              <>
                <h4 style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-dark)', paddingBottom: '6px' }}>Table Borders & Spacing</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Outer Border</label>
                    <input type="color" value={tableBorderColor || '#cccccc'} onChange={(e) => setTableBorderColor(e.target.value)} style={{ width: '100%', height: '28px', cursor: 'pointer' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Width / Style</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="text" value={tableBorderWidth} onChange={(e) => setTableBorderWidth(e.target.value)} placeholder="1px" style={{ width: '50%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 4px', borderRadius: '4px' }} />
                      <select value={tableBorderStyle} onChange={(e) => setTableBorderStyle(e.target.value)} style={{ width: '50%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 2px', borderRadius: '4px' }}>
                        <option value="">--</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '4px', color: 'var(--text-muted)' }}>Table Spacing</label>
                    <input type="text" value={tableBorderSpacing} onChange={(e) => setTableBorderSpacing(e.target.value)} placeholder="e.g. 0px" style={{ width: '100%', height: '28px', background: 'var(--toolbar-bg-hover)', border: '1px solid var(--border-dark)', color: 'var(--text-primary)', padding: '0 8px', borderRadius: '4px' }} />
                  </div>
                </div>
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '4px' }}>
              <button type="button" onClick={() => setShowSettings('none')} style={{ background: 'transparent', border: '1px solid var(--border-dark)', color: 'var(--text-secondary)', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
              <button type="submit" style={{ background: 'var(--accent)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Apply</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
