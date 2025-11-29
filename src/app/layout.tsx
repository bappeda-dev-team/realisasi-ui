import type { Metadata } from "next";
/* import { Nunito_Sans } from "next/font/google"; */
import { Header } from "@/components/Global/Header/Header";
import TopNavbar from "@/components/Global/Navbar/TopNavbar";
import { ApiUrlProvider } from "@/context/ApiUrlContext";
import { BrandingProvider } from "@/context/BrandingContext";
import { UserProvider } from "@/context/UserContext";
import { FilterProvider } from "@/context/FilterContext";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

/* const font = Nunito_Sans({
 *   subsets: ["latin"],
 *   display: 'swap',
 * }); */

const appName = process.env.NEXT_PUBLIC_APP_NAME || "";
const clientName = process.env.NEXT_PUBLIC_CLIENT_NAME || "";
const logo = process.env.NEXT_PUBLIC_LOGO_URL || "/logo.ico";

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
        <link rel="icon" href={logo} />
      </head>
      <body className={`antialiased`}>
        <BrandingProvider>
          <NextTopLoader color="red" showSpinner={false} />
          <ApiUrlProvider>
            <UserProvider>
              <FilterProvider>
                <TopNavbar />
                <Header />
                <div className="pt-5 px-5 pb-5">{children}</div>
              </FilterProvider>
            </UserProvider>
          </ApiUrlProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}
