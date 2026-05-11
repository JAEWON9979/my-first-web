import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import ThemeProvider from "./components/ThemeProvider";
import ToastProvider from "./components/ToastProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "내 블로그",
  description: "김재원의 개인 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-300 dark:bg-slate-900 dark:text-slate-100">
        <AuthProvider>
        <ThemeProvider>
        <ToastProvider />
        <Header />
        <main>{children}</main>

        <footer className="fixed bottom-0 left-0 w-full z-50 bg-black py-3 px-6 text-gray-300">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-bold text-white">바로가기</span>
            <a href="https://github.com/JAEWON9979" target="_blank" rel="noopener noreferrer" className="hover:text-white">
              GitHub 사이트 이동
            </a>
            <span className="text-gray-500">|</span>
            <a href="mailto:rlawodnjs9979@hs.ac.kr" className="hover:text-white">
              rlawodnjs9979@hs.ac.kr
            </a>
          </div>
        </footer>
        </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
