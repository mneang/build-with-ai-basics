import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UAT Scenario Generator",
  description: "Turn a software change into structured UAT scenarios.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
