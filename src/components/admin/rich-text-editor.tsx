"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { cn } from "@/lib/utils";

type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium",
        "text-zinc-500 transition-all",
        "hover:bg-zinc-200 hover:text-zinc-900",
        "dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",
        active && [
          "bg-zinc-200 text-zinc-900",
          "dark:bg-zinc-700 dark:text-zinc-100",
        ],
      )}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <div className="mx-1 my-1 h-6 w-px bg-zinc-200 dark:bg-zinc-800" />
  );
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write…",
  className,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),

      Underline,

      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),

      Image.configure({
        HTMLAttributes: {
          loading: "lazy",
        },
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],

    content: value || "",

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: [
          "tiptap-editor",
          "prose prose-sm dark:prose-invert",
          "max-w-none",
          "min-h-[260px]",
          "px-4 py-4 md:px-5 md:py-5",
          "focus:outline-none",

          "text-zinc-800",
          "dark:text-zinc-200",

          "prose-headings:text-zinc-900",
          "dark:prose-headings:text-zinc-100",

          "prose-p:text-zinc-700",
          "dark:prose-p:text-zinc-300",

          "prose-strong:text-zinc-900",
          "dark:prose-strong:text-zinc-100",

          "prose-li:text-zinc-700",
          "dark:prose-li:text-zinc-300",

          "prose-blockquote:border-zinc-300",
          "prose-blockquote:text-zinc-600",
          "dark:prose-blockquote:border-zinc-700",
          "dark:prose-blockquote:text-zinc-400",

          "prose-a:text-violet-600",
          "dark:prose-a:text-violet-400",
        ].join(" "),
      },
    },

    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;

    const current = editor.getHTML();

    if ((value || "") !== current) {
      editor.commands.setContent(value || "", {
        emitUpdate: false,
      });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-xl border border-zinc-200 bg-white",
          "dark:border-zinc-800 dark:bg-[#19191b]",
          className,
        )}
      >
        <div className="flex h-11 items-center border-b border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-800 dark:bg-[#161618]">
          <div className="h-6 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="min-h-[260px] animate-pulse bg-white dark:bg-[#19191b]" />
      </div>
    );
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as
      | string
      | undefined;

    const url = window.prompt(
      "Link URL",
      previousUrl || "https://",
    );

    if (url === null) return;

    if (url === "") {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .unsetLink()
        .run();

      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  };

  const insertImage = () => {
    const url = window.prompt("Image URL");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setImage({
        src: url,
      })
      .run();
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl",
        "border border-zinc-200 bg-white",
        "shadow-sm shadow-zinc-950/[0.02]",
        "dark:border-zinc-800 dark:bg-[#19191b]",
        "dark:shadow-none",
        className,
      )}
    >
      {/* Toolbar */}
      <div
        className={cn(
          "flex min-h-12 flex-wrap items-center gap-0.5",
          "border-b border-zinc-200 bg-zinc-50/80 px-2 py-1.5",
          "dark:border-zinc-800 dark:bg-[#161618]",
        )}
      >
        <ToolbarButton
          title="Heading 2"
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
          title="Heading 3"
          active={editor.isActive("heading", {
            level: 3,
          })}
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({
                level: 3,
              })
              .run()
          }
        >
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() =>
            editor.chain().focus().toggleBold().run()
          }
        >
          <span className="font-bold">B</span>
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() =>
            editor.chain().focus().toggleItalic().run()
          }
        >
          <span className="font-serif italic">I</span>
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          active={editor.isActive("underline")}
          onClick={() =>
            editor.chain().focus().toggleUnderline().run()
          }
        >
          <span className="underline underline-offset-2">U</span>
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          Link
        </ToolbarButton>

        <ToolbarButton
          title="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
        >
          Quote
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
        >
          • List
        </ToolbarButton>

        <ToolbarButton
          title="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
        >
          1. List
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton
          title="Insert image"
          onClick={insertImage}
        >
          Image
        </ToolbarButton>

        <ToolbarButton
          title="Horizontal rule"
          onClick={() =>
            editor.chain().focus().setHorizontalRule().run()
          }
        >
          HR
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="bg-white dark:bg-[#19191b]">
        <EditorContent editor={editor} />
      </div>

      {/* Bottom status */}
      <div
        className={cn(
          "flex items-center justify-between",
          "border-t border-zinc-100 bg-zinc-50/70",
          "px-4 py-2",
          "dark:border-zinc-800 dark:bg-[#161618]",
        )}
      >
        <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-600">
          Rich text
        </span>

        <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
          Ready
        </span>
      </div>
    </div>
  );
}