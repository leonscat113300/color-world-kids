import type { Metadata, Viewport } from "next";
import "./globals.css";
import "@fontsource-variable/vazirmatn/wght.css";
import "@fontsource-variable/baloo-2/wght.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "دنیای رنگ‌ها | Color World Kids",
  description:
    "بازی رنگ‌آمیزی شاد و امن برای کودکان ۳ تا ۱۲ سال — با رنگو آشنا شو، نقاشی بکش، استیکر بچسبون و گالری خودت رو بساز!",
  keywords: ["رنگ‌آمیزی", "کودکان", "نقاشی", "coloring", "kids", "Color World"],
  applicationName: "دنیای رنگ‌ها",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/logo.webp", type: "image/webp" },
      { url: "/icons/icon-192.png?v=2", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png?v=2", sizes: "512x512", type: "image/png" },
    ],
    apple: "/icons/icon-192.png?v=2",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "رنگ‌ها",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#78C8F8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body
        className={`kid-font antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
