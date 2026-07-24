import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const HEADING_OPTIONS = [
  { label: 'Paragraph', level: 0 },
  { label: 'Heading 1', level: 1 },
  { label: 'Heading 2', level: 2 },
  { label: 'Heading 3', level: 3 },
  { label: 'Heading 4', level: 4 },
];

export default function HeadingDropdown({ editor }) {
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

  const getCurrentLabel = () => {
    if (!editor) return 'Paragraph';
    for (let level = 1; level <= 4; level++) {
      if (editor.isActive('heading', { level })) {
        return `Heading ${level}`;
      }
    }
    return 'Paragraph';
  };

  const handleSelect = (level) => {
    if (!editor) return;
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
    setOpen(false);
  };

  return (
    <div className={`rte-dropdown ${open ? 'open' : ''}`} ref={ref}>
      <button
        type="button"
        className="rte-dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        title="Text Style"
      >
        <span>{getCurrentLabel()}</span>
        <ChevronDown className="chevron" />
      </button>
      <div className="rte-dropdown-menu">
        {HEADING_OPTIONS.map((opt) => (
          <button
            key={opt.level}
            type="button"
            className={`rte-dropdown-item ${getCurrentLabel() === opt.label ? 'active' : ''}`}
            style={{
              fontSize: opt.level === 0 ? '14px' : `${18 - opt.level * 2}px`,
              fontWeight: opt.level === 0 ? 400 : 600,
            }}
            onClick={() => handleSelect(opt.level)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
