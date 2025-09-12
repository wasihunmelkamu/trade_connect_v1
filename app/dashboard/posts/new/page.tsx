import { PostForm } from "@/components/posts/post-form"
import AuthGuard from "@/contexts/AuthGuard"
// import { Header } from "@/components/navigation/header"

export default function NewPostPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        <div className="container mx-auto">
          <PostForm />
        </div>
      </div>
    </AuthGuard>
  )
}
