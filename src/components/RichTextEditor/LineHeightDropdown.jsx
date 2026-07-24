import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoveVertical } from 'lucide-react';

const LINE_HEIGHT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: '1.0', value: '1' },
  { label: '1.15', value: '1.15' },
  { label: '1.5', value: '1.5' },
  { label: '2.0', value: '2' },
  { label: '2.5', value: '2.5' },
  { label: '3.0', value: '3' },
];

export default function LineHeightDropdown({ editor }) {
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

  const getCurrentValue = () => {
    if (!editor) return 'Default';
    
    let lh = editor.getAttributes('textStyle')?.lineHeight;
    if (!lh) lh = editor.getAttributes('paragraph')?.lineHeight;
    if (!lh) lh = editor.getAttributes('heading')?.lineHeight;
    
    if (lh) {
      const match = LINE_HEIGHT_OPTIONS.find((opt) => opt.value === lh);
      return match ? match.label : lh;
    }
    return 'Default';
  };

  const handleSelect = (val) => {
    if (!editor) return;
    if (val === '') {
      editor.chain().focus().unsetLineHeight().run();
    } else {
      editor.chain().focus().setLineHeight(val).run();
    }
    setOpen(false);
  };

  return (
    <div className={`rte-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="rte-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        title="Line Height"
        style={{ minWidth: '70px', padding: '0 6px' }}
      >
        <MoveVertical style={{ width: '14px', height: '14px' }} />
        <span>{getCurrentValue()}</span>
        <ChevronDown className="chevron" />
      </button>
      <div className="rte-dropdown-menu" style={{ minWidth: '100px' }}>
        {LINE_HEIGHT_OPTIONS.map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={`rte-dropdown-item ${getCurrentValue() === opt.label ? 'active' : ''}`}
            onClick={() => handleSelect(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
