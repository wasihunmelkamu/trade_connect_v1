import * as jose from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(
    'cc7e0d44fd473002f1c42167459001140ec6389b7353f8088f4d9a95f2f596f2',
)

const alg = 'HS256'

type JwtPayload = {
    userId: string
    role: "user" | "admin"
}

export const signToken = async (payload: JwtPayload) => {
    const token = await new jose.SignJWT(payload)
        .setProtectedHeader({ alg })
        .setIssuedAt()
        .setIssuer('tradeConnect')
        .setAudience(payload.userId)
        .setExpirationTime('24h')
        .sign(secret)

    return token
}


export const verifyToken = async (token: string) => {
    const payload = await jose.jwtVerify<JwtPayload>(token, secret)
    return payload.payload
}

export const isAuthenticated = async () => {
    const cookie = await cookies()
    const token = cookie.get("token")?.value

    if (!token) return false

    try {
        await verifyToken(token)
        return true
    } catch (error) {
        console.log({ error })
        return false

    }
}