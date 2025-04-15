import React, { useState, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Paragraph from '@tiptap/extension-paragraph'
import Image from '@tiptap/extension-image';
import ImageResize from 'tiptap-extension-resize-image';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Strike from '@tiptap/extension-strike';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
// Hypothetical YouTube extension (community or custom)
import Youtube from '@tiptap/extension-youtube';

const TiptapEditor = ({ mode = 'write', content, onContentChange }) => {
  const imageUploadInputRef = useRef(null);
  const [toolbarState, setToolbarState] = useState({}); // For active formats
  const [youtubeHeight, setYoutubeHeight] = React.useState(300)
  const [youtubeWidth, setYoutubeWidth] = React.useState(600)

  const editor = useEditor({
    editable: mode === 'write',
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Write something …' }),
      Bold,
      Italic,
      Heading.configure({ levels: [1,2,3,4,5,6] }),
      Blockquote,
      // Paragraph and Text are available via StarterKit.
      Paragraph,
      Image,
      ImageResize,
      CodeBlock,
      TaskList.configure({ HTMLAttributes: { class: 'my-custom-tasklist' } }),
      TaskItem.configure({ nested: true }),
      BulletList,
      OrderedList,
      ListItem,
      Highlight,
      Link.configure({
        // By default, opens link in a new tab; customize as needed.
        HTMLAttributes: {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      }),
      Strike,
      Subscript,
      Superscript,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({ // assume config supports resizing
        width: 640,
        height: 360,
      }),
    ],
    content, // Prefill content (HTML or JSON)
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const json = editor.getJSON();
      if (onContentChange && mode === 'write') {
        onContentChange({ html, json });
      }
      console.log('Content changed:', {html}, {json});
      // Update toolbar state based on current selection
      setToolbarState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        heading: editor.getAttributes('heading').level || null,
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        codeBlock: editor.isActive('codeBlock'),
        taskList: editor.isActive('taskList'),
        blockquote: editor.isActive('blockquote'),
        highlight: editor.isActive('highlight'),
        strike: editor.isActive('strike'),
        subscript: editor.isActive('subscript'),
        superscript: editor.isActive('superscript'),
        underline: editor.isActive('underline'),
        textAlign: editor.getAttributes('paragraph').textAlign || editor.getAttributes('heading').textAlign || null,
        // Add more as needed.
      });
    },
  });

  useEffect(() => {
    if (!editor) return;

    const updateToolbar = () => {
      setToolbarState({
        bold: editor.isActive('bold'),
        italic: editor.isActive('italic'),
        heading: editor.getAttributes('heading').level || null,
        bulletList: editor.isActive('bulletList'),
        orderedList: editor.isActive('orderedList'),
        codeBlock: editor.isActive('codeBlock'),
        taskList: editor.isActive('taskList'),
        blockquote: editor.isActive('blockquote'),
        highlight: editor.isActive('highlight'),
        strike: editor.isActive('strike'),
        subscript: editor.isActive('subscript'),
        superscript: editor.isActive('superscript'),
        underline: editor.isActive('underline'),
        textAlign: editor.getAttributes('paragraph').textAlign || editor.getAttributes('heading').textAlign || null,
      });
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);

    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
    };
  }, [editor]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
  };

  // For link insertion, prompt user for the URL
  const handleLinkInsertion = () => {
    const previousUrl = editor.getAttributes('link').href || '';
    const url = window.prompt('Enter the URL', previousUrl);
    // If user cancels or leaves empty, remove the link
    if (url === null) {
      return;
    }
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  if (!editor) return null;

  return (
    <div className="p-5">
      {mode === 'write' && (
        <div className="flex flex-wrap gap-2 mb-2">
          {/* Undo/Redo buttons */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 border rounded"
          >
            Undo
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 border rounded"
          >
            Redo
          </button>
          {/* Basic formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 border rounded ${toolbarState.bold ? 'bg-gray' : ''}`}
          >
            Bold
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 border rounded ${toolbarState.italic ? 'bg-gray' : ''}`}
          >
            Italic
          </button>
          {/* Headings */}
          {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={`p-2 border rounded ${toolbarState.heading === level ? 'bg-gray' : ''}`}
            >
              H{level}
            </button>
          ))}
          {/* Lists */}
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 border rounded ${toolbarState.bulletList ? 'bg-gray' : ''}`}
          >
            P
          </button>
                    {/* Highlight */}
                    <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 border rounded ${toolbarState.highlight ? 'bg-gray' : ''}`}
          >
            Highlight Text
          </button>
          {/* Link */}
          <button
            onClick={handleLinkInsertion}
            className={`p-2 border rounded ${editor.isActive('link') ? 'bg-gray' : ''}`}
          >
            Link
          </button>
          {/* Strike */}
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 border rounded ${toolbarState.strike ? 'bg-gray' : ''}`}
          >
            Strike-through
          </button>
          {/* Subscript */}
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-2 border rounded ${toolbarState.subscript ? 'bg-gray' : ''}`}
          >
            Subscript
          </button>
          {/* Superscript */}
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-2 border rounded ${toolbarState.superscript ? 'bg-gray' : ''}`}
          >
            Superscript
          </button>
          {/* Underline */}
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 border rounded ${toolbarState.underline ? 'bg-gray' : ''}`}
          >
            Underline
          </button>
          {/* Text Align buttons */}
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 border rounded ${
              editor.getAttributes('paragraph').textAlign === 'left' ||
              editor.getAttributes('heading').textAlign === 'left'
                ? 'bg-gray'
                : ''
            }`}
          >
            Align Left
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 border rounded ${
              editor.getAttributes('paragraph').textAlign === 'center' ||
              editor.getAttributes('heading').textAlign === 'center'
                ? 'bg-gray'
                : ''
            }`}
          >
            Align Center
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 border rounded ${
              editor.getAttributes('paragraph').textAlign === 'right' ||
              editor.getAttributes('heading').textAlign === 'right'
                ? 'bg-gray'
                : ''
            }`}
          >
            Align Right
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 border rounded ${toolbarState.bulletList ? 'bg-gray' : ''}`}
          >
            Bullet List
          </button>
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 border rounded ${toolbarState.orderedList ? 'bg-gray' : ''}`}
          >
            Ordered List
          </button>
          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 border rounded ${toolbarState.codeBlock ? 'bg-gray' : ''}`}
          >
            Code Block
          </button>
          {/* Task List */}
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-2 border rounded ${toolbarState.taskList ? 'bg-gray' : ''}`}
          >
            Task List
          </button>
          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 border rounded ${toolbarState.blockquote ? 'bg-gray' : ''}`}
          >
            Blockquote
          </button>
          {/* Youtube embed */}
          <button
            onClick={() => {
              const url = window.prompt('Enter the YouTube URL:');
              if (url) {
                editor.commands.setYoutubeVideo({
                  src: url,
                  width: youtubeWidth,
                  height: youtubeHeight,
                });
              }
            }}
            className="p-2 border rounded"
          >
            Youtube
          </button>
          <input
            ref={imageUploadInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <button
            onClick={() => imageUploadInputRef.current.click()}
            className="p-2 border rounded"
          >
            Image
          </button>
        </div>
      )}
      <div className="border p-3 rounded-md bg-white shadow-md">
        <EditorContent editor={editor} className="prose max-w-none p-2" />
      </div>
    </div>
  );
};

export default TiptapEditor;
