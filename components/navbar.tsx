'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "text-sm font-medium transition-colors hover:text-primary mr-6",
        isActive
          ? "text-black dark:text-white"
          : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
}

export function NavBar() {
  const { isSignedIn } = useAuth();
  const isDevelopmentMode = process.env.NODE_ENV === 'development';
  
  // In development mode, always show as signed in for easier testing
  const showSignedInUI = isDevelopmentMode || isSignedIn;

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container flex h-16 items-center">
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold inline-block">Kolb&apos;s Learning Cycle</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {showSignedInUI ? (
              <>
                <NavLink href="/dashboard">Dashboard</NavLink>
                <NavLink href="/skills">Skills</NavLink>
                <NavLink href="/cycles">Learning Cycles</NavLink>
              </>
            ) : (
              <>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/about">About</NavLink>
              </>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          {showSignedInUI ? (
            <div className="flex items-center space-x-4">
              <Link href="/cycles/new">
                <Button variant="default" size="sm">New Cycle</Button>
              </Link>
              {isDevelopmentMode ? (
                <Button variant="outline" size="sm">User</Button>
              ) : (
                <UserButton afterSignOutUrl="/" />
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">Sign In</Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button variant="default" size="sm">Sign Up</Button>
              </SignInButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 