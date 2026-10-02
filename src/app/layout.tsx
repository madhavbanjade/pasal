import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/layouts/Header";
import Footer from "@/src/components/layouts/Footer";



const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans", // the name used in globals.css
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mero Pasal",
  description: "Mero Pasal is an ecommerce platform..",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 <html lang="en" className={publicSans.variable}>
  <body>

       <Header />
      <main className="min-h-screen overflow-x-hidden">
{children}
      </main>
      <Footer />
  </body>
   
    </html>
  );
}
