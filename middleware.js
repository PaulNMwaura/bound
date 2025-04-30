export { default }from "next-auth/middleware";

export const config = {
    matcher: ["/applyLister", "/dashboard/:path*", "/messages/:path*", "/settings", "/settings/:path*", "/payment"]
};