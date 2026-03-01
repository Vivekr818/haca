import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Loan Recommendation",
  description: "Evaluate your financial profile and get personalized loan and policy recommendations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-fintech-dark text-fintech-text">
        {children}
      </body>
    </html>
  );
}
