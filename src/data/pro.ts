import { Lesson } from "./types";

export const proLessons: Lesson[] = [
  {
    id: "street-photography",
    title: "Nhiếp Ảnh Đường Phố",
    description: "Decisive moment, zone focusing, candid - nghệ thuật bắt khoảnh khắc",
    content: `
<h2>Triết Lý Nhiếp Ảnh Đường Phố</h2>
<p>Henri Cartier-Bresson định nghĩa "The Decisive Moment" - <strong>khoảnh khắc quyết định</strong> khi tất cả yếu tố (bố cục, ánh sáng, cảm xúc, hành động) hội tụ hoàn hảo trong một tích tắc.</p>

<h2>Nguyên Tắc Cơ Bản</h2>
<ul>
<li><strong>Quan sát trước, chụp sau:</strong> Dành 70% thời gian quan sát, 30% chụp</li>
<li><strong>Là người vô hình:</strong> Hoà nhập vào đám đông, không thu hút sự chú ý</li>
<li><strong>Luôn sẵn sàng:</strong> Máy ảnh bật, thông số đặt sẵn, sẵn sàng chụp bất cứ lúc nào</li>
<li><strong>Kể chuyện:</strong> Mỗi bức ảnh phải kể 1 câu chuyện hoặc gợi 1 cảm xúc</li>
</ul>

<h2>Zone Focusing</h2>
<p>Kỹ thuật <strong>đặt focus trước</strong> ở một khoảng cách cố định, không cần AF khi chụp:</p>
<ul>
<li>Đặt focus ở khoảng 2-3m (khoảng cách tương tác thường gặp)</li>
<li>Dùng khẩu độ f/8 - f/11 để có DOF đủ rộng</li>
<li>Với 35mm f/8, focus 3m → sắc nét từ 1.5m đến vô cực</li>
<li>Chỉ cần đưa máy lên và bấm - không mất thời gian AF</li>
</ul>

<h2>Thiết Lập Máy Ảnh Cho Street</h2>
<ul>
<li><strong>Ống kính:</strong> 28mm, 35mm, hoặc 50mm (prime, nhỏ gọn)</li>
<li><strong>Chế độ:</strong> Av f/8 với Auto ISO (giới hạn 3200-6400)</li>
<li><strong>Focus:</strong> Zone focus hoặc AF-C với điểm focus giữa</li>
<li><strong>Chụp im lặng:</strong> Bật electronic shutter nếu có</li>
</ul>

<h2>Các Kỹ Thuật Chụp</h2>
<h3>1. Chờ Đợi (Fishing)</h3>
<p>Tìm 1 khung hình đẹp (ánh sáng, background, bố cục), đứng đợi cho đến khi người phù hợp bước vào khung hình.</p>

<h3>2. Chụp Từ Hông (Hip Shot)</h3>
<p>Giữ máy ở ngang hông, chụp không nhìn viewfinder. Cần luyện tập nhiều để cảm góc chính xác.</p>

<h3>3. Tương Tác</h3>
<p>Bắt chuyện với chủ thể trước, xin phép chụp. Được ảnh chân dung đường phố chân thật hơn.</p>

<h3>4. Lớp Cảnh (Layering)</h3>
<p>Kết hợp nhiều yếu tố trong nhiều lớp: tiền cảnh - trung cảnh - hậu cảnh, tạo chiều sâu và câu chuyện phức tạp.</p>

<div class="tip-box">
<strong>Lời khuyên từ Cartier-Bresson:</strong> "Your first 10,000 photographs are your worst." Chụp nhiều, chụp mỗi ngày. Lượng tạo chất.
</div>

<h2>Đạo Đức Trong Street Photography</h2>
<ul>
<li>Tôn trọng quyền riêng tư của người khác</li>
<li>Không chụp người trong tình huống khó khăn nếu họ không đồng ý</li>
<li>Sẵn sàng xoá ảnh nếu người ta yêu cầu</li>
<li>Hiểu luật pháp địa phương về chụp ảnh nơi công cộng</li>
</ul>
    `,
    quiz: [
      {
        question: "'The Decisive Moment' của Cartier-Bresson là gì?",
        options: ["Lúc ánh sáng đẹp nhất trong ngày", "Khoảnh khắc tất cả yếu tố hội tụ hoàn hảo", "Lúc nhấn nút chụp", "Lúc chỉnh sửa ảnh"],
        correctIndex: 1,
        explanation: "Decisive Moment là khoảnh khắc duy nhất khi bố cục, ánh sáng, cảm xúc, hành động đều hội tụ hoàn hảo."
      },
      {
        question: "Zone focusing là gì?",
        options: ["Dùng autofocus theo vùng", "Đặt focus trước ở khoảng cách cố định", "Focus bằng mắt", "Focus liên tục"],
        correctIndex: 1,
        explanation: "Zone focusing là đặt trước điểm focus (thường 2-3m) với khẩu độ nhỏ (f/8-11) để có vùng nét rộng, chụp ngay không cần AF."
      },
      {
        question: "Ống kính nào phổ biến nhất cho street photography?",
        options: ["85mm f/1.4", "200mm f/2.8", "35mm hoặc 50mm prime", "16mm fisheye"],
        correctIndex: 2,
        explanation: "35mm và 50mm prime là lựa chọn kinh điển - góc nhìn tự nhiên, nhỏ gọn, không thu hút sự chú ý."
      }
    ],
    exercises: [
      {
        title: "1 Giờ Đường Phố",
        description: "Dành 1 giờ ở một con phố đông. Thiết lập: 35mm hoặc 50mm, f/8, Auto ISO. Mục tiêu: chụp 100 tấm, chọn ra 3 tấm tốt nhất.",
        tips: ["Đi bộ chậm, quan sát nhiều", "Tìm các vệt sáng, bóng, khung hình tự nhiên", "Chờ đợi khoảnh khắc thay vì chạy theo"]
      }
    ]
  },
  {
    id: "commercial-photography",
    title: "Chụp Thương Mại & Quảng Cáo",
    description: "Product, fashion, food photography - chụp ảnh kiếm tiền",
    content: `
<h2>Nhiếp Ảnh Thương Mại</h2>
<p>Commercial photography là chụp ảnh phục vụ mục đích kinh doanh: quảng cáo, catalog, website, mạng xã hội. Đây là lĩnh vực <strong>kiếm tiền chính</strong> của nhiều nhiếp ảnh gia.</p>

<h2>1. Product Photography</h2>
<h3>Setup Cơ Bản</h3>
<ul>
<li>Nền trắng (lightbox hoặc giấy trắng cong)</li>
<li>2 đèn softbox 2 bên (góc 45 độ)</li>
<li>1 đèn từ phía sau hoặc dưới (cho sản phẩm trong suốt)</li>
<li>Tripod và remote shutter</li>
</ul>
<h3>Kỹ Thuật</h3>
<ul>
<li>f/8 - f/11 để sắc nét toàn bộ sản phẩm</li>
<li>ISO 100, tripod, remote để chất lượng tối đa</li>
<li>Chú ý phản chiếu (reflection) trên bề mặt bóng</li>
</ul>

<h2>2. Fashion Photography</h2>
<ul>
<li><strong>Mood board:</strong> Tạo bảng cảm hứng trước buổi chụp</li>
<li><strong>Styling:</strong> Hợp tác với stylist, MUA (makeup artist)</li>
<li><strong>Lighting:</strong> Beauty dish + rim light là combo phổ biến</li>
<li><strong>Posing:</strong> Hướng dẫn model tạo hình, chú ý đường cong cơ thể</li>
<li><strong>Post:</strong> Retouch da, chỉnh màu theo brand identity</li>
</ul>

<h2>3. Food Photography</h2>
<ul>
<li><strong>Ánh sáng:</strong> Sáng tự nhiên từ cửa sổ là tốt nhất. Sáng cạnh nhấn mạnh kết cấu</li>
<li><strong>Góc chụp:</strong> 45 độ (cách nhìn người ăn), top-down (flat lay), ngang (burger, bánh)</li>
<li><strong>Prop styling:</strong> Khay, dao, thớt, vải, thảo mộc làm phụ kiện</li>
<li><strong>Màu sắc:</strong> Dùng màu bổ sung (cam thức ăn + xanh lá herbs)</li>
<li><strong>Tươi mát:</strong> Chụp nhanh - đồ ăn nguội lâu, kem tan, rau héo</li>
</ul>
<div class="tip-box">
<strong>Trick của food photographer:</strong> Xịt dầu olive lên thức ăn để bóng, dùng glycerin pha nước để tạo giọt nước giả, dùng kem cạo râu thay kem tươi (không tan).
</div>

<h2>4. Quy Trình Làm Việc Chuyên Nghiệp</h2>
<ol>
<li><strong>Brief:</strong> Hiểu rõ yêu cầu của khách hàng</li>
<li><strong>Mood board:</strong> Tạo và duyệt với khách</li>
<li><strong>Pre-production:</strong> Chuẩn bị location, model, props, team</li>
<li><strong>Shoot day:</strong> Chụp theo shot list đã lên</li>
<li><strong>Post-production:</strong> Chọn ảnh, retouch, color grade</li>
<li><strong>Delivery:</strong> Giao file theo format yêu cầu</li>
</ol>
    `,
    quiz: [
      {
        question: "Khẩu độ nào phù hợp để chụp sản phẩm sắc nét toàn bộ?",
        options: ["f/1.4", "f/2.8", "f/8 - f/11", "f/22"],
        correctIndex: 2,
        explanation: "f/8-f/11 cho độ sắc nét tối ưu trên toàn bộ sản phẩm. f/1.4-2.8 quá nông, f/22 bị nhiễu xạ (diffraction)."
      },
      {
        question: "Nguồn sáng tốt nhất cho food photography là gì?",
        options: ["Flash trực tiếp", "Đèn huỳnh quang trần nhà", "Ánh sáng tự nhiên từ cửa sổ (side light)", "Đèn LED RGB"],
        correctIndex: 2,
        explanation: "Ánh sáng tự nhiên từ cửa sổ (đặc biệt side light) là nguồn sáng lý tưởng cho food - tự nhiên, mềm, nhấn mạnh kết cấu."
      },
      {
        question: "Bước đầu tiên trong quy trình chụp thương mại là gì?",
        options: ["Mua thiết bị", "Hiểu brief/yêu cầu khách hàng", "Setup đèn", "Chọn model"],
        correctIndex: 1,
        explanation: "Luôn bắt đầu bằng việc hiểu rõ brief - khách hàng muốn gì, mục đích sử dụng ảnh, phong cách, deadline, budget."
      }
    ],
    exercises: [
      {
        title: "Chụp Sản Phẩm Tại Nhà",
        description: "Chọn 1 sản phẩm (giày, đồng hồ, chai nước hoa). Dùng giấy trắng A0 làm nền. Ánh sáng cửa sổ + 1 reflector. Chụp 3 góc: 45 độ, ngang, top-down.",
        tips: ["Lau sạch sản phẩm trước khi chụp", "Dùng khẩu độ f/8-f/11 cho nét toàn bộ", "Chỉnh WB chính xác để màu sản phẩm trung thực"]
      }
    ]
  },
  {
    id: "advanced-retouching",
    title: "Hậu Kỳ Nâng Cao",
    description: "Photoshop retouching, frequency separation, compositing - kỹ thuật hậu kỳ chuyên sâu",
    content: `
<h2>Retouch Chân Dung Chuyên Nghiệp</h2>
<p>Mục tiêu của retouching: <strong>làm đẹp mà vẫn tự nhiên</strong>. Giúp chủ thể trở nên tốt nhất của họ, không biến họ thành người khác.</p>

<h2>1. Frequency Separation</h2>
<p>Kỹ thuật tách bức ảnh thành 2 lớp:</p>
<ul>
<li><strong>Low frequency:</strong> Màu sắc và tone (làm mịn màu da, xoá đốm, đều màu)</li>
<li><strong>High frequency:</strong> Chi tiết và texture (lỗ chân lông, nếp nhăn, texture da)</li>
</ul>
<h3>Cách thực hiện:</h3>
<ol>
<li>Nhân đôi layer 2 lần</li>
<li>Layer dưới: Gaussian Blur (radius 5-10px) → Low Freq</li>
<li>Layer trên: Image > Apply Image (Subtract, Scale 2, Offset 128) → High Freq</li>
<li>Đặt High Freq ở blend mode Linear Light</li>
<li>Làm việc trên từng layer độc lập</li>
</ol>

<h2>2. Dodge & Burn</h2>
<p>Kỹ thuật <strong>tăng/giảm sáng cục bộ</strong> để tạo khối, chiều sâu cho khuôn mặt:</p>
<ul>
<li>Tạo 2 Curves adjustment layers (1 sáng, 1 tối)</li>
<li>Fill mask đen (ẩn tất cả)</li>
<li>Dùng brush trắng, opacity 5-15% vẽ lên mask</li>
<li><strong>Dodge (sáng):</strong> Nhấn mạnh gò má, sống mũi, trán, cằm</li>
<li><strong>Burn (tối):</strong> Tạo chiều sâu ở hàm, thái dương, dưới cằm</li>
</ul>

<h2>3. Color Grading Nâng Cao</h2>
<ul>
<li><strong>Selective Color:</strong> Chỉnh riêng từng màu cực chính xác</li>
<li><strong>Color Balance:</strong> Chỉnh màu theo shadows/midtones/highlights</li>
<li><strong>LUT (Look Up Table):</strong> Áp dụng preset màu nhanh, chỉnh lại theo ý</li>
<li><strong>Channel Mixer:</strong> Pha trộn các kênh màu (R,G,B) để tạo hiệu ứng đặc biệt</li>
</ul>

<h2>4. Compositing Cơ Bản</h2>
<ul>
<li><strong>Sky replacement:</strong> Thay trời - phổ biến trong phong cảnh/kiến trúc</li>
<li><strong>Background swap:</strong> Cắt chủ thể, ghép nền mới</li>
<li><strong>Chú ý:</strong> Phương hướng ánh sáng phải nhất quán giữa các lớp</li>
<li><strong>Công cụ:</strong> Select Subject, Refine Edge, Layer Mask</li>
</ul>

<h2>5. Workflow Hiệu Quả</h2>
<ul>
<li>Lightroom → xử lý hàng loạt (batch), chỉnh cơ bản</li>
<li>Photoshop → retouch chi tiết, compositing</li>
<li>Dùng Actions/Presets cho các bước lặp lại</li>
<li>Làm việc non-destructive (Smart Objects, Adjustment Layers)</li>
</ul>

<div class="info-box">
<strong>Nguyên tắc:</strong> Zoom out thường xuyên. Nếu bạn phải zoom 200% mới thấy sự khác biệt, có lẽ bạn đang over-retouch.
</div>
    `,
    quiz: [
      {
        question: "Frequency Separation tách ảnh thành những gì?",
        options: ["Sáng và tối", "Màu sắc (low freq) và chi tiết/texture (high freq)", "Foreground và background", "Chủ thể và nền"],
        correctIndex: 1,
        explanation: "Frequency Separation tách thành Low (màu sắc, tone) và High (texture, chi tiết), cho phép chỉnh từng lớp độc lập."
      },
      {
        question: "Dodge & Burn dùng để làm gì?",
        options: ["Xoá mụn", "Tăng/giảm sáng cục bộ để tạo khối 3D", "Làm mờ nền", "Cắt chủ thể"],
        correctIndex: 1,
        explanation: "Dodge (sáng) và Burn (tối) cục bộ giúp tạo khối, chiều sâu, nhấn mạnh cấu trúc xương và cơ trên khuôn mặt."
      },
      {
        question: "Tại sao nên làm việc non-destructive?",
        options: ["Nhanh hơn", "File nhỏ hơn", "Có thể quay lại chỉnh sửa bất cứ lúc nào", "Ảnh đẹp hơn"],
        correctIndex: 2,
        explanation: "Non-destructive (Smart Objects, Adjustment Layers, Masks) giữ nguyên ảnh gốc, có thể chỉnh sửa hoặc undo bất cứ lúc nào."
      }
    ],
    exercises: [
      {
        title: "Frequency Separation",
        description: "Mở 1 ảnh chân dung trong Photoshop. Thực hành tách Frequency Separation theo hướng dẫn. Làm mịn da trên Low Freq bằng Clone Stamp.",
        tips: ["Bắt đầu với Gaussian Blur radius 5-8px cho Low Freq", "Trên High Freq, dùng Clone Stamp để xoá mụn mà giữ texture", "Làm từ từ, zoom out thường xuyên để kiểm tra"]
      }
    ]
  },
  {
    id: "color-management",
    title: "Quản Lý Màu Chuyên Sâu",
    description: "Color space, ICC profile, calibration - đảm bảo màu chính xác từ màn hình đến in",
    content: `
<h2>Tại Sao Quản Lý Màu Quan Trọng?</h2>
<p>Bạn chỉnh ảnh đẹp trên màn hình, nhưng khi in ra màu khác hoàn toàn? Đó là vì thiếu quản lý màu (Color Management). Đây là kỹ năng <strong>bắt buộc</strong> của nhiếp ảnh gia chuyên nghiệp.</p>

<h2>Color Space (Không Gian Màu)</h2>
<ul>
<li><strong>sRGB:</strong> Nhỏ nhất, chuẩn cho web và màn hình thường. Dùng khi xuất ảnh cho online.</li>
<li><strong>Adobe RGB:</strong> Rộng hơn sRGB ~35%, nhiều màu hơn ở vùng xanh lá và xanh dương. Dùng cho in ấn.</li>
<li><strong>ProPhoto RGB:</strong> Rộng nhất. Dùng trong workflow RAW → hậu kỳ.</li>
</ul>

<h2>ICC Profile</h2>
<p>ICC Profile là "bản dịch" giúp các thiết bị hiểu màu giống nhau:</p>
<ul>
<li>Máy ảnh có profile riêng (embedded trong RAW)</li>
<li>Màn hình có profile riêng (tạo bằng calibration)</li>
<li>Máy in có profile riêng (cho từng loại giấy)</li>
<li>Khi chuyển ảnh giữa thiết bị, ICC Profile đảm bảo màu nhất quán</li>
</ul>

<h2>Monitor Calibration</h2>
<p>Màn hình của bạn có thể hiển thị màu <strong>SAI</strong> ngay từ đầu. Calibration giúp:</p>
<ul>
<li>Màu sắc chính xác và nhất quán</li>
<li>Độ sáng phù hợp (thường 120 cd/m2)</li>
<li>White point đúng (D65 = 6500K)</li>
<li>Gamma chuẩn (2.2)</li>
</ul>
<h3>Công cụ calibration:</h3>
<ul>
<li><strong>Datacolor SpyderX:</strong> Phổ biến, dễ dùng (~$170)</li>
<li><strong>X-Rite i1Display:</strong> Chính xác hơn (~$250)</li>
<li>Nên calibrate mỗi 4-6 tuần</li>
</ul>

<h2>Soft Proofing</h2>
<p>Xem trước ảnh sẽ trông như thế nào khi in, ngay trên màn hình:</p>
<ul>
<li>Lightroom: View > Soft Proofing</li>
<li>Chọn ICC profile của máy in + giấy</li>
<li>Chỉnh ảnh để phù hợp với gamut của máy in</li>
</ul>

<h2>Workflow Màu Chuẩn</h2>
<ol>
<li>Calibrate màn hình</li>
<li>Chụp RAW (giữ toàn bộ dữ liệu màu)</li>
<li>Hậu kỳ trong ProPhoto RGB hoặc Adobe RGB</li>
<li>Xuất web: Convert sang sRGB</li>
<li>Xuất in: Giữ Adobe RGB, embed ICC profile</li>
<li>Soft proof trước khi gửi in</li>
</ol>

<div class="tip-box">
<strong>Sai lầm phổ biến:</strong> Chỉnh ảnh trên laptop với màn hình không calibrate, trong phòng tối. Màu sắc sẽ sai nghiêm trọng. Luôn calibrate và làm việc trong môi trường ánh sáng ổn định.
</div>
    `,
    quiz: [
      {
        question: "Color space nào phù hợp để xuất ảnh lên web?",
        options: ["ProPhoto RGB", "Adobe RGB", "sRGB", "CMYK"],
        correctIndex: 2,
        explanation: "sRGB là chuẩn cho web và hầu hết màn hình. Dùng color space rộng hơn sẽ khiến màu hiển thị sai trên trình duyệt."
      },
      {
        question: "Tại sao cần calibrate màn hình?",
        options: ["Để màn hình sáng hơn", "Để màn hình hiển thị màu chính xác", "Để tăng độ phân giải", "Để tiết kiệm điện"],
        correctIndex: 1,
        explanation: "Màn hình không calibrate có thể hiển thị màu sai. Calibration đảm bảo màu bạn thấy chính là màu thật của bức ảnh."
      },
      {
        question: "Nên calibrate màn hình bao lâu 1 lần?",
        options: ["1 lần duy nhất", "Mỗi 4-6 tuần", "Mỗi năm", "Không cần calibrate"],
        correctIndex: 1,
        explanation: "Màn hình thay đổi màu theo thời gian. Calibrate mỗi 4-6 tuần để giữ độ chính xác."
      }
    ],
    exercises: [
      {
        title: "Kiểm Tra Màn Hình",
        description: "In 1 bức ảnh ở tiệm và so sánh với ảnh trên màn hình. Ghi nhận sự khác biệt về màu sắc, độ sáng, tương phản.",
        tips: ["In ở tiệm uy tín có sử dụng ICC profile", "So sánh dưới ánh sáng ban ngày (D65)", "Đây là bước đầu để hiểu tại sao calibration quan trọng"]
      }
    ]
  },
  {
    id: "personal-style",
    title: "Phong Cách Nghệ Thuật Cá Nhân",
    description: "Tìm style riêng, series concept, fine art - từ nhiếp ảnh gia thành nghệ sĩ",
    content: `
<h2>Tại Sao Cần Phong Cách Riêng?</h2>
<p>Kỹ thuật ai cũng học được. Nhưng <strong>phong cách cá nhân</strong> là thứ làm bạn khác biệt - là "chữ ký" của bạn trên mỗi bức ảnh.</p>

<h2>Cách Tìm Phong Cách Riêng</h2>
<h3>1. Nghiên Cứu Và Cảm Hứng</h3>
<ul>
<li>Xem nhiều ảnh của các bậc thầy: HCB, Fan Ho, Steve McCurry, Annie Leibovitz</li>
<li>Xem phim, hội hoạ, kiến trúc - cảm hứng từ mọi nghệ thuật</li>
<li>Lưu lại những bức ảnh khiến bạn cảm thấy gì đó mạnh mẽ</li>
<li>Phân tích: tại sao những bức ảnh này thu hút bạn?</li>
</ul>

<h3>2. Thực Nghiệm</h3>
<ul>
<li>Thử nhiều thể loại: street, portrait, landscape, abstract</li>
<li>Thử nhiều phong cách hậu kỳ: high contrast, muted, filmic, vivid</li>
<li>Chụp bằng nhiều ống kính khác nhau</li>
<li>Thử chụp phim (film photography) để hiểu tinh thần "mỗi tấm đều quý"</li>
</ul>

<h3>3. Lọc Và Tinh Chọn</h3>
<ul>
<li>Sau 1-2 năm, xem lại toàn bộ portfolio</li>
<li>Tìm mẫu chung: màu sắc, chủ đề, cảm xúc, góc chụp nào bạn hay dùng?</li>
<li>Đó chính là phong cách đang hình thành của bạn</li>
<li>Tập trung phát triển những điểm mạnh đó</li>
</ul>

<h2>Xây Dựng Photo Series</h2>
<p>Photo series là tập hợp ảnh có <strong>chủ đề, phong cách, và thông điệp thống nhất</strong>:</p>
<ul>
<li><strong>Concept:</strong> Xác định ý tưởng trung tâm</li>
<li><strong>Consistency:</strong> Nhất quán về màu sắc, tone, bố cục</li>
<li><strong>Narrative:</strong> Kể 1 câu chuyện qua nhiều bức ảnh</li>
<li><strong>Editing:</strong> Chọn 10-20 bức mạnh nhất, loại bỏ thừ dù tốt</li>
</ul>

<h2>Fine Art Photography</h2>
<p>Ảnh nghệ thuật - chụp để biểu đạt, không để ghi lại:</p>
<ul>
<li>Ý tưởng và cảm xúc quan trọng hơn kỹ thuật</li>
<li>Có thể phi thực tế, trừu tượng, siêu thực</li>
<li>Thường được trưng bày trong gallery, bảo tàng</li>
<li>Mỗi bức ảnh cần có artist statement</li>
</ul>

<div class="tip-box">
<strong>Nhớ:</strong> Phong cách không phải là 1 preset hay 1 filter. Nó là cách bạn NHÌN thế giới và CHỌN chụp gì, chụp như thế nào. Nó mất nhiều năm để hình thành - hãy kiên nhẫn.
</div>
    `,
    quiz: [
      {
        question: "Phong cách cá nhân trong nhiếp ảnh là gì?",
        options: ["1 preset Lightroom", "Cách bạn nhìn thế giới và thể hiện qua ảnh", "Loại máy ảnh bạn dùng", "Thể loại bạn chụp"],
        correctIndex: 1,
        explanation: "Phong cách là cách bạn nhìn, cảm nhận và thể hiện thế giới qua ảnh - bao gồm chủ đề, màu sắc, bố cục, cảm xúc đặc trưng."
      },
      {
        question: "Photo Series cần có yếu tố nào?",
        options: ["Càng nhiều ảnh càng tốt", "Chủ đề thống nhất, phong cách nhất quán, narrative", "Chỉ cần ảnh đẹp", "Phải chụp cùng 1 ngày"],
        correctIndex: 1,
        explanation: "Series cần có concept thống nhất, consistency về phong cách, và narrative (câu chuyện) xuyên suốt các bức ảnh."
      }
    ],
    exercises: [
      {
        title: "Tìm Phong Cách",
        description: "Chọn 20 bức ảnh tốt nhất bạn đã chụp. In ra hoặc hiển thị trên màn hình. Tìm 3 điểm chung về: màu sắc, chủ đề, cảm xúc, góc chụp.",
        tips: ["Nhờ người khác giúp nhận xét - họ có thể thấy pattern bạn không thấy", "Các điểm chung này là mầm mống của phong cách riêng"]
      }
    ]
  },
  {
    id: "photography-business",
    title: "Xây Dựng Sự Nghiệp Nhiếp Ảnh",
    description: "Portfolio, giá cả, marketing, quản lý khách hàng - kinh doanh nhiếp ảnh",
    content: `
<h2>Từ Đam Mê Thành Nghề Nghiệp</h2>
<p>Nhiều người chụp đẹp nhưng không biết cách kiếm tiền từ nhiếp ảnh. Phần này dành cho những ai muốn <strong>biến nhiếp ảnh thành sự nghiệp hoặc thu nhập phụ</strong>.</p>

<h2>1. Xây Dựng Portfolio</h2>
<ul>
<li><strong>Chỉ thể hiện ảnh tốt nhất:</strong> 15-20 bức/thể loại. 1 bức trung bình làm giảm giá trị 10 bức xuất sắc</li>
<li><strong>Tập trung vào niche:</strong> Wedding? Portrait? Product? Đừng trộn lẫn</li>
<li><strong>Website chuyên nghiệp:</strong> Format.com, Squarespace, hoặc tự xây</li>
<li><strong>Cập nhật thường xuyên:</strong> Mỗi 2-3 tháng thay ảnh mới, bỏ ảnh cũ</li>
</ul>

<h2>2. Định Giá Dịch Vụ</h2>
<h3>Công thức tính giá:</h3>
<ol>
<li>Tính tổng chi phí/năm (thiết bị, phần mềm, bảo hiểm, văn phòng, marketing)</li>
<li>Cộng lương bạn muốn (thu nhập mong muốn)</li>
<li>Chia cho số buổi chụp khả thi/năm</li>
<li>= Giá tối thiểu mỗi buổi chụp</li>
</ol>
<div class="info-box">
<strong>Ví dụ:</strong> Chi phí: 200tr/năm + Lương: 300tr/năm = 500tr. Chụp 100 buổi/năm → Tối thiểu 5tr/buổi.
</div>

<h2>3. Marketing</h2>
<ul>
<li><strong>Instagram:</strong> Post đều đặn, dùng hashtag, tương tác cộng đồng</li>
<li><strong>Google Business:</strong> Để khách tìm bạn qua Google Maps</li>
<li><strong>Referral:</strong> Khách cũ giới thiệu khách mới - kênh hiệu quả nhất</li>
<li><strong>Collaboration:</strong> Hợp tác với vendor (MUA, wedding planner, florist)</li>
<li><strong>SEO/Blog:</strong> Viết blog chia sẻ kinh nghiệm, portfolio trên website</li>
</ul>

<h2>4. Quản Lý Khách Hàng</h2>
<ul>
<li><strong>Hợp đồng:</strong> LUÔN có hợp đồng bằng văn bản</li>
<li><strong>Timeline:</strong> Thông báo rõ thời gian giao ảnh</li>
<li><strong>Giao tiếp:</strong> Phản hồi nhanh, chuyên nghiệp</li>
<li><strong>Vượt mong đợi:</strong> Giao sớm hơn hẹn, thêm vài bức bonus</li>
</ul>

<h2>5. Pháp Lý</h2>
<ul>
<li><strong>Model release:</strong> Văn bản đồng ý của người được chụp</li>
<li><strong>Bản quyền:</strong> Hiểu rõ bán chụp ảnh ≠ bán bản quyền</li>
<li><strong>Đăng ký kinh doanh:</strong> Khi thu nhập ổn định, đăng ký hộ kinh doanh</li>
<li><strong>Bảo hiểm thiết bị:</strong> Bảo vệ thiết bị hàng trăm triệu</li>
</ul>

<div class="tip-box">
<strong>Lời khuyên:</strong> Đừng hạ giá để cạnh tranh. Hạ giá thu hút khách thiếu chi phí, tạo vòng luẩn giá thấp. Hãy nâng cao chất lượng và marketing để thu hút khách sẵn sàng trả đúng giá trị.
</div>
    `,
    quiz: [
      {
        question: "Portfolio nên có bao nhiêu ảnh?",
        options: ["Càng nhiều càng tốt (100+)", "15-20 bức tốt nhất mỗi thể loại", "Chỉ cần 5 bức", "Không cần portfolio"],
        correctIndex: 1,
        explanation: "Chỉ thể hiện 15-20 bức tốt nhất. 1 bức trung bình làm giảm giá trị của cả portfolio. Chất lượng hơn số lượng."
      },
      {
        question: "Kênh marketing hiệu quả nhất cho nhiếp ảnh gia là gì?",
        options: ["Quảng cáo TV", "Referral (khách cũ giới thiệu)", "Phát tờ rơi", "Spam email"],
        correctIndex: 1,
        explanation: "Referral (giới thiệu từ khách cũ) là kênh hiệu quả nhất vì có độ tin tưởng cao và chi phí thấp."
      },
      {
        question: "Tại sao không nên hạ giá để cạnh tranh?",
        options: ["Vì pháp luật cấm", "Thu hút khách thiếu chi phí, tạo vòng luẩn giá thấp", "Vì giá cao luôn tốt hơn", "Không có lý do"],
        correctIndex: 1,
        explanation: "Hạ giá thu hút khách không sẵn sàng trả giá trị, tạo áp lực tài chính, và rất khó tăng giá sau này."
      }
    ],
    exercises: [
      {
        title: "Lập Kế Hoạch Kinh Doanh",
        description: "Viết 1 kế hoạch kinh doanh nhiếp ảnh đơn giản: Niche? Khách hàng mục tiêu? Giá? 3 kênh marketing? Mục tiêu 6 tháng?",
        tips: ["Không cần hoàn hảo - viết ra để có định hướng", "Nghiên cứu giá của 5 nhiếp ảnh gia cùng niche trong khu vực", "Tính chi phí thiết bị bạn đã có và cần mua thêm"]
      }
    ]
  }
];
