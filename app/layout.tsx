import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pixel Academy | أكاديمية بيكسل',
  description: 'منصة تعليمية متكاملة مصممة لتوفير بيئة تفاعلية ذكية للطالب.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}