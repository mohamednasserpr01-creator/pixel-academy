import './globals.css'; 
import { AuthProvider } from '../context/AuthContext'; 
import { ThemeProvider } from '../context/ThemeContext'; 
import ChatBox from '../components/chat/ChatBox'; // 💡 1. استدعاء الشات هنا

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <AuthProvider>
          <ThemeProvider>
            {children}
            <ChatBox /> {/* 💡 2. الشات هنا هيظهر في الموقع كله بلا استثناء */}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}