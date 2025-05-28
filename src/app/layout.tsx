import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Global/Header/Header";
import NextTopLoader from "nextjs-toploader";

const font = Nunito_Sans({
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "E-MANER Realisasi",
  description: "Website Realisasi Kota Semarang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="icon" 
          href="/logo.png" 
        />
      </head>
      <body className={`${font.className} antialiased`}>
        <NextTopLoader 
          color="red"
          showSpinner={false}
        />
        <header>
          <Header />
        </header>
        <div className="pt-[90px] px-5 pb-5">
          {children}
        </div>
      </body>
    </html>
  );
}