import './globals.css';
import { AppProviders } from '../components/providers/AppProviders';
import Navbar from '../components/layout/Navbar'; 
import Footer from '../components/layout/Footer';

// 💡 استعادة المكونات التفاعلية التي اختفت
import ChatBox from '../components/chat/ChatBox'; 

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
        {/* المُغلف الذكي يحيط بكل شيء لضمان وصول "الكهرباء" (الإعدادات) لكل المكونات */}
        <AppProviders>
          
          {/* الناف بار يظهر ثابتاً في أعلى كل الصفحات */}
          <Navbar />
          
          {/* تغليف المحتوى بكلاس الحماية لضمان عدم تداخله مع الناف بار */}
          <div className="main-content-wrapper">
            {children}
          </div>

          {/* 💡 الشات بوت والواتساب سيعملان الآن في كل صفحات المنصة أوتوماتيكياً */}
          <ChatBox />
          
          {/* الفوتر يظهر دائماً في أسفل الصفحة */}
          <Footer />

        </AppProviders>
      </body>
    </html>
  );
}