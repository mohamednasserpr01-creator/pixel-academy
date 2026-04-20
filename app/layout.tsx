// FILE: app/layout.tsx
import './globals.css';
import { AppProviders } from '../components/providers/AppProviders';
import { ToastProvider } from '../context/ToastContext'; 
import PlatformUI from '../components/layout/PlatformUI'; // 💡 استدعاء المُغلف الذكي

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
        <ToastProvider>
          <AppProviders>
            
            {/* 💡 المُغلف الذكي هو اللي هيقرر يعرض الهيدر والفوتر ولا يخفيهم */}
            <PlatformUI>
              {children}
            </PlatformUI>

          </AppProviders>
        </ToastProvider>
      </body>
    </html>
  );
}