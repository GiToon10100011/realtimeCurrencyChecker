import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Currency Dashboard",
  description: "Real-time currency exchange rate dashboard with smart revalidation system",
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