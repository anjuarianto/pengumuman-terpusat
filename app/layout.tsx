import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";
import '@/ckeditor5/sample/styles.css';

const inter = Inter({ subsets: ["latin"] });

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Pengumuman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable}  `}>
      <body className="h-screen bg-cover bg-center " style={{ backgroundImage: `url('/assets/bg.jpeg')` }}>
        {children}
      </body>
    </html>
  );
}
