import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

function checkBasicAuth(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (authHeader) {
    const authValue = authHeader.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === process.env.GATE_USER && pwd === process.env.GATE_PASSWORD) {
      return true;
    }
  }
  return false;
}

export async function proxy(request: NextRequest) {
  const isAdminPath = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminPath && !checkBasicAuth(request)) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Restricted"' },
    });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/admin/:path*",
  ],
};