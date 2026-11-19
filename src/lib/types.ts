export type UserRole = 'guru' | 'siswa';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  institution?: string;
  created_at: string;
}

export interface ForumComment {
  id: string;
  post_id: string;
  parent_id?: string | null;
  user_id: string;
  author_name: string;
  author_role: UserRole;
  author_avatar?: string;
  content: string;
  created_at: string;
  replies?: ForumComment[];
}

export interface ForumPost {
  id: string;
  user_id: string;
  author_name: string;
  author_role: UserRole;
  author_avatar?: string;
  category: 'Pemrograman Web' | 'Basis Data' | 'Algoritma & Struktur Data' | 'Jaringan Komputer' | 'Pengumuman Guru' | 'Umum';
  title: string;
  content: string;
  likes_count: number;
  liked_by_users: string[]; // user IDs who liked
  is_pinned?: boolean;
  comments_count: number;
  comments: ForumComment[];
  created_at: string;
  updated_at: string;
}

export interface EModul {
  id: string;
  chapter: number;
  title: string;
  description: string;
  content: string;
  pdf_url?: string;
  pdf_name?: string;
  category: string;
  read_time_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface EModulProgress {
  module_id: string;
  user_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export type MediaType = 'youtube' | 'slide' | 'infografis' | 'simulasi';

export interface MediaAjar {
  id: string;
  title: string;
  type: MediaType;
  category: string;
  media_url: string;
  thumbnail_url?: string;
  description: string;
  tags: string[];
  created_at: string;
}

export interface LkmAssignment {
  id: string;
  title: string;
  subject: string;
  description: string;
  deadline: string;
  attachment_url?: string;
  attachment_name?: string;
  max_score: number;
  created_at: string;
}

export interface LkmSubmission {
  id: string;
  assignment_id: string;
  student_id: string;
  student_name: string;
  student_avatar?: string;
  student_email: string;
  content_text: string;
  attachment_url?: string;
  attachment_name?: string;
  score?: number | null;
  feedback?: string | null;
  status: 'pending' | 'graded';
  submitted_at: string;
  graded_at?: string;
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  type: 'mcq' | 'essay';
  options: string[]; // 4 options for MCQ
  correct_answer: string; // "A", "B", "C", "D" or string for essay
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  total_questions: number;
  questions: QuizQuestion[];
  created_at: string;
}

export interface QuizSubmission {
  id: string;
  quiz_id: string;
  quiz_title: string;
  student_id: string;
  student_name: string;
  score: number;
  total_points: number;
  percentage: number;
  passed: boolean;
  time_spent_seconds: number;
  submitted_at: string;
  answers: Record<string, string>; // questionId -> selected answer
}
