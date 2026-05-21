
"use client";

import { useUser } from "@/firebase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

// The only public route is the login page. All other routes are protected.
const PUBLIC_ROUTES = ["/login"]; 
// The default route to redirect to after a successful login.
const PROTECTED_ROOT = "/dashboard";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) {
      return; // Wait for user status to be determined.
    }

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If the user is authenticated...
    if (user) {
      // and they are trying to access a public route (like /login),
      // redirect them to the main dashboard.
      if (isPublicRoute) {
        router.replace(PROTECTED_ROOT);
      }
    } 
    // If the user is not authenticated...
    else {
      // and they are trying to access a protected route,
      // redirect them to the login page.
      if (!isPublicRoute) {
        router.replace("/login");
      }
    }
  }, [user, isLoading, router, pathname]);

  // While loading or during redirection, show a loader to prevent flashes.
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  if (isLoading || (!user && !isPublicRoute) || (user && isPublicRoute)) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
