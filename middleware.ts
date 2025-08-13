import { clerkMiddleware } from "@clerk/nextjs/server";

// Create a custom middleware that excludes webhook routes and test routes
export default clerkMiddleware((auth, req) => {
  console.log('🚀 Middleware called for:', req.nextUrl.pathname);
  
  // Skip middleware for webhook routes
  if (req.nextUrl.pathname.startsWith('/api/webhooks/clerk')) {
    console.log('⏭️ Skipping middleware for webhook route');
    return;
  }
  
  // Skip middleware for test-db route
  if (req.nextUrl.pathname.startsWith('/api/test-db')) {
    console.log('⏭️ Skipping middleware for test-db route');
    return;
  }
  
  // Apply Clerk authentication for all other routes (including organization APIs)
  console.log('🔐 Applying auth middleware');
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
