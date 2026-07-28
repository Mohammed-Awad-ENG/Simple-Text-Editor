import {
  forwardRef,
  useImperativeHandle,
  useState,
  useCallback,
  useRef,
} from 'react';
import { Plus, ImagePlus } from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import { Node, mergeAttributes } from '@tiptap/core';

const PageNode = Node.create({
  name: 'page',
  group: 'block',
  content: 'block+',
  parseHTML() {
    return [{ tag: 'div.paper-page' }];
  },
  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'paper-page' }), 0];
  },
});

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
import PaperContextMenu from './PaperContextMenu';
import './RichTextEditor.scss';
import { NodeSelection } from '@tiptap/pm/state';

const RichTextEditor = forwardRef(function RichTextEditor(
  { initialContent = '', placeholder = 'Start typing your document...', onChange },
  ref
) {
  const [globalFont, setGlobalFont] = useState('');
  const [globalBgColor, setGlobalBgColor] = useState('');
  const [counts, setCounts] = useState({ words: 0, chars: 0 });
  const [tableContextMenu, setTableContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [paperContextMenu, setPaperContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const [paperSettings, setPaperSettings] = useState({
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
  });
  const editorContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const isClient = typeof window !== 'undefined';



  let formattedContent = initialContent;
  if (formattedContent && !formattedContent.includes('class="paper-page"')) {
    formattedContent = `<div class="paper-page">${formattedContent}</div>`;
  } else if (!formattedContent) {
    formattedContent = `<div class="paper-page"><p></p></div>`;
  }

  const editor = useEditor({
    extensions: [
      PageNode,
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
    content: formattedContent,
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

      if (ed.isEmpty) {
        ed.commands.setContent('<div class="paper-page"><p></p></div>');
      }
    },
    immediatelyRender: false,
  }, []);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

const handleFileChange = useCallback(
  (e) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = () => {
      const { schema } = editor.state;
      const imageType = schema.nodes.image;
      if (!imageType) return;

      const imageNode = imageType.create({
        src: reader.result,
        alt: file.name,
      });

      // Insert as its own top-level node — a sibling of "page" per the
      // doc schema `(page | image)+` — never wrapped inside a page.
      const endPos = editor.state.doc.content.size;
      let tr = editor.state.tr.insert(endPos, imageNode);
      tr = tr.setSelection(NodeSelection.create(tr.doc, endPos));
      editor.view.dispatch(tr);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  },
  [editor]
);

  const handleAddPage = useCallback(() => {
    if (!editor) return;
    editor.chain()
      .insertContentAt(editor.state.doc.content.size, {
        type: 'page',
        content: [{ type: 'paragraph' }]
      })
      .focus('end')
      .run();
  }, [editor]);

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

    setTableContextMenu({ visible: false, x: 0, y: 0 });
    setPaperContextMenu({ visible: false, x: 0, y: 0 });

    const isImageClicked = e.target.tagName === 'IMG' || e.target.closest('.image-resize-wrapper');

    if (!isImageClicked && (e.target.closest('td') || e.target.closest('th') || e.target.closest('table'))) {
      const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
      if (pos && pos.pos) {
        editor.commands.setTextSelection(pos.pos);
      }
      setTableContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    } else if (e.target.closest('.paper-page') || e.target.closest('.image-resize-node')) {
      const isImage = e.target.closest('.image-resize-node');
      if (!isImage) {
        const pos = editor.view.posAtCoords({ left: e.clientX, top: e.clientY });
        if (pos && pos.pos) {
          editor.commands.setTextSelection(pos.pos);
        }
      }
      setPaperContextMenu({ visible: true, x: e.clientX, y: e.clientY });
    }
  };

  const handleDeletePage = useCallback(() => {
    if (!editor) return;
    if (editor.isActive('image')) {
      editor.commands.deleteSelection();
    } else {
      editor.commands.deleteNode('page');
    }
    setPaperContextMenu((prev) => ({ ...prev, visible: false }));
  }, [editor]);

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
      <PaperContextMenu
        position={paperContextMenu}
        onClose={() => setPaperContextMenu((prev) => ({ ...prev, visible: false }))}
        paperSettings={paperSettings}
        onApply={(newSettings) => setPaperSettings(newSettings)}
        onDeletePage={handleDeletePage}
      />

      <div
        className="rte-editor-canvas"
        ref={editorContainerRef}
        style={{
          '--page-font': globalFont || paperSettings.fontFamily || undefined,
          '--page-bg': globalBgColor || paperSettings.bgColor || undefined,
          '--page-text-color': paperSettings.textColor || undefined,
          '--page-padding-top': paperSettings.paddingTop + 'px',
          '--page-padding-right': paperSettings.paddingRight + 'px',
          '--page-padding-bottom': paperSettings.paddingBottom + 'px',
          '--page-padding-left': paperSettings.paddingLeft + 'px',
          '--page-width': paperSettings.pageWidth || undefined,
          '--page-min-height': paperSettings.pageMinHeight || undefined,
          '--page-font-size': paperSettings.fontSize + 'rem',
          '--page-line-height': paperSettings.lineHeight || undefined,
        }}
        onClick={(e) => {
          if (e.target.classList.contains('rte-editor-canvas')) {
            editor?.commands.focus('end');
          }
        }}
      >
        <EditorContent editor={editor} />
        
        <div className="canvas-footer-actions">
          <button className="add-page-btn dashed-border-btn" onClick={handleAddPage}>
            <Plus size={20} />
            <span>Add New Page</span>
          </button>
          <button className="add-img-btn dashed-border-btn" onClick={handleImageUpload}>
            <ImagePlus size={20} />
            <span>Add Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div className="rte-status-bar">
        <span>{wordCount} words · {charCount} characters</span>
        <span>Tiptap Editor</span>
      </div>
    </div>
  );
});

export default RichTextEditor;
