import { clerkMiddleware } from "@clerk/nextjs/server";

// Create a custom middleware that excludes webhook routes and organization API routes
export default clerkMiddleware((auth, req) => {
  // Skip middleware for webhook routes
  if (req.nextUrl.pathname.startsWith('/api/webhooks/clerk')) {
    return;
  }
  
  // Skip middleware for organization API routes (they handle auth internally)
  if (req.nextUrl.pathname.startsWith('/api/organizations/')) {
    return;
  }
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};
