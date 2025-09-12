"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function CategoryGrid() {
  const stats = useQuery(api.public.getPostStats)

  if (stats === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {stats.categories.map((category) => (
        <Link key={category._id} href={`/browse?category=${category.slug}`}>
          <Card className="group hover:shadow-md transition-shadow duration-200 cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-2">{category.icon || "📦"}</div>
              <h3 className="font-medium group-hover:text-primary transition-colors">{category.name}</h3>
              <Badge variant="secondary" className="mt-2">
                {category.postCount} posts
              </Badge>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
