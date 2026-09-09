import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BizCard — Your Digital Business Card",
  description:
    "Create your digital business card in minutes. Share via QR code, get leads instantly.",
  keywords: ["digital business card", "QR code", "business card", "lead generation"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-white">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#18181b",
              color: "#fff",
              border: "none",
            },
          }}
        />
      </body>
    </html>
  );
}
