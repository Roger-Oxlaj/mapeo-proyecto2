<<<<<<< HEAD
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const rutasPublicas = ["/"];

  if (!token && !rutasPublicas.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/mapa", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
=======
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const rutasPublicas = ["/"];

  if (!token && !rutasPublicas.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/mapa", req.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
>>>>>>> 4f8914e (actualizado)
