import {
  UserProfile,
  ForumPost,
  EModul,
  MediaAjar,
  LkmAssignment,
  LkmSubmission,
  Quiz
} from './types';

export const initialProfiles: UserProfile[] = [
  {
    id: 'user-guru-1',
    email: 'dosen.arya@eduportal.ac.id',
    full_name: 'Dr. Ir. Arya Dipanegara, M.Kom.',
    role: 'guru',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    institution: 'Fakultas Ilmu Komputer - Universitas EduPortal',
    created_at: new Date('2026-09-01T08:00:00Z').toISOString(),
  },
  {
    id: 'user-siswa-1',
    email: 'rizky.ramadhan@student.eduportal.ac.id',
    full_name: 'Rizky Ramadhan',
    role: 'siswa',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    institution: 'Teknologi Informasi - Angkatan 2024',
    created_at: new Date('2026-09-05T09:30:00Z').toISOString(),
  },
  {
    id: 'user-siswa-2',
    email: 'anisa.putri@student.eduportal.ac.id',
    full_name: 'Anisa Putri Lestari',
    role: 'siswa',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    institution: 'Teknologi Informasi - Angkatan 2024',
    created_at: new Date('2026-09-06T10:15:00Z').toISOString(),
  },
];

export const initialPosts: ForumPost[] = [
  {
    id: 'post-1',
    user_id: 'user-guru-1',
    author_name: 'Dr. Ir. Arya Dipanegara, M.Kom.',
    author_role: 'guru',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Pengumuman Guru',
    title: '📢 Pengumuman: Rilis E-Modul Bab 3 dan Pembagian Kelompok LKM 02',
    content: 'Selamat pagi rekan-rekan mahasiswa. Modul Bab 3 mengenai "State Management & Realtime Synchronisation" telah dipublikasikan di menu E-Modul lengkap dengan referensi PDF. Silakan dipelajari untuk persiapan praktikum minggu ini. Tugas LKM 02 juga sudah dibuka dengan tenggat waktu 14 hari ke depan. Jika ada kendala teknis seputar setup Supabase atau Next.js, silakan buat thread baru di forum ini!',
    likes_count: 14,
    liked_by_users: ['user-siswa-1', 'user-siswa-2'],
    is_pinned: true,
    comments_count: 2,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    comments: [
      {
        id: 'comment-1-1',
        post_id: 'post-1',
        parent_id: null,
        user_id: 'user-siswa-1',
        author_name: 'Rizky Ramadhan',
        author_role: 'siswa',
        author_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        content: 'Terima kasih Pak atas pengumumannya. Untuk pengerjaan LKM 02 apakah boleh menggunakan library UI Tailwind CSS tambahan seperti Lucide icons?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
        replies: [
          {
            id: 'comment-1-1-1',
            post_id: 'post-1',
            parent_id: 'comment-1-1',
            user_id: 'user-guru-1',
            author_name: 'Dr. Ir. Arya Dipanegara, M.Kom.',
            author_role: 'guru',
            author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            content: 'Tentu sangat dianjurkan, Mas Rizky. Gunakan icon pack modern agar tampilan antarmuka ramah pengguna (user-friendly) dan profesional.',
            created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
          }
        ]
      }
    ]
  },
  {
    id: 'post-2',
    user_id: 'user-siswa-2',
    author_name: 'Anisa Putri Lestari',
    author_role: 'siswa',
    author_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    category: 'Pemrograman Web',
    title: '💡 Best Practice Memilih Antara Server Component vs Client Component di Next.js',
    content: 'Halo teman-teman, dari materi modul Bab 1 kemarin, saya merangkum aturan praktis: gunakan Server Component secara default untuk pengambilan data langsung ke database, akses secret keys, dan rendering konten statis demi performa SEO maksimal. Sedangkan "use client" hanya dideklarasikan jika butuh hooks interaktif (useState, useEffect, onClick) atau browser API. Bagaimana pengalaman teman-teman sejauh ini?',
    likes_count: 8,
    liked_by_users: ['user-guru-1', 'user-siswa-1'],
    comments_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    comments: [
      {
        id: 'comment-2-1',
        post_id: 'post-2',
        parent_id: null,
        user_id: 'user-siswa-1',
        author_name: 'Rizky Ramadhan',
        author_role: 'siswa',
        author_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
        content: 'Setuju banget Mbak Anisa! Waktu render jadi jauh lebih ringan karena bundle JavaScript yang dikirim ke browser berkurang drastis.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        replies: []
      }
    ]
  },
  {
    id: 'post-3',
    user_id: 'user-siswa-1',
    author_name: 'Rizky Ramadhan',
    author_role: 'siswa',
    author_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    category: 'Basis Data',
    title: '❓ Mengapa Row Level Security (RLS) di Supabase Sangat Krusial untuk Multi-tenant?',
    content: 'Saat menguji REST API Supabase dari sisi frontend klien menggunakan anon key, apakah semua orang bisa membaca tabel jika RLS tidak diaktifkan? Apakah wajib membuat policy terpisah untuk aksi INSERT, UPDATE, dan DELETE?',
    likes_count: 5,
    liked_by_users: ['user-guru-1'],
    comments_count: 1,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    comments: [
      {
        id: 'comment-3-1',
        post_id: 'post-3',
        parent_id: null,
        user_id: 'user-guru-1',
        author_name: 'Dr. Ir. Arya Dipanegara, M.Kom.',
        author_role: 'guru',
        author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        content: 'Pertanyaan bagus sekali Mas Rizky. Betul, anon key itu bersifat publik di browser. Jika RLS nonaktif, tabel bisa diakses publik tanpa pembatasan. Oleh karena itu, PostgreSQL RLS memastikan tiap row hanya bisa dimanipulasi sesuai dengan auth.uid() dari token JWT.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        replies: []
      }
    ]
  }
];

