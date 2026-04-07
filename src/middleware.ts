import { NextRequest, NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard", "/documents", "/templates", "/settings", "/api/documents", "/api/templates"];

// Define public routes that don't require authentication
const publicRoutes = ["/", "/auth/signin", "/auth/signup", "/api/auth", "/sign"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is public (including signing routes)
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Note: For protected routes, middleware auth is disabled due to Edge Runtime limitations with Prisma
  // Auth checks should be done in the route handlers themselves
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - public (static files)
     * - .next/static (static files)
     * - .next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!public|_next/static|_next/image|favicon.ico).*)",
  ],
};
