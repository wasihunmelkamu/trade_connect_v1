import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard";
import { RecentActivity } from "@/components/admin/recent-activity";
import { CategorySeeder } from "@/components/admin/category-seeder";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserManagement } from "@/components/admin/user-management";
import { PostModeration } from "@/components/admin/post-moderation";
import AuthGuard, { AdminGuard } from "@/contexts/AuthGuard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminGuard>
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage your TradeConnect platform
              </p>
            </div>

            <Tabs defaultValue="analytics" className="space-y-6">
              <TabsList className="grid grid-cols-5 w-full max-w-xl">
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="setup">Setup</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="analytics">
                <AnalyticsDashboard />
              </TabsContent>

              <TabsContent value="users">
                <UserManagement />
              </TabsContent>

              <TabsContent value="posts">
                <PostModeration />
              </TabsContent>

              <TabsContent value="setup">
                <div className="space-y-6">
                  <CategorySeeder />
                </div>
              </TabsContent>

              <TabsContent value="activity">
                <RecentActivity />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </AdminGuard>
    </ProtectedRoute>
  );
}
