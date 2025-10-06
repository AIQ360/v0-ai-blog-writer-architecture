import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Auth bypass: allow all routes without redirects
export async function middleware(_request: NextRequest) {
  return NextResponse.next()
}

// Disable all matchers so this middleware applies generically without blocking anything
export const config = {
  matcher: ["/:path*"],
}
