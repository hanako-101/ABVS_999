import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value

 
  const protectedPages = [
    "/admin",
    "/stagiaire"
  ]

  const isProtectedPage = protectedPages.some(page => 
    request.nextUrl.pathname.startsWith(page)
  )

  if (isProtectedPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    try {
      const session = await verifyToken(token)
      
      if (!session) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // pour Vérifier les permissions 
      if (request.nextUrl.pathname.startsWith("/admin") && session.role !== "admin") {
        return NextResponse.redirect(new URL("/stagiaire", request.url))
      }

      if (request.nextUrl.pathname.startsWith("/stagiaire") && session.role !== "stagiaire") {
        return NextResponse.redirect(new URL("/admin", request.url))
      }

    } catch (error) {
      console.error("Token verification failed:", error)
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("token")
      return response
    }
  }
  

  // Rediriger les utilisateurs connectés qui vont sur login/register
  if (token && (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/register")) {
    try {
      const session = await verifyToken(token)
      if (session) {
        return NextResponse.redirect(new URL(session.role === "admin" ? "/admin" : "/stagiaire", request.url))
      }
    } catch (error) {
      // Token invalide, laisser passer
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}