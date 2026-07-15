import type { Metadata } from "next";
import { Sidebar } from "@/components/sidebar";
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Sidebar />
        <div className="min-h-screen pt-14 md:pt-0 md:pl-[var(--sidebar-width)]">
          {children}
        </div>
      </body>
    </html>
  );
}
