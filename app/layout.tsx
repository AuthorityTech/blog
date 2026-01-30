import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AuthorityTech Blog | Performance PR & Earned Media ROI",
  description: "The definitive resource on performance PR, AI visibility, and earned media ROI. Where founders learn PR actually works.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
