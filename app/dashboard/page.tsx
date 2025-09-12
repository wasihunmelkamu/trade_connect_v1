"use client"

import { useCallback, useEffect, useState } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { PostCard } from "@/components/browse/post-card"
import { SearchFilters } from "@/components/browse/search-filters"
// import { Header } from "@/components/navigation/header"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import DebugJson from "@/components/debugJSON"
import { Doc } from "@/convex/_generated/dataModel"
import { toast } from "sonner"

type PostWithAuthor = Doc<"posts"> & { author: Doc<"profiles"> | null }

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || null)

  const posts = useQuery(api.public.getPublishedPosts, {
    // search: searchQuery || undefined,
    category: selectedCategory || undefined,
    limit: 100,
  })


  const [filteredPosts, setFilteredPosts] = useState<PostWithAuthor[]>(posts?.posts || [])



  const getFilteredPosts = useCallback(() => {
    const posts = filteredPosts?.filter(p => `${p.title} ${p.description} ${p.brand} ${p.tags.join(" ")}`.includes(searchQuery)) || []

    return posts
  }, [searchQuery, filteredPosts])



  useEffect(() => {
    if (posts?.posts) {
      let newPosts = posts?.posts
      if (searchQuery) {
        newPosts = getFilteredPosts()
      }

      setFilteredPosts(newPosts)
    }
  }, [posts?.posts])

  useEffect(() => {
    const posts = getFilteredPosts()
    setFilteredPosts(posts)

  }, [searchQuery])


  return (
    <main className="min-h-screen bg-background">
      {/* <Header /> */}

      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
          <p className="text-muted-foreground">Discover amazing items and services from our community</p>
        </div>

        <div className="mb-8">
          <SearchFilters
            onSearch={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>

        {posts === undefined ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse different categories.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory(null)
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                Showing {posts?.posts.length} results
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory && ` in ${selectedCategory}`}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {posts?.hasMore && (
              <div className="text-center mt-12">
                <Button variant="outline">Load More</Button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
