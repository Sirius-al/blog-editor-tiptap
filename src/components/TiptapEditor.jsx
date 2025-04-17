import React, { useState, useRef, useEffect, Fragment } from 'react';
import { Listbox } from '@headlessui/react'
// import { ChevronUpDownIcon } from '@heroicons/react/20/solid'
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
  //* 
  const [activeBlock, setActiveBlock] = useState('paragraph');
  const [selectedAlignment, setSelectedAlignment] = useState(null)
  //* 
  const [toolbarState, setToolbarState] = useState({}); // For active formats
  const [youtubeHeight, setYoutubeHeight] = React.useState(300)
  const [youtubeWidth, setYoutubeWidth] = React.useState(600)


  const alignOptions = [
    { value: 'left', label: 'Align Left', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75H12a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
      </svg>
      )
    },
    { value: 'center', label: 'Align Center', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
      </svg>
      )
    },
    { value: 'right', label: 'Align Right', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
        <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm8.25 5.25a.75.75 0 0 1 .75-.75h8.25a.75.75 0 0 1 0 1.5H12a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
      </svg>
      )
    },
  ]

  const onAlignmentChange = (option) => {
    // console.log(option)
    editor.chain().focus().setTextAlign(option.value).run()
    setTimeout(() => {
      setSelectedAlignment(option)
    }, 50);
  }


  function AlignmentSelector({ editor }) {
return (
      <Listbox value={selectedAlignment} onChange={onAlignmentChange}>
        <div className="relative">
          <Listbox.Button className="flex items-center p-2 border rounded">
            <span style={{ width: '20px', height: '20px', }}>{selectedAlignment?.icon || ''}</span>
          </Listbox.Button>
  
          <Listbox.Options className="listBoxOptions-1 absolute mt-1 w-full bg-white border rounded shadow-lg z-10">
            {alignOptions.map((option) => (
              <Listbox.Option key={`${option.value}-${selectedAlignment}`} value={option} as={Fragment}>
                {({ active, selected }) => (
                  <li className={`flex items-center cursor-pointer p-2 ${ active ? 'bg-blue' : '' } ${selectedAlignment.label == option.label ? 'selected-align' : ''}`}
                  >
                    <span style={{ width: '25px', height: '25px', }}>{option.icon}</span>
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    )
  }


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
        textAlign: editor.getAttributes('paragraph').textAlign || editor.getAttributes('heading').textAlign || 'left',
        // Add more as needed.
      });

      console.log("TEXT ALIGN")
      console.log(editor.getAttributes('paragraph').textAlign || editor.getAttributes('heading').textAlign)

      const { $from } = editor.state.selection;
      const type = $from.parent.type.name;
      setActiveBlock(
        type === 'heading'
          ? `h${$from.parent.attrs.level}`
          : 'paragraph'
      );
    },
  });

  useEffect(() => {
    setSelectedAlignment(alignOptions[0])
  }, [])

  useEffect(() => {
    if (!editor) return;
    const updateAlignment = () => {
      // 1) read alignment attribute from paragraph or heading
      const pAlign = editor.getAttributes('paragraph').textAlign;
      const hAlign = editor.getAttributes('heading').textAlign;
      const align   = pAlign || hAlign || 'left';      // default left
      // 2) find matching option
      const option = alignOptions.find(o => o.value === align);
      if (option) {
        setSelectedAlignment(option);                 // sync state
      }
    };
    
    editor.on('selectionUpdate', updateAlignment);   // fires on cursor move
    return () => editor.off('selectionUpdate', updateAlignment);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    // Also update on selection changes
    const handler = () => {
      const { $from } = editor.state.selection;
      const type = $from.parent.type.name;
      setActiveBlock(
        type === 'heading'
          ? `h${$from.parent.attrs.level}`
          : 'paragraph'
      );
    };
    editor.on('selectionUpdate', handler);
    return () => editor.off('selectionUpdate', handler);
  }, [editor]);

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
    <div className="editor-main">
      {mode === 'write' && (
        <div className="all-selectors">
          {/* Undo/Redo buttons */}
          <button
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 border rounded"
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M9.53 2.47a.75.75 0 0 1 0 1.06L4.81 8.25H15a6.75 6.75 0 0 1 0 13.5h-3a.75.75 0 0 1 0-1.5h3a5.25 5.25 0 1 0 0-10.5H4.81l4.72 4.72a.75.75 0 1 1-1.06 1.06l-6-6a.75.75 0 0 1 0-1.06l6-6a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 border rounded"
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M14.47 2.47a.75.75 0 0 1 1.06 0l6 6a.75.75 0 0 1 0 1.06l-6 6a.75.75 0 1 1-1.06-1.06l4.72-4.72H9a5.25 5.25 0 1 0 0 10.5h3a.75.75 0 0 1 0 1.5H9a6.75 6.75 0 0 1 0-13.5h10.19l-4.72-4.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {/* Basic formatting */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 border rounded ${toolbarState.bold ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M5.246 3.744a.75.75 0 0 1 .75-.75h7.125a4.875 4.875 0 0 1 3.346 8.422 5.25 5.25 0 0 1-2.97 9.58h-7.5a.75.75 0 0 1-.75-.75V3.744Zm7.125 6.75a2.625 2.625 0 0 0 0-5.25H8.246v5.25h4.125Zm-4.125 2.251v6h4.5a3 3 0 0 0 0-6h-4.5Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 border rounded ${toolbarState.italic ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M10.497 3.744a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-3.275l-5.357 15.002h2.632a.75.75 0 1 1 0 1.5h-7.5a.75.75 0 1 1 0-1.5h3.275l5.357-15.002h-2.632a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {/* Headings */}
          {/* {[1, 2, 3, 4, 5, 6].map((level) => (
            <button
              key={level}
              onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
              className={`p-2 border rounded ${toolbarState.heading === level ? 'bg-gray' : ''}`}
            >
              H{level}
            </button>
          ))} */}
          <select
            value={activeBlock}
            onChange={(e) => {
              const val = e.target.value;
              if (val === 'paragraph') {
                editor.chain().focus().setParagraph().run();
              } else {
                const lvl = +val.slice(1);
                editor.chain().focus().setHeading({ level: lvl }).run();
              }
            }}
            className="p-2 border rounded"
          >
            <option value="paragraph">P</option>
            {[1,2,3,4,5,6].map((l) => (
              <option key={l} value={`h${l}`}>H{l}</option>
            ))}
          </select>
          {/* Lists */}
          {/* <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`p-2 border rounded ${toolbarState.bulletList ? 'bg-gray' : ''}`}
          >
            P
          </button> */}
          {/* Highlight */}
          {/* <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`p-2 border rounded ${toolbarState.highlight ? 'bg-gray' : ''}`}
          >
            Highlight Text
          </button> */}
          {/* Link */}
          <button
            onClick={handleLinkInsertion}
            className={`p-2 border rounded ${editor.isActive('link') ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '22px', height: '20px', }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clip-path="url(#clip0_429_11074)">
              <path d="M8 11.9999H16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9 7.99994H6C3.79086 7.99994 2 9.7908 2 11.9999C2 14.2091 3.79086 15.9999 6 15.9999H9" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 7.99994H18C20.2091 7.99994 22 9.7908 22 11.9999C22 14.2091 20.2091 15.9999 18 15.9999H15" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </g>
              <defs>
              <clipPath id="clip0_429_11074">
              <rect width="24" height="24" fill="white"/>
              </clipPath>
              </defs>
            </svg>
            </span>
          </button>
          {/* Strike */}
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 border rounded ${toolbarState.strike ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '18px', height: '18px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a8.912 8.912 0 0 1-.318-.079c-1.585-.424-2.904-1.247-3.76-2.236-.873-1.009-1.265-2.19-.968-3.301.59-2.2 3.663-3.29 6.863-2.432A8.186 8.186 0 0 1 16.5 5.21M6.42 17.81c.857.99 2.176 1.812 3.761 2.237 3.2.858 6.274-.23 6.863-2.431.233-.868.044-1.779-.465-2.617M3.75 12h16.5" />
              </svg>
            </span>
          </button>
          {/* Subscript */}
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`p-2 border rounded ${toolbarState.subscript ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '18px', height: '18px', }}>
              <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M496 448h-16V304a16 16 0 0 0-16-16h-48a16 16 0 0 0-14.29 8.83l-16 32A16 16 0 0 0 400 352h16v96h-16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM336 64h-67a16 16 0 0 0-13.14 6.87l-79.9 115-79.9-115A16 16 0 0 0 83 64H16A16 16 0 0 0 0 80v48a16 16 0 0 0 16 16h33.48l77.81 112-77.81 112H16a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h67a16 16 0 0 0 13.14-6.87l79.9-115 79.9 115A16 16 0 0 0 269 448h67a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16h-33.48l-77.81-112 77.81-112H336a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"/></svg>
            </span>
          </button>
          {/* Superscript */}
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`p-2 border rounded ${toolbarState.superscript ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '18px', height: '18px', }}>
              <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M496 160h-16V16a16 16 0 0 0-16-16h-48a16 16 0 0 0-14.29 8.83l-16 32A16 16 0 0 0 400 64h16v96h-16a16 16 0 0 0-16 16v32a16 16 0 0 0 16 16h96a16 16 0 0 0 16-16v-32a16 16 0 0 0-16-16zM336 64h-67a16 16 0 0 0-13.14 6.87l-79.9 115-79.9-115A16 16 0 0 0 83 64H16A16 16 0 0 0 0 80v48a16 16 0 0 0 16 16h33.48l77.81 112-77.81 112H16a16 16 0 0 0-16 16v48a16 16 0 0 0 16 16h67a16 16 0 0 0 13.14-6.87l79.9-115 79.9 115A16 16 0 0 0 269 448h67a16 16 0 0 0 16-16v-48a16 16 0 0 0-16-16h-33.48l-77.81-112 77.81-112H336a16 16 0 0 0 16-16V80a16 16 0 0 0-16-16z"/></svg>
            </span>
          </button>
          {/* Underline */}
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 border rounded ${toolbarState.underline ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M5.995 2.994a.75.75 0 0 1 .75.75v7.5a5.25 5.25 0 1 0 10.5 0v-7.5a.75.75 0 0 1 1.5 0v7.5a6.75 6.75 0 1 1-13.5 0v-7.5a.75.75 0 0 1 .75-.75Zm-3 17.252a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5h-16.5a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {/* Text Align buttons */}
          <AlignmentSelector 
            editor={editor} 
            options={alignOptions} 
            selected={selectedAlignment} 
            onChange={(opt) => {
              editor.chain().focus().setTextAlign(opt.value).run();  // apply in editor
              setSelectedAlignment(opt);                             // reflect in UI
            }}
          />
          {/* Bullet List */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 border rounded ${toolbarState.bulletList ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
            <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 7.5C4.32843 7.5 5 6.82843 5 6C5 5.17157 4.32843 4.5 3.5 4.5C2.67157 4.5 2 5.17157 2 6C2 6.82843 2.67157 7.5 3.5 7.5Z" fill="currentColor"/>
              <path d="M8 5C7.44772 5 7 5.44772 7 6C7 6.55228 7.44772 7 8 7H21C21.5523 7 22 6.55228 22 6C22 5.44772 21.5523 5 21 5H8Z" fill="currentColor"/>
              <path d="M8 11C7.44772 11 7 11.4477 7 12C7 12.5523 7.44772 13 8 13H21C21.5523 13 22 12.5523 22 12C22 11.4477 21.5523 11 21 11H8Z" fill="currentColor"/>
              <path d="M7 18C7 17.4477 7.44772 17 8 17H21C21.5523 17 22 17.4477 22 18C22 18.5523 21.5523 19 21 19H8C7.44772 19 7 18.5523 7 18Z" fill="currentColor"/>
              <path d="M5 12C5 12.8284 4.32843 13.5 3.5 13.5C2.67157 13.5 2 12.8284 2 12C2 11.1716 2.67157 10.5 3.5 10.5C4.32843 10.5 5 11.1716 5 12Z" fill="currentColor"/>
              <path d="M3.5 19.5C4.32843 19.5 5 18.8284 5 18C5 17.1716 4.32843 16.5 3.5 16.5C2.67157 16.5 2 17.1716 2 18C2 18.8284 2.67157 19.5 3.5 19.5Z" fill="#000000"/>
            </svg>
            </span>
          </button>
          {/* Ordered List */}
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 border rounded ${toolbarState.orderedList ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="currentColor" className="size-6" stroke="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>list_ordered_line</title> <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Editor" transform="translate(-768.000000, 0.000000)" fill-rule="nonzero"> <g id="list_ordered_line" transform="translate(768.000000, 0.000000)"> <path d="M24,0 L24,24 L0,24 L0,0 L24,0 Z M12.5934901,23.257841 L12.5819402,23.2595131 L12.5108777,23.2950439 L12.4918791,23.2987469 L12.4918791,23.2987469 L12.4767152,23.2950439 L12.4056548,23.2595131 C12.3958229,23.2563662 12.3870493,23.2590235 12.3821421,23.2649074 L12.3780323,23.275831 L12.360941,23.7031097 L12.3658947,23.7234994 L12.3769048,23.7357139 L12.4804777,23.8096931 L12.4953491,23.8136134 L12.4953491,23.8136134 L12.5071152,23.8096931 L12.6106902,23.7357139 L12.6232938,23.7196733 L12.6232938,23.7196733 L12.6266527,23.7031097 L12.609561,23.275831 C12.6075724,23.2657013 12.6010112,23.2592993 12.5934901,23.257841 L12.5934901,23.257841 Z M12.8583906,23.1452862 L12.8445485,23.1473072 L12.6598443,23.2396597 L12.6498822,23.2499052 L12.6498822,23.2499052 L12.6471943,23.2611114 L12.6650943,23.6906389 L12.6699349,23.7034178 L12.6699349,23.7034178 L12.678386,23.7104931 L12.8793402,23.8032389 C12.8914285,23.8068999 12.9022333,23.8029875 12.9078286,23.7952264 L12.9118235,23.7811639 L12.8776777,23.1665331 C12.8752882,23.1545897 12.8674102,23.1470016 12.8583906,23.1452862 L12.8583906,23.1452862 Z M12.1430473,23.1473072 C12.1332178,23.1423925 12.1221763,23.1452606 12.1156365,23.1525954 L12.1099173,23.1665331 L12.0757714,23.7811639 C12.0751323,23.7926639 12.0828099,23.8018602 12.0926481,23.8045676 L12.108256,23.8032389 L12.3092106,23.7104931 L12.3186497,23.7024347 L12.3186497,23.7024347 L12.3225043,23.6906389 L12.340401,23.2611114 L12.337245,23.2485176 L12.337245,23.2485176 L12.3277531,23.2396597 L12.1430473,23.1473072 Z" id="MingCute" fill-rule="nonzero"> </path> <path d="M5.43576,16.7202 C6.24693,16.7202 6.90006,17.3807 6.90006,18.1869 C6.90006,18.4774 6.81337,18.7582 6.65589,18.9952 C6.81331,19.2321 6.89997,19.5129 6.89997,19.8033 C6.89997,20.6096 6.24685,21.27 5.43567,21.27 C4.78616,21.27 4.27297,20.9917 4.00872,20.3689 C3.86849,20.0385 4.02271,19.6569 4.35318,19.5167 C4.68364,19.3764 5.06521,19.5307 5.20544,19.8611 C5.23345,19.9271 5.29822,19.97 5.36995,19.97 C5.479,19.97 5.59997,19.9398 5.59997,19.8033 C5.59997,19.7023833 5.52693528,19.6598694 5.44362625,19.6485014 L5.39291,19.6452 C5.03386,19.6452 4.74283,19.3541 4.74283,18.995 C4.74283,18.6686364 4.98333413,18.3984711 5.29677666,18.3520473 L5.39283,18.345 C5.49475,18.345 5.60006,18.3081 5.60006,18.1869 C5.60006,18.0504 5.47911,18.0202 5.37007,18.0202 C5.29835,18.0202 5.23357,18.0631 5.20556,18.1291 C5.06533,18.4596 4.68376,18.6138 4.3533,18.4736 C4.02283,18.3333 3.86861,17.9518 4.00884,17.6213 C4.27308,16.9986 4.78626,16.7202 5.43576,16.7202 Z M20,18 C20.5523,18 21,18.4477 21,19 C21,19.5523 20.5523,20 20,20 L9,20 C8.44772,20 8,19.5523 8,19 C8,18.4477 8.44772,18 9,18 L20,18 Z M6.08078,9.94525 C6.72558,10.2677 7.05451,11.0088 6.88063,11.7043 C6.81679,11.9596 6.68907,12.1946 6.50947,12.387 L5.95592,12.9801 L6.4256,12.9801 C6.78459,12.9801 7.0756,13.2711 7.0756,13.6301 C7.0756,13.9891 6.78459,14.2801 6.4256,14.2801 L4.5731,14.2801 C4.21155,14.2801 3.91846,13.987 3.91846,13.6255 C3.91846,13.4195 3.9468,13.2274 4.09452,13.0692 L5.5591,11.5 C5.66833,11.383 5.64089,11.1787 5.49941,11.108 C5.362945,11.03975 5.25019141,11.1187297 5.22413527,11.2496762 L5.21846,11.3087 C5.21846,11.6677 4.92744,11.9587 4.56846,11.9587 C4.17777,11.9587 3.91846,11.632 3.91846,11.2617 C3.91846,10.5817 4.38122,9.98904 5.04087,9.82413 C5.3917,9.73642 5.75867,9.7842 6.08078,9.94525 Z M20,11 C20.5523,11 21,11.4477 21,12 C21,12.51285 20.613973,12.9355092 20.1166239,12.9932725 L20,13 L9,13 C8.44772,13 8,12.5523 8,12 C8,11.48715 8.38604429,11.0644908 8.88337975,11.0067275 L9,11 L20,11 Z M6.15004,3.38925 L6.15004,6.62991 C6.15004,6.9889 5.85903,7.27991 5.50004,7.27991 C5.14106,7.27991 4.85004,6.9889 4.85004,6.62991 L4.85004,4.52233 C4.60765,4.5599 4.35422,4.45799 4.20921,4.24047 C4.01008,3.94177 4.0908,3.53821 4.38949,3.33908 L5.13172,2.84426 C5.56699,2.55408 6.15004,2.8661 6.15004,3.38925 Z M20,4 C20.5523,4 21,4.44772 21,5 C21,5.51283143 20.613973,5.93550653 20.1166239,5.9932722 L20,6 L9,6 C8.44772,6 8,5.55228 8,5 C8,4.48716857 8.38604429,4.06449347 8.88337975,4.0067278 L9,4 L20,4 Z" id="形状" fill="currentColor"> </path> </g> </g> </g> </g></svg>
            </span>
          </button>
          {/* Code Block */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 border rounded ${toolbarState.codeBlock ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M2.25 6a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V6Zm3.97.97a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 0 1-1.06-1.06l1.72-1.72-1.72-1.72a.75.75 0 0 1 0-1.06Zm4.28 4.28a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
          {/* Task List */}
          <button
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={`p-2 border rounded ${toolbarState.taskList ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg fill="currentColor" viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/">
                  <g id="SVGRepo_bgCarrier" stroke-width="0"/>
                  <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"/>
                  <g id="SVGRepo_iconCarrier"> <rect id="Icons" x="-576" y="0"/> <g id="Icons1" serif:id="Icons"> <g id="Strike"> </g> <g id="H1"> </g> <g id="H2"> </g> <g id="H3"> </g> <g id="list-ul"> </g> <g id="hamburger-1"> </g> <g id="hamburger-2"> </g> <g id="list-ol"> </g> <g id="list-task"> <path d="M14.563,17.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> <path d="M14.563,17.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> <path d="M14.563,49.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> <path d="M14.563,49.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> <path d="M14.563,33.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> <path d="M14.563,33.167l7.468,-7.468l2.61,2.61l-10.107,10.107l-6.359,-6.358l2.64,-2.64l3.748,3.749Zm41.456,0.806l-27.993,0l0,-3.969l27.993,0l0,3.969Z"/> </g> <g id="trash"> </g> <g id="vertical-menu"> </g> <g id="horizontal-menu"> </g> <g id="sidebar-2"> </g> <g id="Pen"> </g> <g id="Pen1" serif:id="Pen"> </g> <g id="clock"> </g> <g id="external-link"> </g> <g id="hr"> </g> <g id="info"> </g> <g id="warning"> </g> <g id="plus-circle"> </g> <g id="minus-circle"> </g> <g id="vue"> </g> <g id="cog"> </g> <g id="logo"> </g> <g id="radio-check"> </g> <g id="eye-slash"> </g> <g id="eye"> </g> <g id="toggle-off"> </g> <g id="shredder"> </g> <g id="spinner--loading--dots-" serif:id="spinner [loading, dots]"> </g> <g id="react"> </g> <g id="check-selected"> </g> <g id="turn-off"> </g> <g id="code-block"> </g> <g id="user"> </g> <g id="coffee-bean"> </g> <g id="coffee-beans"> <g id="coffee-bean1" serif:id="coffee-bean"> </g> </g> <g id="coffee-bean-filled"> </g> <g id="coffee-beans-filled"> <g id="coffee-bean2" serif:id="coffee-bean"> </g> </g> <g id="clipboard"> </g> <g id="clipboard-paste"> </g> <g id="clipboard-copy"> </g> <g id="Layer1"> </g> </g> </g>
                </svg>
            </span>
          </button>
          {/* Blockquote */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 border rounded ${toolbarState.blockquote ? 'bg-gray' : ''}`}
          >
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d='M.78,8.89c0-3.07,1.53-4.3,4.3-4.34L5.38,6C3.78,6.17,3,7,3.1,8.31H4.54V12H.78Zm5.9,0c0-3.07,1.53-4.3,4.3-4.34L11.28,6C9.68,6.17,8.89,7,9,8.31h1.44V12H6.68Z' />
                <path d='M16.94,15.11c0,3.07-1.53,4.3-4.3,4.34L12.35,18c1.6-.16,2.39-1,2.28-2.3H13.18V12h3.76Zm5.9,0c0,3.07-1.53,4.3-4.3,4.34L18.24,18c1.6-.16,2.39-1,2.28-2.3H19.08V12h3.76Z' />
              </svg>
            </span>
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
            <span style={{ display: 'block', width: '20px', height: '20px', }}>
              <svg fill="currentColor"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"viewBox="0 0 512 512" xml:space="preserve"> <g id="7935ec95c421cee6d86eb22ecd1368a9"> <path d="M34.354,0.5h45.959l29.604,91.096h2.863L141.013,0.5h46.353l-53.107,133.338v94.589H88.641V138.08
                  L34.354,0.5z M192.193,98.657c0-13.374,5.495-24.003,16.493-31.938c10.984-7.934,25.749-11.901,44.3-11.901
                  c16.893,0,30.728,4.192,41.506,12.55c10.805,8.358,16.193,19.112,16.193,32.287v89.2c0,14.771-5.301,26.373-15.868,34.782
                  c-10.579,8.408-25.151,12.625-43.684,12.625c-17.859,0-32.143-4.342-42.866-13.024c-10.709-8.683-16.074-20.36-16.074-35.057
                  V98.657z M234.205,191.424c0,4.766,1.44,8.409,4.354,11.029c2.907,2.595,7.055,3.867,12.451,3.867c5.532,0,9.93-1.297,13.18-3.942
                  c3.256-2.669,4.891-6.313,4.891-10.954V97.359c0-3.768-1.672-6.812-4.99-9.132c-3.318-2.321-7.679-3.494-13.081-3.494
                  c-4.972,0-9.027,1.173-12.133,3.494c-3.119,2.32-4.672,5.364-4.672,9.132V191.424z M459.992,57.588v172.711h-40.883v-19.063
                  c-7.547,7.037-15.381,12.375-23.541,16.069c-8.146,3.643-16.068,5.489-23.729,5.489c-9.455,0-16.592-2.57-21.383-7.71
                  c-4.791-5.141-7.186-12.85-7.186-23.13V57.588h40.895v132.39c0,4.117,0.861,7.061,2.57,8.907c1.723,1.822,4.492,2.745,8.322,2.745
                  c3.018,0,6.824-1.223,11.4-3.643c4.604-2.42,8.82-5.514,12.65-9.282V57.588H459.992z M421.68,363.262
                  c-2.008-2.221-5.203-3.368-9.594-3.368c-4.59,0-7.883,1.147-9.879,3.368c-1.996,2.245-2.994,5.963-2.994,11.153v10.754h25.473
                  v-10.754C424.686,369.225,423.688,365.507,421.68,363.262z M300.855,444.228c2.195,0.898,4.516,1.322,6.961,1.322
                  c3.543,0,6.113-0.849,7.785-2.595c1.67-1.722,2.494-4.591,2.494-8.533v-62.178c0-4.191-1.023-7.36-3.068-9.531
                  c-2.059-2.171-5.064-3.244-8.957-3.244c-2.059,0-4.092,0.399-6.102,1.198c-2.008,0.823-3.991,2.096-5.95,3.792v75.402
                  C296.364,441.907,298.646,443.354,300.855,444.228z M490.496,312.587c0-29.941-30.754-54.219-68.654-54.219
                  c-54.068-1.822-109.396-2.62-165.842-2.521c-56.427-0.1-111.756,0.698-165.843,2.521c-37.881,0-68.633,24.277-68.633,54.219
                  c-2.277,23.678-3.263,47.381-3.175,71.085c-0.087,23.703,0.898,47.406,3.175,71.11c0,29.916,30.752,54.192,68.633,54.192
                  c54.087,1.797,109.416,2.596,165.843,2.521c56.446,0.075,111.774-0.724,165.842-2.521c37.9,0,68.654-24.276,68.654-54.192
                  c2.27-23.704,3.254-47.407,3.154-71.11C493.75,359.968,492.766,336.265,490.496,312.587z M121.251,463.465v1.797H88.778v-1.797
                  V321.644H55.182v-1.771v-22.605v-1.771h99.672v1.771v22.605v1.771h-33.603V463.465z M236.768,341.33v122.135v1.797h-28.831v-1.797
                  v-11.901c-5.327,5.064-10.848,8.882-16.592,11.527c-5.757,2.619-11.334,3.942-16.748,3.942c-6.662,0-11.684-1.847-15.065-5.515
                  c-3.387-3.692-5.078-9.231-5.078-16.617v-1.797V341.33v-1.772h28.844v1.772v93.216c0,2.92,0.599,5.065,1.802,6.363
                  c1.217,1.322,3.175,1.971,5.876,1.971c2.127,0,4.803-0.873,8.047-2.595c3.231-1.747,6.2-3.967,8.914-6.662V341.33v-1.772h28.831
                  V341.33z M347.775,370.847v66.943v1.797c0,8.808-2.258,15.544-6.773,20.235c-4.518,4.641-11.055,6.986-19.588,6.986
                  c-5.639,0-10.652-0.898-15.07-2.695c-4.428-1.821-8.532-4.616-12.325-8.384v7.735v1.797h-29.105v-1.797V297.267v-1.771h29.105
                  v1.771v52.297c3.893-3.793,8.009-6.662,12.376-8.608c4.379-1.971,8.809-2.969,13.273-2.969c9.107,0,16.094,2.645,20.896,7.935
                  c4.803,5.289,7.211,12.999,7.211,23.13V370.847z M454.365,374.64v29.767v1.797h-55.152v21.581c0,6.513,0.947,11.029,2.844,13.549
                  c1.908,2.521,5.152,3.793,9.742,3.793c4.779,0,8.135-1.073,10.043-3.219c1.896-2.121,2.844-6.837,2.844-14.123v-6.811v-1.796h29.68
                  v1.796v7.51v1.796c0,12.7-3.605,22.257-10.84,28.694c-7.225,6.438-18.016,9.631-32.375,9.631c-12.912,0-23.066-3.418-30.49-10.229
                  c-7.41-6.812-11.127-16.193-11.127-28.096v-1.796V374.64v-1.771c0-10.754,4.078-19.512,12.213-26.299
                  c8.146-6.762,18.689-10.155,31.588-10.155c13.199,0,23.328,3.144,30.416,9.406c7.061,6.264,10.615,15.296,10.615,27.048V374.64z"> </path> </g> 
              </svg>
            </span>
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
            <span style={{ width: '20px', height: '20px', display: 'block' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
              </svg>
            </span>
          </button>
        </div>
      )}
      <div className="p-3 bg-white shadow-md">
        <EditorContent editor={editor} className="prose max-w-none p-2" />
      </div>
    </div>
  );
};

export default TiptapEditor;
