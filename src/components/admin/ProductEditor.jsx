import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaListOl,
  FaAlignRight,
  FaAlignCenter,
  FaAlignLeft,
  FaLink,
  FaImage,
  FaEraser,
  FaQuoteRight,
} from "react-icons/fa";

function ToolbarButton({ children, onClick, active = false }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`
        flex h-10 min-w-[40px]
        items-center justify-center
        rounded-xl border transition
        ${
          active
            ? "border-green-600 bg-green-600 text-white"
            : "border-gray-200 bg-white hover:bg-gray-100"
        }
      `}
    >
      {children}
    </button>
  );
}

function ProductEditor({ value, onChange }) {
  const editor = useEditor({
    immediatelyRender: false,

    extensions: [
      StarterKit,

      Underline,

      Highlight.configure({
        multicolor: true,
      }),

      TextStyle,
      Color,

      Image.configure({
        inline: false,
      }),

      Link.configure({
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
      }),

      HorizontalRule,

      Placeholder.configure({
        placeholder: "اكتب وصف المنتج هنا...",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    content: value || "",

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) return null;

  const handleAddLink = () => {
    const { empty } = editor.state.selection;

    if (empty) {
      alert("حدد كلمة أو جملة أولاً");
      return;
    }

    const previousUrl = editor.getAttributes("link").href || "";

    const url = window.prompt("أدخل الرابط", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().unsetLink().run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({
        href: url,
        target: "_blank",
      })
      .run();
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-4">
        <ToolbarButton
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <FaBold />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <FaItalic />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <FaUnderline />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", {
            level: 1,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 1,
              })
              .run()
          }
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("heading", {
            level: 2,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 2,
              })
              .run()
          }
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <FaListUl />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <FaListOl />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({
            textAlign: "right",
          })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <FaAlignRight />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({
            textAlign: "center",
          })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <FaAlignCenter />
        </ToolbarButton>

        <ToolbarButton
          active={editor.isActive({
            textAlign: "left",
          })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <FaAlignLeft />
        </ToolbarButton>

        <input
          type="color"
          className="h-10 w-12 cursor-pointer rounded-xl border"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />

        <ToolbarButton
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <FaQuoteRight />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          ─
        </ToolbarButton>

        <ToolbarButton active={editor.isActive("link")} onClick={handleAddLink}>
          <FaLink />
        </ToolbarButton>

        <label>
          <div
            className="
              flex h-10 min-w-[40px]
              cursor-pointer items-center justify-center
              rounded-xl border border-gray-200
              bg-white hover:bg-gray-100
            "
          >
            <FaImage />
          </div>

          <input
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];

              if (!file) return;

              const reader = new FileReader();

              reader.onload = () => {
                editor
                  .chain()
                  .focus()
                  .setImage({
                    src: reader.result,
                  })
                  .run();

                e.target.value = "";
              };

              reader.readAsDataURL(file);
            }}
          />
        </label>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().unsetAllMarks().clearNodes().run()
          }
        >
          <FaEraser />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="min-h-[320px] p-5" />
    </div>
  );
}

export default ProductEditor;
