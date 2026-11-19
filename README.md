# 🎓 EduPortal - Platform Media Pembelajaran & Jejaring Sosial Pendidikan

EduPortal adalah aplikasi web full-stack modern berbasis **Next.js (App Router)**, **Tailwind CSS**, dan **Supabase PostgreSQL** yang dirancang khusus untuk media pembelajaran interaktif perkuliahan/sekolah. Menggabungkan konsep repositori materi akademik (E-Modul & Media Ajar) dengan jejaring sosial pendidikan (Forum Diskusi Berjenjang) serta Computer-Based Testing (CBT Evaluasi & LKM).

---

## 🚀 Fitur Utama & Struktur Menu

### 1. 🏠 Beranda & Forum Diskusi Sosial (Social Learning Feed)
- **Ringkasan Akademik:** Statistik cepat jumlah modul, media ajar, LKM aktif, dan paket kuis.
- **Pengumuman Resmi Dosen/Guru:** Highlight banner untuk pesan dan pengumuman krusial.
- **Feed Interaktif Jejaring Sosial:** 
  - Pembuatan postingan pertanyaan atau diskusi baru.
  - Filter kategori mata pelajaran (*Pemrograman Web, Basis Data, Algoritma, Jaringan Komputer, Pengumuman Guru, Umum*).
  - Fitur **Like** (Apresiasi suka dengan counter).
  - Fitur **Komentar & Nested Replies (Balasan Berjenjang)** bertingkat.
  - Hak akses edit dan hapus khusus bagi pembuat postingan atau Guru.

### 2. 📚 E-Modul Pembelajaran Digital
- **Daftar Modul:** Tersusun rapi berdasarkan nomor Bab, estimasi waktu baca, dan kategori.
- **Mode Baca Daring:** Membaca uraian artikel lengkap secara langsung di web.
- **Pratinjau & Unduh PDF:** Embedded viewer PDF langsung di peramban (zoom, fullscreen, download).
- **Progres Belajar Siswa:** Tombol "Tandai Selesai Dibaca" dengan kalkulasi persentase ketercapaian membaca.
- **Guru CRUD:** Tambah, edit, dan hapus modul serta lampiran berkas PDF.

### 3. 🎨 Galeri Media Ajar Multimedia
- **Koleksi Multimedia:** Video YouTube interaktif, slide materi presentasi (PPT), dan infografis resolusi tinggi.
- **Inline Modal Player:** Pemutaran video dan pembesaran gambar dalam popup interaktif.
- **Filter Tipe:** Semua, Video YouTube, Slide Kuliah, Infografis, dan Simulasi.
- **Guru CRUD:** Kelola media pembelajaran, deskripsi, dan tag materi.

### 4. 📝 LKM (Lembar Kerja Murid / Mahasiswa)
- **Daftar Tugas LKM:** Dilengkapi petunjuk kerja, tenggat waktu (*deadline*), dan unduhan berkas panduan guru.
- **Pengumpulan Tugas (Siswa):** Form jawaban tertulis dan upload lampiran berkas hasil kerja (PDF/DOCX/Gambar).
- **Penilaian & Feedback (Guru):** Tab rekapitulasi pengumpulan seluruh siswa, input nilai (0-100), dan catatan umpan balik evaluatif.

### 5. ⏱️ Asesmen (Kuis & Evaluasi Online CBT)
- **Computer-Based Testing (CBT):** Kuis interaktif (Pilihan Ganda & Isian Singkat) dengan **Countdown Timer** real-time.
- **Otomatisasi Penilaian:** Penghitungan skor instan, status kelulusan (KKM), dan animasi perayaan (Confetti).
- **Pembahasan Soal Komprehensif:** Pembahasan detail untuk setiap butir soal guna perbaikan kognitif siswa.
- **Guru CRUD:** Membuat paket kuis, mengatur durasi menit, KKM, butir soal, kunci jawaban, dan pembahasan.
- **Rekapitulasi Nilai:** Tab daftar nilai seluruh siswa yang telah menyelesaikan kuis.

