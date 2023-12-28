
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UIProvider from "./nextui-provider";
import AppProvider from "./app-provider";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DailyHype",
  description: "This is a clothing e-commerce website",
  icons: [
    {
      media: "(prefers-color-scheme: light)",
      url: "/images/logo.png",
    },
    {
      media: "(prefers-color-scheme: dark)",
      url: "/images/logo.png",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark:bg-slate-900`}>
        <ClerkProvider>
        <UIProvider>
          <AppProvider>{children}</AppProvider>
        </UIProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
