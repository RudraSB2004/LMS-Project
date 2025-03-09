import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import { Button } from "./ui/button"; // Import your custom button UI

const RichTextEditor = ({ input, setInput }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: input.description,
    onUpdate: ({ editor }) => {
      setInput({ ...input, description: editor.getHTML() });
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg p-3">
      {/* Custom Toolbar */}
      <div className="flex gap-2 border-b pb-2 mb-2">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant="outline"
        >
          B
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant="outline"
        >
          I
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant="outline"
        >
          U
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          variant="outline"
        >
          H1
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          variant="outline"
        >
          H2
        </Button>
        <Button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          variant="outline"
        >
          H3
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          variant="outline"
        >
          • List
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          variant="outline"
        >
          1. List
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] border rounded p-2"
      />
    </div>
  );
};

export default RichTextEditor;
