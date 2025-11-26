import nextAuthMiddleware from "next-auth/middleware";

export function proxy(request) {
  return nextAuthMiddleware(request);
}

export const config = {
  matcher: [
    "/applyLister",
    "/dashboard/:path*",
    "/messages/:path*",
    "/settings",
    "/settings/:path*",
    "/payment"
  ],
};
