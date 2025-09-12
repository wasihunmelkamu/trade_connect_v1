"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Users, FileText, MessageCircle, Eye, TrendingUp, TrendingDown } from "lucide-react"

export function AnalyticsDashboard() {
  const analytics = useQuery(api.admin.getPlatformAnalytics)

  if (analytics === undefined) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const stats = [
    {
      title: "Total Users",
      value: analytics.totals.users,
      recent: analytics.recent.users30d,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Posts",
      value: analytics.totals.posts,
      recent: analytics.recent.posts30d,
      icon: FileText,
      color: "text-green-600",
    },
    {
      title: "Published Posts",
      value: analytics.totals.publishedPosts,
      recent: analytics.recent.posts30d,
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Comments",
      value: analytics.totals.comments,
      recent: analytics.recent.comments30d,
      icon: MessageCircle,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          const growth = stat.recent > 0
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  {growth ? (
                    <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                  )}
                  +{stat.recent} in last 30 days
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Category Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Category Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.categories.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">{category.published} published</p>
                </div>
                <Badge variant="secondary">{category.count} total</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">New Users</span>
              <Badge variant="outline">{analytics.recent.users7d}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">New Posts</span>
              <Badge variant="outline">{analytics.recent.posts7d}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Views</span>
              <Badge variant="outline">{analytics.recent.views7d}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Published Rate</span>
              <Badge variant="outline">
                {Math.round((analytics.totals.publishedPosts / analytics.totals.posts) * 100)}%
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Views/Post</span>
              <Badge variant="outline">{Math.round(analytics.totals.views / analytics.totals.posts) || 0}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Engagement Rate</span>
              <Badge variant="outline">
                {Math.round((analytics.totals.comments / analytics.totals.posts) * 100) || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
