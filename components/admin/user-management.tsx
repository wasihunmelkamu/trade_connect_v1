"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, Search, Shield, ShieldCheck, UserCheck, UserX } from "lucide-react"
import type { Id } from "@/convex/_generated/dataModel"

export function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const users = useQuery(api.admin.getAllUsersForAdmin, {
    search: searchQuery || undefined,
    limit: 100,
  })
  // const updateUserRole = useMutation(api.users.updateUserRole)
  const toggleVerification = useMutation(api.admin.toggleUserVerification)

  const handleRoleChange = async (userId: Id<"users">, newRole: "admin" | "user") => {
    try {
      // await updateUserRole({ userId, role: newRole })
    } catch (error) {
      console.error("Failed to update user role:", error)
    }
  }

  const handleVerificationToggle = async (userId: Id<"users">) => {
    try {
      await toggleVerification({ userId })
    } catch (error) {
      console.error("Failed to toggle verification:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2">User Management</CardTitle>
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {users === undefined ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Posts</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const initials = user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"

                return (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {/* <AvatarImage src={user.avatar || "/placeholder.svg"} /> */}
                          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role === "admin" ? (
                          <>
                            <Shield className="mr-1 h-3 w-3" />
                            Admin
                          </>
                        ) : (
                          "User"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.isVerified ? "default" : "outline"}>
                        {user.isVerified ? (
                          <>
                            <ShieldCheck className="mr-1 h-3 w-3" />
                            Verified
                          </>
                        ) : (
                          "Unverified"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{user.publishedPostCount} published</div>
                        <div className="text-muted-foreground">{user.postCount} total</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleVerificationToggle(user.userId)}>
                          {user.isVerified ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
                        </Button>
                        {/* {user.role !== "admin" && (
                          <Button variant="outline" size="sm" onClick={() => handleRoleChange(user.userId, "admin")}>
                            Make Admin
                          </Button>
                        )} */}
                        {user.role === "admin" && (
                          <Button variant="outline" size="sm" onClick={() => handleRoleChange(user.userId, "user")}>
                            Remove Admin
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
