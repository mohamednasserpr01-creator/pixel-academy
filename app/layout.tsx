import './globals.css';
import { AppProviders } from '../components/providers/AppProviders';

export const metadata = {
  title: 'Pixel Academy',
  description: 'أكاديمية بيكسل.. خطوتك الأولى نحو التفوق',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* رمينا كل حاجة جوه المُغلف الذكي، كده Next.js مستحيل يضرب إيرور Context */}
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}