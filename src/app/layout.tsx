import type { Metadata } from "next";
/* import { Nunito_Sans } from "next/font/google"; */
import "./globals.css";
import { Header } from "@/components/Global/Header/Header";
import TopNavbar from '@/components/Global/Navbar/TopNavbar'
import NextTopLoader from "nextjs-toploader";
import { BrandingProvider } from "@/context/BrandingContext";
import { ApiUrlProvider } from "@/context/ApiUrlContext";

/* const font = Nunito_Sans({
*   subsets: ["latin"],
*   display: 'swap',
* }); */

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";

export const metadata: Metadata = {
    title: appName,
    description: `${appName} - ${clientName}`,
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
            <body className={`antialiased`}>
                <BrandingProvider>
                    <NextTopLoader
                        color="red"
                        showSpinner={false}
                    />
                    <ApiUrlProvider>
                        <TopNavbar />
                        <div className="pt-[90px] px-5 pb-5">
                            {children}
                        </div>
                    </ApiUrlProvider>
                </BrandingProvider>
            </body>
        </html>
    );
}
