import { PostList } from "@/components/posts/post-list"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/contexts/AuthGuard"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">My Posts</h1>
            <Button asChild>
              <Link href="/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
          <PostList />
        </div>
      </div>
    </AuthGuard>
  )
}
