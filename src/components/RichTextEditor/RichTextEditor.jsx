import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyleKit } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import { TaskList, TaskItem } from '@tiptap/extension-list';
import { CustomTable, CustomTableRow, CustomTableHeader, CustomTableCell } from './extensions/TableExtensions';

import ResizableImage from './ImageResizeWrapper';
import Toolbar from './Toolbar';
import BubbleToolbar from './BubbleToolbar';
import TableContextMenu from './TableContextMenu';
import './RichTextEditor.css';

const RichTextEditor = forwardRef(function RichTextEditor(
  { initialContent = '', placeholder = 'Start typing your document...', onChange },
  ref
) {
  const [globalFont, setGlobalFont] = useState('');
  const [globalBgColor, setGlobalBgColor] = useState('');
  const [counts, setCounts] = useState({ words: 0, chars: 0 });
  const [tableContextMenu, setTableContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const editorContainerRef = useRef(null);

  const isClient = typeof window !== 'undefined';

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: {
          openOnClick: false,
          HTMLAttributes: {
            rel: 'noopener noreferrer',
            target: '_blank',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyleKit,
      Placeholder.configure({
        placeholder,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CustomTable.configure({
        resizable: true,
      }),
      CustomTableRow,
      CustomTableHeader,
      CustomTableCell,
      ResizableImage,
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap',
        spellcheck: 'true',
      },
    },
    onCreate: ({ editor: ed }) => {
      const text = ed.getText();
      setCounts({
        words: text.split(/\s+/).filter(Boolean).length,
        chars: text.length,
      });
    },
    onUpdate: ({ editor: ed }) => {
      onChange?.(ed.getHTML());
      const text = ed.getText();
      setCounts({
        words: text.split(/\s+/).filter(Boolean).length,
        chars: text.length,
      });
    },
    immediatelyRender: false,
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      getHtml: () => editor?.getHTML() ?? '',
      getText: () => editor?.getText() ?? '',
      setHtml: (html) => {
        editor?.commands.setContent(html, false);
      },
      exportToPdf: () => exportToPdf(),
      exportToTxt: () => exportToTxt(),
      getEditor: () => editor,
    }),
    [editor]
  );

  const exportToTxt = useCallback(() => {
    if (!editor || !isClient) return;
    const text = editor.getText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [editor, isClient]);

  const exportToPdf = useCallback(async () => {
    if (!editorContainerRef.current || !isClient) return;

    const html2pdf = (await import('html2pdf.js')).default;

    const element = editorContainerRef.current;
    const opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: 'document.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
      },
      jsPDF: {
        unit: 'in',
        format: 'letter',
        orientation: 'portrait',
      },
    };

    html2pdf().set(opt).from(element).save();
  }, [isClient]);

  const handleGlobalFontChange = useCallback((fontValue) => {
    setGlobalFont(fontValue);
  }, []);

  const handleGlobalBgColorChange = useCallback((color) => {
    setGlobalBgColor(color);
  }, []);

  const wordCount = counts.words;
  const charCount = counts.chars;

  const handleContextMenu = (e) => {
    e.preventDefault();
    if (!editor) return;

    if (e.target.closest('td') || e.target.closest('th') || e.target.closest('table')) {
      const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
      if (pos && pos.pos) {
        editor.commands.setTextSelection(pos.pos);
      }
      setTableContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    } else {
      setTableContextMenu({ visible: false, x: 0, y: 0 });
    }
  };

  return (
    <div className="rte-container" id="rte-container" onContextMenu={handleContextMenu}>
      <Toolbar
        editor={editor}
        globalFont={globalFont}
        onGlobalFontChange={handleGlobalFontChange}
        globalBgColor={globalBgColor}
        onGlobalBgColorChange={handleGlobalBgColorChange}
        onExportTxt={exportToTxt}
        onExportPdf={exportToPdf}
      />

      <BubbleToolbar editor={editor} />
      <TableContextMenu 
        editor={editor} 
        position={tableContextMenu} 
        onClose={() => setTableContextMenu((prev) => ({ ...prev, visible: false }))} 
      />

      <div
        className="rte-editor-canvas"
        ref={editorContainerRef}
        style={{
          '--page-font': globalFont || undefined,
          '--page-bg': globalBgColor || undefined,
        }}
        onClick={(e) => {
          if (e.target.classList.contains('rte-editor-canvas')) {
            editor?.commands.focus('end');
          }
        }}
      >
        <EditorContent editor={editor} />
      </div>

      <div className="rte-status-bar">
        <span>{wordCount} words · {charCount} characters</span>
        <span>Tiptap Editor</span>
      </div>
    </div>
  );
});

export default RichTextEditor;
