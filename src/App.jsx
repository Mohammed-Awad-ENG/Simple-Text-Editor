import { useRef, useCallback } from 'react';
import RichTextEditor from './components/RichTextEditor/RichTextEditor';

function App() {
  const editorRef = useRef(null);


  const handleGetHtml = useCallback(() => {
    const html = editorRef.current?.getHtml();
    console.log('Editor HTML:', html);
  }, []);

  return (
    <>
      <RichTextEditor
        ref={editorRef}
        placeholder="Start writing something amazing..."
        initialContent="<h2>Welcome to the Editor</h2><p>This is a <strong>rich text editor</strong> built with <em>Tiptap</em>. Try out all the toolbar features — formatting, headings, font families, colors, images, and more.</p><p>Select some text to see the <u>bubble menu</u> appear. Use the toolbar above to change fonts, export your document, and insert images.</p>"
      />
    </>
  );
}

export default App;
