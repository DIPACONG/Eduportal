-- ====================================================================
-- EDUPORTAL - FULL DATABASE SCHEMA, RLS POLICIES & STORAGE SETUP
-- Platform Pembelajaran Interaktif & Jejaring Sosial Pendidikan
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS (Idempotent)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('guru', 'siswa');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type AS ENUM ('youtube', 'slide', 'infografis', 'simulasi');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_status AS ENUM ('pending', 'graded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Hubungan langsung dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'siswa',
    avatar_url TEXT,
    institution TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. FORUM POSTS (Jejaring Sosial Pendidikan)
CREATE TABLE IF NOT EXISTS public.forum_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role user_role NOT NULL DEFAULT 'siswa',
    author_avatar TEXT,
    category TEXT NOT NULL DEFAULT 'Umum',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    is_pinned BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. FORUM COMMENTS (Nested Comments / Balasan Berjenjang)
-- Dibuat tanpa inline self-reference agar tidak menyebabkan error 42P01 pada PostgreSQL
CREATE TABLE IF NOT EXISTS public.forum_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    parent_id UUID,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_role user_role NOT NULL DEFAULT 'siswa',
    author_avatar TEXT,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Tambahkan foreign key self-referencing secara aman setelah tabel terdaftar
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_forum_comments_parent'
    ) THEN
        ALTER TABLE public.forum_comments 
        ADD CONSTRAINT fk_forum_comments_parent 
        FOREIGN KEY (parent_id) REFERENCES public.forum_comments(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. POST LIKES (Tombol Suka / Apresiasi)
CREATE TABLE IF NOT EXISTS public.post_likes (
    post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (post_id, user_id)
);

-- 7. E-MODUL (Modul Pembelajaran Digital & PDF)
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    pdf_url TEXT,
    pdf_name TEXT,
    category TEXT NOT NULL DEFAULT 'Umum',
    read_time_minutes INT NOT NULL DEFAULT 15,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. E-MODUL PROGRESS (Tandai Selesai Dibaca Siswa)
CREATE TABLE IF NOT EXISTS public.module_progress (
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT true,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    PRIMARY KEY (module_id, user_id)
);

-- 9. MEDIA AJAR (Slide, Infografis, Video YouTube, Simulasi)
CREATE TABLE IF NOT EXISTS public.media_ajar (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    type media_type NOT NULL DEFAULT 'youtube',
    category TEXT NOT NULL DEFAULT 'Umum',
    media_url TEXT NOT NULL,
    thumbnail_url TEXT,
    description TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. LKM (Lembar Kerja Murid/Mahasiswa)
CREATE TABLE IF NOT EXISTS public.lkm_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    deadline TIMESTAMPTZ NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    max_score INT NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. LKM SUBMISSIONS (Pengumpulan Tugas Siswa & Penilaian Guru)
CREATE TABLE IF NOT EXISTS public.lkm_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.lkm_assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    student_avatar TEXT,
    student_email TEXT NOT NULL,
    content_text TEXT NOT NULL,
    attachment_url TEXT,
    attachment_name TEXT,
    score INT,
    feedback TEXT,
    status submission_status NOT NULL DEFAULT 'pending',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    graded_at TIMESTAMPTZ
);

-- 12. ASESMEN & KUIS (Paket Kuis)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 15,
    passing_score INT NOT NULL DEFAULT 70,
    total_questions INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. BUTIR SOAL KUIS
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'mcq', -- 'mcq' atau 'essay'
    options JSONB NOT NULL DEFAULT '[]'::JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT NOT NULL,
    points INT NOT NULL DEFAULT 20
);

-- 14. RIWAYAT HASIL KUIS SISWA
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    quiz_title TEXT NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    score INT NOT NULL,
    total_points INT NOT NULL,
    percentage INT NOT NULL,
    passed BOOLEAN NOT NULL DEFAULT false,
    time_spent_seconds INT NOT NULL DEFAULT 0,
    answers JSONB NOT NULL DEFAULT '{}'::JSONB,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Aktifkan RLS di setiap tabel
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_ajar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkm_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lkm_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;

-- Helper Function: Periksa apakah user adalah Guru
CREATE OR REPLACE FUNCTION public.is_guru()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'guru'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kebijakan PROFILES
DROP POLICY IF EXISTS "Public Profiles Read" ON public.profiles;
CREATE POLICY "Public Profiles Read" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Can Update Own Profile" ON public.profiles;
CREATE POLICY "Users Can Update Own Profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users Can Insert Own Profile" ON public.profiles;
CREATE POLICY "Users Can Insert Own Profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Kebijakan FORUM POSTS
DROP POLICY IF EXISTS "Public Read Posts" ON public.forum_posts;
CREATE POLICY "Public Read Posts" ON public.forum_posts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Users Can Create Posts" ON public.forum_posts;
CREATE POLICY "Authenticated Users Can Create Posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authors or Guru Can Update Posts" ON public.forum_posts;
CREATE POLICY "Authors or Guru Can Update Posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id OR public.is_guru());

DROP POLICY IF EXISTS "Authors or Guru Can Delete Posts" ON public.forum_posts;
CREATE POLICY "Authors or Guru Can Delete Posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id OR public.is_guru());

