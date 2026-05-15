'use client';

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeedbackModal } from "@/components/feedback-modal";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, children, className }: PageHeaderProps) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard';

  return (
    <header className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between p-6 pb-2", className)}>
      <div className="flex items-center gap-4">
        <Image src="/icons/logo.png" alt="bharat-mantra Logo" width={48} height={48} className="block" style={{ height: 'auto' }} />
        <div className="space-y-1.5">
          <h1 className="font-headline text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 md:ml-auto">
        {children}
        {!isDashboard && (
           <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Dashboard
              </Link>
           </Button>
        )}
        <FeedbackModal />
        <ThemeToggle />
      </div>
    </header>
  );
}
