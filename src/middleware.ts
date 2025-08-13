import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  '/api/organizations(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  // Skip middleware for webhook routes
  if (req.nextUrl.pathname.startsWith('/api/webhooks/clerk')) {
    return;
  }
  
  // Skip middleware for Inngest routes
  if (req.nextUrl.pathname.startsWith('/api/inngest')) {
    return;
  }
  
  // Skip middleware for test-db route
  if (req.nextUrl.pathname.startsWith('/api/test-db')) {
    return;
  }

  // Protect organization routes - Note the await here
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", 
    "/", 
    "/(api|trpc)(.*)"
  ],
};