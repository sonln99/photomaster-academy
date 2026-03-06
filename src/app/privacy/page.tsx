
export default function PrivacyPage() {
  return (
    <>

      <main className="pt-4 max-w-3xl mx-auto px-4 pb-20">
        <h1 className="text-2xl font-bold mb-6">Chính sách bảo mật / Privacy Policy</h1>
        <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>Cập nhật lần cuối: 06/03/2026</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">1. Thông tin thu thập</h2>
          <p>Khi bạn đăng nhập bằng Google hoặc TikTok, chúng tôi thu thập: tên hiển thị, ảnh đại diện và ID tài khoản. Với TikTok, chúng tôi cũng truy cập danh sách video công khai của bạn để hiển thị trên trang chủ. Chúng tôi không thu thập email, số điện thoại hay bất kỳ thông tin cá nhân nhạy cảm nào khác.</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">2. Mục đích sử dụng</h2>
          <p>Thông tin được sử dụng để: hiển thị tên và ảnh đại diện trong ứng dụng, lưu tiến độ học tập, hiển thị bảng xếp hạng, chat cộng đồng, và hiển thị video TikTok của thành viên trên trang chủ.</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">3. Chia sẻ dữ liệu</h2>
          <p>Chúng tôi không bán, trao đổi hay chia sẻ thông tin cá nhân của bạn cho bất kỳ bên thứ ba nào.</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">4. Bảo mật</h2>
          <p>Dữ liệu được lưu trữ an toàn trên Supabase (PostgreSQL) với mã hóa SSL. Chúng tôi áp dụng các biện pháp bảo mật hợp lý để bảo vệ thông tin của bạn.</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">5. Xoá dữ liệu</h2>
          <p>Bạn có thể yêu cầu xoá tài khoản và toàn bộ dữ liệu bằng cách liên hệ với chúng tôi. Dữ liệu sẽ được xoá trong vòng 30 ngày.</p>

          <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6">6. Liên hệ</h2>
          <p>Nếu có câu hỏi về chính sách bảo mật, vui lòng liên hệ qua ứng dụng.</p>
        </div>
      </main>
    </>
  );
}
