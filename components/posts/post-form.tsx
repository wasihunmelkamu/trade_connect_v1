"use client"

import type React from "react"

import { useState, useEffect, useCallback, CSSProperties } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog" // 👈 Added DialogTrigger
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Loader2,
  X,
  Save,
  Eye,
  Package,
  Search,
  Handshake,
  Repeat,
  Upload,
  ImageIcon,
  Bold,
  Italic,
  Code,
  Link,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from "lucide-react"
import { toast } from "sonner"
import type { Id } from "@/convex/_generated/dataModel"
import { useAuthUser } from "@/contexts/AuthGuard"
import { useDropzone } from "react-dropzone"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import tomorrow from "react-syntax-highlighter/dist/esm/styles/prism"

// ======================
// 🖼️ IMAGE UPLOAD COMPONENT (UNCHANGED)
// ======================

interface ImageUploadProps {
  postId: Id<"posts">
}

const ImageUpload: React.FC<ImageUploadProps> = ({ postId }) => {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const authUser = useAuthUser()

  const generateUploadUrl = useMutation(api.posts.generateUploadUrl)
  const addImageToPost = useMutation(api.posts.addImageToPost)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const maxFiles = 5
      const maxFileSize = 10 * 1024 * 1024 // 10MB

      if (files.length + acceptedFiles.length > maxFiles) {
        toast.error(`You can only upload up to ${maxFiles} images.`)
        return
      }

      const oversizedFiles = acceptedFiles.filter((file) => file.size > maxFileSize)
      if (oversizedFiles.length > 0) {
        toast.error(`Maximum file size is ${(maxFileSize / 1024 / 1024).toFixed(0)}MB.`)
        return
      }

      setFiles((prev) => [...prev, ...acceptedFiles])
    },
    [files],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  })

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    if (!authUser) {
      toast.error("User isn't authorized.")
      return;
    }

    setUploading(true)
    setProgress(0)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        setProgress(Math.round(((i + 1) / files.length) * 100))

        // Step 1: Generate upload URL (returns just a string URL)
        const uploadUrl = await generateUploadUrl({
          userId: authUser.id
        })

        // Step 2: Upload file to Convex and get storageId from response
        const uploadPromise = fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        })

        // Show progress with sonner
        toast.promise(uploadPromise, {
          loading: `Uploading ${file.name}...`,
          success: `Uploaded ${file.name}`,
          error: `Failed to upload ${file.name}`,
        })

        const uploadResponse = await uploadPromise
        if (!uploadResponse.ok) throw new Error("Upload failed")

        // Step 3: Extract storageId from response JSON
        const { storageId } = await uploadResponse.json()

        // Step 4: Attach image to post using the storageId
        await addImageToPost({
          postId: postId as any,
          userId: authUser.id,
          storageId: storageId as any,
          filename: file.name,
          size: file.size,
          mimeType: file.type,
          alt: file.name.split(".")[0],
        })
      }

      toast.success(`${files.length} image(s) uploaded successfully!`)
      setFiles([])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {isDragActive ? "Drop images here" : "Drag & drop images here, or click to select"}
          </p>
          <p className="text-xs text-muted-foreground">Max 5 files, 10MB each</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {files.map((file, index) => (
              <div key={index} className="relative group aspect-square bg-muted rounded-md overflow-hidden">
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={file.name}
                  className="w-full h-full object-cover"
                  onClick={() => {
                    setPreview(URL.createObjectURL(file))
                    setIsPreviewOpen(true)
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button type="button" onClick={handleUpload} disabled={uploading} className="flex-1">
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading... {progress}%
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Upload {files.length} Image{files.length !== 1 ? "s" : ""}
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => setFiles([])} disabled={uploading}>
              Clear
            </Button>
          </div>

          {uploading && (
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }}></div>
            </div>
          )}
        </div>
      )}

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>
          {preview && (
            <div className="aspect-video relative bg-muted rounded-md">
              <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain p-4" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ======================
// 📝 MARKDOWN EDITOR COMPONENT (UNCHANGED)
// ======================

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, disabled }) => {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")

  const insertMarkdown = (before: string, after = "") => {
    const textarea = document.getElementById("markdown-content") as HTMLTextAreaElement
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
    { icon: Bold, action: () => insertMarkdown("**", "**"), tooltip: "Bold" },
    { icon: Italic, action: () => insertMarkdown("*", "*"), tooltip: "Italic" },
    { icon: Code, action: () => insertMarkdown("`", "`"), tooltip: "Inline Code" },
    { icon: Heading1, action: () => insertMarkdown("# "), tooltip: "Heading 1" },
    { icon: Heading2, action: () => insertMarkdown("## "), tooltip: "Heading 2" },
    { icon: Heading3, action: () => insertMarkdown("### "), tooltip: "Heading 3" },
    { icon: List, action: () => insertMarkdown("- "), tooltip: "Bullet List" },
    { icon: ListOrdered, action: () => insertMarkdown("1. "), tooltip: "Numbered List" },
    { icon: Quote, action: () => insertMarkdown("> "), tooltip: "Quote" },
    { icon: Link, action: () => insertMarkdown("[", "](url)"), tooltip: "Link" },
  ]

  return (
    <div className="border rounded-lg overflow-hidden max-w-[calc(100vw-5rem)] overflow-x-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "write" | "preview")}>
        <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2 min-w-[35rem]">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                disabled={disabled || activeTab === "preview"}
                title={button.tooltip}
                className="h-8 w-8 p-0"
              >
                <button.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="write" className="m-0 ">
          <Textarea
            id="markdown-content"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write your content using Markdown formatting...

**Examples:**
# Heading 1
## Heading 2
**Bold text**
*Italic text*
`inline code`
- Bullet point
1. Numbered list
> Quote
[Link text](https://example.com)

```javascript
// Code block
console.log('Hello World');
```"
            rows={12}
            disabled={disabled}
            className="font-mono text-sm border-0 resize-none focus-visible:ring-0 rounded-none"
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div className="p-4 min-h-[300px] max-h-[400px] overflow-y-auto prose prose-sm dark:prose-invert w-full">
            <ReactMarkdown
              components={{
                code({ node, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "")
                  return match ? (
                    <SyntaxHighlighter

                      // @ts-ignore
                      style={tomorrow}
                      language={match[1]}
                      PreTag="div" {...props}>
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                },
              }}
            >
              {value || "*Nothing to preview yet. Start writing in the Write tab.*"}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface PostFormProps {
  postId?: Id<"posts">
  onSuccess?: () => void
}

export function PostForm({ postId, onSuccess }: PostFormProps) {
  const authUser = useAuthUser()
  const [newPostId, setNewPostId] = useState<Id<"posts"> | undefined>(undefined)
  const [tagInput, setTagInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 🆕 NEW: State for image upload dialog
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [postType, setPostType] = useState<"supply" | "demand" | "service" | "exchange">("supply")
  const [status, setStatus] = useState<"active" | "sold" | "expired" | "paused">("active")
  const [price, setPrice] = useState<number | undefined>(undefined)
  const [currency, setCurrency] = useState("")
  const [isNegotiable, setIsNegotiable] = useState(false)
  const [priceType, setPriceType] = useState<"fixed" | "negotiable" | "auction" | "free" | undefined>(undefined)
  const [condition, setCondition] = useState<"new" | "like_new" | "good" | "fair" | "poor" | undefined>(undefined)
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [quantity, setQuantity] = useState<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState("")
  const [weight, setWeight] = useState("")
  const [color, setColor] = useState("")
  const [material, setMaterial] = useState("")
  const [urgency, setUrgency] = useState<"low" | "medium" | "high" | "urgent" | undefined>(undefined)
  const [location, setLocation] = useState("")
  const [city, setCity] = useState("")
  const [country, setCountry] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [shippingAvailable, setShippingAvailable] = useState(false)
  const [localPickupOnly, setLocalPickupOnly] = useState(false)
  const [shippingCost, setShippingCost] = useState<number | undefined>(undefined)
  const [shippingRegions, setShippingRegions] = useState<string[]>([])
  const [contactInfo, setContactInfo] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState<"individual" | "business" | "organization" | undefined>(undefined)
  const [website, setWebsite] = useState("")

  const categories = useQuery(api.categories.getCategories)
  const createPost = useMutation(api.posts.createPost)
  const updatePost = useMutation(api.posts.updatePost)

  const existingPost = useQuery(api.posts.getPost, postId ? { postId } : "skip")

  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || "")
      setDescription(existingPost.description || "")
      setContent(existingPost.content || "")
      setCategory(existingPost.category || "")
      setTags(existingPost.tags || [])
      setPostType(existingPost.postType || "supply")
      setStatus(existingPost.status || "active")
      setPrice(existingPost.price)
      setCurrency(existingPost.currency || "")
      setIsNegotiable(existingPost.isNegotiable || false)
      setPriceType(existingPost.priceType)
      setCondition(existingPost.condition)
      setBrand(existingPost.brand || "")
      setModel(existingPost.model || "")
      setQuantity(existingPost.quantity)
      setDimensions(existingPost.dimensions || "")
      setWeight(existingPost.weight || "")
      setColor(existingPost.color || "")
      setMaterial(existingPost.material || "")
      setUrgency(existingPost.urgency)
      setLocation(existingPost.location || "")
      setCity(existingPost.city || "")
      setCountry(existingPost.country || "")
      setZipCode(existingPost.zipCode || "")
      setShippingAvailable(existingPost.shippingAvailable || false)
      setLocalPickupOnly(existingPost.localPickupOnly || false)
      setShippingCost(existingPost.shippingCost)
      setShippingRegions(existingPost.shippingRegions || [])
      setContactInfo(existingPost.contactInfo || "")
      setBusinessName(existingPost.businessName || "")
      setBusinessType(existingPost.businessType)
      setWebsite(existingPost.website || "")
    }
  }, [existingPost])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const validateForm = () => {
    const errors: string[] = []
    if (!title.trim()) errors.push("Title is required")
    if (!description.trim()) errors.push("Description is required")
    if (!content.trim()) errors.push("Content is required")
    if (!category.trim()) errors.push("Category is required")

    if (errors.length > 0) {
      setError(errors.join(", "))
      return false
    }
    return true
  }

  const onSubmit = async (isPublished: boolean) => {
    setError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    console.log("[v0] Form data being submitted:", {
      title,
      description,
      content,
      category,
      tags,
      postType,
      status,
      isPublished,
    })

    try {
      const postData = {
        title,
        description,
        content,
        category,
        tags,
        postType,
        isPublished,
        ...(price !== undefined && { price }),
        ...(currency && { currency }),
        ...(isNegotiable && { isNegotiable }),
        ...(priceType && { priceType }),
        ...(condition && { condition }),
        ...(brand && { brand }),
        ...(model && { model }),
        ...(quantity !== undefined && { quantity }),
        ...(dimensions && { dimensions }),
        ...(weight && { weight }),
        ...(color && { color }),
        ...(material && { material }),
        ...(urgency && { urgency }),
        ...(location && { location }),
        ...(city && { city }),
        ...(country && { country }),
        ...(zipCode && { zipCode }),
        ...(shippingAvailable && { shippingAvailable }),
        ...(localPickupOnly && { localPickupOnly }),
        ...(shippingCost !== undefined && { shippingCost }),
        ...(shippingRegions.length > 0 && { shippingRegions }),
        ...(contactInfo && { contactInfo }),
        ...(businessName && { businessName }),
        ...(businessType && { businessType }),
        ...(website && { website }),
      }

      console.log("[v0] Processed post data:", postData)

      const userId = authUser?.id as Id<"users">
      if (!userId) throw new Error("Not authenticated")

      let finalPostId = postId

      if (!postId) {
        console.log("[v0] Creating new post...")
        const result = await createPost({ ...postData, userId })
        finalPostId = result as Id<"posts">
        setNewPostId(finalPostId)
        console.log({ finalPostId })

        console.log("[v0] Post created with ID:", finalPostId)
        toast.success("Post created successfully!")

        // 🆕 NEW: Open image upload dialog after creating post
        setIsImageDialogOpen(true)
      } else {
        console.log("[v0] Updating existing post...")
        await updatePost({ postId, userId, ...postData })
        console.log("[v0] Post updated successfully")
        toast.success("Post updated successfully!")
      }

      onSuccess?.()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save post"
      console.error("[v0] Error saving post:", err)
      setError(message)
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    console.log("[v0] Save Draft button clicked")
    onSubmit(false)
  }

  const handlePublish = () => {
    console.log("[v0] Publish button clicked")
    onSubmit(true)
  }

  const postTypeOptions = [
    { value: "supply", label: "Supply", icon: Package, description: "I have something to offer" },
    { value: "demand", label: "Demand", icon: Search, description: "I'm looking for something" },
    { value: "service", label: "Service", icon: Handshake, description: "I offer a service" },
    { value: "exchange", label: "Exchange", icon: Repeat, description: "I want to trade/exchange" },
  ]

  const RequiredAsterisk = () => <span className="text-destructive ml-1">*</span>

  return (
    <form className="w-full max-w-6xl mx-auto space-y-6" onSubmit={(e) => e.preventDefault()}>
      <Card>
        <CardHeader>
          <CardTitle>What type of post is this?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {postTypeOptions.map((option) => (
              <div
                key={option.value}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${postType === option.value ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50"
                  }`}
                onClick={() => setPostType(option.value as any)}
              >
                <div className="flex flex-col items-center text-center space-y-2">
                  <option.icon className="h-8 w-8" />
                  <h3 className="font-semibold">{option.label}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                Title <RequiredAsterisk />
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title"
                disabled={isSubmitting}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="category">
                Category <RequiredAsterisk />
              </Label>
              <Select value={category} onValueChange={setCategory} disabled={isSubmitting} >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Short Description <RequiredAsterisk />
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description that will appear in search results"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add relevant tags"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  disabled={isSubmitting}
                />
                <Button type="button" onClick={handleAddTag} disabled={isSubmitting}>
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                      <X className="h-3 w-3 hover:text-red-500" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              <div className="flex flex-col gap-2 min-w-[10rem]">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency} disabled={isSubmitting}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="USD" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="negotiable"
                checked={isNegotiable}
                onCheckedChange={(checked) => setIsNegotiable(checked === true)}
                disabled={isSubmitting}
              />
              <Label htmlFor="negotiable">Price is negotiable</Label>
            </div>

            {postType === "supply" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition</Label>
                    <Select
                      value={condition || ""}
                      onValueChange={(value) => setCondition(value as any)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="poor">Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Brand name"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity || ""}
                        onChange={(e) => setQuantity(e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="1"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select value={urgency || ""} onValueChange={(value) => setUrgency(value as any)} disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Detailed Content <RequiredAsterisk />
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Write detailed information about your post using Markdown formatting for better presentation.
          </p>
        </CardHeader>
        <CardContent>
          <MarkdownEditor value={content} onChange={setContent} disabled={isSubmitting} />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location & Shipping</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Country"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="shipping"
                  checked={shippingAvailable}
                  onCheckedChange={(checked) => setShippingAvailable(checked === true)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="shipping">Shipping available</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="pickup"
                  checked={localPickupOnly}
                  onCheckedChange={(checked) => setLocalPickupOnly(checked === true)}
                  disabled={isSubmitting}
                />
                <Label htmlFor="pickup">Local pickup only</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Details</Label>
              <Textarea
                id="contact"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="How should people contact you? (email, phone, etc.)"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business">Business Name (Optional)</Label>
              <Input
                id="business"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                disabled={isSubmitting}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 🆕 NEW: Conditionally show image upload dialog trigger for existing posts */}
      {postId && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageUpload postId={postId} />
          </CardContent>
        </Card>
      )}

      {/* 🆕 NEW: Dialog for image upload after post creation */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Upload Images for Your Post</DialogTitle>
          </DialogHeader>
          {newPostId && <ImageUpload postId={newPostId} />}
          {!newPostId && (
            <div className="p-4 text-center text-muted-foreground">
              Post must be created first.
            </div>
          )}
        </DialogContent>
      </Dialog>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button type="button" onClick={handlePublish} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Eye className="mr-2 h-4 w-4" />
          {existingPost ? "Update" :
            "Publish"}
        </Button>
      </div>
    </form>
  )
}