export { default }from "next-auth/middleware";

export const config = {
    matcher: ["/home", "/browse", "/viewLister", "/viewLister/:path*", "/applyLister"]
};