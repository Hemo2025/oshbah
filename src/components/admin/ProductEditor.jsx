import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function ProductEditor({ value, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="overflow-hidden rounded-2xl border">
      <div className="flex gap-2 border-b p-3">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="rounded bg-gray-100 px-3 py-2"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="rounded bg-gray-100 px-3 py-2"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded bg-gray-100 px-3 py-2"
        >
          •
        </button>
      </div>

      <EditorContent editor={editor} className="min-h-[250px] p-4" />
    </div>
  );
}

export default ProductEditor;
