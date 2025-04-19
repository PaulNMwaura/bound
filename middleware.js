export { default }from "next-auth/middleware";

export const config = {
    matcher: ["/browse", "/viewLister", "/viewLister/:path*", "/applyLister", "/dashboard/:path*", "/messages/:path*"]
};