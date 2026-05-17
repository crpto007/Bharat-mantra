
import type { Metadata, Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase";
import { AuthGate } from "@/components/auth-gate";

<<<<<<< HEAD

const fontVariables = "[--font-inter:Inter,ui-sans-serif,system-ui,sans-serif] [--font-lexend:Lexend,ui-sans-serif,system-ui,sans-serif]";

=======
>>>>>>> main
export const metadata: Metadata = {
  title: "bharat-mantra",
  description: "AI-powered assistant for chat, prompts, and productivity",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6D28D9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body
        className={cn(
<<<<<<< HEAD
          "min-h-screen bg-background font-body antialiased",
          fontVariables
=======
          "min-h-screen bg-background font-body antialiased"
>>>>>>> main
        )}
        style={{
          "--font-inter":
            "Inter, ui-sans-serif, system-ui, sans-serif",
          "--font-lexend":
            "Lexend, ui-sans-serif, system-ui, sans-serif",
        } as React.CSSProperties}
      >
        <div className="absolute inset-0 -z-10 h-full w-full bg-black bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem]"/>
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,hsl(var(--primary)/0.15),rgba(255,255,255,0))]"></div>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <AuthGate>
              {children}
            </AuthGate>
          </FirebaseClientProvider>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
