import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import { LanguageProvider } from "@/lib/LanguageContext";

export const metadata: Metadata = {
  title: "PhotoMaster Academy - Học Chụp Ảnh Chuyên Nghiệp",
  description: "Ứng dụng dạy chụp ảnh từ cơ bản đến chuyên nghiệp với 3 cấp độ: Beginner, Professional, Pro",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <LanguageProvider>
          <AuthProvider>{children}</AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
