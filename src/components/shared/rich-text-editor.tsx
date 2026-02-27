"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import CharacterCount from "@tiptap/extension-character-count"
import {
    Bold, Italic, Strikethrough, List, ListOrdered,
    Quote, Minus, Heading1, Heading2, Heading3, Undo, Redo,
} from "lucide-react"
import { cn } from "@/lib/utils"

function ToolbarButton({
    onClick,
    active,
    disabled,
    children,
    title,
}: {
    onClick: () => void
    active?: boolean
    disabled?: boolean
    children: React.ReactNode
    title?: string
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-8 h-8 flex items-center justify-center rounded-lg transition-all text-zinc-500 dark:text-zinc-400",
                active
                    ? "bg-zinc-900 dark:bg-amber-400 text-white dark:text-zinc-950"
                    : "hover:bg-zinc-100 dark:hover:bg-white/10 hover:text-zinc-900 dark:hover:text-white",
                disabled && "opacity-30 cursor-not-allowed"
            )}
        >
            {children}
        </button>
    )
}

function ToolbarDivider() {
    return <div className="w-px h-5 bg-zinc-200 dark:bg-white/10 mx-0.5" />
}

type RichTextEditorProps = {
    value?: string
    onChange?: (html: string) => void
    placeholder?: string
    maxCharacters?: number
    className?: string
    editorClassName?: string
    disabled?: boolean
}

export function RichTextEditor({
    value = "",
    onChange,
    placeholder = "Write something...",
    maxCharacters = 5000,
    className,
    editorClassName,
    disabled = false,
}: RichTextEditorProps) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { keepMarks: true },
                orderedList: { keepMarks: true },
            }),
            Placeholder.configure({
                placeholder,
                emptyEditorClass: "is-editor-empty",
            }),
            CharacterCount.configure({ limit: maxCharacters }),
        ],
        content: value,
        editable: !disabled,
        onUpdate({ editor }) {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: "outline-none min-h-[200px] prose prose-sm dark:prose-invert max-w-none focus:outline-none",
            },
        },
    })

    if (!editor) return null

    const charCount = editor.storage.characterCount.characters()
    const isNearLimit = charCount > maxCharacters * 0.9

    return (
        <div className={cn(
            "rounded-xl border border-zinc-200 dark:border-white/10 overflow-hidden bg-white dark:bg-zinc-900",
            disabled && "opacity-60 pointer-events-none",
            className
        )}>
            {/* Toolbar */}
            <div className="flex items-center gap-0.5 flex-wrap px-3 py-2 border-b border-zinc-100 dark:border-white/5 bg-zinc-50 dark:bg-white/[0.02]">

                {/* Headings */}
                <ToolbarButton
                    title="Heading 1"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive("heading", { level: 1 })}
                >
                    <Heading1 size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive("heading", { level: 2 })}
                >
                    <Heading2 size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive("heading", { level: 3 })}
                >
                    <Heading3 size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Formatting */}
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive("bold")}
                >
                    <Bold size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive("italic")}
                >
                    <Italic size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Strikethrough"
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive("strike")}
                >
                    <Strikethrough size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Lists */}
                <ToolbarButton
                    title="Bullet List"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive("bulletList")}
                >
                    <List size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered List"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive("orderedList")}
                >
                    <ListOrdered size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                {/* Blocks */}
                <ToolbarButton
                    title="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive("blockquote")}
                >
                    <Quote size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Horizontal Rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                >
                    <Minus size={14} />
                </ToolbarButton>

                <ToolbarDivider />

                {/* History */}
                <ToolbarButton
                    title="Undo"
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                >
                    <Undo size={14} />
                </ToolbarButton>
                <ToolbarButton
                    title="Redo"
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                >
                    <Redo size={14} />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <div className={cn("px-4 py-4", editorClassName)}>
                <EditorContent editor={editor} />
            </div>

            {/* Character count */}
            <div className="flex justify-end px-4 py-2 border-t border-zinc-100 dark:border-white/5">
                <span className={cn(
                    "text-[11px] font-medium tabular-nums",
                    isNearLimit ? "text-red-400" : "text-zinc-300 dark:text-zinc-600"
                )}>
                    {charCount} / {maxCharacters.toLocaleString()}
                </span>
            </div>
        </div>
    )
}