"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  Edit,
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  ImageIcon,
  Heading1,
  Heading2,
} from "lucide-react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function MarkdownEditor({ value, onChange, placeholder, disabled }: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const toolbarButtons = [
    { icon: Bold, label: "Bold", action: () => insertMarkdown("**", "**") },
    { icon: Italic, label: "Italic", action: () => insertMarkdown("*", "*") },
    { icon: Heading1, label: "Heading 1", action: () => insertMarkdown("# ") },
    { icon: Heading2, label: "Heading 2", action: () => insertMarkdown("## ") },
    { icon: Link, label: "Link", action: () => insertMarkdown("[", "](url)") },
    { icon: List, label: "Bullet List", action: () => insertMarkdown("- ") },
    { icon: ListOrdered, label: "Numbered List", action: () => insertMarkdown("1. ") },
    { icon: Quote, label: "Quote", action: () => insertMarkdown("> ") },
    { icon: Code, label: "Code", action: () => insertMarkdown("`", "`") },
    { icon: ImageIcon, label: "Image", action: () => insertMarkdown("![alt text](", ")") },
  ]

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Content</CardTitle>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "edit" | "preview")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="edit" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === "edit" && (
          <>
            <div className="flex flex-wrap gap-1 p-2 border rounded-md bg-muted/50">
              {toolbarButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  disabled={disabled}
                  className="h-8 w-8 p-0"
                  title={button.label}
                >
                  <button.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Textarea
              id="markdown-textarea"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || "Write your content here... (Markdown supported)"}
              className="min-h-[300px] font-mono text-sm"
              disabled={disabled}
            />
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">**bold**</Badge>
              <Badge variant="outline">*italic*</Badge>
              <Badge variant="outline"># heading</Badge>
              <Badge variant="outline">[link](url)</Badge>
              <Badge variant="outline">- list</Badge>
              <Badge variant="outline">`code`</Badge>
            </div>
          </>
        )}

        {activeTab === "preview" && (
          <div className="min-h-[300px] p-4 border rounded-md bg-background">
            {value.trim() ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                Nothing to preview yet. Start writing in the Edit tab!
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
