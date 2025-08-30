import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Athletic Labs - Professional Sports Nutrition Platform",
  description: "Premium meal catering platform designed for professional sports teams. Streamlined nutritional planning and meal ordering with team-specific scheduling integration.",
  keywords: ["sports nutrition", "professional athletes", "meal catering", "team nutrition", "athletic performance"],
  authors: [{ name: "Athletic Labs" }],
  creator: "Athletic Labs",
  publisher: "Athletic Labs",
  openGraph: {
    title: "Athletic Labs - Professional Sports Nutrition",
    description: "Premium nutrition platform for professional sports teams",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
