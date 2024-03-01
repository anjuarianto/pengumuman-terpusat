// "use client";
// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// // import {   Paragraph, Heading, BulletList, OrderedList, ListItem } from '@tiptap/extension-text-style';
// import { History } from '@tiptap/extension-history';
// import  Bold  from "@tiptap/extension-text-style";
// import Italic from "@tiptap/extension-text-style";
// import Underline from "@tiptap/extension-text-style";
// import Strike from "@tiptap/extension-text-style";
// import Code from "@tiptap/extension-text-style";
// import Paragraph from "@tiptap/extension-text-style";
// import Heading from "@tiptap/extension-text-style";
// import BulletList from "@tiptap/extension-text-style";
// import OrderedList from "@tiptap/extension-text-style";
// import ListItem from "@tiptap/extension-text-style";

// export default function TipTap({
//   konten,
//   onChange,
// }: {
//   konten: string;
//   onChange: (richText: string) => void;
// }) {
//     const editor = useEditor({
//       extensions: [
//         StarterKit,
//         History,
//         Bold,
//         Italic,
//         Underline,
//         Strike,
//         Code,
//         Paragraph,
//         Heading,
//         BulletList,
//         OrderedList,
//         ListItem,
//       ],
//     });
  
//     if (!editor) {
//       return null;
//     }
  
//     const toggleMark = (mark:any) => {
//       editor.chain().toggleMark(mark).focus().run();
//     };
  
//     const toggleBlock = (block:any) => {
//       editor.chain().focus().toggleNode({ type: block }).run();
//     };
  
//     return (
//       <div className="toolbar">
//         <button onClick={() => toggleMark('bold')}><strong>B</strong></button>
//         <button onClick={() => toggleMark('italic')}><em>I</em></button>
//         <button onClick={() => toggleMark('underline')}><u>U</u></button>
//         <button onClick={() => toggleMark('strike')}><s>S</s></button>
//         <button onClick={() => toggleMark('code')}>Code</button>
//         <button onClick={() => toggleBlock('heading', { level: 1 })}>H1</button>
//         <button onClick={() => toggleBlock('heading', { level: 2 })}>H2</button>
//         <button onClick={() => toggleBlock('paragraph')}>P</button>
//         <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
//         <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
//         <button onClick={() => editor.chain().focus().toggleBulletList().run()}>UL</button>
//         <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>OL</button>
//       </div>
//     );
//   };
  
//   const TipTapEditorWithToolbar = ({ konten, onChange }:{konten:any, onChange:any}) => {
//     const editor = useEditor({
//       extensions: [StarterKit],
//       content: konten,
//       onUpdate({ editor }) {
//         onChange(editor.getHTML());
//       },
//     });
  
//     return (
//       <div>
//         <Toolbar />
//         <EditorContent editor={editor} />
//       </div>
//     );
//   };