---

## 👥 Sistem Autentikasi & Multi-Role

Aplikasi mendukung 2 peran utama:
1. **Guru / Admin:** Akses penuh untuk manajemen konten (CRUD E-Modul, Media Ajar, Tugas LKM, Penilaian Siswa, Pembuatan Kuis, Moderasi Forum).
2. **Siswa / Pengunjung:** Akses belajar (membaca materi, mengunduh file, mengerjakan kuis dengan timer, mengumpulkan LKM, dan berpartisipasi aktif di forum).

> **💡 Quick Role Switcher (Mode Demo Cepat):** 
> Pada bagian kanan atas Navbar, tersedia tombol pengalih peran instan. Anda dapat berganti antara profil **👨‍🏫 Guru (Dr. Ir. Arya Dipanegara, M.Kom.)** dan **🎓 Siswa (Rizky Ramadhan)** dalam 1 kali klik untuk menguji seluruh skenario tanpa perlu re-login berulang kali.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas-Confetti.
- **Backend & Database:** Supabase (PostgreSQL Database, Authentication, Row Level Security, Cloud Storage).
- **Dual Mode State:** Menggunakan Supabase Client saat environment variables tersedia, dan otomatis beralih ke dynamic local persistence yang dilengkapi rich seed data bawaan saat dalam mode offline/demo.

---

## 📦 Panduan Menjalankan Proyek Secara Lokal

1. **Pastikan Node.js terinstal** (rekomendasi Node.js v18+ atau v20+).
2. **Buka terminal di folder proyek ini:**
   ```bash
   npm install
   ```
3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
4. Buka peramban di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Langkah Menghubungkan Supabase Database

1. Buka [https://supabase.com](https://supabase.com) dan buat akun/proyek baru gratis.
2. Di dashboard Supabase, buka menu **SQL Editor**.
3. Buka berkas `supabase/schema.sql` dari proyek ini, salin seluruh isi kodenya, dan tekan **Run**.
   - Perintah ini akan membuat seluruh tabel (`profiles`, `forum_posts`, `forum_comments`, `post_likes`, `modules`, `module_progress`, `media_ajar`, `lkm_assignments`, `lkm_submissions`, `quizzes`, `quiz_questions`, `quiz_submissions`), foreign keys, dan Row Level Security (RLS) policies.
4. Buka menu **Storage** di Supabase, buat 2 bucket publik:
   - `documents` (centang **Public bucket**) untuk file PDF dan berkas tugas.
   - `media` (centang **Public bucket**) untuk gambar dan infografis.
5. Masuk ke **Project Settings -> API**, salin:
   - **Project URL**
   - **Project API Keys (anon / public)**
6. Buat berkas `.env.local` di root proyek:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://proyek-anda.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🌐 Langkah Deploy ke Vercel (Siap Diakses Publik)

Proyek ini telah dikonfigurasi dan diuji lolos `npm run build` sehingga 100% siap di-deploy:

1. Buat repositori baru di akun GitHub Anda dan unggah kodenya:
   ```bash
   git init
   git add .
   git commit -m "feat: EduPortal v2 ready for deployment"
   git branch -M main
   git remote add origin https://github.com/username-anda/eduportal.git
   git push -u origin main
   ```
2. Buka [https://vercel.com](https://vercel.com) dan hubungkan akun GitHub Anda.
3. Klik **Add New -> Project**, lalu pilih repositori `eduportal`.
4. Pada form konfigurasi Vercel:
   - **Framework Preset:** Next.js (terdeteksi otomatis).
   - Di bagian **Environment Variables**, tambahkan:
     - `NEXT_PUBLIC_SUPABASE_URL`: (URL Supabase Anda)
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Anon key Supabase Anda)
5. Klik **Deploy**.
6. Dalam waktu sekitar 1-2 menit, situs EduPortal Anda sudah aktif secara daring dengan alamat publik gratis (misal: `https://eduportal-anda.vercel.app`)!
