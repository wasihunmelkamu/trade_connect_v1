"use client"

import { PostForm } from '@/components/posts/post-form'
import { Id } from '@/convex/_generated/dataModel'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const EditPage = () => {
    const params = useParams()
    const id = params["id"] as Id<"posts">
    const router = useRouter()

    return (
        <main>
            <PostForm postId={id} onSuccess={() => {
                toast.success("Post updated successfully.")
                router.push(`/dashboard/posts/${id}`)
            }} />
        </main>
    )
}

export default EditPage