export const initialModules: EModul[] = [
  {
    id: 'modul-1',
    chapter: 1,
    title: 'Arsitektur Modern Web & Next.js App Router',
    description: 'Memahami konsep Server-Side Rendering (SSR), Static Site Generation (SSG), Client Components, dan sistem routing berbasis direktori.',
    read_time_minutes: 25,
    category: 'Pemrograman Web',
    pdf_name: 'Modul_01_Nextjs_App_Router.pdf',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date('2026-10-01T09:00:00Z').toISOString(),
    updated_at: new Date('2026-10-01T09:00:00Z').toISOString(),
    content: `
### 1. Pengantar Arsitektur Web Modern
Aplikasi web modern bergeser dari monolitik tradisional (MPA) menuju arsitektur hibrida berbasis komponen yang mengoptimalkan pengalaman pengguna (UX) dan kecepatan loading pertama (First Contentful Paint).

### 2. Next.js App Router: Paradigma Baru
Next.js versi terbaru memperkenalkan **App Router** yang dibangun di atas fondasi React Server Components (RSC):
- **Server Components (Default):** Dieksekusi secara eksklusif di server. Mengurangi ukuran bundle JavaScript klien dan mempercepat perolehan data dari basis data secara langsung.
- **Client Components ('use client'):** Digunakan ketika antarmuka membutuhkan interaktivitas pengguna seperti event listeners (\`onClick\`, \`onChange\`), state (\`useState\`), efek samping (\`useEffect\`), atau API browser.

### 3. Struktur Direktori Proyek
- \`src/app/layout.tsx\`: Root layout yang membungkus seluruh halaman aplikasi.
- \`src/app/page.tsx\`: Halaman utama atau homepage portal.
- \`src/app/[route]/page.tsx\`: Halaman spesifik berdasarkan segmen rute URL.

### 4. Studi Kasus Implementasi
Dalam membangun EduPortal, kita memanfaatkan layout bersarang (*nested layouts*) sehingga navigasi Sidebar dan Topbar tetap persisten tanpa me-reload seluruh DOM ketika berpindah dari E-Modul ke Asesmen.
    `.trim()
  },
  {
    id: 'modul-2',
    chapter: 2,
    title: 'Desain Skema Basis Data PostgreSQL & Supabase RLS',
    description: 'Panduan merancang database relasional yang aman, scalable, dengan perlindungan data multi-user melalui PostgreSQL Row Level Security.',
    read_time_minutes: 30,
    category: 'Basis Data',
    pdf_name: 'Modul_02_Postgres_Supabase_RLS.pdf',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-10T10:00:00Z').toISOString(),
    content: `
### 1. Prinsip Keamanan Basis Data Cloud
Ketika membangun aplikasi berbasis Backend-as-a-Service (BaaS) seperti Supabase, klien web berinteraksi langsung dengan REST API database PostgreSQL. Tanpa mekanisme keamanan yang tepat, celah kebocoran data sangat berisiko.

### 2. Memahami Row Level Security (RLS)
PostgreSQL memiliki fitur bawaan bernama **Row Level Security (RLS)**. RLS bekerja seperti filter otomatis pada level mesin basis data:
- Setiap kueri \`SELECT\`, \`INSERT\`, \`UPDATE\`, atau \`DELETE\` harus lolos dari ekspresi boolean (*policy*).
- Fungsi bawaan \`auth.uid()\` membaca klaim ID pengguna dari token JWT yang dikirimkan header HTTP.

### 3. Contoh Kebijakan (Policies)
\`\`\`sql
-- Kebijakan Siswa hanya bisa membaca modul yang dipublikasikan
CREATE POLICY "Public Read Modules" 
ON public.modules FOR SELECT 
USING (true);

-- Kebijakan Guru memiliki hak penuh untuk menambah dan mengubah modul
CREATE POLICY "Guru Full Access" 
ON public.modules FOR ALL 
USING (auth.jwt() ->> 'role' = 'guru');
\`\`\`
    `.trim()
  },
  {
    id: 'modul-3',
    chapter: 3,
    title: 'Interaktivitas & Realtime Social Learning Feed',
    description: 'Membangun fitur forum jejaring sosial dengan balasan komentar berjenjang (threaded replies), filter kategori, dan reactive state.',
    read_time_minutes: 20,
    category: 'Pemrograman Web',
    pdf_name: 'Modul_03_Realtime_Forum_Interactivity.pdf',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date('2026-10-20T11:00:00Z').toISOString(),
    updated_at: new Date('2026-10-20T11:00:00Z').toISOString(),
    content: `
### 1. Mengapa Jejaring Sosial Pendidikan Penting?
Pembelajaran kolaboratif (*collaborative learning*) terbukti meningkatkan pemahaman mahasiswa hingga 40% dibandingkan membaca modul secara mandiri. Forum sosial memberikan ruang tanya jawab langsung antara Dosen/Guru dan Siswa.

### 2. Struktur Data Komentar Berjenjang (Nested Tree)
Untuk mengimplementasikan komentar bertingkat:
- Setiap record komentar memiliki kolom \`parent_id\` yang merujuk pada \`comment.id\` induk.
- Jika \`parent_id IS NULL\`, maka komentar berada di tingkat utama (root).
- Algoritma rekursif atau pengelompokan bersarang digunakan untuk me-render sub-komentar secara rapi dan terindentasi.
    `.trim()
  },
  {
    id: 'modul-4',
    chapter: 4,
    title: 'Evaluasi & Asesmen Pembelajaran Terkomputerisasi (CBT)',
    description: 'Prinsip pembuatan sistem kuis daring dengan countdown timer, validasi otomatis, serta umpan balik pembahasan soal.',
    read_time_minutes: 25,
    category: 'Asesmen & Evaluasi',
    pdf_name: 'Modul_04_CBT_Computer_Based_Test.pdf',
    pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    created_at: new Date('2026-10-28T14:00:00Z').toISOString(),
    updated_at: new Date('2026-10-28T14:00:00Z').toISOString(),
    content: `
### 1. Desain Asesmen Formatif vs Sumatif
Asesmen interaktif dalam EduPortal bertujuan untuk mengukur tingkat serapan pemahaman siswa terhadap materi ajar secara instan.

### 2. Komponen Kunci Kuis Online:
1. **Timer Real-time:** Memastikan pengerjaan tepat waktu dengan penguncian otomatis saat durasi habis.
2. **Auto-Grading Algorithm:** Mengkalkulasi poin jawaban benar dan menampilkan persentase kelulusan instan.
3. **Pembahasan Terperinci:** Menjelaskan alasan mengapa opsi tertentu benar dan opsi lain salah untuk proses perbaikan kognitif.
    `.trim()
  }
];

