"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { menuItems } from "@/lib/menu-items";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarContent,
  SidebarTrigger,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ThemeToggle } from "@/components/theme-toggle";
import { FeedbackModal } from "./feedback-modal";
import { Button } from "./ui/button";
import { ChevronRight, PanelLeft, LogOut } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { useAuth, useUser } from "@/firebase";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();
  const auth = useAuth();
  const { user } = useUser();

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };

  const isSubItemActive = (items: any[] | undefined) => {
    if (!items) return false;
    return items.some((i) => pathname === i.href);
  };

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-3 left-3 z-50 bg-background/50 backdrop-blur-sm"
          onClick={toggleSidebar}
        >
          <PanelLeft />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}
      <Sidebar collapsible="icon" variant="inset" side="left">
        <SidebarHeader>
           <div className="flex items-center justify-between p-2">
            <Link href="/" className="flex items-center gap-3 truncate">
                <Image src="/icons/logo.png" alt="bharat-mantra Logo" width={40} height={40} className="shrink-0" style={{ height: 'auto' }} />
                <span className="font-headline text-2xl font-semibold">
                bharat-mantra
                </span>
            </Link>
            <SidebarTrigger className="ml-auto" />
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item) =>
              item.items ? (
                <Collapsible
                  key={item.label}
                  asChild
                  defaultOpen={isSubItemActive(item.items)}
                >
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        isActive={isSubItemActive(item.items)}
                        tooltip={{
                          children: item.label,
                        }}
                        className="h-10 justify-between rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground data-[state=open]:bg-sidebar-primary/10 data-[state=open]:text-sidebar-primary data-[state=open]:hover:bg-sidebar-primary/15 data-[state=open]:hover:text-sidebar-primary"
                      >
                        <div className="flex items-center gap-2">
                          <item.icon className="size-5" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[collapsible=icon]:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.href}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={pathname === subItem.href}
                            >
                              <Link href={subItem.href}>
                                <span>{subItem.label}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              ) : (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={{
                      children: item.label,
                    }}
                    className={cn(
                      "h-10 justify-start rounded-lg text-sidebar-foreground/80 hover:text-sidebar-foreground",
                      pathname === item.href &&
                        "bg-sidebar-primary/10 text-sidebar-primary hover:bg-sidebar-primary/15 hover:text-sidebar-primary"
                    )}
                  >
                    <Link href={item.href!}>
                      <item.icon className="size-5" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           {user && (
            <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start gap-2">
              <LogOut className="size-5" />
              <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
            </Button>
          )}
          <FeedbackModal />
          <ThemeToggle />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