-- Kebijakan FORUM COMMENTS
DROP POLICY IF EXISTS "Public Read Comments" ON public.forum_comments;
CREATE POLICY "Public Read Comments" ON public.forum_comments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated Users Can Comment" ON public.forum_comments;
CREATE POLICY "Authenticated Users Can Comment" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authors or Guru Can Delete Comments" ON public.forum_comments;
CREATE POLICY "Authors or Guru Can Delete Comments" ON public.forum_comments FOR DELETE USING (auth.uid() = user_id OR public.is_guru());

-- Kebijakan POST LIKES
DROP POLICY IF EXISTS "Public Read Likes" ON public.post_likes;
CREATE POLICY "Public Read Likes" ON public.post_likes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users Can Like" ON public.post_likes;
CREATE POLICY "Users Can Like" ON public.post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users Can Unlike" ON public.post_likes;
CREATE POLICY "Users Can Unlike" ON public.post_likes FOR DELETE USING (auth.uid() = user_id);

-- Kebijakan MODULES (Guru CRUD, Siswa Read)
DROP POLICY IF EXISTS "Public Read Modules" ON public.modules;
CREATE POLICY "Public Read Modules" ON public.modules FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru Can Manage Modules" ON public.modules;
CREATE POLICY "Guru Can Manage Modules" ON public.modules FOR ALL USING (public.is_guru());

-- Kebijakan MODULE PROGRESS (Siswa manage progress sendiri)
DROP POLICY IF EXISTS "Users Manage Own Progress" ON public.module_progress;
CREATE POLICY "Users Manage Own Progress" ON public.module_progress FOR ALL USING (auth.uid() = user_id);

-- Kebijakan MEDIA AJAR (Guru CRUD, Siswa Read)
DROP POLICY IF EXISTS "Public Read Media Ajar" ON public.media_ajar;
CREATE POLICY "Public Read Media Ajar" ON public.media_ajar FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru Can Manage Media Ajar" ON public.media_ajar;
CREATE POLICY "Guru Can Manage Media Ajar" ON public.media_ajar FOR ALL USING (public.is_guru());

-- Kebijakan LKM ASSIGNMENTS (Guru CRUD, Siswa Read)
DROP POLICY IF EXISTS "Public Read LKM" ON public.lkm_assignments;
CREATE POLICY "Public Read LKM" ON public.lkm_assignments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru Can Manage LKM" ON public.lkm_assignments;
CREATE POLICY "Guru Can Manage LKM" ON public.lkm_assignments FOR ALL USING (public.is_guru());

-- Kebijakan LKM SUBMISSIONS (Siswa submit/lihat miliknya, Guru nilai semua)
DROP POLICY IF EXISTS "View Submissions" ON public.lkm_submissions;
CREATE POLICY "View Submissions" ON public.lkm_submissions FOR SELECT USING (auth.uid() = student_id OR public.is_guru());

DROP POLICY IF EXISTS "Siswa Can Submit LKM" ON public.lkm_submissions;
CREATE POLICY "Siswa Can Submit LKM" ON public.lkm_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "Guru Can Grade Submissions" ON public.lkm_submissions;
CREATE POLICY "Guru Can Grade Submissions" ON public.lkm_submissions FOR UPDATE USING (public.is_guru());

-- Kebijakan QUIZZES & QUESTIONS
DROP POLICY IF EXISTS "Public Read Quizzes" ON public.quizzes;
CREATE POLICY "Public Read Quizzes" ON public.quizzes FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru Can Manage Quizzes" ON public.quizzes;
CREATE POLICY "Guru Can Manage Quizzes" ON public.quizzes FOR ALL USING (public.is_guru());

DROP POLICY IF EXISTS "Public Read Questions" ON public.quiz_questions;
CREATE POLICY "Public Read Questions" ON public.quiz_questions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Guru Can Manage Questions" ON public.quiz_questions;
CREATE POLICY "Guru Can Manage Questions" ON public.quiz_questions FOR ALL USING (public.is_guru());

-- Kebijakan QUIZ SUBMISSIONS
DROP POLICY IF EXISTS "View Quiz Submissions" ON public.quiz_submissions;
CREATE POLICY "View Quiz Submissions" ON public.quiz_submissions FOR SELECT USING (auth.uid() = student_id OR public.is_guru());

DROP POLICY IF EXISTS "Submit Quiz Results" ON public.quiz_submissions;
CREATE POLICY "Submit Quiz Results" ON public.quiz_submissions FOR INSERT WITH CHECK (auth.uid() = student_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (Ketika User Register di Supabase)
-- ====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, institution)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'siswa'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'institution', 'EduPortal')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ====================================================================
-- STORAGE BUCKETS SETUP (Otomatis Buat Bucket 'documents' dan 'media')
-- ====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true), ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public Read Documents" ON storage.objects;
CREATE POLICY "Public Read Documents" ON storage.objects FOR SELECT USING (bucket_id IN ('documents', 'media'));

DROP POLICY IF EXISTS "Public Upload Documents" ON storage.objects;
CREATE POLICY "Public Upload Documents" ON storage.objects FOR INSERT WITH CHECK (bucket_id IN ('documents', 'media'));