export const initialMedia: MediaAjar[] = [
  {
    id: 'media-1',
    title: 'Video Tutorial: Fullstack Web Development Modern 2026',
    type: 'youtube',
    category: 'Pemrograman Web',
    media_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    thumbnail_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    description: 'Panduan video lengkap menyusun arsitektur aplikasi web modern dari nol hingga deployment ke server produksi.',
    tags: ['Next.js', 'React', 'Fullstack', 'Frontend'],
    created_at: new Date('2026-10-05T08:00:00Z').toISOString(),
  },
  {
    id: 'media-2',
    title: 'Slide Presentasi: Normalisasi Basis Data Relasional (1NF ke BCNF)',
    type: 'slide',
    category: 'Basis Data',
    media_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=80',
    description: 'Slide materi kuliah resmi yang mengupas tuntas teknik pemecahan anomali update, insert, dan delete melalui normalisasi tabel.',
    tags: ['PostgreSQL', 'Normalisasi', 'SQL', 'Database'],
    created_at: new Date('2026-10-12T10:30:00Z').toISOString(),
  },
  {
    id: 'media-3',
    title: 'Infografis: Alur Komunikasi Client-Server & HTTP Protocol',
    type: 'infografis',
    category: 'Jaringan Komputer',
    media_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    description: 'Infografis visual beresolusi tinggi yang merangkum handshake TCP/IP, TLS encryption, header HTTP/2 dan HTTP/3.',
    tags: ['Networking', 'HTTP', 'REST API', 'Infografis'],
    created_at: new Date('2026-10-18T13:45:00Z').toISOString(),
  },
  {
    id: 'media-4',
    title: 'Simulasi Interaktif: Struktur Data Pohon Biner (Binary Search Tree)',
    type: 'simulasi',
    category: 'Algoritma & Struktur Data',
    media_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    thumbnail_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    description: 'Simulasi visualisasi langkah demi langkah proses traversal In-order, Pre-order, Post-order dan penyeimbangan AVL Tree.',
    tags: ['Struktur Data', 'Algoritma', 'BST', 'Visualisasi'],
    created_at: new Date('2026-10-25T15:20:00Z').toISOString(),
  }
];

