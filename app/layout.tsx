import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
import { getViewer } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import "@fontsource-variable/inter";
import "@fontsource-variable/noto-sans-kr";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HUB — Weekly Reading Notes",
    template: "%s — HUB",
  },
  description: "A quiet place for a small team to read, write, and discuss.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const authConfigured = isSupabaseConfigured();
  const viewer = await getViewer();

  return (
    <html lang="ko">
      <body>
        <Sidebar viewer={viewer} authConfigured={authConfigured} />
        <div className="min-h-screen pt-14 md:pt-0 md:pl-[var(--sidebar-width)]">
          {children}
        </div>
      </body>
    </html>
  );
}
