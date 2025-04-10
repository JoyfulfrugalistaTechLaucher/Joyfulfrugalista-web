import React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/global.css";
import { AuthProvider } from "./contexts/AuthContext";
import { RecordsProvider } from "./contexts/RecordsContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Joyful Savings Jar",
  description: "Your ultimate savings companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <RecordsProvider>
            {children}
          </RecordsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