export const initialLkms: LkmAssignment[] = [
  {
    id: 'lkm-1',
    title: 'LKM 01 - Analisis Kebutuhan & Perancangan ERD Database EduPortal',
    subject: 'Basis Data & Rekayasa Perangkat Lunak',
    description: 'Mahasiswa diminta membuat diagram Entity-Relationship (ERD) lengkap dengan entitas Profile, Posts, Comments, Modules, LKMs, dan Quizzes beserta tipe relasi 1-to-N dan N-to-N. Lampirkan berkas PDF atau gambar hasil rancangan serta penjelasan singkat normalisasi tabel.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(),
    attachment_name: 'Panduan_Instruksi_LKM_01.pdf',
    attachment_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    max_score: 100,
    created_at: new Date('2026-10-15T08:00:00Z').toISOString(),
  },
  {
    id: 'lkm-2',
    title: 'LKM 02 - Implementasi CRUD Interaktif & Supabase Row Level Security',
    subject: 'Pemrograman Web Lanjutan',
    description: 'Implementasikan form input data modul dan media ajar yang aman. Pastikan user dengan role "siswa" tidak dapat melakukan tindakan DELETE atau UPDATE pada data milik pengguna lain. Uji kueri SQL policy di Supabase SQL editor.',
    deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(),
    attachment_name: 'Spesifikasi_Teknis_LKM_02.pdf',
    attachment_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    max_score: 100,
    created_at: new Date('2026-10-22T09:00:00Z').toISOString(),
  }
];

