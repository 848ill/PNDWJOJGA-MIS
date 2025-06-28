// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Import Inter font

// Initialize Inter font with specific subsets
const inter = Inter({ subsets: ['latin'], variable: '--font-sans' }); // <--- Added variable for Tailwind

export const metadata: Metadata = {
  title: 'PNDWJOGJA MIS',
  description: 'Government Complaint Intelligence Platform',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply Inter font and any other base styles to the body */}
      <body className={inter.className}> {/* <--- Ensure inter.className is applied */}
        {children}
      </body>
    </html>
  );
}