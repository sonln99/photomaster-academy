import { Lesson } from "./types";

export const professionalLessons: Lesson[] = [
  {
    id: "studio-lighting",
    title: "Ánh Sáng Studio",
    description: "Key light, Fill light, Back light - xây dựng hệ thống chiếu sáng chuyên nghiệp",
    content: `
<h2>Hệ Thống Ánh Sáng Studio</h2>
<p>Trong studio, bạn có toàn quyền kiểm soát ánh sáng. Hiểu cách xây dựng hệ thống đèn là kỹ năng cốt lõi của nhiếp ảnh gia chuyên nghiệp.</p>

<h2>1. Key Light (Đèn Chính)</h2>
<p>Nguồn sáng <strong>chính và mạnh nhất</strong>, quyết định giao diện tổng thể của bức ảnh.</p>
<ul>
<li>Thường đặt ở góc 30-60 độ so với máy ảnh</li>
<li>Cao hơn đầu chủ thể một chút</li>
<li>Quyết định pattern sáng/tối trên khuôn mặt</li>
</ul>

<h2>2. Fill Light (Đèn Phụ)</h2>
<p>Giảm độ tương phản bóng tạo bởi key light. Thường <strong>yếu hơn key light 1-2 stop</strong>.</p>
<ul>
<li>Đặt đối diện với key light</li>
<li>Có thể thay bằng reflector (tấm phản quang) để tiết kiệm</li>
<li>Fill ratio 2:1 (tự nhiên), 4:1 (kịch tính), 1:1 (phẳng)</li>
</ul>

<h2>3. Back Light / Rim Light (Đèn Viền)</h2>
<p>Đặt phía sau chủ thể, tạo <strong>viền sáng</strong> tách chủ thể khỏi nền.</p>
<ul>
<li>Còn gọi là hair light khi chiếu vào tóc</li>
<li>Tăng chiều sâu và sự tách biệt 3D</li>
<li>Thường dùng với snoot hoặc grid để kiểm soát</li>
</ul>

<h2>4. Background Light (Đèn Nền)</h2>
<p>Chiếu sáng nền (backdrop), tạo gradient hoặc màu sắc cho nền.</p>

<h2>Các Loại Phụ Kiện Tạo Hình Sáng</h2>
<h3>Softbox</h3>
<ul>
<li>Tạo ánh sáng mềm, đều - phổ biến nhất trong studio</li>
<li>Có nhiều hình dạng: vuông, chữ nhật, bát giác, strip</li>
<li>Càng lớn càng mềm (so với khoảng cách đến chủ thể)</li>
</ul>

<h3>Umbrella (Dù)</h3>
<ul>
<li><strong>Shoot-through (xuyên qua):</strong> Sáng mềm, phân tán rộng</li>
<li><strong>Reflective (phản xạ):</strong> Sáng mạnh hơn, kiểm soát tốt hơn</li>
<li>Rẻ, nhẹ, dễ setup - tốt cho người mới</li>
</ul>

<h3>Beauty Dish</h3>
<ul>
<li>Ánh sáng "giữa" soft và hard - có "punch" nhưng không quá cứng</li>
<li>Phổ biến trong beauty/fashion photography</li>
</ul>

<h3>Reflector (Tấm Phản Quang)</h3>
<ul>
<li><strong>Trắng:</strong> Fill nhẹ, tự nhiên</li>
<li><strong>Bạc:</strong> Fill mạnh, specular</li>
<li><strong>Vàng:</strong> Fill ấm, giống golden hour</li>
<li><strong>Đen:</strong> Hấp thụ sáng, tăng bóng (negative fill)</li>
</ul>

<div class="tip-box">
<strong>Setup cơ bản nhất:</strong> 1 softbox làm key light + 1 reflector trắng làm fill. Chỉ cần 2 thứ này bạn đã có thể chụp chân dung chuyên nghiệp.
</div>
    `,
    quiz: [
      {
        question: "Fill light thường yếu hơn key light bao nhiêu?",
        options: ["Bằng nhau", "Yếu hơn 1-2 stop", "Mạnh hơn 1 stop", "Yếu hơn 4-5 stop"],
        correctIndex: 1,
        explanation: "Fill light thường yếu hơn key light 1-2 stop để giảm bóng mà vẫn giữ chiều sâu và hình khối."
      },
      {
        question: "Tác dụng chính của rim/back light là gì?",
        options: ["Làm sáng toàn bộ chủ thể", "Tách chủ thể khỏi nền bằng viền sáng", "Xoá bóng hoàn toàn", "Tạo bóng trên nền"],
        correctIndex: 1,
        explanation: "Rim/back light tạo viền sáng quanh chủ thể, giúp tách biệt chủ thể khỏi nền và tăng cảm giác 3D."
      },
      {
        question: "Fill ratio 4:1 sẽ tạo hiệu ứng như thế nào?",
        options: ["Rất phẳng, không có bóng", "Tương phản vừa phải", "Kịch tính, nhiều bóng", "Hoàn toàn tối"],
        correctIndex: 2,
        explanation: "Ratio 4:1 nghĩa là key light mạnh gấp 4 lần fill, tạo bóng sâu và tương phản kịch tính."
      },
      {
        question: "Loại reflector nào tạo hiệu ứng ấm giống golden hour?",
        options: ["Trắng", "Bạc", "Vàng/Gold", "Đen"],
        correctIndex: 2,
        explanation: "Reflector vàng phản xạ ánh sáng với tone ấm, giống ánh sáng golden hour tự nhiên."
      }
    ],
    exercises: [
      {
        title: "Setup 1 Đèn Cơ Bản",
        description: "Chỉ dùng 1 nguồn sáng với 1 softbox/dù. Thử di chuyển đèn ở các góc 0, 45, 90, 135 độ. Quan sát bóng thay đổi.",
        tips: ["Bắt đầu với đèn ở góc 45 độ, cao hơn đầu", "Thử thêm reflector trắng đối diện để fill bóng", "Chụp cả có và không có fill để so sánh"]
      }
    ]
  },
  {
    id: "portrait-lighting-patterns",
    title: "Portrait Lighting Patterns",
    description: "6 kiểu chiếu sáng chân dung kinh điển: Rembrandt, Butterfly, Loop, Split, Broad, Short",
    content: `
<h2>6 Kiểu Chiếu Sáng Chân Dung</h2>
<p>Mỗi kiểu sáng tạo hiệu ứng khác nhau trên khuôn mặt. Thành thạo 6 kiểu này là nền tảng của portrait photography chuyên nghiệp.</p>

<h2>1. Loop Lighting</h2>
<p><strong>Phổ biến nhất</strong> - phù hợp với hầu hết mọi khuôn mặt.</p>
<ul>
<li><strong>Setup:</strong> Đèn ở góc 30-45 độ bên cạnh, hơi cao hơn mắt</li>
<li><strong>Dấu hiệu:</strong> Bóng mũi tạo một "vòng" nhỏ trên má, không chạm bóng má</li>
<li><strong>Dùng khi:</strong> Chụp chân dung thường ngày, gia đình, headshot</li>
</ul>

<h2>2. Rembrandt Lighting</h2>
<p>Đặt tên theo hoạ sĩ Rembrandt - <strong>kịch tính và nghệ thuật</strong>.</p>
<ul>
<li><strong>Setup:</strong> Đèn ở góc 45 độ, cao hơn đầu, chủ thể quay nhẹ khỏi đèn</li>
<li><strong>Dấu hiệu:</strong> Tam giác sáng hình thoi trên má tối (shadow side)</li>
<li><strong>Dùng khi:</strong> Chân dung nghệ thuật, ảnh moody, musician</li>
</ul>

<h2>3. Butterfly Lighting (Paramount)</h2>
<p>Còn gọi là <strong>Paramount lighting</strong> - phong cách Hollywood cổ điển.</p>
<ul>
<li><strong>Setup:</strong> Đèn đặt ngay phía trước, trên cao, hướng xuống</li>
<li><strong>Dấu hiệu:</strong> Bóng hình cánh bướm dưới mũi</li>
<li><strong>Dùng khi:</strong> Beauty/fashion, người có gương mặt thon, gò má cao</li>
</ul>

<h2>4. Split Lighting</h2>
<p>Chia khuôn mặt thành <strong>2 nửa: sáng và tối</strong> - rất kịch tính.</p>
<ul>
<li><strong>Setup:</strong> Đèn đặt chính xác 90 độ bên cạnh chủ thể</li>
<li><strong>Dấu hiệu:</strong> Đúng 1/2 mặt sáng, 1/2 tối hoàn toàn</li>
<li><strong>Dùng khi:</strong> Chân dung nghệ thuật, moody portrait</li>
</ul>

<h2>5. Broad Lighting</h2>
<ul>
<li><strong>Setup:</strong> Chủ thể quay mặt sang một bên, đèn chiếu vào phía mặt hướng về máy ảnh</li>
<li><strong>Hiệu ứng:</strong> Làm mặt trông rộng hơn</li>
<li><strong>Dùng khi:</strong> Người có mặt rất gầy - giúp mặt đầy đặn hơn</li>
</ul>

<h2>6. Short Lighting</h2>
<ul>
<li><strong>Setup:</strong> Ngược với Broad - đèn chiếu vào phía mặt quay khỏi máy ảnh</li>
<li><strong>Hiệu ứng:</strong> Làm mặt thon hơn, tạo chiều sâu</li>
<li><strong>Dùng khi:</strong> Hầu hết mọi người - thường đẹp hơn Broad lighting</li>
</ul>

<div class="info-box">
<strong>Catchlight:</strong> Điểm sáng phản chiếu trong mắt chủ thể. LUÔN đảm bảo mắt có catchlight - đây là yếu tố tạo "sự sống" cho chân dung.
</div>
    `,
    quiz: [
      {
        question: "Dấu hiệu nhận biết Rembrandt lighting là gì?",
        options: ["Bóng cánh bướm dưới mũi", "Tam giác sáng trên má bên tối", "Nửa mặt sáng nửa mặt tối", "Không có bóng"],
        correctIndex: 1,
        explanation: "Rembrandt lighting tạo tam giác sáng trên má ở phía tối của khuôn mặt."
      },
      {
        question: "Loop lighting phù hợp với tình huống nào?",
        options: ["Chỉ chụp fashion", "Hầu hết mọi khuôn mặt và tình huống", "Chỉ khi chụp ngoài trời", "Chỉ với đèn flash mạnh"],
        correctIndex: 1,
        explanation: "Loop lighting là pattern phổ biến nhất vì phù hợp với hầu hết mọi hình dạng khuôn mặt."
      },
      {
        question: "Butterfly lighting phù hợp với loại khuôn mặt nào?",
        options: ["Mặt tròn, béo", "Mặt thon, gò má cao", "Mọi loại mặt", "Mặt vuông"],
        correctIndex: 1,
        explanation: "Butterfly lighting nhấn mạnh gò má và tạo bóng dưới cằm/mũi, đẹp nhất với khuôn mặt thon, gò má cao."
      },
      {
        question: "Short lighting giúp gì cho khuôn mặt?",
        options: ["Làm mặt trông rộng hơn", "Làm mặt thon hơn và tạo chiều sâu", "Xoá hoàn toàn bóng", "Không có tác dụng đặc biệt"],
        correctIndex: 1,
        explanation: "Short lighting chiếu sáng phía mặt quay đi, để phần lớn mặt trong bóng, tạo hiệu ứng thon gọn và chiều sâu 3D."
      }
    ],
    exercises: [
      {
        title: "Thực hành 6 Lighting Patterns",
        description: "Với 1 đèn và 1 người mẫu, thực hành từng pattern. Chụp mỗi kiểu 3-5 tấm. So sánh và nhận xét hiệu ứng.",
        tips: ["Bắt đầu với Loop, đơn giản nhất", "Nhớ kiểm tra catchlight trong mắt", "Có thể dùng đèn bàn hoặc đèn LED thay cho flash"]
      }
    ]
  },
  {
    id: "landscape-advanced",
    title: "Chụp Phong Cảnh Nâng Cao",
    description: "Long exposure, ND filter, HDR, focus stacking - kỹ thuật nâng tầm phong cảnh",
    content: `
<h2>Kỹ Thuật Phơi Sáng (Long Exposure)</h2>
<p>Long exposure là kỹ thuật để cửa trập mở lâu (1 giây đến vài phút), tạo hiệu ứng đặc biệt:</p>
<ul>
<li><strong>Nước mượt lụa:</strong> Thác nước, sóng biển trở nên mịn màng</li>
<li><strong>Mây chạy:</strong> Mây trở thành các vệt kẻ dài trên trời</li>
<li><strong>Vẽ sáng (Light trails):</strong> Đèn xe tạo các vệt sáng dài</li>
<li><strong>Star trails:</strong> Vệt sao vạch trên trời (phơi 15-30 phút)</li>
</ul>
<div class="info-box">
<strong>Yêu cầu:</strong> Tripod chắc chắn, remote shutter hoặc timer 2s, chế độ M hoặc Bulb.
</div>

<h2>ND Filter (Kính Lọc Giảm Sáng)</h2>
<p>ND filter giảm lượng sáng đi vào ống kính, cho phép phơi lâu ngay cả trong điều kiện sáng:</p>
<ul>
<li><strong>ND4 (2 stop):</strong> Giảm nhẹ, làm chậm nước</li>
<li><strong>ND64 (6 stop):</strong> Golden hour phơi 2-4 phút</li>
<li><strong>ND1000 (10 stop):</strong> Ban ngày phơi 30s-4 phút, nước/mây mịn hoàn toàn</li>
</ul>

<h2>GND Filter (Graduated ND)</h2>
<p>Tối ở nửa trên, trong ở nửa dưới - cân bằng sáng giữa trời sáng và đất tối:</p>
<ul>
<li><strong>Hard GND:</strong> Chuyển tiếp sắc nét - cho đường chân trời thẳng (biển)</li>
<li><strong>Soft GND:</strong> Chuyển tiếp từ từ - cho đường chân trời không bằng phẳng (núi)</li>
</ul>

<h2>HDR (High Dynamic Range)</h2>
<p>Chụp nhiều tấm với độ sáng khác nhau (bracketing), ghép lại để có chi tiết cả vùng sáng và tối:</p>
<ul>
<li>Thường chụp 3-5 tấm: -2EV, -1EV, 0, +1EV, +2EV</li>
<li>Dùng tripod, không di chuyển máy giữa các tấm</li>
<li>Ghép bằng Lightroom, Aurora HDR, hoặc Photoshop</li>
</ul>

<h2>Focus Stacking</h2>
<p>Chụp nhiều tấm với điểm focus khác nhau, ghép lại để có <strong>sắc nét từ tiền cảnh đến hậu cảnh</strong>:</p>
<ul>
<li>Dùng cho macro và phong cảnh có tiền cảnh rất gần</li>
<li>Chụp 5-15 tấm, dịch chuyển điểm focus từ gần đến xa</li>
<li>Ghép bằng Photoshop (Auto-Blend Layers) hoặc Helicon Focus</li>
</ul>

<div class="tip-box">
<strong>Mẹo:</strong> Dùng Hyperfocal Distance thay vì focus stacking khi có thể. Đặt focus ở khoảng cách hyperfocal (thường 1/3 vào cảnh) để tối đa hoá vùng sắc nét với 1 tấm chụp.
</div>
    `,
    quiz: [
      {
        question: "ND1000 (10 stop) cho phép bạn làm gì?",
        options: ["Chụp nhanh hơn bình thường", "Phơi sáng 30s-4 phút giữa ban ngày", "Tăng độ nét", "Xoá phông mạnh hơn"],
        correctIndex: 1,
        explanation: "ND1000 giảm 10 stop sáng, cho phép dùng tốc độ rất chậm (30s-4 phút) giữa ban ngày để tạo hiệu ứng nước/mây mịn."
      },
      {
        question: "Focus stacking dùng để làm gì?",
        options: ["Xoá phông đẹp hơn", "Có sắc nét từ tiền cảnh đến hậu cảnh", "Tăng ISO mà không bị noise", "Tạo hiệu ứng HDR"],
        correctIndex: 1,
        explanation: "Focus stacking ghép nhiều tấm với điểm focus khác nhau, cho độ sắc nét xuyên suốt từ tiền cảnh đến hậu cảnh."
      },
      {
        question: "Khi nào dùng Hard GND filter?",
        options: ["Khi chụp macro", "Khi đường chân trời thẳng (như biển)", "Khi chụp chân dung", "Khi chụp đêm"],
        correctIndex: 1,
        explanation: "Hard GND có chuyển tiếp sắc nét, phù hợp với đường chân trời thẳng như biển."
      }
    ],
    exercises: [
      {
        title: "Long Exposure Cơ Bản",
        description: "Tìm 1 thác nước hoặc dòng suối. Dùng tripod, chế độ M, ISO 100, f/11-f/16. Chụp với tốc độ 1/500s, 1/15s, 1s, 5s. So sánh hiệu ứng nước.",
        tips: ["Không có ND filter? Chụp vào lúc hoàng hôn khi sáng yếu", "Dùng timer 2s hoặc remote để tránh rung", "Che viewfinder khi phơi lâu để tránh lọ sáng"]
      }
    ]
  },
  {
    id: "color-theory",
    title: "Lý Thuyết Màu Sắc",
    description: "Color wheel, màu bổ sung, màu tương đồng - sử dụng màu sắc có ý thức",
    content: `
<h2>Bánh Xe Màu Sắc (Color Wheel)</h2>
<p>Isaac Newton tạo ra bánh xe màu năm 1666. Hiểu màu sắc giúp bạn tạo ảnh có cảm xúc và sự hài hoà có chủ đích.</p>

<h2>3 Loại Màu</h2>
<ul>
<li><strong>Màu cơ bản (Primary):</strong> Đỏ, Xanh dương, Vàng</li>
<li><strong>Màu thứ cấp (Secondary):</strong> Cam, Tím, Xanh lá</li>
<li><strong>Màu tam cấp (Tertiary):</strong> Đỏ-cam, Vàng-xanh lá...</li>
</ul>

<h2>Các Phối Màu Quan Trọng</h2>
<h3>Màu Bổ Sung (Complementary)</h3>
<p>2 màu đối diện nhau trên bánh xe: <strong>Đỏ-Xanh lá, Xanh-Cam, Vàng-Tím</strong></p>
<ul>
<li>Tạo tương phản mạnh, nổi bật</li>
<li>Phim Hollywood thường dùng Xanh-Cam (teal & orange)</li>
</ul>

<h3>Màu Tương Đồng (Analogous)</h3>
<p>3 màu nằm cạnh nhau trên bánh xe</p>
<ul>
<li>Tạo sự hài hoà, yên bình</li>
<li>1 màu chủ đạo, 1 hỗ trợ, 1 điểm nhấn</li>
</ul>

<h3>Màu Ba (Triadic)</h3>
<p>3 màu cách đều nhau trên bánh xe (tạo hình tam giác đều)</p>
<ul>
<li>Sống động, phong phú nhưng vẫn cân bằng</li>
</ul>

<h2>Màu Ấm vs Màu Lạnh</h2>
<ul>
<li><strong>Màu ấm (Đỏ, Cam, Vàng):</strong> Năng lượng, ấm áp, vui vẻ, đam mê</li>
<li><strong>Màu lạnh (Xanh dương, Xanh lá, Tím):</strong> Bình yên, lạnh lẽo, bí ẩn, buồn</li>
</ul>

<h2>Tâm Lý Màu Sắc Trong Ảnh</h2>
<ul>
<li><strong>Đỏ:</strong> Đam mê, năng lượng, nguy hiểm</li>
<li><strong>Xanh dương:</strong> Bình yên, tin tưởng, man mác</li>
<li><strong>Vàng:</strong> Lạc quan, vui vẻ, ấm áp</li>
<li><strong>Xanh lá:</strong> Tự nhiên, tươi mát, sống động</li>
<li><strong>Tím:</strong> Bí ẩn, sang trọng, sáng tạo</li>
<li><strong>Cam:</strong> Năng động, thân thiện</li>
</ul>

<div class="tip-box">
<strong>Ứng dụng:</strong> Trước khi chụp, hãy ý thức về màu sắc trong khung hình. Tìm các cặp màu bổ sung hoặc tương đồng. Trong hậu kỳ, tăng/giảm bão hoà các màu cụ thể để tăng cảm xúc.
</div>
    `,
    quiz: [
      {
        question: "Màu bổ sung (Complementary) của Xanh dương là gì?",
        options: ["Xanh lá", "Tím", "Cam", "Vàng"],
        correctIndex: 2,
        explanation: "Xanh dương và Cam là cặp màu bổ sung - đối diện nhau trên bánh xe màu. Đây là phối màu 'teal & orange' phổ biến trong phim."
      },
      {
        question: "Phối màu Analogous tạo cảm giác gì?",
        options: ["Tương phản mạnh, kích thích", "Hài hoà, yên bình", "Hỗn loạn, khó chịu", "Lạnh lẽo, cô đơn"],
        correctIndex: 1,
        explanation: "Màu tương đồng (cạnh nhau trên bánh xe) tạo sự hài hoà tự nhiên vì chúng có liên hệ màu sắc gần gũi."
      },
      {
        question: "Màu ấm thường truyền tải cảm xúc gì?",
        options: ["Bình yên, lạnh lẽo", "Buồn bã, cô đơn", "Năng lượng, ấm áp, vui vẻ", "Bí ẩn, sang trọng"],
        correctIndex: 2,
        explanation: "Màu ấm (đỏ, cam, vàng) truyền tải cảm giác năng lượng, ấm áp, vui vẻ và đam mê."
      }
    ],
    exercises: [
      {
        title: "Săn Màu Bổ Sung",
        description: "Ra ngoài và tìm 5 cặp màu bổ sung tự nhiên. Chụp và phân tích tại sao chúng thu hút mắt.",
        tips: ["Chợ, khu phố cũ là nơi dễ tìm màu sắc phong phú", "Chụp cả toàn cảnh và cận cảnh để thấy màu sắc rõ hơn"]
      }
    ]
  },
  {
    id: "post-processing-basics",
    title: "Hậu Kỳ Cơ Bản",
    description: "Lightroom workflow, color grading, tone curve - biến RAW thành tác phẩm",
    content: `
<h2>Quy Trình Hậu Kỳ Cơ Bản (Lightroom)</h2>
<p>Hậu kỳ không phải là "sửa ảnh giả" mà là <strong>hoàn thiện ý đồ sáng tạo</strong> của bạn.</p>

<h2>Bước 1: Import & Chọn Ảnh</h2>
<ul>
<li>Import RAW files vào Lightroom</li>
<li>Đánh giá (Rating) 1-5 sao để lọc ảnh tốt</li>
<li>Loại bỏ ảnh hư, trùng, không đạt</li>
</ul>

<h2>Bước 2: Chỉnh Sáng Cơ Bản</h2>
<ul>
<li><strong>White Balance:</strong> Chỉnh nhiệt màu và tint cho đúng</li>
<li><strong>Exposure:</strong> Tăng/giảm độ sáng tổng thể</li>
<li><strong>Contrast:</strong> Tăng tương phản sáng/tối</li>
<li><strong>Highlights:</strong> Kéo xuống để lấy lại chi tiết vùng sáng</li>
<li><strong>Shadows:</strong> Kéo lên để lấy chi tiết vùng tối</li>
<li><strong>Whites/Blacks:</strong> Điểm trắng cao nhất và đen thấp nhất</li>
</ul>

<h2>Bước 3: Tone Curve</h2>
<p>Công cụ mạnh nhất để kiểm soát tương phản và tông màu:</p>
<ul>
<li><strong>S-curve:</strong> Tăng tương phản (sáng hơn sáng, tối hơn tối)</li>
<li><strong>Nâng blacks:</strong> Kéo điểm đen lên → hiệu ứng "faded/matte"</li>
<li><strong>Chỉnh từng kênh RGB:</strong> Kiểm soát màu sắc chính xác</li>
</ul>

<h2>Bước 4: HSL/Color</h2>
<p>Chỉnh riêng từng màu sắc:</p>
<ul>
<li><strong>Hue:</strong> Đổi sắc màu (vd: cam → vàng)</li>
<li><strong>Saturation:</strong> Tăng/giảm độ bão hoà từng màu</li>
<li><strong>Luminance:</strong> Tăng/giảm độ sáng từng màu</li>
</ul>

<h2>Bước 5: Color Grading</h2>
<ul>
<li><strong>Shadows:</strong> Thường thêm xanh dương hoặc teal</li>
<li><strong>Highlights:</strong> Thường thêm vàng hoặc cam</li>
<li>Tạo look "cinematic" với combo teal shadows + orange highlights</li>
</ul>

<h2>Bước 6: Detail & Export</h2>
<ul>
<li><strong>Sharpening:</strong> Tăng độ nét (Amount 40-80, Radius 1.0-1.5)</li>
<li><strong>Noise Reduction:</strong> Giảm nhiễu (Luminance 20-40 cho ISO cao)</li>
<li><strong>Lens Correction:</strong> Sửa biến dạng ống kính</li>
<li><strong>Export:</strong> JPEG quality 85-95%, sRGB cho web</li>
</ul>

<div class="tip-box">
<strong>Nguyên tắc vàng:</strong> "Chỉnh ít hơn bạn nghĩ là cần." Hậu kỳ tốt là khi người xem không nhận ra ảnh đã được chỉnh. Over-editing là lỗi phổ biến nhất.
</div>
    `,
    quiz: [
      {
        question: "Thứ tự chỉnh sửa đúng trong Lightroom là gì?",
        options: ["Color trước, Exposure sau", "Exposure/WB trước, Color/Detail sau", "Detail trước, Exposure sau", "Thứ tự không quan trọng"],
        correctIndex: 1,
        explanation: "Luôn chỉnh Exposure và White Balance trước (nền tảng), sau đó mới đến Color, Tone Curve, Detail."
      },
      {
        question: "S-curve trong Tone Curve tạo hiệu ứng gì?",
        options: ["Giảm tương phản", "Tăng tương phản (sáng hơn sáng, tối hơn tối)", "Làm ảnh tối đi", "Làm ảnh sáng lên"],
        correctIndex: 1,
        explanation: "S-curve kéo sáng lên và tối xuống, tăng tương phản tự nhiên và tạo chiều sâu."
      },
      {
        question: "Để tạo look 'cinematic', combo color grading phổ biến là gì?",
        options: ["Đỏ shadows + Xanh lá highlights", "Teal shadows + Cam/Vàng highlights", "Tím shadows + Vàng highlights", "Không thêm màu"],
        correctIndex: 1,
        explanation: "Teal & Orange là combo color grading kinh điển của phim Hollywood."
      },
      {
        question: "Khi export ảnh cho web, nên dùng color space nào?",
        options: ["Adobe RGB", "ProPhoto RGB", "sRGB", "CMYK"],
        correctIndex: 2,
        explanation: "sRGB là color space chuẩn cho web và màn hình. Adobe RGB và ProPhoto RGB dùng cho in ấn."
      }
    ],
    exercises: [
      {
        title: "Hậu Kỳ 1 Bức Ảnh Từ Đầu Đến Cuối",
        description: "Chọn 1 bức RAW, thực hành đầy đủ 6 bước hậu kỳ. Lưu 3 phiên bản: chỉnh nhẹ, vừa, và mạnh. So sánh để tìm mức chỉnh phù hợp.",
        tips: ["Dùng Lightroom hoặc phần mềm miễn phí như darktable/RawTherapee", "Tất cả slider về 0 trước khi bắt đầu", "Luôn so sánh Before/After (phím \\\\ trong Lightroom)"]
      }
    ]
  },
  {
    id: "depth-of-field-advanced",
    title: "Depth of Field Nâng Cao",
    description: "Bokeh, hyperfocal distance, DOF control - làm chủ độ sâu trường ảnh",
    content: `
<h2>Depth of Field (DOF) Chi Tiết</h2>
<p>DOF là vùng sắc nét trước và sau điểm focus. Hiểu và kiểm soát DOF là kỹ năng tách biệt nghiệp dư và chuyên nghiệp.</p>

<h2>3 Yếu Tố Ảnh Hưởng DOF</h2>
<ul>
<li><strong>Khẩu độ:</strong> f nhỏ (f/1.4) → DOF nông. f lớn (f/11) → DOF sâu</li>
<li><strong>Tiêu cự:</strong> Tiêu cự dài hơn (85mm, 200mm) → DOF nông hơn</li>
<li><strong>Khoảng cách:</strong> Gần chủ thể hơn → DOF nông hơn</li>
</ul>

<h2>Bokeh</h2>
<p>Bokeh là <strong>chất lượng vùng mờ (out-of-focus)</strong>, không phải độ mờ. Bokeh đẹp có đặc điểm:</p>
<ul>
<li>Các điểm sáng mờ thành hình tròn mềm (không góc cạnh)</li>
<li>Chuyển tiếp từ nét sang mờ mượt mà</li>
<li>Không có "onion ring" hoặc viền cứng</li>
</ul>
<h3>Yếu tố tạo bokeh đẹp:</h3>
<ul>
<li>Ống kính có nhiều lá khẩu (7-9 lá tròn)</li>
<li>Khẩu độ lớn (f/1.4 - f/2.8)</li>
<li>Khoảng cách xa giữa chủ thể và hậu cảnh</li>
<li>Tiêu cự dài (85mm, 135mm cho bokeh đẹp nhất)</li>
</ul>

<h2>Hyperfocal Distance</h2>
<p>Khoảng cách focus gần nhất mà <strong>hậu cảnh (vô cực) vẫn sắc nét</strong>. Dùng nhiều trong phong cảnh.</p>
<ul>
<li>Phụ thuộc vào: tiêu cự, khẩu độ, kích thước cảm biến</li>
<li>Ví dụ: 24mm f/11 trên full-frame → hyperfocal ~2m → sắc nét từ 1m đến vô cực</li>
<li>Dùng app như PhotoPills hoặc DOF calculator để tính</li>
</ul>

<h2>Kỹ Thuật DOF Sáng Tạo</h2>
<h3>Selective Focus</h3>
<p>Dùng DOF cực nông (f/1.2 - f/1.4) để chỉ focus vào 1 điểm cực nhỏ - mắt, 1 chi tiết - tạo cảm giác thân mật, tập trung.</p>

<h3>Deep DOF Storytelling</h3>
<p>Dùng f/8-f/16 để tất cả đều sắc nét - kể chuyện qua nhiều lớp cảnh. Phong cách của nhiều nhiếp ảnh gia đường phố vĩ đại.</p>

<div class="tip-box">
<strong>Quy tắc nhanh:</strong> Muốn xoá phông đẹp? Dùng ống kính dài (85mm+), khẩu độ lớn (f/1.4-2.8), đứng gần chủ thể, và để chủ thể cách xa hậu cảnh.
</div>
    `,
    quiz: [
      {
        question: "3 yếu tố nào ảnh hưởng đến DOF?",
        options: ["ISO, WB, Metering", "Khẩu độ, Tiêu cự, Khoảng cách", "Shutter speed, ISO, Aperture", "File format, Resolution, Lens"],
        correctIndex: 1,
        explanation: "DOF bị ảnh hưởng bởi: Khẩu độ, Tiêu cự, và Khoảng cách giữa máy ảnh - chủ thể - hậu cảnh."
      },
      {
        question: "Bokeh là gì?",
        options: ["Độ mờ của hậu cảnh", "Chất lượng/thẩm mỹ của vùng mờ", "Loại ống kính", "Kỹ thuật chụp"],
        correctIndex: 1,
        explanation: "Bokeh là chất lượng thẩm mỹ của vùng out-of-focus, không phải độ mờ. Bokeh đẹp có các điểm sáng tròn, mềm."
      },
      {
        question: "Hyperfocal distance dùng để làm gì?",
        options: ["Tạo xoá phông tối đa", "Tối đa hoá vùng sắc nét từ gần đến vô cực", "Đo khoảng cách đến chủ thể", "Tính tiêu cự"],
        correctIndex: 1,
        explanation: "Focus ở hyperfocal distance cho vùng sắc nét từ 1/2 khoảng cách đó đến vô cực - lý tưởng cho phong cảnh."
      }
    ],
    exercises: [
      {
        title: "Thực Hành Bokeh",
        description: "Chụp chân dung hoặc vật thể với khẩu độ f/1.8 (hoặc lớn nhất có thể). Thử thay đổi khoảng cách giữa chủ thể và hậu cảnh. Quan sát bokeh.",
        tips: ["Để hậu cảnh có nhiều điểm sáng (lá cây, đèn) để thấy bokeh rõ", "Thử các tiêu cự khác nhau: 50mm vs 85mm", "Gần chủ thể + xa hậu cảnh = bokeh đẹp nhất"]
      }
    ]
  },
  {
    id: "flash-photography",
    title: "Sử Dụng Đèn Flash",
    description: "On-camera, off-camera flash, TTL, manual - làm chủ đèn flash",
    content: `
<h2>Tại Sao Cần Flash?</h2>
<p>Flash giúp bạn <strong>kiểm soát ánh sáng hoàn toàn</strong>, không phụ thuộc vào điều kiện tự nhiên. Là công cụ không thể thiếu của nhiếp ảnh gia chuyên nghiệp.</p>

<h2>1. On-Camera Flash</h2>
<ul>
<li><strong>Bounce flash:</strong> Đẩy đầu flash lên trần hoặc tường để tạo soft light</li>
<li><strong>Diffuser:</strong> Gắn phụ kiện tản sáng trên đầu flash</li>
<li><strong>Fill flash:</strong> Dùng ngoài trời để fill bóng mặt (đặc biệt giữa trưa)</li>
<li><strong>Tránh:</strong> Flash trực tiếp vào mặt - tạo bóng cứng, mắt đỏ</li>
</ul>

<h2>2. Off-Camera Flash (OCF)</h2>
<p>Flash tách khỏi máy ảnh, điều khiển từ xa:</p>
<ul>
<li><strong>Trigger:</strong> Bộ phát/nhận (Godox, Profoto) kết nối flash với máy</li>
<li><strong>Vị trí:</strong> Đặt flash ở bất kỳ vị trí nào - sáng tạo không giới hạn</li>
<li><strong>Modifier:</strong> Softbox, umbrella, beauty dish thay đổi chất lượng sáng</li>
<li><strong>Multi-flash:</strong> 2-3 đèn tạo hệ thống sáng phức tạp</li>
</ul>

<h2>3. TTL vs Manual</h2>
<h3>TTL (Through The Lens)</h3>
<ul>
<li>Máy tự động tính công suất flash</li>
<li>Nhanh, tiện lợi khi điều kiện thay đổi liên tục</li>
<li>Dùng flash compensation (+/-) để tinh chỉnh</li>
</ul>
<h3>Manual</h3>
<ul>
<li>Bạn tự chọn công suất: 1/1 (full), 1/2, 1/4, 1/8...</li>
<li>Nhất quán, không thay đổi giữa các tấm</li>
<li>Bắt buộc trong studio và khi dùng nhiều đèn</li>
</ul>

<h2>4. High-Speed Sync (HSS)</h2>
<ul>
<li>Cho phép dùng flash với tốc độ nhanh hơn sync speed (thường 1/200s-1/250s)</li>
<li>Dùng để: chụp f/1.4 ngoài nắng với flash fill, đóng băng chuyển động với flash</li>
<li>Nhược điểm: giảm công suất flash</li>
</ul>

<h2>5. Flash và Ambient Balance</h2>
<p>Cân bằng giữa ánh sáng flash và ánh sáng môi trường:</p>
<ul>
<li><strong>Tốc độ:</strong> Kiểm soát ambient (chậm = nhiều ambient, nhanh = ít ambient)</li>
<li><strong>Khẩu độ:</strong> Kiểm soát flash (đóng = ít flash, mở = nhiều flash)</li>
<li><strong>Kết hợp:</strong> Điều chỉnh 2 yếu tố để cân bằng theo ý muốn</li>
</ul>

<div class="tip-box">
<strong>Mẹo:</strong> Bắt đầu với 1 đèn flash + 1 umbrella shoot-through. Chỉ cần bộ này bạn đã có thể chụp chuyên nghiệp. Off-camera flash là bước nhảy lớn nhất trong kỹ năng ánh sáng.
</div>
    `,
    quiz: [
      {
        question: "Bounce flash là gì?",
        options: ["Bắn flash trực tiếp vào chủ thể", "Đẩy đầu flash lên trần/tường để tản sáng", "Tắt flash đi", "Dùng 2 flash cùng lúc"],
        correctIndex: 1,
        explanation: "Bounce flash đẩy ánh sáng lên trần hoặc tường, biến nguồn sáng nhỏ (flash) thành nguồn sáng lớn (cả trần nhà), tạo soft light."
      },
      {
        question: "Khi nào nên dùng Manual flash thay vì TTL?",
        options: ["Khi chụp ngoài trời", "Khi cần kết quả nhất quán và dùng nhiều đèn", "Khi pin yếu", "Khi chụp nhanh"],
        correctIndex: 1,
        explanation: "Manual flash cho kết quả nhất quán giữa các tấm và bắt buộc khi setup nhiều đèn vì TTL không thể tính toán chính xác cho nhiều nguồn sáng."
      },
      {
        question: "High-Speed Sync dùng để làm gì?",
        options: ["Tăng công suất flash", "Dùng flash với tốc độ nhanh hơn sync speed bình thường", "Làm flash nhấp nháy nhanh", "Giảm noise"],
        correctIndex: 1,
        explanation: "HSS cho phép dùng flash với tốc độ 1/500s, 1/1000s..., giúp chụp khẩu độ lớn (f/1.4) ngoài nắng mà vẫn có thể fill flash."
      }
    ],
    exercises: [
      {
        title: "Bounce Flash Trong Nhà",
        description: "Chụp chân dung trong nhà với flash. Chụp 3 kiểu: flash trực tiếp, bounce trần, bounce tường. So sánh chất lượng ánh sáng.",
        tips: ["Trần trắng cho bounce đẹp nhất", "Trần cao cần tăng công suất flash", "Thử với và không diffuser"]
      }
    ]
  },
  {
    id: "event-photography",
    title: "Chụp Sự Kiện & Tiệc",
    description: "Wedding, corporate event, party - kỹ thuật chụp sự kiện chuyên nghiệp",
    content: `
<h2>Chụp Sự Kiện Là Gì?</h2>
<p>Event photography yêu cầu bạn chụp <strong>nhanh, chính xác, trong điều kiện không lý tưởng</strong> và KHÔNG được bỏ lỡ khoảnh khắc quan trọng.</p>

<h2>1. Thiết Bị Cần Thiết</h2>
<ul>
<li><strong>2 thân máy:</strong> 1 chính + 1 dự phòng (máy hỏng giữa sự kiện = thảm hoạ)</li>
<li><strong>Ống kính:</strong> 24-70mm f/2.8 (đa năng) + 70-200mm f/2.8 (xa) + 35mm f/1.4 (thiếu sáng)</li>
<li><strong>Flash:</strong> 2 đèn speedlight + diffuser + pin dự phòng</li>
<li><strong>Thẻ nhớ:</strong> Nhiều thẻ nhớ (dùng 1 thẻ cho toàn bộ sự kiện = rủi ro cao)</li>
<li><strong>Pin:</strong> Ít nhất 4-6 pin đầy</li>
</ul>

<h2>2. Thiết Lập Máy Ảnh</h2>
<ul>
<li><strong>Chế độ:</strong> Av (f/2.8-4) với Auto ISO (giới hạn 6400)</li>
<li><strong>AF:</strong> AF-C với Eye Detect hoặc Zone AF</li>
<li><strong>Drive:</strong> Continuous (burst) để chụp nhiều frame</li>
<li><strong>WB:</strong> Auto hoặc Flash (nếu dùng flash)</li>
<li><strong>Format:</strong> RAW + JPEG (JPEG để xem nhanh, RAW để chỉnh sau)</li>
</ul>

<h2>3. Shot List Cơ Bản</h2>
<h3>Wedding:</h3>
<ul>
<li>Chuẩn bị: cô dâu/chú rể makeup, mặc đồ</li>
<li>Lễ: trao nhẫn, hôn, cảm xúc gia đình</li>
<li>Nhóm: gia đình, bạn bè (có danh sách trước)</li>
<li>Chi tiết: hoa, bánh, trang trí, thiệp mời</li>
<li>Tiệc: cắt bánh, nhảy, toast, pha bouquet</li>
</ul>

<h3>Corporate Event:</h3>
<ul>
<li>Overview: toàn cảnh sự kiện</li>
<li>Speakers: diễn giả trên sân khấu</li>
<li>Networking: người tham gia tương tác</li>
<li>Branding: logo, banner, standee</li>
</ul>

<h2>4. Kỹ Thuật Chụp</h2>
<ul>
<li><strong>Dự đoán:</strong> Di chuyển trước đến vị trí tốt trước khoảnh khắc xảy ra</li>
<li><strong>2 góc:</strong> Chụp cả wide (bối cảnh) và tight (cảm xúc)</li>
<li><strong>Ánh sáng:</strong> Bounce flash + kéo shadows trong hậu kỳ</li>
<li><strong>Backup:</strong> Copy ảnh sang laptop mỗi 2-3 giờ</li>
</ul>

<div class="tip-box">
<strong>Quy tắc vàng:</strong> "If you didn't capture the moment, it didn't happen." Bạn KHÔNG được bỏ lỡ những khoảnh khắc quan trọng. Luôn sẵn sàng, luôn quan sát.
</div>
    `,
    quiz: [
      {
        question: "Tại sao cần 2 thân máy khi chụp sự kiện?",
        options: ["Để chụp nhanh hơn", "Dự phòng khi máy chính hỏng", "Để 2 người chụp", "Để trang trí"],
        correctIndex: 1,
        explanation: "Máy ảnh có thể hỏng bất cứ lúc nào. Tại sự kiện, bạn không thể nói 'đợi một chút' - phải có máy dự phòng sẵn sàng."
      },
      {
        question: "Nên sử dụng bao nhiêu thẻ nhớ cho sự kiện?",
        options: ["1 thẻ nhớ lớn", "Nhiều thẻ nhớ (chia rủi ro)", "Không cần thẻ nhớ, chụp thẳng vào máy tính", "2 thẻ là đủ"],
        correctIndex: 1,
        explanation: "Dùng nhiều thẻ nhớ để chia rủi ro. Nếu 1 thẻ hỏng, bạn chỉ mất 1 phần ảnh thay vì toàn bộ sự kiện."
      },
      {
        question: "Khi chụp wedding, việc gì quan trọng nhất?",
        options: ["Chụp đẹp", "Không bỏ lỡ khoảnh khắc quan trọng", "Dùng ống kính đắt tiền", "Chụp nhiều ảnh nhất có thể"],
        correctIndex: 1,
        explanation: "Khoảnh khắc như trao nhẫn, nụ hôn, cảm xúc gia đình chỉ xảy ra 1 lần. Bỏ lỡ = không thể làm lại."
      }
    ],
    exercises: [
      {
        title: "Thực Hành Chụp Sự Kiện",
        description: "Tìm 1 sự kiện nhỏ (sinh nhật, họp lớp, tiệc). Làm shot list trước, chụp và review. So sánh với shot list xem đã chụp đủ chưa.",
        tips: ["Đến sớm để khảo sát địa điểm", "Làm quen với ánh sáng tại chỗ", "Luôn có plan B cho tình huống thiếu sáng"]
      }
    ]
  },
  {
    id: "drone-photography",
    title: "Chụp Ảnh Flycam/Drone",
    description: "Aerial photography - góc nhìn từ trên cao, kỹ thuật và luật pháp",
    content: `
<h2>Sức Mạnh Của Góc Nhìn Từ Trên Cao</h2>
<p>Drone photography mở ra <strong>góc nhìn hoàn toàn mới</strong> mà mắt thường không thể thấy. Phong cảnh, kiến trúc, bất động sản đều đẹp hơn từ trên cao.</p>

<h2>1. Chọn Drone</h2>
<ul>
<li><strong>DJI Mini (dưới 249g):</strong> Nhẹ, không cần đăng ký ở nhiều nước, chất lượng tốt</li>
<li><strong>DJI Air:</strong> Cảm biến lớn hơn, quay 4K tốt, obstacle avoidance</li>
<li><strong>DJI Mavic Pro:</strong> Chuyên nghiệp, cảm biến 1 inch, chụp RAW</li>
</ul>

<h2>2. Thiết Lập Chụp Ảnh</h2>
<ul>
<li><strong>Format:</strong> Chụp RAW (DNG) để có dữ liệu chỉnh sửa</li>
<li><strong>ISO:</strong> Giữ ISO 100-200 (cảm biến nhỏ = nhiều noise)</li>
<li><strong>Tốc độ:</strong> 1/500s trở lên để tránh rung</li>
<li><strong>WB:</strong> Auto hoặc Daylight</li>
<li><strong>AEB:</strong> Chụp bracketing 3-5 tấm để làm HDR</li>
</ul>

<h2>3. Kỹ Thuật Chụp</h2>
<h3>Các Góc Chụp Phổ Biến:</h3>
<ul>
<li><strong>Top-down (90 độ):</strong> Nhìn thẳng xuống - tạo hình học, pattern thú vị</li>
<li><strong>45 độ:</strong> Góc tự nhiên nhất, thể hiện cả chiều cao và chiều sâu</li>
<li><strong>Ngang (0 độ):</strong> Như góc nhìn của chim, hiển thị horizon</li>
<li><strong>Reveal shot:</strong> Bay lên từ thấp lên cao, lộ dần phong cảnh</li>
</ul>

<h3>Bố Cục Từ Trên Cao:</h3>
<ul>
<li>Tìm các đường dẫn: sông, đường, ranh giới</li>
<li>Tìm patterns: ruộng bậc thang, nhà ở, cây cối</li>
<li>Tìm tương phản màu sắc: nước xanh vs cát trắng</li>
<li>Tìm bóng: bóng cây, bóng nhà tạo hình thú vị từ trên cao</li>
</ul>

<h2>4. Golden Hour Là Tốt Nhất</h2>
<ul>
<li>Ánh sáng ấm, bóng dài từ trên cao rất đẹp</li>
<li>Tránh giữa trưa - ánh sáng phẳng, ít bóng</li>
<li>Sau mưa: không khí trong, màu sắc tươi</li>
</ul>

<h2>5. Luật Pháp Và An Toàn</h2>
<ul>
<li><strong>Đăng ký:</strong> Kiểm tra luật địa phương về đăng ký drone</li>
<li><strong>Vùng cấm:</strong> Không bay gần sân bay, cơ sở quân sự, khu đông người</li>
<li><strong>Độ cao:</strong> Thường giới hạn 120m</li>
<li><strong>Tầm nhìn:</strong> Luôn giữ drone trong tầm nhìn (VLOS)</li>
<li><strong>Thời tiết:</strong> Không bay khi gió mạnh, mưa, sương mù</li>
</ul>

<div class="tip-box">
<strong>An toàn là trên hết:</strong> Drone rơi có thể gây thương tích và hư hại tài sản. Luôn kiểm tra pin, cánh quạt, và điều kiện thời tiết trước khi bay.
</div>
    `,
    quiz: [
      {
        question: "Tại sao nên giữ ISO thấp khi chụp drone?",
        options: ["Để tiết kiệm pin", "Cảm biến drone nhỏ nên dễ bị noise ở ISO cao", "Để chụp nhanh hơn", "Không có lý do"],
        correctIndex: 1,
        explanation: "Drone có cảm biến nhỏ hơn máy ảnh thường, nên rất dễ bị noise ở ISO cao. Giữ ISO 100-200 để có chất lượng tốt nhất."
      },
      {
        question: "Góc chụp top-down (90 độ) từ drone tạo hiệu ứng gì?",
        options: ["Chiều sâu 3D", "Hình học và pattern thú vị", "Xoá phông đẹp", "Panorama"],
        correctIndex: 1,
        explanation: "Nhìn thẳng xuống tạo ra những hình ảnh đồ hoạ, geometric - các pattern, đường kẻ, hình học mà mắt thường không thấy."
      },
      {
        question: "Điều gì KHÔNG nên làm khi bay drone?",
        options: ["Chụp RAW", "Bay gần sân bay và khu đông người", "Bay vào golden hour", "Kiểm tra pin trước khi bay"],
        correctIndex: 1,
        explanation: "Bay gần sân bay và khu đông người là vi phạm pháp luật và cực kỳ nguy hiểm. Luôn kiểm tra vùng cấm trước khi bay."
      }
    ],
    exercises: [
      {
        title: "Khám Phá Góc Nhìn Trên Cao",
        description: "Nếu có drone, chọn 1 địa điểm đẹp (công viên, hồ, ruộng). Chụp ở 3 góc: top-down, 45 độ, ngang. Mỗi góc chụp 5-10 tấm. So sánh.",
        tips: ["Bay vào golden hour để có ánh sáng đẹp nhất", "Tìm các pattern tự nhiên: đường đi, cây cối, nước", "Luôn kiểm tra pin và vùng cấm bay"]
      }
    ]
  }
];