export const initialSubmissions: LkmSubmission[] = [
  {
    id: 'sub-1',
    assignment_id: 'lkm-1',
    student_id: 'user-siswa-1',
    student_name: 'Rizky Ramadhan',
    student_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    student_email: 'rizky.ramadhan@student.eduportal.ac.id',
    content_text: 'Berikut adalah laporan hasil perancangan skema ERD EduPortal. Kami telah merancang 7 entitas utama dengan normalisasi sampai bentuk ketiga (3NF) guna menghindari redudansi data pada forum komentar bertingkat.',
    attachment_name: 'Laporan_LKM01_Rizky_Ramadhan.pdf',
    attachment_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    score: 95,
    feedback: 'Kerja sangat bagus! Relasi foreign key untuk parent_id pada komentar bertingkat sudah dirancang dengan tepat. Pertahankan kualitas analisis.',
    status: 'graded',
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    graded_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'sub-2',
    assignment_id: 'lkm-1',
    student_id: 'user-siswa-2',
    student_name: 'Anisa Putri Lestari',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    student_email: 'anisa.putri@student.eduportal.ac.id',
    content_text: 'Tugas LKM 01 telah selesai dikerjakan. Berkas diagram ERD dan rancangan kamus data (data dictionary) terlampir dalam file PDF.',
    attachment_name: 'Tugas_LKM1_AnisaPutri_3NF.pdf',
    attachment_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    score: null,
    feedback: null,
    status: 'pending',
    submitted_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    title: 'Evaluasi Pemrograman Web Modern & Next.js App Router',
    subject: 'Pemrograman Web',
    description: 'Uji pemahaman mendalam mengenai React Server Components, Client Components, optimasi performa render, dan arsitektur Next.js.',
    duration_minutes: 15,
    passing_score: 70,
    total_questions: 5,
    created_at: new Date('2026-10-18T08:00:00Z').toISOString(),
    questions: [
      {
        id: 'q1-1',
        quiz_id: 'quiz-1',
        type: 'mcq',
        question_text: 'Manakah pernyataan yang BENAR mengenai React Server Components (RSC) pada Next.js App Router?',
        options: [
          'A. Server Components mengirimkan seluruh bundle JavaScript komponen ke browser klien.',
          'B. Server Components dieksekusi di server dan merender HTML serta format JSON payload tanpa membebani bundle JS klien.',
          'C. Server Components wajib dideklarasikan dengan direktif "use client" di baris paling atas.',
          'D. Server Components mendukung pemanggilan hooks seperti useState dan useEffect secara langsung.'
        ],
        correct_answer: 'B',
        explanation: 'Server Components dieksekusi eksklusif di server. Kode dan dependensinya tidak diikutsertakan ke dalam JavaScript bundle yang dikirim ke browser, sehingga ukuran unduhan aplikasi menjadi sangat hemat dan rendering lebih kencang.',
        points: 20
      },
      {
        id: 'q1-2',
        quiz_id: 'quiz-1',
        type: 'mcq',
        question_text: 'Kapan seorang pengembang frontend WAJIB menambahkan direktif "use client"?',
        options: [
          'A. Ketika ingin membaca environment variable sensitif seperti database secret key.',
          'B. Ketika ingin melakukan query SQL langsung ke database server.',
          'C. Ketika komponen membutuhkan event handler interaktif seperti onClick atau React state (useState, useEffect).',
          'D. Ketika ingin mengonfigurasi Metadata SEO halaman web.'
        ],
        correct_answer: 'C',
        explanation: 'Direktif "use client" menandai boundary antara Server Component dan Client Component. Ini diperlukan saat komponen membutuhkan interaktivitas pengguna atau lifecycle hooks peramban.',
        points: 20
      },
      {
        id: 'q1-3',
        quiz_id: 'quiz-1',
        type: 'mcq',
        question_text: 'Pada arsitektur Next.js App Router, file apakah yang digunakan untuk mendefinisikan layout umum yang membungkus beberapa halaman rute sekaligus?',
        options: [
          'A. page.tsx',
          'B. layout.tsx',
          'C. template.tsx',
          'D. error.tsx'
        ],
        correct_answer: 'B',
        explanation: 'File layout.tsx mendefinisikan kerangka antarmuka bersama (seperti navbar, sidebar, footer) yang tetap mempertahankan state dan tidak melakukan re-render penuh saat navigasi antar rute.',
        points: 20
      },
      {
        id: 'q1-4',
        quiz_id: 'quiz-1',
        type: 'mcq',
        question_text: 'Apa fungsi utama dari utilitas "twMerge" dan "clsx" yang sering digunakan bersama Tailwind CSS?',
        options: [
          'A. Mengonversi kode CSS menjadi bahasa C++',
          'B. Menggabungkan class Tailwind secara kondisional dan menyelesaikan konflik duplikasi class styling secara cerdas.',
          'C. Mengenkripsi token autentikasi pengguna.',
          'D. Mengompresi file gambar menjadi format WebP secara otomatis.'
        ],
        correct_answer: 'B',
        explanation: 'clsx menangani conditional classnames, sedangkan twMerge menyelesaikan class conflict (misal "p-4" dan "p-2", twMerge memastikan nilai yang terakhir yang menang).',
        points: 20
      },
      {
        id: 'q1-5',
        quiz_id: 'quiz-1',
        type: 'essay',
        question_text: 'Sebutkan nama direktif (1 kata/frasa singkat) yang diletakkan di baris pertama file untuk menandai Client Component di Next.js!',
        options: [],
        correct_answer: 'use client',
        explanation: 'Direktif \'use client\' ditulis di baris pertama file untuk memberitahu Next.js compiler agar komponen tersebut dikompilasi sebagai Client Component.',
        points: 20
      }
    ]
  },
  {
    id: 'quiz-2',
    title: 'Kuis Basis Data Relasional & Supabase Row Level Security',
    subject: 'Basis Data',
    description: 'Evaluasi penguasaan konsep integritas referensial, normalisasi tabel 3NF, dan pembuatan kebijakan keamanan Row Level Security (RLS).',
    duration_minutes: 20,
    passing_score: 75,
    total_questions: 4,
    created_at: new Date('2026-10-25T10:00:00Z').toISOString(),
    questions: [
      {
        id: 'q2-1',
        quiz_id: 'quiz-2',
        type: 'mcq',
        question_text: 'Apa tujuan utama pengaktifan Row Level Security (RLS) pada tabel PostgreSQL di platform Supabase?',
        options: [
          'A. Mempercepat koneksi internet pengguna.',
          'B. Mengontrol hak akses pembacaan dan manipulasi baris data spesifik berdasarkan identitas (auth.uid()) pengguna.',
          'C. Mengubah database PostgreSQL menjadi MongoDB.',
          'D. Menghapus otomatis data yang berumur lebih dari 30 hari.'
        ],
        correct_answer: 'B',
        explanation: 'RLS memastikan keamanan data pada tingkat baris (row level), sehingga pengguna hanya dapat membaca atau memodifikasi baris data yang diizinkan oleh policy.',
        points: 25
      },
      {
        id: 'q2-2',
        quiz_id: 'quiz-2',
        type: 'mcq',
        question_text: 'Sebuah relasi dikatakan berada dalam Bentuk Normal Ketiga (3NF) jika telah memenuhi 2NF dan tidak memiliki ketergantungan...?',
        options: [
          'A. Transitif (Transitive Dependency)',
          'B. Parsial (Partial Dependency)',
          'C. Multivalued Dependency',
          'D. Join Dependency'
        ],
        correct_answer: 'A',
        explanation: 'Bentuk Normal Ketiga (3NF) mensyaratkan tidak adanya ketergantungan transitif, di mana atribut non-kunci primer tidak boleh bergantung pada atribut non-kunci lainnya.',
        points: 25
      },
      {
        id: 'q2-3',
        quiz_id: 'quiz-2',
        type: 'mcq',
        question_text: 'Fungsi PostgreSQL Supabase manakah yang membaca ID unik pengguna yang sedang login dari token JWT autentikasi?',
        options: [
          'A. session_user_id()',
          'B. auth.uid()',
          'C. current_user_token()',
          'D. get_client_ip()'
        ],
        correct_answer: 'B',
        explanation: 'auth.uid() adalah fungsi helper bawaan schema auth di Supabase yang mengembalikan UUID pengguna terotentikasi.',
        points: 25
      },
      {
        id: 'q2-4',
        quiz_id: 'quiz-2',
        type: 'essay',
        question_text: 'Perintah SQL DDL singkat apa yang digunakan untuk mengaktifkan fitur RLS pada tabel "modules"? (Contoh format: ALTER TABLE ... ENABLE ...)',
        options: [],
        correct_answer: 'ALTER TABLE modules ENABLE ROW LEVEL SECURITY',
        explanation: 'Sintaks lengkap PostgreSQL untuk menyalakan RLS adalah "ALTER TABLE <nama_tabel> ENABLE ROW LEVEL SECURITY;".',
        points: 25
      }
    ]
  }
];
