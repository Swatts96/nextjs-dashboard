import { auth } from "@/auth"; // Import from NextAuth
import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const isAuthenticated = auth();

  // Protect dashboard routes
  if (request.url.includes("/dashboard") && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
