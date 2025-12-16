import { Course, Badge } from './types';

export const BADGES: Badge[] = [
  {
    id: 'first_steps',
    name: 'Khởi đầu mới',
    description: 'Hoàn thành bài học đầu tiên.',
    icon: '🚀',
    color: 'electric-indigo'
  },
  {
    id: 'streak_7',
    name: 'Chiến binh Code',
    description: 'Code liên tục 7 ngày.',
    icon: '🔥',
    color: 'orange-500'
  },
  {
    id: 'master_100',
    name: 'Giải mã 100',
    description: 'Giải quyết 100 bài tập.',
    icon: '💎',
    color: 'cyber-cyan'
  },
  {
    id: 'python_pioneer',
    name: 'Nhà thám hiểm Python',
    description: 'Hoàn thành khóa học Python cơ bản.',
    icon: '🐍',
    color: 'neon-serpent'
  }
];

// ID for the specific Trinket project provided by user
const BASE_TRINKET_ID = 'a24811fa054e'; 

export const PYTHON_COURSE: Course = {
  id: 'python-101',
  title: 'Bài 17: Biến và Lệnh Gán',
  description: 'Khám phá nền tảng của lập trình Python với Biến, Phép toán và Từ khóa.',
  segments: [
    {
      id: 'seg-1',
      title: '1. Làm Quen Với Biến (Variable)',
      type: 'theory',
      xpReward: 10,
      trinketId: BASE_TRINKET_ID,
      hint: 'Hãy tưởng tượng "hop_qua" là cái tên, còn "5" là món quà bên trong.',
      content: `
        <h3 class="text-neon-serpent font-display text-xl md:text-3xl mb-4">Biến là gì nhỉ? 🤔</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] leading-relaxed text-text-primary">
           Chào bạn mới! Hãy tưởng tượng trong máy tính có rất nhiều cái hộp rỗng. Để dùng được, chúng ta phải:
        </p>
        <ul class="list-decimal list-inside text-text-primary text-[13.5px] md:text-[20px] space-y-2 mb-6 ml-2">
           <li>Dán nhãn tên cho cái hộp (Gọi là <strong>Tên biến</strong>).</li>
           <li>Bỏ một giá trị vào hộp (Gọi là <strong>Gán giá trị</strong>).</li>
        </ul>
        
        <div class="neu-out bg-bg-main p-4 md:p-6 rounded-xl border-2 border-electric-indigo/50 shadow-[0_0_20px_rgba(108,99,255,0.15)] my-6 hover:shadow-[0_0_25px_rgba(108,99,255,0.3)] transition-all duration-300">
          <p class="text-text-primary text-[14px] md:text-[20px] font-bold mb-3 uppercase tracking-wider text-electric-indigo">Ví dụ siêu dễ:</p>
          <div class="neu-inset bg-bg-main p-3 rounded-lg mb-3 flex justify-center border border-electric-indigo/20">
             <code class="text-neon-serpent text-lg md:text-2xl font-mono font-bold">tuoi = 16</code>
          </div>
          <span class="text-text-primary text-[13.5px] md:text-[20px]">👉 Máy tính sẽ tạo một cái hộp tên là <strong>tuoi</strong> và cất số <strong>16</strong> vào đó.</span>
        </div>

        <div class="bg-electric-indigo/10 p-4 rounded-xl border-2 border-electric-indigo/30 mb-4 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
            <p class="text-cyber-cyan font-bold text-sm md:text-lg uppercase mb-1">💡 Pro Tip:</p>
            <p class="text-text-primary text-[13.5px] md:text-[18px]">Biến giống như Saved Game vậy. Bạn lưu máu, level, tên nhân vật vào biến để lần sau dùng tiếp!</p>
        </div>

        <p class="mb-2 text-[14px] md:text-[20px] text-text-primary"><strong>🎮 Thử ngay nào:</strong></p>
        <p class="text-text-primary text-[13.5px] md:text-[20px] mb-2">Bạn hãy nhìn sang màn hình đen bên phải (nhấn tab <strong>Code</strong> trên điện thoại). Hãy gõ thử dòng này nha:</p>
      `,
      codeSnippet: `# Tạo một biến tên là 'tuoi' và gán bằng 16
tuoi = 16

# In biến 'tuoi' ra màn hình xem có gì nào
print(tuoi)

# Năm sau mình tăng thêm 1 tuổi
tuoi = tuoi + 1
print(tuoi)`
    },
    {
      id: 'seg-2',
      title: 'Lệnh Gán (Dấu = thần thánh)',
      type: 'theory',
      xpReward: 15,
      trinketId: BASE_TRINKET_ID,
      hint: 'Trong lập trình, dấu = có nghĩa là "Lấy cái bên phải bỏ vào cái bên trái".',
      content: `
        <h3 class="text-cyber-cyan font-display text-xl md:text-3xl mb-4">Dấu Bằng (=)</h3>
        <p class="mb-6 text-[13.5px] md:text-[20px] text-text-primary">
            Trong toán học, <code>x = 5</code> nghĩa là x bằng 5. <br>
            Nhưng trong Python, dấu <code>=</code> là <strong>Lệnh Gán</strong>.
        </p>
        
        <!-- BLOCK 1: CÚ PHÁP -->
        <div class="mb-6 neu-out p-5 rounded-2xl border-2 border-hot-coral/50 shadow-[0_0_20px_rgba(255,107,107,0.15)] bg-bg-main transition-all hover:shadow-[0_0_25px_rgba(255,107,107,0.3)]">
            <span class="text-hot-coral font-bold text-sm md:text-lg uppercase tracking-wider mb-2 block border-b border-hot-coral/20 pb-2">1. Cú pháp (Công thức)</span>
            <div class="neu-inset bg-bg-main p-4 rounded-xl flex items-center justify-center mt-3 border border-hot-coral/10">
                 <code class="font-mono text-hot-coral text-lg md:text-3xl font-bold">&lt;tên_biến&gt; = &lt;giá_trị&gt;</code>
            </div>
        </div>

        <!-- BLOCK 2: VÍ DỤ -->
        <div class="mb-8 neu-out p-5 rounded-2xl border-2 border-neon-serpent/50 shadow-[0_0_20px_rgba(0,255,148,0.15)] bg-bg-main transition-all hover:shadow-[0_0_25px_rgba(0,255,148,0.3)]">
            <span class="text-neon-serpent font-bold text-sm md:text-lg uppercase tracking-wider mb-2 block border-b border-neon-serpent/20 pb-2">2. Ví dụ Python</span>
            <div class="neu-inset bg-bg-main p-4 rounded-xl flex items-center justify-center mt-3 border border-neon-serpent/10">
                 <code class="font-mono text-neon-serpent text-lg md:text-3xl font-bold">diem_toan = 10</code>
            </div>
        </div>

        <div class="neu-out p-4 rounded-xl bg-electric-indigo/5 border-2 border-electric-indigo/30 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
            <p class="text-[13.5px] md:text-[20px] text-text-primary italic text-center">
                👉 Quy tắc vàng: <strong>Lấy cái bên PHẢI, cất vào cái tên bên TRÁI.</strong>
            </p>
        </div>

        <p class="mt-6 mb-2 text-[14px] md:text-[20px] text-text-primary font-bold">Python cất được những gì?</p>
        <ul class="list-disc list-inside text-text-primary text-[13.5px] md:text-[20px] space-y-2 mb-4 ml-2">
          <li>Số nguyên: <code>a = 10</code></li>
          <li>Số thực: <code>b = 2.5</code></li>
          <li>Chữ viết: <code>ten = "Cyber Bot"</code> (Nhớ dấu nháy kép " " nhé!)</li>
        </ul>
      `,
      codeSnippet: `# 1. Tạo biến 'qua' và gán giá trị là số 10
qua = 10

# 2. Tạo biến 'ten' và gán tên của bạn (nhớ dấu nháy kép)
ten = "Trần Thạch"

# 3. In ra lời chào
print("Xin chào", ten)
print("Bạn có", qua, "món quà")`
    },
    {
      id: 'seg-3',
      title: '2. Phép Toán (Siêu máy tính)',
      type: 'theory',
      xpReward: 20,
      trinketId: BASE_TRINKET_ID,
      hint: 'Chia lấy dư (%) dùng để tìm số lẻ/chẵn. Lũy thừa (**) là mũ.',
      content: `
        <h3 class="text-hot-coral font-display text-xl md:text-3xl mb-4">Cộng Trừ Nhân Chia</h3>
        <p class="mb-6 text-[13.5px] md:text-[20px] text-text-primary">Biến không chỉ để ngắm, chúng ta có thể mang nó ra tính toán.</p>
        
        <div class="grid grid-cols-1 gap-4 text-[13.5px] md:text-[20px] mb-6">
          <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-neon-serpent/30 shadow-[0_0_15px_rgba(0,255,148,0.1)] hover:scale-[1.01] transition-transform">
             <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="font-mono text-neon-serpent text-xl md:text-2xl font-bold bg-neon-serpent/10 px-2 rounded">+ - * /</span> 
                <span class="text-text-primary font-bold text-sm md:text-lg">Cơ bản</span>
             </div>
             <p class="text-text-primary">Cộng, trừ, nhân, chia bình thường. <br>Ví dụ: <code class="neu-inset bg-bg-main px-1 rounded text-neon-serpent font-bold">5 / 2 = 2.5</code></p>
          </div>

          <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-hot-coral/30 shadow-[0_0_15px_rgba(255,107,107,0.1)] hover:scale-[1.01] transition-transform">
             <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="font-mono text-hot-coral text-xl md:text-2xl font-bold bg-hot-coral/10 px-2 rounded">//</span> 
                <span class="text-text-primary font-bold text-sm md:text-lg">Chia lấy nguyên</span>
             </div>
             <p class="text-text-primary">Chia xong bỏ phần thập phân. <br>Ví dụ: <code class="neu-inset bg-bg-main px-1 rounded text-hot-coral font-bold">5 // 2 = 2</code> (Chỉ lấy số 2)</p>
          </div>

          <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.1)] hover:scale-[1.01] transition-transform">
             <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="font-mono text-cyber-cyan text-xl md:text-2xl font-bold bg-cyber-cyan/10 px-2 rounded">%</span> 
                <span class="text-text-primary font-bold text-sm md:text-lg">Chia lấy dư</span>
             </div>
             <p class="text-text-primary">Chỉ lấy phần dư. <br>Ví dụ: <code class="neu-inset bg-bg-main px-1 rounded text-cyber-cyan font-bold">5 % 2 = 1</code> (5 chia 2 dư 1)</p>
          </div>
           
           <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-electric-indigo/30 shadow-[0_0_15px_rgba(108,99,255,0.1)] hover:scale-[1.01] transition-transform">
             <div class="flex items-center justify-between mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                <span class="font-mono text-electric-indigo text-xl md:text-2xl font-bold bg-electric-indigo/10 px-2 rounded">**</span> 
                <span class="text-text-primary font-bold text-sm md:text-lg">Lũy thừa (Mũ)</span>
             </div>
             <p class="text-text-primary">Ví dụ: <code class="neu-inset bg-bg-main px-1 rounded text-electric-indigo font-bold">3 ** 2 = 9</code> (3 bình phương)</p>
          </div>
        </div>
      `,
      codeSnippet: `a = 10
b = 3

print("Tổng a+b:", a + b)

# Phép chia lấy nguyên (//)
# 10 chia 3 được 3.3333... Lấy nguyên là 3
print("10 // 3 =", a // b)

# Phép chia lấy dư (%)
# 10 chia 3 dư 1.
print("10 % 3 =", a % b)

# Thử tính 2 mũ 3 xem
print("2 mũ 3 =", 2**3)`
    },
    {
      id: 'seg-4',
      title: 'Phép Toán Với Chữ (String)',
      type: 'theory',
      xpReward: 15,
      trinketId: BASE_TRINKET_ID,
      hint: 'Dùng dấu + để nối hai chữ lại. Dùng dấu * để nhân bản chữ lên.',
      content: `
        <h3 class="text-electric-indigo font-display text-xl md:text-3xl mb-4">Chữ cũng cộng được ư? 😲</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] leading-relaxed text-text-primary">Đúng vậy! Python rất thú vị. Với chữ (String), chúng ta có 2 phép thuật:</p>
        
        <div class="space-y-4 text-[13.5px] md:text-[20px]">
          <div class="neu-out bg-bg-main p-5 border-2 border-hot-coral/50 shadow-[0_0_20px_rgba(255,107,107,0.15)] rounded-xl relative overflow-hidden group">
            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span class="text-6xl">🔗</span></div>
            <p class="font-bold text-hot-coral mb-2 text-lg uppercase">1. Phép nối (+)</p>
            <div class="neu-inset bg-bg-main p-3 rounded-lg mb-2 border border-hot-coral/10">
                <p class="font-mono text-[16px] md:text-[24px] text-text-primary">"Trà" + "Sữa" = <span class="text-hot-coral font-bold">"TràSữa"</span></p>
            </div>
            <p class="text-text-secondary italic text-sm md:text-base">(Dính liền nhau luôn! Muốn cách ra phải thêm dấu cách " ")</p>
          </div>
          
          <div class="neu-out bg-bg-main p-5 border-2 border-neon-serpent/50 shadow-[0_0_20px_rgba(0,255,148,0.15)] rounded-xl relative overflow-hidden group">
            <div class="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><span class="text-6xl">✖️</span></div>
            <p class="font-bold text-neon-serpent mb-2 text-lg uppercase">2. Phép nhân bản (*)</p>
            <div class="neu-inset bg-bg-main p-3 rounded-lg mb-2 border border-neon-serpent/10">
                <p class="font-mono text-[16px] md:text-[24px] text-text-primary">"Ha" * 3 = <span class="text-neon-serpent font-bold">"HaHaHa"</span></p>
            </div>
            <p class="text-text-secondary italic text-sm md:text-base">(Copy ra 3 lần đó!)</p>
          </div>
        </div>
      `,
      codeSnippet: `ho = "Nguyễn"
ten = "Văn A"

# Nối họ và tên (Nhớ cộng thêm dấu cách " " ở giữa nhé)
ho_va_ten = ho + " " + ten
print(ho_va_ten)

# In ra tiếng cười
cuoi = "Hi" * 5
print(cuoi)`
    },
    {
      id: 'seg-5',
      title: '3. Kiểm Tra: Luật Đặt Tên (Biến & Tệp)',
      type: 'quiz',
      xpReward: 100,
      content: 'Hãy trả lời 10 câu hỏi sau để trở thành bậc thầy đặt tên! Quy tắc này áp dụng cho cả tên biến và tên tệp chương trình (.py) nhé.',
      quizData: [
        {
          id: 'q1',
          question: 'Tên biến nào sau đây là HỢP LỆ trong Python?',
          options: [
             { id: 'a', text: '1hocsinh', isCorrect: false },
             { id: 'b', text: 'hoc sinh', isCorrect: false },
             { id: 'c', text: 'hoc_sinh', isCorrect: true },
             { id: 'd', text: 'class', isCorrect: false },
          ],
          explanation: 'Chính xác! Tên biến và tên tệp không được bắt đầu bằng số, không chứa khoảng trắng. Dấu gạch dưới (_) là lựa chọn an toàn nhất.'
        },
        {
          id: 'q2',
          question: 'Biến "Name" và "name" có giống nhau không?',
          options: [
             { id: 'a', text: 'Có, Python không phân biệt hoa thường', isCorrect: false },
             { id: 'b', text: 'Không, Python có phân biệt hoa thường (Case Sensitive)', isCorrect: true },
          ],
          explanation: 'Đúng rồi! Python rất "soi", chữ hoa và chữ thường là hai thứ hoàn toàn khác nhau. (Lưu ý: Tên tệp trên Windows có thể không phân biệt, nhưng trên Linux/Web thì có, nên cứ coi là khác nhau cho chắc nhé!).'
        },
        {
          id: 'q3',
          question: 'Tên biến nào sau đây bị SAI?',
          options: [
             { id: 'a', text: 'my_var', isCorrect: false },
             { id: 'b', text: '_bien_bi_an', isCorrect: false },
             { id: 'c', text: 'tong2so', isCorrect: false },
             { id: 'd', text: 'for', isCorrect: true },
          ],
          explanation: '"for" là một từ khóa (keyword) dùng cho vòng lặp, nên không thể dùng làm tên biến hay tên tệp. Tránh xa các từ khóa màu cam/tím trong editor nhé!'
        },
        {
          id: 'q4',
          question: 'Ký tự đặc biệt nào DUY NHẤT được dùng trong tên biến?',
          options: [
             { id: 'a', text: '@ (A còng)', isCorrect: false },
             { id: 'b', text: '$ (Đô la)', isCorrect: false },
             { id: 'c', text: '_ (Gạch dưới)', isCorrect: true },
             { id: 'd', text: '- (Gạch ngang)', isCorrect: false },
          ],
          explanation: 'Chỉ có dấu gạch dưới (_) được phép dùng để nối các từ. Gạch ngang (-) sẽ bị hiểu nhầm là phép trừ, còn $ hay @ là của ngôn ngữ khác!'
        },
        {
          id: 'q5',
          question: 'Để gán giá trị 10 cho biến x, câu lệnh nào đúng?',
          options: [
             { id: 'a', text: 'x = 10', isCorrect: true },
             { id: 'b', text: '10 = x', isCorrect: false },
             { id: 'c', text: 'x == 10', isCorrect: false },
             { id: 'd', text: 'x : 10', isCorrect: false },
          ],
          explanation: 'Luôn nhớ khẩu quyết: "Tên biến bên trái, Giá trị bên phải". Dấu = giống như mũi tên cất đồ vào hộp vậy.'
        },
        {
          id: 'q6',
          question: 'Phong cách đặt tên chuẩn của Python (Snake Case) là gì?',
          options: [
             { id: 'a', text: 'myVariable', isCorrect: false },
             { id: 'b', text: 'MyVariable', isCorrect: false },
             { id: 'c', text: 'my_variable', isCorrect: true },
             { id: 'd', text: 'MY_VARIABLE', isCorrect: false },
          ],
          explanation: 'Snake Case (kiểu con rắn) sử dụng toàn chữ thường và nối các từ bằng dấu gạch dưới (ví dụ: bai_tap_ve_nha.py). Đây là chuẩn mực của Python!'
        },
        {
          id: 'q7',
          question: 'Tên biến có thể chứa Tiếng Việt có dấu không?',
          options: [
             { id: 'a', text: 'Được, nhưng không khuyến khích', isCorrect: true },
             { id: 'b', text: 'Tuyệt đối không, sẽ báo lỗi ngay', isCorrect: false },
          ],
          explanation: 'Python 3 hiện đại hỗ trợ Unicode nên "biến = 1" vẫn chạy, nhưng ĐỪNG LÀM THẾ! Nó rất dễ gây lỗi khi gửi file cho người khác hoặc up lên web. Hãy dùng Tiếng Việt không dấu hoặc Tiếng Anh.'
        },
        {
          id: 'q8',
          question: 'Trong câu lệnh "a = b + 5", cái nào là Biến?',
          options: [
             { id: 'a', text: 'Chỉ a', isCorrect: false },
             { id: 'b', text: 'Chỉ b', isCorrect: false },
             { id: 'c', text: 'Cả a và b', isCorrect: true },
             { id: 'd', text: 'Số 5', isCorrect: false },
          ],
          explanation: 'Cả a và b đều là tên đại diện cho các ô nhớ dữ liệu, nên cả hai đều là biến. Số 5 là hằng số (giá trị cụ thể).'
        },
        {
          id: 'q9',
          question: 'Câu lệnh `print = 10` có hợp lệ không?',
          options: [
             { id: 'a', text: 'Có, nhưng sẽ làm hỏng lệnh in print()', isCorrect: true },
             { id: 'b', text: 'Không, báo lỗi Syntax Error', isCorrect: false },
          ],
          explanation: 'Nguy hiểm chết người! Python cho phép gán đè tên hàm có sẵn, nhưng sau đó lệnh `print("Hello")` sẽ báo lỗi vì `print` giờ đã là số 10. Đừng đặt tên trùng với lệnh có sẵn nhé!'
        },
        {
          id: 'q10',
          question: 'Đâu là cách đặt tên biến tốt nhất cho "Số lượng học sinh"?',
          options: [
             { id: 'a', text: 'sl', isCorrect: false },
             { id: 'b', text: 'a', isCorrect: false },
             { id: 'c', text: 'so_luong_hoc_sinh', isCorrect: true },
             { id: 'd', text: 'SoLuongHocSinh', isCorrect: false },
          ],
          explanation: 'Tên biến nên rõ nghĩa (Descriptive). Đọc vào là hiểu ngay nó chứa gì, đừng đặt tên tắt kiểu đánh đố người đọc (và đánh đố chính mình sau này)!'
        },
      ]
    },
    {
      id: 'seg-6',
      title: 'Thực Hành Vui: Tính Tuổi Chó 🐶',
      type: 'practice',
      xpReward: 30,
      trinketId: BASE_TRINKET_ID,
      hint: 'Tuổi chó = Tuổi người * 7. Hãy tạo biến tuoi_nguoi rồi nhân lên nhé.',
      content: `
        <h3 class="text-neon-serpent font-display text-xl md:text-3xl mb-4">Bạn bao nhiêu tuổi... Chó?</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">Người ta thường nói 1 năm tuổi người bằng 7 năm tuổi chó.</p>
        
        <div class="neu-out bg-bg-main p-4 md:p-6 rounded-xl border-2 border-electric-indigo/50 shadow-[0_0_20px_rgba(108,99,255,0.15)] mb-6">
            <p class="text-text-primary text-[14px] md:text-[20px] mb-3 font-bold uppercase tracking-wider text-electric-indigo">📝 Yêu cầu:</p>
            <ol class="list-decimal list-inside text-text-primary space-y-2 text-[13.5px] md:text-[20px] ml-2">
                <li>Tạo biến <code class="text-hot-coral bg-white/10 px-1 rounded border border-white/10">tuoi_cua_ban</code> và gán số tuổi hiện tại của bạn.</li>
                <li>Tạo biến <code class="text-neon-serpent bg-white/10 px-1 rounded border border-white/10">tuoi_cho</code> bằng <code class="text-hot-coral">tuoi_cua_ban</code> nhân với 7.</li>
                <li>In kết quả ra màn hình.</li>
            </ol>
        </div>
      `,
      codeSnippet: `# Tính tuổi theo hệ "gâu gâu"
tuoi_cua_ban = 16

# 1 năm người = 7 năm chó
tuoi_cho = tuoi_cua_ban * 7

print("Tuổi của tớ theo hệ chó là:", tuoi_cho)`
    },
    {
      id: 'seg-7',
      title: 'Thực Hành Vui: Chia Tiền Trà Sữa 🧋',
      type: 'practice',
      xpReward: 35,
      trinketId: BASE_TRINKET_ID,
      hint: 'Tổng tiền = Giá ly * Số người. Mỗi người trả = Tổng tiền / Số người (Thật ra là bằng giá ly đó, nhưng hãy tập tính toán nhé!)',
      content: `
        <h3 class="text-hot-coral font-display text-xl md:text-3xl mb-4">Hội Trà Sữa</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">Hôm nay nhóm bạn đi uống trà sữa. Hãy giúp tính tiền nhé!</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-cyber-cyan/30 shadow-[0_0_15px_rgba(0,212,255,0.1)]">
                <span class="block text-text-primary text-sm md:text-xl mb-1 opacity-80">Giá 1 ly (Full topping)</span>
                <span class="text-xl md:text-3xl text-cyber-cyan font-bold font-mono">25000</span>
            </div>
             <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-neon-serpent/30 shadow-[0_0_15px_rgba(0,255,148,0.1)]">
                <span class="block text-text-primary text-sm md:text-xl mb-1 opacity-80">Số người</span>
                <span class="text-xl md:text-3xl text-neon-serpent font-bold font-mono">5</span>
            </div>
        </div>

        <p class="text-text-primary text-[13.5px] md:text-[20px] p-4 neu-inset rounded-xl bg-bg-main border border-white/10">Hãy tính <strong>Tổng tiền</strong> phải trả cho cả nhóm.</p>
      `,
      codeSnippet: `gia_ly = 25000
so_nguoi = 5

# Tính tổng tiền
tong_tien = gia_ly * so_nguoi

print("Tổng thiệt hại là:", tong_tien)`
    },
    {
      id: 'seg-8',
      title: 'Thực Hành Vui: Máy Tính Minecraft ⛏️',
      type: 'practice',
      xpReward: 40,
      trinketId: BASE_TRINKET_ID,
      hint: '1 stack = 64 block. Số stack = Tổng block // 64. Số lẻ = Tổng block % 64.',
      content: `
        <h3 class="text-green-500 font-display text-xl md:text-3xl mb-4">Steve cần giúp đỡ!</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">Trong Minecraft, 1 stack chứa được tối đa 64 block.</p>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">Steve đang có <strong>500 block Kim cương</strong>. Hỏi Steve có bao nhiêu stack chẵn và dư ra bao nhiêu block lẻ?</p>
        
        <div class="neu-out bg-bg-main p-4 md:p-6 rounded-xl border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.15)] mb-6">
            <p class="text-text-primary text-[14px] md:text-[20px] font-bold mb-3 uppercase tracking-wider text-green-500">Gợi ý phép toán:</p>
            <ul class="list-disc list-inside text-text-primary text-[13.5px] md:text-[20px] space-y-2 ml-2">
                <li>Tính số stack chẵn: Dùng chia lấy nguyên (<code class="text-green-500 bg-white/10 px-1 rounded border border-white/10">//</code>)</li>
                <li>Tính số block dư: Dùng chia lấy dư (<code class="text-green-500 bg-white/10 px-1 rounded border border-white/10">%</code>)</li>
            </ul>
        </div>
      `,
      codeSnippet: `tong_block = 500
mot_stack = 64

# Tính số stack đầy
so_stack = tong_block // mot_stack

# Tính số block còn dư
so_du = tong_block % mot_stack

print("Steve có", so_stack, "stack và dư", so_du, "block")`
    },
    {
      id: 'seg-9',
      title: 'Tự Luyện: Phép Toán Cơ Bản 1',
      type: 'practice',
      xpReward: 20,
      trinketId: BASE_TRINKET_ID,
      hint: 'Chu vi hình chữ nhật = (dài + rộng) * 2',
      content: `
        <h3 class="text-text-primary font-display text-xl md:text-3xl mb-4">Bài Toán Chu Vi</h3>
        <p class="mb-6 text-[13.5px] md:text-[20px] text-text-primary neu-out p-4 rounded-xl border-2 border-electric-indigo/30 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
            Cho hình chữ nhật có chiều dài là 15, chiều rộng là 8. <br>
            Hãy viết chương trình tính <strong>Chu vi</strong> của hình chữ nhật đó.
        </p>
      `,
      codeSnippet: `dai = 15
rong = 8

# Viết công thức tính chu vi ở dưới đây
# chu_vi = ?

# print(chu_vi)`
    },
    {
      id: 'seg-10',
      title: 'Tự Luyện: Phép Toán Cơ Bản 2',
      type: 'practice',
      xpReward: 25,
      trinketId: BASE_TRINKET_ID,
      hint: 'Trung bình cộng = (a + b + c) / 3',
      content: `
        <h3 class="text-text-primary font-display text-xl md:text-3xl mb-4">Điểm Trung Bình</h3>
        <p class="mb-6 text-[13.5px] md:text-[20px] text-text-primary neu-out p-4 rounded-xl border-2 border-hot-coral/30 shadow-[0_0_15px_rgba(255,107,107,0.1)]">
            Bạn có điểm 3 môn: Toán (8.5), Văn (7.0), Anh (9.0). <br>
            Hãy tính điểm trung bình cộng của 3 môn này.
        </p>
      `,
      codeSnippet: `toan = 8.5
van = 7.0
anh = 9.0

# Tính diem_trung_binh
# diem_tb = ?

# print(diem_tb)`
    },
    {
      id: 'seg-11',
      title: 'Tự Luyện: Đổi Đơn Vị',
      type: 'practice',
      xpReward: 30,
      trinketId: BASE_TRINKET_ID,
      hint: '1 giờ = 60 phút = 3600 giây.',
      content: `
        <h3 class="text-text-primary font-display text-xl md:text-3xl mb-4">Thời Gian Là Vàng</h3>
        <p class="mb-6 text-[13.5px] md:text-[20px] text-text-primary">
            Hãy viết chương trình đổi <strong>2 giờ 30 phút</strong> ra tổng số <strong>giây</strong>.
        </p>
        <ul class="list-disc list-inside text-text-primary ml-2 mb-4 text-[13.5px] md:text-[20px] neu-inset p-4 rounded-xl bg-bg-main border border-white/10">
            <li>1 giờ = 3600 giây</li>
            <li>1 phút = 60 giây</li>
        </ul>
      `,
      codeSnippet: `gio = 2
phut = 30

# Tính tổng số giây (tong_giay)
# tong_giay = (gio * 3600) + (phut * ?)

# print(tong_giay)`
    },
    {
      id: 'seg-12',
      title: 'Thực Hành Vui: Quy Đổi Tiền Tệ Cyber 💸',
      type: 'practice',
      xpReward: 45,
      trinketId: BASE_TRINKET_ID,
      hint: 'Số tiền VND = Số tiền Cyber * Tỷ giá (23000).',
      content: `
        <h3 class="text-electric-indigo font-display text-xl md:text-3xl mb-4">Tỷ Phú Thế Giới Ảo</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">
           Bạn vừa chiến thắng giải đấu Cyber-Game và nhận được <strong>500 đồng Cyber Gold</strong>.
        </p>
        <div class="neu-out bg-bg-main p-4 md:p-6 rounded-xl border-2 border-neon-serpent/50 shadow-[0_0_20px_rgba(0,255,148,0.15)] mb-6">
            <p class="text-text-primary text-[14px] md:text-[20px] mb-2 opacity-80">Tỷ giá quy đổi hiện tại:</p>
            <p class="text-neon-serpent text-xl md:text-3xl font-bold font-mono bg-neon-serpent/5 p-2 rounded-lg inline-block border border-neon-serpent/10">1 Cyber Gold = 23,000 VND</p>
        </div>
        <p class="text-text-primary text-[13.5px] md:text-[20px]">Hãy viết chương trình quy đổi số tiền thưởng này ra tiền Việt Nam Đồng nhé!</p>
      `,
      codeSnippet: `cyber_gold = 500
ty_gia = 23000

# Tính tổng tiền VND
# tien_viet = ?

# print(tien_viet)`
    },
    {
      id: 'seg-13',
      title: 'Thực Hành Vui: Chỉ Số Sức Mạnh Robot 🤖',
      type: 'practice',
      xpReward: 50,
      trinketId: BASE_TRINKET_ID,
      hint: 'Sức mạnh = Tấn công / (Tốc độ * Tốc độ). Có thể dùng toc_do ** 2.',
      content: `
        <h3 class="text-hot-coral font-display text-xl md:text-3xl mb-4">Nâng Cấp Robot</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">
           Các kỹ sư đang tính toán chỉ số sức mạnh (Power Index) cho Robot chiến đấu mới.
        </p>
        <div class="neu-out bg-bg-main p-4 md:p-6 rounded-xl border-2 border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,212,255,0.15)] mb-6 space-y-3">
             <p class="text-[14px] md:text-[20px] text-text-primary font-bold uppercase tracking-wider text-cyber-cyan">Công thức bí mật:</p>
             <div class="neu-inset bg-bg-main p-3 rounded text-center border border-white/10">
                <code class="text-cyber-cyan text-lg md:text-3xl font-bold">Power = Attack / (Speed)²</code>
             </div>
             <ul class="text-[13.5px] md:text-[20px] text-text-primary list-disc ml-6 space-y-1">
                <li>Attack (Tấn công): 8000</li>
                <li>Speed (Tốc độ): 20</li>
             </ul>
        </div>
        <p class="text-text-primary text-[13.5px] md:text-[20px]">Hãy tính xem chỉ số Power của Robot là bao nhiêu?</p>
      `,
      codeSnippet: `tan_cong = 8000
toc_do = 20

# Tính power theo công thức trên
# power = ?

# print(power)`
    },
    {
      id: 'seg-14',
      title: 'Thực Hành Vui: Vận Tốc Ánh Sáng 🚀',
      type: 'practice',
      xpReward: 60,
      trinketId: BASE_TRINKET_ID,
      hint: 'Thời gian = Quãng đường / Vận tốc. Đừng quên vận tốc ánh sáng là con số rất lớn!',
      content: `
        <h3 class="text-text-primary font-display text-xl md:text-3xl mb-4">Du Hành Vũ Trụ</h3>
        <p class="mb-4 text-[13.5px] md:text-[20px] text-text-primary">
           Một con tàu vũ trụ cần bay từ Trái Đất đến sao Hỏa.
        </p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-hot-coral/50 shadow-[0_0_15px_rgba(255,107,107,0.1)]">
                <span class="block text-text-primary text-sm md:text-xl mb-1 opacity-80">Khoảng cách (km)</span>
                <span class="text-xl md:text-3xl text-hot-coral font-bold font-mono">225,000,000</span>
            </div>
             <div class="neu-out bg-bg-main p-4 rounded-xl border-2 border-electric-indigo/50 shadow-[0_0_15px_rgba(108,99,255,0.1)]">
                <span class="block text-text-primary text-sm md:text-xl mb-1 opacity-80">Vận tốc tàu (km/h)</span>
                <span class="text-xl md:text-3xl text-electric-indigo font-bold font-mono">50,000</span>
            </div>
        </div>

        <p class="text-text-primary text-[13.5px] md:text-[20px]">Hãy tính xem con tàu mất bao nhiêu <strong>giờ</strong> để đến nơi?</p>
      `,
      codeSnippet: `quang_duong = 225000000
van_toc = 50000

# Tính thoi_gian_bay
# thoi_gian = ?

# print(thoi_gian)`
    }
  ]
};