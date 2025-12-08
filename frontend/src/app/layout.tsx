import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import AppLayout from "@/components/AppLayout";
import { FileProvider } from "@/context/FileContext";
import { OfflineProvider } from "@/context/OfflineContext";


export const metadata: Metadata = {
  title: "営業日報システム",
  description: "営業日報・活動管理システム",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "営業日報",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#0066CC",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className="antialiased bg-sf-bg text-sf-text h-screen overflow-hidden" suppressHydrationWarning>
        <Toaster position="top-right" />
        <FileProvider>
          <OfflineProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </OfflineProvider>
        </FileProvider>
      </body>
    </html>
  );
}
