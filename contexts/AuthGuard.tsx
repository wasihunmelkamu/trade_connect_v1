"use client"
import { verifyUser } from '@/actions/auth'
import Loader from '@/components/loader/loader'
import { Id } from '@/convex/_generated/dataModel'
import { useRouter } from 'next/navigation'
import React, { PropsWithChildren, useCallback, useEffect, useState, useTransition } from 'react'
import { create } from "zustand"


type AuthState = {
    user: {
        id: Id<"users">,
        name: string
        email: string
        role: "admin" | "user";
        displayName: string
        isVerified: boolean
        createdAt?: number
        updatedAt?: number
    } | null
}

type AuthAction = {
    setUser: (user: AuthState["user"]) => void
}

const authStore = create<AuthState & AuthAction>()((set) => ({
    user: null,
    setUser(user) {
        set({
            user
        })
    },
}))


export const useAuthUser = () => authStore(state => state.user)
export const useSetAuthUser = () => authStore(store => store.setUser)


const AuthGuard = ({ children, requireAdmin = true }: PropsWithChildren & {
    requireAdmin?: boolean
}) => {
    const [pending, setPending] = useState(true)
    const setUser = authStore(state => state.setUser)
    const user = useAuthUser()
    const router = useRouter()

    const verifyUserFn = useCallback(async () => {
        setPending(true)
        const res = await verifyUser()
        if (!res.success) {
            return null
        }

        const user = res.data

        if (user) {
            setUser({
                id: user._id,
                name: user.name,
                displayName: user.displayName || "",
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isVerified: user.isVerified || false,
                role: user.role
            })
        }

        setPending(false)
    }, [])

    useEffect(() => {
        if (!user) {
            verifyUserFn()
        }
    }, [])


    useEffect(() => {
        if (!user && requireAdmin) {
            router.replace("/auth/sign-in")
        }
    }, [user])

    if (pending && !user) {
        return <Loader size='lg' />
    }

    return (
        <>{children}</>
    )
}

export const AdminGuard = ({ children }: PropsWithChildren) => {
    const [pending, setPending] = useState(true)
    const setUser = authStore(state => state.setUser)
    const user = useAuthUser()
    const router = useRouter()

    const verifyUserFn = useCallback(async () => {
        setPending(true)
        const res = await verifyUser()
        if (!res.success) {
            return null
        }

        const user = res.data

        if (user) {
            setUser({
                id: user._id,
                name: user.name,
                displayName: user.displayName || "",
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isVerified: user.isVerified || false,
                role: user.role
            })
        }

        setPending(false)
    }, [])

    useEffect(() => {
        if (!user) {
            verifyUserFn()
        }
    }, [])


    useEffect(() => {
        if (!user) {
            router.replace("/auth/sign-in")
        }
    }, [user])

    if (pending && !user) {
        return <Loader size='lg' />
    }


    if (user) {
        if (user.role !== "admin") {
            return <section>Your aren't authorized to access this sections</section>
        }
    }

    return (
        <>{children}</>
    )
}

export const LoadAuthUser = ({ children }: PropsWithChildren) => {
    const [pending, setPending] = useState(true)
    const setUser = authStore(state => state.setUser)
    const authUser = useAuthUser()

    const verifyUserFn = useCallback(async () => {
        setPending(true)
        const res = await verifyUser()
        if (!res.success) {
            return null
        }

        const user = res.data

        if (user) {
            setUser({
                id: user._id,
                name: user.name,
                displayName: user.displayName || "",
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                isVerified: user.isVerified || false,
                role: user.role
            })
        }

        setPending(false)
    }, [])

    useEffect(() => {
        if (!authUser) {
            verifyUserFn()
        }
    }, [])


    if (pending && !authUser) {
        return <Loader size='lg' />
    }


    return (
        <>{children}</>
    )
}

export const Authenticated = ({ children }: PropsWithChildren) => {
    const user = useAuthUser()

    if (!user) return null
    return children
}

export const Admin = ({ children }: PropsWithChildren) => {
    const user = useAuthUser()

    if (!user) return null

    if (user.role !== "admin") return null

    return children
}

export default AuthGuard