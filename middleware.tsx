import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated, verifyToken } from "./lib/auth"

const AUTH_PAGES_PRIFIX = "/auth"


export default async (req: NextRequest) => {
    const pathname = req.nextUrl.pathname

    console.log("Middleware running on:", pathname)

    const isAuth = await isAuthenticated()

    console.log({ isAuth })

    if (pathname === "/" && !isAuth) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    if (!pathname.includes(AUTH_PAGES_PRIFIX) && !isAuth) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    NextResponse.next()
}


export const config = {
    matcher: ["/", "/dashboard/:path*"]
}