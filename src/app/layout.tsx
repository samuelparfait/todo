import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import localFont from 'next/font/local';

import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'Todo',
  description: 'A basic todo list',
};

const myFont = localFont({
  src: '../../public/fonts/Ginto-Copilot-Upright-Variable.woff2',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body lang='en' className={myFont.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
