import type { Metadata } from "next";
import { Public_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/src/components/layouts/Header";
import Footer from "@/src/components/layouts/Footer";
import CartDrawer from "@/src/components/layouts/CartDrawer";
import CartToast from "@/src/components/layouts/CartToast";
import { SITE_URL, SITE_NAME } from "@/src/lib/seo";



const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans", // the name used in globals.css
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: "Mero Pasal is an ecommerce platform for clothing, jewellery and electronics.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: "Mero Pasal is an ecommerce platform for clothing, jewellery and electronics.",
    images: ["/images/logo.png"],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: "Mero Pasal is an ecommerce platform for clothing, jewellery and electronics.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo.png`,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/products?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
 <html lang="en" className={publicSans.variable}>
  <body>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

       <Header />
      <main className="min-h-screen overflow-x-hidden">
{children}
      </main>
      <Footer />
      <CartDrawer />
      <CartToast />
  </body>

    </html>
  );
}
