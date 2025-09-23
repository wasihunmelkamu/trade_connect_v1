import { NextRequest, NextResponse } from "next/server"
import { isAuthenticated } from "./lib/auth"

const AUTH_PAGES_PREFIX = "/auth"

export default async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname

    console.log("Middleware running on:", pathname)

    const isAuth = await isAuthenticated()
    console.log({ isAuth })

    // ✅ Landing page is public
    if (pathname === "/") {
        return NextResponse.next()
    }

    // ✅ All /auth pages are public
    if (pathname.startsWith(AUTH_PAGES_PREFIX)) {
        return NextResponse.next()
    }

    // ✅ Protect dashboard or other protected pages
    if (pathname.startsWith("/dashboard") && !isAuth) {
        return NextResponse.redirect(new URL("/auth/sign-in", req.url))
    }

    // ✅ Allow all other requests
    return NextResponse.next()
}

// Specify which routes the middleware should run on
export const config = {
    matcher: ["/", "/dashboard/:path*","/auth/:path*"] // runs middleware only on these paths
}
