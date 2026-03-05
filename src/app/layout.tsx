import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
