import { Lesson } from "./types";

export const beginnerLessons: Lesson[] = [
  {
    id: "exposure-triangle",
    title: "Tam Giác Phơi Sáng",
    description: "ISO, Khẩu độ, Tốc độ màn trập - 3 yếu tố quyết định ánh sáng bức ảnh",
    content: `
<h2>Tam Giác Phơi Sáng Là Gì?</h2>
<p>Tam giác phơi sáng (Exposure Triangle) là khái niệm cơ bản nhất trong nhiếp ảnh, mô tả mối quan hệ giữa 3 yếu tố quyết định lượng ánh sáng trong bức ảnh: <strong>ISO</strong>, <strong>Khẩu độ (Aperture)</strong>, và <strong>Tốc độ màn trập (Shutter Speed)</strong>.</p>
<p>Khi một trong ba yếu tố thay đổi, bạn cần điều chỉnh ít nhất một trong hai yếu tố còn lại để giữ cho bức ảnh có độ sáng phù hợp.</p>

<h2>1. ISO - Độ Nhạy Sáng</h2>
<p>ISO là mức độ nhạy sáng của cảm biến máy ảnh. Số ISO càng cao, cảm biến càng nhạy sáng, ảnh càng sáng.</p>
<h3>Các mức ISO thường gặp:</h3>
<ul>
<li><strong>ISO 100-200:</strong> Dùng ngoài trời nắng, ảnh sắc nét, ít nhiễu (noise)</li>
<li><strong>ISO 400-800:</strong> Dùng trong bóng râm, trong nhà có cửa sổ</li>
<li><strong>ISO 1600-3200:</strong> Dùng trong nhà thiếu sáng, buổi tối</li>
<li><strong>ISO 6400+:</strong> Điều kiện cực thiếu sáng, chấp nhận nhiễu hạt</li>
</ul>
<div class="tip-box">
<strong>Mẹo:</strong> Luôn bắt đầu với ISO thấp nhất có thể (100 hoặc 200) để có chất lượng ảnh tốt nhất. Chỉ tăng ISO khi khẩu độ và tốc độ không đủ đáp ứng.
</div>

<h2>2. Khẩu Độ (Aperture) - F-stop</h2>
<p>Khẩu độ là độ mở của ống kính, kiểm soát lượng ánh sáng đi vào cảm biến. Được đo bằng chỉ số <strong>f-stop</strong>.</p>
<h3>Quy tắc quan trọng:</h3>
<ul>
<li><strong>Số f nhỏ (f/1.4, f/2.8):</strong> Khẩu độ MỞ LỚN → nhiều sáng → xoá phông mạnh (DOF nông)</li>
<li><strong>Số f lớn (f/8, f/11, f/16):</strong> Khẩu độ ĐÓNG NHỎ → ít sáng → sắc nét toàn cảnh (DOF sâu)</li>
</ul>
<div class="info-box">
<strong>Ví dụ thực tế:</strong> Chụp chân dung xoá phông đẹp → dùng f/1.4 - f/2.8. Chụp phong cảnh sắc nét → dùng f/8 - f/11.
</div>

<h2>3. Tốc Độ Màn Trập (Shutter Speed)</h2>
<p>Tốc độ màn trập là khoảng thời gian cửa trập mở ra để ánh sáng chiếu vào cảm biến.</p>
<h3>Các mức tốc độ:</h3>
<ul>
<li><strong>1/1000s - 1/500s:</strong> Đóng băng chuyển động nhanh (thể thao, chim bay)</li>
<li><strong>1/250s - 1/125s:</strong> Chụp đời thường, chân dung</li>
<li><strong>1/60s:</strong> Giới hạn cầm tay an toàn (với lens 50mm)</li>
<li><strong>1/30s - 1s:</strong> Cần tripod, tạo hiệu ứng chuyển động</li>
<li><strong>1s - 30s:</strong> Phơi sáng, chụp đêm, vẽ sáng</li>
</ul>
<div class="tip-box">
<strong>Quy tắc cầm tay:</strong> Tốc độ tối thiểu = 1/(tiêu cự ống kính). Ví dụ: lens 50mm → tốc độ tối thiểu 1/50s. Lens 200mm → tối thiểu 1/200s.
</div>

<h2>Cách 3 Yếu Tố Làm Việc Cùng Nhau</h2>
<p>Hãy tưởng tượng như một chiếc cân. Khi bạn tăng một yếu tố, bạn cần giảm yếu tố khác để giữ cân bằng:</p>
<ul>
<li>Tăng ISO 1 stop → có thể tăng tốc độ 1 stop hoặc đóng khẩu độ 1 stop</li>
<li>Mở khẩu độ 1 stop → cần tăng tốc độ 1 stop hoặc giảm ISO 1 stop</li>
<li>Giảm tốc độ 1 stop → có thể đóng khẩu độ 1 stop hoặc giảm ISO 1 stop</li>
</ul>
<div class="info-box">
<strong>1 Stop là gì?</strong> Một stop là gấp đôi hoặc giảm nửa lượng sáng. Ví dụ: từ ISO 200 lên ISO 400 là tăng 1 stop. Từ f/4 sang f/2.8 là mở thêm 1 stop.
</div>
    `,
    quiz: [
      {
        question: "ISO cao hơn sẽ tạo ra hiệu ứng gì?",
        options: ["Ảnh sáng hơn và nhiều noise hơn", "Ảnh tối hơn và ít noise", "Xoá phông nhiều hơn", "Đóng băng chuyển động"],
        correctIndex: 0,
        explanation: "ISO cao làm tăng độ nhạy sáng của cảm biến, giúp ảnh sáng hơn nhưng đồng thời tạo ra nhiễu hạt (noise) nhiều hơn."
      },
      {
        question: "Khẩu độ f/2.8 so với f/11, điều gì đúng?",
        options: ["f/2.8 cho ít sáng hơn f/11", "f/2.8 cho nhiều sáng hơn và xoá phông mạnh hơn", "f/11 cho xoá phông đẹp hơn", "Không có sự khác biệt"],
        correctIndex: 1,
        explanation: "Số f càng nhỏ = khẩu độ càng lớn = nhiều sáng hơn và độ sâu trường ảnh (DOF) càng nông, tạo xoá phông mạnh hơn."
      },
      {
        question: "Để đóng băng một vận động viên đang chạy, bạn nên dùng tốc độ nào?",
        options: ["1/30s", "1/60s", "1/500s hoặc nhanh hơn", "2 giây"],
        correctIndex: 2,
        explanation: "Tốc độ 1/500s hoặc nhanh hơn (1/1000s, 1/2000s) giúp đóng băng chuyển động nhanh mà không bị nhoè."
      },
      {
        question: "Quy tắc cầm tay an toàn với ống kính 100mm là gì?",
        options: ["Tốc độ tối thiểu 1/50s", "Tốc độ tối thiểu 1/100s", "Tốc độ tối thiểu 1/200s", "Không cần quan tâm tốc độ"],
        correctIndex: 1,
        explanation: "Quy tắc cầm tay: tốc độ tối thiểu = 1/(tiêu cự). Với lens 100mm, tốc độ tối thiểu là 1/100s để tránh rung tay."
      },
      {
        question: "Tăng ISO từ 400 lên 800 tương đương với điều gì?",
        options: ["Tăng 2 stop sáng", "Tăng 1 stop sáng", "Giảm 1 stop sáng", "Không thay đổi"],
        correctIndex: 1,
        explanation: "Mỗi lần gấp đôi ISO (400 → 800) là tăng 1 stop, tức là gấp đôi lượng sáng cảm biến thu nhận."
      }
    ],
    exercises: [
      {
        title: "Thực hành chế độ M (Manual)",
        description: "Đặt máy ảnh ở chế độ Manual. Chọn ISO 100, f/5.6. Thay đổi tốc độ từ 1/1000s xuống 1/30s, chụp mỗi mức một tấm. Quan sát sự thay đổi độ sáng.",
        tips: ["Dùng tripod nếu tốc độ chậm hơn 1/60s", "Chụp cùng một chủ thể và góc để dễ so sánh", "Ghi lại thông số mỗi tấm ảnh"]
      },
      {
        title: "So sánh ISO",
        description: "Cố định tốc độ và khẩu độ. Chụp cùng một cảnh với ISO 100, 400, 1600, 6400. So sánh chất lượng ảnh, đặc biệt ở vùng tối.",
        tips: ["Zoom 100% trên màn hình để thấy rõ nhiễu hạt", "Chú ý vùng tối sẽ bị noise nhiều nhất", "Tìm mức ISO tối đa mà bạn chấp nhận được"]
      }
    ]
  },
  {
    id: "composition-basics",
    title: "Bố Cục Cơ Bản",
    description: "Quy tắc 1/3, đường dẫn, cân bằng - cách sắp xếp khung hình chuyên nghiệp",
    content: `
<h2>Bố Cục Là Gì?</h2>
<p>Bố cục (Composition) là cách bạn sắp xếp các yếu tố trong khung hình. Một bức ảnh có bố cục tốt sẽ dẫn mắt người xem đến chủ thể và tạo cảm xúc mạnh mẽ.</p>

<h2>1. Quy Tắc 1/3 (Rule of Thirds)</h2>
<p>Đây là quy tắc cơ bản và quan trọng nhất. Chia khung hình thành <strong>9 ô bằng nhau</strong> bằng 2 đường ngang và 2 đường dọc. Đặt chủ thể tại các <strong>giao điểm</strong>.</p>
<ul>
<li>Đặt mắt người ở giao điểm trên khi chụp chân dung</li>
<li>Đặt đường chân trời ở đường 1/3 trên hoặc dưới</li>
<li>Tránh đặt chủ thể ở chính giữa (trừ khi có chủ đích)</li>
</ul>

<h2>2. Đường Dẫn (Leading Lines)</h2>
<p>Sử dụng các đường tự nhiên trong cảnh vật để dẫn mắt người xem vào chủ thể chính:</p>
<ul>
<li><strong>Đường thẳng:</strong> Đường ray, con đường, hàng rào</li>
<li><strong>Đường cong:</strong> Sông, đường mòn uốn lượn</li>
<li><strong>Đường chéo:</strong> Tạo cảm giác động, năng động</li>
<li><strong>Đường hội tụ:</strong> 2 đường gặp nhau ở điểm mất → tạo chiều sâu mạnh</li>
</ul>

<h2>3. Khung Hình Trong Khung Hình (Framing)</h2>
<p>Sử dụng yếu tố tự nhiên hoặc nhân tạo để tạo "khung" bao quanh chủ thể:</p>
<ul>
<li>Cửa sổ, cửa ra vào</li>
<li>Cành cây, vòm lá</li>
<li>Cấu trúc kiến trúc (vòm, cổng)</li>
</ul>

<h2>4. Đối Xứng (Symmetry)</h2>
<p>Đối xứng tạo cảm giác hài hoà, cân bằng và thu hút mắt. Thường gặp trong kiến trúc, phản chiếu trên mặt nước.</p>

<h2>5. Tiền Cảnh (Foreground Interest)</h2>
<p>Thêm yếu tố ở tiền cảnh để tạo <strong>chiều sâu 3D</strong> cho bức ảnh 2D:</p>
<ul>
<li>Đá, hoa, lá cây ở tiền cảnh khi chụp phong cảnh</li>
<li>Tạo các lớp: tiền cảnh → trung cảnh → hậu cảnh</li>
</ul>

<h2>6. Khoảng Trống (Negative Space)</h2>
<p>Để khoảng trống xung quanh chủ thể để tạo cảm giác cô đơn, tĩnh lặng, nhấn mạnh chủ thể hoặc tạo sự tối giản.</p>

<h2>7. Cân Bằng (Balance)</h2>
<p>Phân bố "trọng lượng thị giác" đều trong khung hình. Một chủ thể lớn ở bên trái có thể cân bằng bởi nhiều chủ thể nhỏ ở bên phải.</p>

<div class="tip-box">
<strong>Lưu ý:</strong> Các quy tắc này là hướng dẫn, không phải luật. Khi đã thành thạo, hãy thử phá vỡ chúng để tạo phong cách riêng!
</div>
    `,
    quiz: [
      {
        question: "Theo quy tắc 1/3, bạn nên đặt chủ thể ở đâu?",
        options: ["Chính giữa khung hình", "Tại các giao điểm của đường kẻ", "Ở góc khung hình", "Ở cạnh khung hình"],
        correctIndex: 1,
        explanation: "Quy tắc 1/3 khuyên đặt chủ thể tại 4 giao điểm của các đường chia, tạo bố cục tự nhiên và thu hút hơn."
      },
      {
        question: "Đường dẫn (Leading Lines) có tác dụng gì?",
        options: ["Làm ảnh sáng hơn", "Dẫn mắt người xem đến chủ thể chính", "Tạo xoá phông", "Tăng độ nét"],
        correctIndex: 1,
        explanation: "Đường dẫn sử dụng các đường tự nhiên để hướng mắt người xem đến chủ thể chính trong bức ảnh."
      },
      {
        question: "Kỹ thuật 'Framing' là gì?",
        options: ["Chọn khung ảnh đẹp", "Dùng các yếu tố tạo khung bao quanh chủ thể", "Crop ảnh sau khi chụp", "Chọn tỷ lệ khung hình"],
        correctIndex: 1,
        explanation: "Framing là dùng các yếu tố như cửa sổ, cành cây, vòm cuốn để tạo khung tự nhiên bao quanh chủ thể."
      },
      {
        question: "Khoảng trống (Negative Space) giúp tạo cảm giác gì?",
        options: ["Ảnh bị trống, thiếu nội dung", "Nhấn mạnh chủ thể, tạo sự tối giản", "Ảnh bị lỗi bố cục", "Không có tác dụng gì"],
        correctIndex: 1,
        explanation: "Negative space giúp nhấn mạnh chủ thể, tạo cảm giác tối giản, hiện đại hoặc cô đơn tuỳ ngữ cảnh."
      },
      {
        question: "Tiền cảnh (Foreground) giúp bức ảnh như thế nào?",
        options: ["Làm mờ hậu cảnh", "Tạo chiều sâu 3D cho ảnh 2D", "Tăng độ sáng", "Giảm nhiễu hạt"],
        correctIndex: 1,
        explanation: "Thêm yếu tố tiền cảnh tạo các lớp, giúp ảnh 2D có cảm giác chiều sâu 3D."
      }
    ],
    exercises: [
      {
        title: "Thực hành Quy tắc 1/3",
        description: "Bật lưới trên màn hình máy ảnh/điện thoại. Chụp 10 bức ảnh đặt chủ thể tại các giao điểm. So sánh với việc đặt ở giữa.",
        tips: ["Hầu hết máy ảnh và điện thoại đều có tuỳ chọn bật lưới", "Thử cả 4 giao điểm", "Chú ý hướng nhìn của chủ thể - để khoảng trống phía trước mắt"]
      },
      {
        title: "Tìm Đường Dẫn",
        description: "Ra ngoài và tìm 5 loại đường dẫn khác nhau. Chụp mỗi loại ít nhất 2 tấm.",
        tips: ["Hạ thấp góc chụp để nhấn mạnh đường dẫn", "Đường dẫn không nhất thiết phải là đường vật lý - có thể là ánh sáng, bóng"]
      }
    ]
  },
  {
    id: "natural-light",
    title: "Ánh Sáng Tự Nhiên",
    description: "Hiểu và tận dụng ánh sáng tự nhiên - vũ khí mạnh nhất của nhiếp ảnh gia",
    content: `
<h2>Tại Sao Ánh Sáng Tự Nhiên Quan Trọng?</h2>
<p>Ánh sáng là yếu tố quan trọng nhất trong nhiếp ảnh (photography = "vẽ bằng ánh sáng"). Hiểu cách đọc và sử dụng ánh sáng tự nhiên là kỹ năng nền tảng.</p>

<h2>1. Chất Lượng Ánh Sáng</h2>
<h3>Ánh sáng mềm (Soft Light)</h3>
<ul>
<li>Nguồn sáng lớn, tản ra (trời mây, bóng râm, qua tấm tản sáng)</li>
<li>Bóng mờ, chuyển tiếp nhẹ nhàng</li>
<li>Lý tưởng cho chân dung - làm mịn da, giảm nếp nhăn</li>
</ul>
<h3>Ánh sáng cứng (Hard Light)</h3>
<ul>
<li>Nguồn sáng nhỏ, tập trung (nắng giữa trưa, đèn flash trực tiếp)</li>
<li>Bóng sắc nét, tương phản cao</li>
<li>Tạo kịch tính, nhấn mạnh kết cấu</li>
</ul>

<h2>2. Hướng Ánh Sáng</h2>
<ul>
<li><strong>Thuận sáng (Front light):</strong> Sáng từ phía trước. Phẳng, ít chiều sâu nhưng dễ chụp.</li>
<li><strong>Ngược sáng (Backlight):</strong> Sáng từ phía sau. Tạo rim light, silhouette đẹp.</li>
<li><strong>Sáng cạnh (Side light):</strong> Sáng từ bên cạnh. Tạo chiều sâu, nhấn mạnh kết cấu.</li>
<li><strong>Sáng từ trên (Top light):</strong> Sáng từ trên xuống (giữa trưa). Tạo bóng mắt gấu trúc - tránh chụp chân dung.</li>
</ul>

<h2>3. Giờ Vàng (Golden Hour)</h2>
<p>Khoảng <strong>1 giờ sau bình minh</strong> và <strong>1 giờ trước hoàng hôn</strong>:</p>
<ul>
<li>Màu ấm vàng, cam tuyệt đẹp</li>
<li>Góc sáng thấp tạo bóng dài, chiều sâu</li>
<li>Ánh sáng mềm, dịu - lý tưởng cho mọi thể loại</li>
</ul>

<h2>4. Giờ Xanh (Blue Hour)</h2>
<p>Khoảng <strong>20-30 phút trước bình minh</strong> và <strong>sau hoàng hôn</strong>. Bầu trời có màu xanh đậm, cân bằng đẹp với ánh sáng nhân tạo.</p>

<h2>5. Chụp Trong Nhà Với Ánh Sáng Cửa Sổ</h2>
<ul>
<li>Đặt chủ thể cạnh cửa sổ, sáng chiếu từ một bên</li>
<li>Dùng tấm phản quang hoặc giấy trắng để fill bóng</li>
<li>Rèm mỏng giúp khuếch tán ánh sáng thành soft light</li>
</ul>

<div class="tip-box">
<strong>Mẹo Pro:</strong> Trời mây phủ là "softbox khổng lồ" tự nhiên. Ngày u ám thực ra lý tưởng để chụp chân dung vì ánh sáng mềm đều, không có bóng cứng.
</div>
    `,
    quiz: [
      {
        question: "Golden Hour xảy ra khi nào?",
        options: ["Giữa trưa", "1 giờ sau bình minh và 1 giờ trước hoàng hôn", "Nửa đêm", "Bất cứ lúc nào trời nắng"],
        correctIndex: 1,
        explanation: "Golden Hour là khoảng 1 giờ sau bình minh và 1 giờ trước hoàng hôn, khi mặt trời ở góc thấp tạo ánh sáng ấm, mềm tuyệt đẹp."
      },
      {
        question: "Ánh sáng mềm (Soft Light) có đặc điểm gì?",
        options: ["Bóng sắc nét, tương phản cao", "Bóng mờ, chuyển tiếp nhẹ nhàng", "Không có bóng", "Chỉ có vào ban đêm"],
        correctIndex: 1,
        explanation: "Soft light tạo bóng mờ với chuyển tiếp nhẹ nhàng, đến từ nguồn sáng lớn hoặc tản ra."
      },
      {
        question: "Khi nào nên tránh chụp chân dung ngoài trời?",
        options: ["Golden Hour", "Trời mây", "Giữa trưa nắng gắt", "Blue Hour"],
        correctIndex: 2,
        explanation: "Giữa trưa, mặt trời chiếu từ trên xuống tạo bóng mắt gấu trúc - rất không đẹp cho chân dung."
      },
      {
        question: "Backlight (ngược sáng) thường tạo hiệu ứng gì?",
        options: ["Ảnh phẳng, không có chiều sâu", "Rim light hoặc silhouette", "Ảnh bị tối hoàn toàn", "Xoá phông mạnh"],
        correctIndex: 1,
        explanation: "Ngược sáng tạo viền sáng (rim light) quanh chủ thể hoặc silhouette tuỳ vào cách đo sáng."
      }
    ],
    exercises: [
      {
        title: "Chụp Golden Hour",
        description: "Chọn một địa điểm đẹp, đến trước hoàng hôn 1.5 giờ. Chụp liên tục trong 1 giờ và quan sát sự thay đổi ánh sáng.",
        tips: ["Check giờ mặt trời lặn trên ứng dụng thời tiết", "Chụp cả ngược sáng để tạo flare và rim light", "Thử cả chân dung và phong cảnh"]
      },
      {
        title: "Thực hành Ánh Sáng Cửa Sổ",
        description: "Đặt vật thể cạnh cửa sổ. Chụp với các vị trí khác nhau: sáng cạnh, sáng 45 độ, ngược sáng.",
        tips: ["Dùng giấy trắng A4 làm reflector fill bóng", "Thử với và không rèm cửa", "Tắt tất đèn trong phòng để chỉ dùng ánh sáng cửa sổ"]
      }
    ]
  },
  {
    id: "camera-modes",
    title: "Các Chế Độ Chụp",
    description: "Auto, P, Av, Tv, M - hiểu và sử dụng đúng chế độ cho từng tình huống",
    content: `
<h2>Tổng Quan Các Chế Độ Chụp</h2>
<p>Hiểu các chế độ chụp giúp bạn kiểm soát máy ảnh theo ý muốn thay vì để máy tự quyết định.</p>

<h2>1. Auto Mode (Chế Độ Tự Động)</h2>
<p>Máy ảnh tự quyết định tất cả: ISO, khẩu độ, tốc độ, flash.</p>
<ul>
<li><strong>Ưu điểm:</strong> Dễ dùng, nhanh</li>
<li><strong>Nhược điểm:</strong> Không kiểm soát được, máy thường bật flash khi không cần</li>
</ul>

<h2>2. P - Program Mode</h2>
<p>Máy chọn khẩu độ và tốc độ, bạn kiểm soát ISO, cân bằng trắng, bù sáng.</p>

<h2>3. Av/A - Aperture Priority (Ưu Tiên Khẩu Độ)</h2>
<p>Bạn chọn <strong>khẩu độ</strong>, máy tự tính tốc độ. <strong>Chế độ được dùng nhiều nhất bởi nhiếp ảnh gia chuyên nghiệp.</strong></p>
<h3>Khi nào dùng:</h3>
<ul>
<li>Chụp chân dung: đặt f/1.4 - f/2.8 để xoá phông</li>
<li>Chụp phong cảnh: đặt f/8 - f/11 để sắc nét toàn cảnh</li>
<li>Khi bạn muốn kiểm soát độ sâu trường ảnh (DOF)</li>
</ul>

<h2>4. Tv/S - Shutter Priority (Ưu Tiên Tốc Độ)</h2>
<p>Bạn chọn <strong>tốc độ</strong>, máy tự tính khẩu độ.</p>
<h3>Khi nào dùng:</h3>
<ul>
<li>Chụp thể thao, động vật: 1/500s - 1/2000s</li>
<li>Tạo hiệu ứng nhoè chuyển động: 1/15s - 1/4s</li>
<li>Chụp thác nước mượt: 1/2s - 2s</li>
</ul>

<h2>5. M - Manual Mode</h2>
<p>Bạn kiểm soát <strong>tất cả</strong>: ISO, khẩu độ, tốc độ. Toàn quyền sáng tạo.</p>
<h3>Khi nào dùng:</h3>
<ul>
<li>Chụp studio với đèn flash</li>
<li>Chụp phơi sáng (long exposure)</li>
<li>Khi bạn muốn kết quả nhất quán giữa các tấm</li>
</ul>

<div class="info-box">
<strong>Lời khuyên:</strong> Bắt đầu với Av/A mode. Khi đã quen, chuyển sang M mode. 80% nhiếp ảnh gia chuyên nghiệp sử dụng Av hoặc M.
</div>

<h2>6. Bù Sáng (Exposure Compensation)</h2>
<p>Trong chế độ P, Av, Tv - dùng nút <strong>+/-</strong> để bù sáng khi máy đo sai:</p>
<ul>
<li><strong>+1, +2:</strong> Tăng sáng (chụp người mặc áo trắng, cảnh tuyết)</li>
<li><strong>-1, -2:</strong> Giảm sáng (chụp vật tối, cảnh ban đêm)</li>
</ul>
    `,
    quiz: [
      {
        question: "Chế độ Av/A cho phép bạn kiểm soát gì?",
        options: ["Tốc độ màn trập", "Khẩu độ (aperture)", "ISO và tốc độ", "Tất cả thông số"],
        correctIndex: 1,
        explanation: "Av/A mode cho bạn chọn khẩu độ, máy ảnh tự tính tốc độ phù hợp."
      },
      {
        question: "Khi chụp thể thao, chế độ nào phù hợp nhất?",
        options: ["Auto", "Av - Aperture Priority", "Tv/S - Shutter Priority", "P - Program"],
        correctIndex: 2,
        explanation: "Tv/S mode cho bạn chọn tốc độ cao (1/500s+) để đóng băng chuyển động."
      },
      {
        question: "Bù sáng +1 có nghĩa là gì?",
        options: ["Giảm 1 stop sáng", "Tăng 1 stop sáng", "Tăng ISO lên 1", "Giảm khẩu độ 1 stop"],
        correctIndex: 1,
        explanation: "Bù sáng +1 yêu cầu máy ảnh tăng thêm 1 stop sáng hơn mức đo sáng tự động."
      },
      {
        question: "Chế độ nào được sử dụng nhiều nhất bởi nhiếp ảnh gia chuyên nghiệp?",
        options: ["Auto", "P - Program", "Av/A - Aperture Priority", "Scene modes"],
        correctIndex: 2,
        explanation: "Av/A mode phổ biến nhất vì cho phép kiểm soát DOF - yếu tố sáng tạo quan trọng nhất."
      }
    ],
    exercises: [
      {
        title: "So sánh các chế độ",
        description: "Chụp cùng một cảnh với tất cả các chế độ: Auto, P, Av, Tv, M. Ghi lại thông số và so sánh.",
        tips: ["Chú ý xem Auto có bật flash không", "Ở Av, thử thay đổi khẩu độ từ f/2.8 đến f/16", "Ở Tv, thử tốc độ từ 1/1000s đến 1/30s"]
      }
    ]
  },
  {
    id: "white-balance",
    title: "Cân Bằng Trắng & RAW vs JPEG",
    description: "Nhiệt màu, cân bằng trắng, và tại sao bạn nên chụp RAW",
    content: `
<h2>Cân Bằng Trắng (White Balance) Là Gì?</h2>
<p>Cân bằng trắng giúp máy ảnh tái tạo màu sắc chính xác dưới các điều kiện ánh sáng khác nhau.</p>

<h2>Nhiệt Màu (Color Temperature) - Kelvin</h2>
<ul>
<li><strong>1800-2700K:</strong> Nến, đèn dây tóc (rất ấm, vàng/cam)</li>
<li><strong>3000-3500K:</strong> Đèn tungsten trong nhà (ấm, vàng)</li>
<li><strong>4000-4500K:</strong> Đèn huỳnh quang (hơi xanh)</li>
<li><strong>5000-5500K:</strong> Ánh sáng ban ngày, flash (trung tính)</li>
<li><strong>6000-6500K:</strong> Trời mây (hơi xanh/lạnh)</li>
<li><strong>7000-8000K:</strong> Bóng râm, trời rất u ám (lạnh, xanh)</li>
</ul>

<h2>Các Preset Cân Bằng Trắng</h2>
<ul>
<li><strong>AWB (Auto):</strong> Máy tự động - tốt cho đa số trường hợp</li>
<li><strong>Daylight:</strong> Ngoài trời nắng (~5200K)</li>
<li><strong>Cloudy:</strong> Trời mây (~6000K) - ấm hơn daylight</li>
<li><strong>Shade:</strong> Bóng râm (~7000K) - ấm nhất</li>
<li><strong>Tungsten:</strong> Đèn dây tóc (~3200K)</li>
<li><strong>Fluorescent:</strong> Đèn huỳnh quang (~4000K)</li>
<li><strong>Flash:</strong> Khi dùng đèn flash (~5500K)</li>
</ul>

<h2>RAW vs JPEG</h2>
<h3>JPEG</h3>
<ul>
<li>File nhỏ, máy ảnh xử lý sẵn</li>
<li>Có thể chia sẻ ngay</li>
<li>Mất dữ liệu khi nén - khó chỉnh sửa sau</li>
</ul>
<h3>RAW</h3>
<ul>
<li>File lớn (20-50MB), chứa tất cả dữ liệu cảm biến</li>
<li>Chỉnh sửa mạnh không mất chất lượng</li>
<li>Có thể thay đổi WB sau khi chụp mà không mất chi tiết</li>
</ul>

<div class="tip-box">
<strong>Khuyến nghị:</strong> Luôn chụp RAW (hoặc RAW+JPEG). Khi chụp RAW, bạn có thể thay đổi cân bằng trắng hoàn toàn tự do trong hậu kỳ mà không mất chi tiết nào.
</div>

<h2>Dynamic Range (Dải Động)</h2>
<p>RAW giữ được <strong>12-14 stop</strong> dải động so với <strong>8-9 stop</strong> của JPEG. Bạn có thể kéo sáng vùng tối, kéo lại chi tiết vùng sáng bị cháy - linh hoạt hơn rất nhiều.</p>
    `,
    quiz: [
      {
        question: "Nhiệt màu Kelvin của ánh sáng ban ngày là khoảng bao nhiêu?",
        options: ["2000K", "3500K", "5200-5500K", "8000K"],
        correctIndex: 2,
        explanation: "Ánh sáng ban ngày có nhiệt màu khoảng 5200-5500K, được coi là ánh sáng trung tính."
      },
      {
        question: "Lợi thế lớn nhất của chụp RAW là gì?",
        options: ["File nhỏ hơn JPEG", "Có thể chia sẻ ngay", "Giữ toàn bộ dữ liệu, linh hoạt hậu kỳ", "Máy ảnh chụp nhanh hơn"],
        correctIndex: 2,
        explanation: "RAW giữ toàn bộ dữ liệu cảm biến (12-14 stop dynamic range), cho phép chỉnh sửa mạnh mà không mất chất lượng."
      },
      {
        question: "Khi chụp dưới đèn tungsten, màu ảnh sẽ bị lệch về đâu?",
        options: ["Xanh lạnh", "Vàng ấm", "Tím", "Xanh lá"],
        correctIndex: 1,
        explanation: "Đèn tungsten có nhiệt màu thấp (~3200K) tạo ánh sáng ấm vàng."
      },
      {
        question: "AWB là gì?",
        options: ["Advanced White Balance", "Auto White Balance", "Aperture With Balance", "Auto Wide Burst"],
        correctIndex: 1,
        explanation: "AWB = Auto White Balance - máy ảnh tự động phân tích cảnh và chọn nhiệt màu phù hợp."
      }
    ],
    exercises: [
      {
        title: "So sánh RAW vs JPEG",
        description: "Chụp RAW+JPEG cùng một cảnh. Thử kéo exposure +2 và -2 trong hậu kỳ cho cả 2 file. So sánh chất lượng.",
        tips: ["Dùng Lightroom hoặc phần mềm miễn phí như RawTherapee", "Zoom 100% để thấy sự khác biệt rõ nhất", "Chú ý vùng sáng và tối - RAW sẽ giữ chi tiết tốt hơn"]
      }
    ]
  },
  {
    id: "lenses-basics",
    title: "Ống Kính Cơ Bản",
    description: "Hiểu về tiêu cự, prime vs zoom, và chọn ống kính đầu tiên",
    content: `
<h2>Tiêu Cự (Focal Length) Là Gì?</h2>
<p>Tiêu cự (đo bằng mm) quyết định <strong>góc nhìn</strong> và <strong>độ phóng đại</strong> của ống kính. Số mm càng nhỏ = góc rộng hơn. Số mm càng lớn = góc hẹp hơn, zoom gần hơn.</p>

<h2>Phân Loại Ống Kính Theo Tiêu Cự</h2>

<h3>Ultra Wide: 10-24mm</h3>
<ul>
<li>Góc cực rộng, bao quát nhiều cảnh</li>
<li>Dùng cho: kiến trúc, nội thất, phong cảnh hùng vĩ, astro</li>
<li>Chú ý: bị biến dạng ở cạnh khung hình</li>
</ul>

<h3>Wide: 24-35mm</h3>
<ul>
<li>Góc rộng tự nhiên</li>
<li><strong>35mm:</strong> Góc nhìn gần giống mắt người - tuyệt vời cho street, documentary</li>
</ul>

<h3>Standard: 50mm</h3>
<ul>
<li>"Nifty Fifty" - ống kính kinh điển nhất</li>
<li>Góc nhìn giống mắt người nhất</li>
<li>Đa năng: street, chân dung, đời thường</li>
<li>Thường có khẩu độ lớn (f/1.8, f/1.4) với giá phải chăng</li>
</ul>

<h3>Portrait: 85-105mm</h3>
<ul>
<li><strong>85mm:</strong> Ống kính chân dung được yêu thích nhất</li>
<li>Nén phông đẹp (background compression)</li>
<li>Tỷ lệ khuôn mặt tự nhiên, không bị biến dạng</li>
</ul>

<h3>Telephoto: 70-200mm và hơn</h3>
<ul>
<li><strong>70-200mm f/2.8:</strong> Ống kính "con ngựa chiến" - sự kiện, thể thao, chân dung</li>
<li>200mm+: Động vật hoang dã, chim, thể thao</li>
<li>Nén background mạnh, xoá phông đẹp</li>
</ul>

<h2>Prime vs Zoom</h2>
<h3>Prime (Cố Định)</h3>
<ul>
<li>Chỉ 1 tiêu cự (vd: 35mm, 50mm, 85mm)</li>
<li><strong>Ưu:</strong> Sắc nét hơn, khẩu độ lớn hơn, nhẹ hơn, rẻ hơn</li>
<li><strong>Nhược:</strong> Phải di chuyển để thay đổi khung hình</li>
</ul>
<h3>Zoom</h3>
<ul>
<li>Nhiều tiêu cự (vd: 24-70mm, 70-200mm)</li>
<li><strong>Ưu:</strong> Linh hoạt, tiện lợi</li>
<li><strong>Nhược:</strong> Nặng hơn, khẩu độ nhỏ hơn, đắt hơn</li>
</ul>

<div class="tip-box">
<strong>Ống kính đầu tiên nên mua:</strong> 50mm f/1.8 là lựa chọn tuyệt vời. Giá rẻ (2-4 triệu), khẩu độ lớn, sắc nét, đa năng. Sau đó thêm 35mm hoặc 85mm tuỳ thể loại yêu thích.
</div>
    `,
    quiz: [
      {
        question: "Ống kính 50mm được gọi là gì?",
        options: ["'Nifty Fifty' - đa năng cho nhiều thể loại", "'Tele lens' - chụp động vật hoang dã", "'Fisheye' - chụp góc cực rộng", "'Macro' - chụp cận cảnh"],
        correctIndex: 0,
        explanation: "50mm được gọi là 'Nifty Fifty', có góc nhìn gần giống mắt người, đa năng với giá phải chăng."
      },
      {
        question: "Tại sao 85mm là ống kính chân dung phổ biến nhất?",
        options: ["Vì nó rẻ nhất", "Vì nó nhẹ nhất", "Vì tạo tỷ lệ khuôn mặt tự nhiên và xoá phông đẹp", "Vì nó có góc rộng nhất"],
        correctIndex: 2,
        explanation: "85mm tạo tỷ lệ khuôn mặt tự nhiên, xoá phông đẹp và có khoảng cách làm việc thoải mái."
      },
      {
        question: "So với zoom lens, prime lens có ưu điểm gì?",
        options: ["Linh hoạt hơn, nhiều tiêu cự", "Sắc nét hơn, khẩu độ lớn hơn, nhẹ hơn", "Đắt hơn và nặng hơn", "Chống rung tốt hơn"],
        correctIndex: 1,
        explanation: "Prime lens sắc nét hơn, khẩu độ lớn hơn (f/1.4-1.8), nhẹ hơn và thường rẻ hơn zoom cùng chất lượng."
      },
      {
        question: "Ống kính nào phù hợp để chụp kiến trúc và nội thất?",
        options: ["85mm", "200mm", "10-24mm (ultra wide)", "50mm"],
        correctIndex: 2,
        explanation: "Ultra wide (10-24mm) có góc nhìn rộng, bao quát toàn bộ không gian - lý tưởng cho kiến trúc và nội thất."
      }
    ],
    exercises: [
      {
        title: "Zoom bằng chân",
        description: "Nếu có zoom lens, khoá ở 1 tiêu cự (35mm hoặc 50mm). Chụp cả ngày chỉ với tiêu cự đó. Học cách 'zoom bằng chân'.",
        tips: ["Bắt đầu với 50mm - góc nhìn tự nhiên nhất", "Bước bạn di chuyển sẽ giúp ý thức hơn về bố cục", "Đây là cách Henri Cartier-Bresson luyện tập"]
      }
    ]
  },
  {
    id: "focusing-techniques",
    title: "Kỹ Thuật Lấy Nét",
    description: "AF-S, AF-C, manual focus, back-button focus - làm chủ điểm nét",
    content: `
<h2>Hệ Thống Lấy Nét (Autofocus)</h2>
<p>Lấy nét chính xác là kỹ năng cơ bản nhất. Một bức ảnh mờ không thể cứu được trong hậu kỳ.</p>

<h2>1. Các Chế Độ AF</h2>
<h3>AF-S / One Shot</h3>
<ul>
<li>Focus 1 lần khi nhấn nửa nút chụp</li>
<li>Không thay đổi khi chủ thể di chuyển</li>
<li>Dùng cho: chủ thể đứng yên (chân dung, phong cảnh, sản phẩm)</li>
</ul>

<h3>AF-C / AI Servo</h3>
<ul>
<li>Liên tục theo dõi và cập nhật focus khi chủ thể di chuyển</li>
<li>Dùng cho: thể thao, động vật, trẻ em chạy nhảy</li>
<li>Kết hợp với burst mode để tăng tỷ lệ ảnh nét</li>
</ul>

<h3>AF-A / AI Focus</h3>
<ul>
<li>Máy tự động chuyển giữa AF-S và AF-C</li>
<li>Tiện lợi nhưng không chính xác bằng việc tự chọn</li>
</ul>

<h2>2. Vùng AF (AF Area)</h2>
<ul>
<li><strong>Single Point:</strong> Chính xác nhất - bạn chọn 1 điểm focus</li>
<li><strong>Zone/Group:</strong> Nhóm điểm, tốt cho chủ thể chuyển động</li>
<li><strong>Wide/Auto:</strong> Máy tự chọn - nhanh nhưng có thể focus sai chỗ</li>
<li><strong>Eye AF:</strong> Tự động nhận diện và focus vào mắt - tuyệt vời cho chân dung</li>
</ul>

<h2>3. Back-Button Focus</h2>
<p>Tách chức năng focus ra khỏi nút chụp, gán vào nút AF-ON ở phía sau máy:</p>
<ul>
<li>Nhấn AF-ON để focus, thả ra để khoá focus</li>
<li>Nút chụp chỉ để chụp, không liên quan đến focus</li>
<li>Kết hợp AF-S và AF-C trong 1: giữ AF-ON = AF-C, nhấn rồi thả = AF-S</li>
</ul>

<h2>4. Manual Focus</h2>
<p>Tự tay xoay vòng focus trên ống kính:</p>
<ul>
<li>Dùng khi AF thất bại (thiếu sáng, ít tương phản)</li>
<li>Chụp macro cần chính xác từng mm</li>
<li>Chụp phong cảnh với hyperfocal distance</li>
<li>Sử dụng Focus Peaking (viền sáng báo nét) trên mirrorless</li>
</ul>

<div class="tip-box">
<strong>Mẹo:</strong> Luôn focus vào MẮT khi chụp chân dung. Mắt là điểm đầu tiên người xem nhìn vào. Mắt mờ = ảnh hỏng.
</div>
    `,
    quiz: [
      {
        question: "Khi nào nên dùng AF-C / AI Servo?",
        options: ["Chụp phong cảnh", "Chụp sản phẩm", "Chụp chủ thể đang di chuyển", "Chụp macro"],
        correctIndex: 2,
        explanation: "AF-C liên tục theo dõi và cập nhật focus, lý tưởng cho chủ thể chuyển động như thể thao, động vật, trẻ em."
      },
      {
        question: "Back-button focus có lợi gì?",
        options: ["Chụp nhanh hơn", "Tách focus khỏi nút chụp, linh hoạt hơn", "Ảnh sáng hơn", "Xoá phông đẹp hơn"],
        correctIndex: 1,
        explanation: "Back-button focus tách AF khỏi nút chụp, cho phép bạn kết hợp AF-S và AF-C linh hoạt trong 1 thiết lập."
      },
      {
        question: "Eye AF dùng để làm gì?",
        options: ["Đo sáng mắt", "Tự động focus vào mắt chủ thể", "Tạo hiệu ứng mắt đỏ", "Xoá vùng mắt thâm"],
        correctIndex: 1,
        explanation: "Eye AF tự động nhận diện và focus vào mắt - rất hữu ích khi chụp chân dung vì mắt luôn là điểm quan trọng nhất."
      },
      {
        question: "Khi nào nên dùng Manual Focus?",
        options: ["Luôn luôn", "Khi AF thất bại, chụp macro, hoặc cần độ chính xác", "Chỉ khi chụp phong cảnh", "Chỉ với ống kính cũ"],
        correctIndex: 1,
        explanation: "Manual focus hữu ích khi AF không hoạt động tốt (thiếu sáng), chụp macro cần chính xác, hoặc dùng hyperfocal distance."
      }
    ],
    exercises: [
      {
        title: "Thực hành Back-Button Focus",
        description: "Thiết lập back-button focus trên máy ảnh. Chụp 20 tấm chân dung và 20 tấm chủ thể chuyển động. So sánh tỷ lệ ảnh nét với setup cũ.",
        tips: ["Đọc hướng dẫn máy ảnh để gán nút AF-ON", "Bắt đầu với chủ thể đứng yên để quen thao tác", "Sau đó thử với người đi bộ, chạy"]
      }
    ]
  },
  {
    id: "smartphone-photography",
    title: "Chụp Ảnh Bằng Điện Thoại",
    description: "Tối ưu hoá camera điện thoại - kỹ thuật, app, và mẹo chuyên gia",
    content: `
<h2>Điện Thoại Là Máy Ảnh Tốt Nhất</h2>
<p>"Máy ảnh tốt nhất là máy ảnh bạn có trong tay." Smartphone hiện đại có camera rất mạnh, vấn đề là bạn có biết sử dụng không.</p>

<h2>1. Hiểu Camera Điện Thoại</h2>
<ul>
<li><strong>Main lens:</strong> Ống kính chính, chất lượng tốt nhất - sử dụng nhiều nhất</li>
<li><strong>Ultra-wide:</strong> Góc rộng cho phong cảnh, kiến trúc</li>
<li><strong>Telephoto:</strong> Zoom quang học (2x, 3x, 5x) - tốt hơn zoom số</li>
<li><strong>Macro:</strong> Chụp cận cảnh chi tiết nhỏ</li>
</ul>

<h2>2. Thiết Lập Quan Trọng</h2>
<ul>
<li><strong>Bật lưới (Grid):</strong> Settings > Camera > Grid ON - áp dụng quy tắc 1/3</li>
<li><strong>HDR:</strong> Bật Auto HDR để giữ chi tiết vùng sáng và tối</li>
<li><strong>Chụp RAW:</strong> iPhone: dùng ProRAW. Android: dùng Pro mode chụp RAW</li>
<li><strong>Khoá focus/sáng:</strong> Chạm giữ màn hình để khoá điểm focus và độ sáng</li>
</ul>

<h2>3. Kỹ Thuật Chụp</h2>
<ul>
<li><strong>Cầm máy ổn định:</strong> Dùng 2 tay, khuỷu tay sát người, hít thở trước khi chụp</li>
<li><strong>Dùng volume button:</strong> Bấm nút âm lượng để chụp - ổn định hơn chạm màn hình</li>
<li><strong>Lau ống kính:</strong> Ống kính điện thoại rất dễ bám dấu vân tay - lau trước mỗi lần chụp</li>
<li><strong>Tránh zoom số:</strong> Zoom số làm giảm chất lượng. Thay vào đó hãy bước lại gần hơn</li>
</ul>

<h2>4. Portrait Mode</h2>
<ul>
<li>Sử dụng AI để tạo hiệu ứng xoá phông (bokeh)</li>
<li>Cần khoảng cách 1-2.5m với chủ thể</li>
<li>Hoạt động tốt nhất với 1 chủ thể rõ ràng</li>
<li>Có thể chỉnh độ xoá phông sau khi chụp</li>
</ul>

<h2>5. Night Mode</h2>
<ul>
<li>Tự động kích hoạt khi thiếu sáng</li>
<li>Giữ máy thật ổn định trong 2-5 giây</li>
<li>Dùng chống hoặc đặt lên bề mặt cứng</li>
<li>Kết quả tốt nhất khi có 1 ít ánh sáng (không tối hoàn toàn)</li>
</ul>

<h2>6. App Chỉnh Sửa Miễn Phí</h2>
<ul>
<li><strong>Snapseed:</strong> Miễn phí, mạnh mẽ, của Google</li>
<li><strong>Lightroom Mobile:</strong> Miễn phí cơ bản, chức năng chuyên nghiệp</li>
<li><strong>VSCO:</strong> Filter đẹp, giao diện đơn giản</li>
</ul>

<div class="tip-box">
<strong>Mẹo Pro:</strong> Dùng chế độ Pro/Manual trên điện thoại để kiểm soát ISO, tốc độ, WB. Chụp RAW để có nhiều dữ liệu chỉnh sửa hơn.
</div>
    `,
    quiz: [
      {
        question: "Tại sao nên tránh zoom số (digital zoom)?",
        options: ["Vì nó tốn pin", "Vì nó làm giảm chất lượng ảnh", "Vì nó làm chậm máy", "Vì nó không hoạt động"],
        correctIndex: 1,
        explanation: "Zoom số chỉ crop và phóng to ảnh, làm giảm độ phân giải và chất lượng. Hãy bước lại gần chủ thể thay vì zoom số."
      },
      {
        question: "Làm sao để khoá focus và độ sáng trên điện thoại?",
        options: ["Bấm nhanh màn hình", "Chạm và giữ (long press) trên màn hình", "Lật điện thoại", "Không thể làm được"],
        correctIndex: 1,
        explanation: "Chạm và giữ trên màn hình sẽ khoá điểm focus và độ sáng (AE/AF Lock), giúp bạn kiểm soát tốt hơn."
      },
      {
        question: "Khi chụp Night Mode, điều quan trọng nhất là gì?",
        options: ["Bật flash", "Giữ máy thật ổn định", "Tăng độ sáng màn hình", "Tắt tất cả đèn"],
        correctIndex: 1,
        explanation: "Night Mode phơi nhiều khung hình - giữ máy ổn định là yếu tố quan trọng nhất để ảnh không bị mờ."
      }
    ],
    exercises: [
      {
        title: "30 Ngày Chụp Điện Thoại",
        description: "Mỗi ngày chụp ít nhất 5 bức ảnh bằng điện thoại với 1 chủ đề: ngày 1 - ánh sáng, ngày 2 - bố cục, ngày 3 - màu sắc...",
        tips: ["Lau ống kính trước khi chụp", "Thử tất cả các ống kính (main, wide, tele)", "Chỉnh sửa bằng Snapseed trước khi chia sẻ"]
      }
    ]
  },
  {
    id: "photo-editing-mobile",
    title: "Chỉnh Ảnh Trên Điện Thoại",
    description: "Snapseed, Lightroom Mobile - biến ảnh thường thành tác phẩm ngay trên điện thoại",
    content: `
<h2>Tại Sao Chỉnh Ảnh Quan Trọng?</h2>
<p>Chụp ảnh chỉ là 50% quy trình. 50% còn lại là hậu kỳ. Ngay cả nhiếp ảnh gia chuyên nghiệp cũng phải chỉnh sửa mỗi bức ảnh.</p>

<h2>1. Snapseed - Workflow Cơ Bản</h2>
<h3>Bước 1: Tune Image</h3>
<ul>
<li>Brightness: chỉnh độ sáng tổng thể</li>
<li>Contrast: tăng tương phản</li>
<li>Saturation: tăng/giảm bão hoà màu</li>
<li>Ambiance: cân bằng sáng tối cục bộ</li>
<li>Highlights/Shadows: lấy chi tiết vùng sáng/tối</li>
</ul>

<h3>Bước 2: White Balance</h3>
<ul>
<li>Temperature: ấm/lạnh</li>
<li>Tint: xanh lá/tím</li>
</ul>

<h3>Bước 3: Details</h3>
<ul>
<li>Structure: tăng chi tiết (dùng cho phong cảnh, kiến trúc)</li>
<li>Sharpening: tăng độ sắc nét</li>
</ul>

<h3>Bước 4: Selective Adjust</h3>
<ul>
<li>Chạm vào 1 vùng cụ thể để chỉnh riêng vùng đó</li>
<li>Brightness, contrast, saturation cục bộ</li>
</ul>

<h2>2. Lightroom Mobile</h2>
<h3>Các công cụ quan trọng:</h3>
<ul>
<li><strong>Light:</strong> Exposure, Contrast, Highlights, Shadows, Whites, Blacks</li>
<li><strong>Color:</strong> WB, Vibrance, Saturation, Color Mix (chỉnh từng màu)</li>
<li><strong>Effects:</strong> Clarity, Dehaze, Vignette</li>
<li><strong>Detail:</strong> Sharpening, Noise Reduction</li>
<li><strong>Presets:</strong> Áp dụng preset và tinh chỉnh thêm</li>
</ul>

<h2>3. Quy Tắc Chỉnh Sửa</h2>
<ul>
<li><strong>Less is more:</strong> Chỉnh ít hơn bạn nghĩ là cần</li>
<li><strong>Bảo vệ highlights:</strong> Kéo highlights xuống trước, giữ chi tiết vùng sáng</li>
<li><strong>Shadow recovery:</strong> Kéo shadows lên để thấy chi tiết vùng tối</li>
<li><strong>Đừng làm oversaturate:</strong> Tăng saturation quá nhiều làm ảnh giả, phản cảm</li>
</ul>

<div class="tip-box">
<strong>Mẹo:</strong> Sau khi chỉnh xong, để điện thoại xuống 5 phút. Quay lại xem lại - bạn sẽ thấy những lỗi chỉnh quá tay. Giảm bớt 20-30%.
</div>
    `,
    quiz: [
      {
        question: "Thứ tự chỉnh sửa đúng là gì?",
        options: ["Màu sắc trước, sáng sau", "Sáng (exposure/WB) trước, màu sắc/chi tiết sau", "Chi tiết trước, sáng sau", "Không cần thứ tự"],
        correctIndex: 1,
        explanation: "Luôn chỉnh sáng và white balance trước (nền tảng), sau đó mới đến màu sắc và chi tiết."
      },
      {
        question: "Selective Adjust trong Snapseed dùng để làm gì?",
        options: ["Chỉnh toàn bộ ảnh", "Chỉnh riêng 1 vùng cụ thể trên ảnh", "Thêm filter", "Xoá phông"],
        correctIndex: 1,
        explanation: "Selective Adjust cho phép chạm vào 1 điểm và chỉnh brightness/contrast/saturation chỉ cho vùng đó."
      },
      {
        question: "Tại sao nên kéo Highlights xuống?",
        options: ["Để ảnh tối hơn", "Để giữ lại chi tiết ở vùng sáng bị cháy", "Để tăng tương phản", "Để làm mờ ảnh"],
        correctIndex: 1,
        explanation: "Kéo highlights xuống giúp lấy lại chi tiết ở vùng sáng bị 'cháy' (overexposed), đặc biệt với file RAW."
      }
    ],
    exercises: [
      {
        title: "Before & After Challenge",
        description: "Chọn 5 bức ảnh chưa chỉnh. Chỉnh sửa từng bức bằng Snapseed. Lưu cả bản gốc và bản đã chỉnh để so sánh.",
        tips: ["Bắt đầu với Tune Image, sau đó mới dùng các tool khác", "Thử Selective Adjust cho vùng trời hoặc mặt người", "Xuất ảnh chất lượng cao nhất"]
      }
    ]
  }
];
