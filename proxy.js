// import nextAuthMiddleware from "next-auth/middleware";

// export function middleware(request) {
//   return nextAuthMiddleware(request);
// }

// export const config = {
//   matcher: [
//     "/applyLister",
//     "/dashboard/:path*",
//     "/messages/:path*",
//     "/settings",
//     "/settings/:path*",
//     "/payment"
//   ],
// };


export default async function proxy(request) {
  const url = new URL(request.url);

  // Check session through NextAuth's built-in endpoint
  const sessionRes = await fetch(`${url.origin}/api/auth/session`, {
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });

  const session = await sessionRes.json();

  const isLoggedIn = session?.user;

  // Protected routes (your matchers)
  const protectedRoutes = [
    "/applyLister",
    "/dashboard",
    "/messages",
    "/settings",
    "/payment",
  ];

  const isProtected = protectedRoutes.some((route) =>
    url.pathname.startsWith(route)
  );

  if (isProtected && !isLoggedIn) {
    return {
      redirect: "/api/auth/signin?callbackUrl=" + encodeURIComponent(url.pathname),
    };
  }

  // Allow the request to continue
  return true;
}
