import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useCallback, useEffect } from 'react';


function ResizableImageComponent({ node, updateAttributes, selected, getPos, editor }) {
  const [resizing, setResizing] = useState(false);
  const imgRef = useRef(null);
  const startData = useRef(null);

  const { src, alt, title, width, align, float, gap = 8, caption } = node.attrs;

  let isStandalone = false;
  if (typeof getPos === 'function') {
    const pos = getPos();
    if (typeof pos === 'number') {
      isStandalone = editor.state.doc.resolve(pos).depth === 0;
    }
  }

  let wrapperStyle = {
    width: width ? `${width}px` : 'auto',
  };

  if (float !== 'none') {
    wrapperStyle.float = float;
    if (float === 'left') {
      wrapperStyle.margin = `0 ${gap}px 0 0`;
    } else {
      wrapperStyle.margin = `0 0 0 ${gap}px`;
    }
  } else {
    wrapperStyle.display = 'block';
    wrapperStyle.marginTop = `${gap}px`;
    wrapperStyle.marginBottom = `${gap}px`;
    wrapperStyle.marginLeft = (align === 'center' || align === 'right') ? 'auto' : 0;
    wrapperStyle.marginRight = (align === 'center' || align === 'left') ? 'auto' : 0;
  }

  const onMouseDown = useCallback(
    (e, handle) => {
      e.preventDefault();
      e.stopPropagation();
      const img = imgRef.current;
      if (!img) return;

      startData.current = {
        startX: e.clientX,
        startY: e.clientY,
        startWidth: img.offsetWidth,
        handle,
      };
      setResizing(true);
    },
    []
  );

  const onMouseMove = useCallback(
    (e) => {
      if (!startData.current) return;
      const { startX, startWidth, handle } = startData.current;
      let delta = e.clientX - startX;
      if (handle === 'top-left' || handle === 'bottom-left') {
        delta = -delta;
      }
      const newWidth = Math.max(50, startWidth + delta);
      updateAttributes({ width: newWidth });
    },
    [updateAttributes]
  );

  const onMouseUp = useCallback(() => {
    startData.current = null;
    setResizing(false);
  }, []);

  useEffect(() => {
    if (resizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
    }
  }, [resizing, onMouseMove, onMouseUp]);

  const handleClick = useCallback((e) => {
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  }, [getPos, editor]);

  const handleContextMenu = useCallback((e) => {
    if (typeof getPos === 'function') {
      editor.commands.setNodeSelection(getPos());
    }
  }, [getPos, editor]);

  return (
    <NodeViewWrapper 
      as="div" 
      className={`image-resize-node${isStandalone ? ' image-resize-node--standalone' : ''}`} 
      onClick={handleClick} 
      onContextMenu={handleContextMenu}
    >
      <div
        className={`image-resize-wrapper ${selected ? 'selected' : ''}`}
        style={wrapperStyle}
      >
        <div style={{ position: 'relative', display: 'block' }}>
          <img
            ref={imgRef}
            src={src}
            alt={alt || ''}
            title={title || ''}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            draggable={false}
          />
          {selected && (
            <>
              <div className="image-resize-handle top-left" onMouseDown={(e) => onMouseDown(e, 'top-left')} />
              <div className="image-resize-handle top-right" onMouseDown={(e) => onMouseDown(e, 'top-right')} />
              <div className="image-resize-handle bottom-left" onMouseDown={(e) => onMouseDown(e, 'bottom-left')} />
              <div className="image-resize-handle bottom-right" onMouseDown={(e) => onMouseDown(e, 'bottom-right')} />
            </>
          )}
        </div>
        {caption && (
          <figcaption className="image-caption" style={{ width: '100%', wordBreak: 'break-word', marginTop: '8px' }}>
            {caption}
          </figcaption>
        )}
      </div>
    </NodeViewWrapper>
  );
}


const ResizableImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
      align: { default: 'center' },
      float: { default: 'none' },
      gap: { default: 8 },
      caption: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'img[src]' }];
  },

  renderHTML({ HTMLAttributes }) {
    const attrs = { ...HTMLAttributes };
    if (attrs.width) {
      attrs.style = `width: ${attrs.width}px`;
      delete attrs.width;
    }
    return ['img', mergeAttributes(attrs)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});

export default ResizableImage;
