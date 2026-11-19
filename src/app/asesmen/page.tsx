'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { Quiz, QuizQuestion } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { QuizRunnerModal } from '@/components/QuizRunnerModal';
import { Modal } from '@/components/Modal';
import {
  Timer,
  Award,
  Play,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  BookOpen,
  History,
  Sparkles,
  Users
} from 'lucide-react';

export default function AsesmenPage() {
  const {
    currentUser,
    quizzes,
    quizResults,
    createQuiz,
    updateQuiz,
    deleteQuiz
  } = usePortal();

  const isGuru = currentUser.role === 'guru';

  // Active quiz runner state
  const [runningQuiz, setRunningQuiz] = useState<Quiz | null>(null);

  // Tabs for Teacher: Paket Kuis vs Rekap Hasil Siswa
  const [activeTab, setActiveTab] = useState<'paket' | 'rekap'>('paket');

  // Teacher Create/Edit Quiz Modal
  const [isQuizFormOpen, setIsQuizFormOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Pemrograman Web');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState(15);
  const [formPassingScore, setFormPassingScore] = useState(70);
  const [formQuestions, setFormQuestions] = useState<QuizQuestion[]>([]);

  // Open Quiz Runner for student or teacher preview
  const handleStartQuiz = (quiz: Quiz) => {
    setRunningQuiz(quiz);
  };

  // Open Create Quiz form
  const handleOpenCreateQuiz = () => {
    setEditingQuiz(null);
    setFormTitle('');
    setFormSubject('Pemrograman Web');
    setFormDescription('');
    setFormDuration(15);
    setFormPassingScore(70);
    setFormQuestions([
      {
        id: 'q-new-1',
        quiz_id: 'quiz-temp',
        type: 'mcq',
        question_text: 'Apa fungsi utama dari hook useEffect pada React?',
        options: [
          'A. Menangani efek samping seperti sinkronisasi data atau subscription',
          'B. Mengubah tipe database menjadi NoSQL',
          'C. Menghapus file di server secara otomatis',
          'D. Mengatur warna tema background secara eksklusif'
        ],
        correct_answer: 'A',
        explanation: 'useEffect digunakan untuk mengeksekusi kode efek samping setelah komponen dirender ke layar.',
        points: 50,
      },
      {
        id: 'q-new-2',
        quiz_id: 'quiz-temp',
        type: 'essay',
        question_text: 'Sebutkan format file pertukaran data berbasis teks standar yang umum digunakan REST API!',
        options: [],
        correct_answer: 'JSON',
        explanation: 'JSON (JavaScript Object Notation) adalah format data pertukaran paling umum.',
        points: 50,
      }
    ]);
    setIsQuizFormOpen(true);
  };

  const handleOpenEditQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setFormTitle(quiz.title);
    setFormSubject(quiz.subject);
    setFormDescription(quiz.description);
    setFormDuration(quiz.duration_minutes);
    setFormPassingScore(quiz.passing_score);
    setFormQuestions(quiz.questions);
    setIsQuizFormOpen(true);
  };

  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || formQuestions.length === 0) return;

    if (editingQuiz) {
      updateQuiz(editingQuiz.id, {
        title: formTitle.trim(),
        subject: formSubject.trim(),
        description: formDescription.trim(),
        duration_minutes: Number(formDuration),
        passing_score: Number(formPassingScore),
        total_questions: formQuestions.length,
        questions: formQuestions,
      });
    } else {
      createQuiz({
        title: formTitle.trim(),
        subject: formSubject.trim(),
        description: formDescription.trim(),
        duration_minutes: Number(formDuration),
        passing_score: Number(formPassingScore),
        total_questions: formQuestions.length,
        questions: formQuestions,
      });
    }

    setIsQuizFormOpen(false);
  };

  // Add question row in form
  const handleAddQuestionToForm = () => {
    const newQ: QuizQuestion = {
      id: 'q-temp-' + Date.now(),
      quiz_id: editingQuiz ? editingQuiz.id : 'temp',
      type: 'mcq',
      question_text: 'Pertanyaan baru...',
      options: ['A. Opsi pertama', 'B. Opsi kedua', 'C. Opsi ketiga', 'D. Opsi keempat'],
      correct_answer: 'A',
      explanation: 'Penjelasan akademis...',
      points: 20,
    };
    setFormQuestions((prev) => [...prev, newQ]);
  };

  const handleRemoveQuestionFromForm = (id: string) => {
    setFormQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // Student specific submissions history
  const myResults = quizResults.filter((r) => r.student_id === currentUser.id);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mb-1">
            <Timer className="w-3.5 h-3.5" />
            <span>Interactive Computer Based Testing (CBT)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Asesmen & Kuis Online Interaktif
          </h1>
          <p className="text-xs text-slate-500">
            Sistem evaluasi pembelajaran digital dengan countdown timer, penilaian otomatis instan, serta pembahasan materi.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={handleOpenCreateQuiz}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Paket Kuis Baru</span>
          </button>
        )}
      </div>

      {/* Teacher Tabs: Paket vs Rekap */}
      {isGuru && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('paket')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'paket'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Daftar Paket Soal ({quizzes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'rekap'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Rekap Skor Ujian Siswa ({quizResults.length})</span>
          </button>
        </div>
      )}

      {/* 1. QUIZ PACKAGES LIST */}
      {(!isGuru || activeTab === 'paket') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {quizzes.map((quiz) => {
            // Check if student has taken this quiz before
            const pastResult = quizResults.find(
              (r) => r.quiz_id === quiz.id && r.student_id === currentUser.id
            );

            return (
              <div
                key={quiz.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {quiz.subject}
                    </span>

                    {/* Past score badge */}
                    {pastResult && (
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                          pastResult.passed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        Skor Terakhir: {pastResult.percentage}% ({pastResult.passed ? 'Lulus' : 'Remidi'})
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {quiz.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-2">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Spec pills */}
                  <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Durasi
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {quiz.duration_minutes} Mnt
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        Soal
                      </span>
                      <span className="text-xs font-extrabold text-slate-800">
                        {quiz.questions.length} Butir
                      </span>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/60">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">
                        KKM
                      </span>
                      <span className="text-xs font-extrabold text-emerald-600">
                        {quiz.passing_score}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition transform hover:scale-[1.02]"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{pastResult ? 'Kerjakan Ulang Kuis' : 'Mulai Pengerjaan Kuis'}</span>
                  </button>

                  {/* Teacher CRUD Actions */}
                  {isGuru && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditQuiz(quiz)}
                        className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100 transition"
                        title="Edit Soal & Kunci"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Hapus kuis "${quiz.title}"?`)) {
                            deleteQuiz(quiz.id);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition"
                        title="Hapus Kuis"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TEACHER REKAP TAB */}
      {isGuru && activeTab === 'rekap' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Rekapitulasi Hasil Pengerjaan Seluruh Siswa ({quizResults.length} Riwayat)
            </h3>
            <span className="text-xs text-slate-500">
              Otomatis dinilai oleh sistem Computer Based Test (CBT)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Paket Kuis</th>
                  <th className="px-4 py-3">Waktu Ujian</th>
                  <th className="px-4 py-3">Durasi</th>
                  <th className="px-4 py-3">Skor / Poin</th>
                  <th className="px-4 py-3">Persentase</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {quizResults.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                      Belum ada siswa yang menyelesaikan kuis.
                    </td>
                  </tr>
                ) : (
                  quizResults.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {result.student_name}
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-medium">
                        {result.quiz_title}
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(result.submitted_at)}
                      </td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                        {Math.floor(result.time_spent_seconds / 60)}m {result.time_spent_seconds % 60}s
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">
                        {result.score} / {result.total_points}
                      </td>
                      <td className="px-4 py-3 font-black text-slate-900">
                        {result.percentage}%
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            result.passed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {result.passed ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Lulus</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Belum Lulus</span>
                            </>
                          )}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. STUDENT RIWAYAT SECTION */}
      {!isGuru && myResults.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Riwayat Evaluasi Pengerjaan Anda</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {myResults.map((res) => (
              <div key={res.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">{res.quiz_title}</p>
                  <p className="text-[11px] text-slate-400">
                    Diselesaikan pada: {formatDate(res.submitted_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-sm">{res.percentage}%</span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      ({res.score} / {res.total_points} Poin)
                    </span>
                  </div>
                  <span
                    className={`font-bold text-[10px] px-2.5 py-0.5 rounded-full ${
                      res.passed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {res.passed ? 'Lulus' : 'Remidi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quiz Runner Modal Component */}
      {runningQuiz && (
        <QuizRunnerModal
          isOpen={Boolean(runningQuiz)}
          onClose={() => setRunningQuiz(null)}
          quiz={runningQuiz}
        />
      )}

      {/* Teacher Create/Edit Quiz Modal */}
      <Modal
        isOpen={isQuizFormOpen}
        onClose={() => setIsQuizFormOpen(false)}
        title={editingQuiz ? 'Edit Paket Kuis & Butir Soal' : 'Buat Paket Kuis Baru'}
        subtitle="Kelola konfigurasi kuis, butir pertanyaan MCQ/Essay, kunci jawaban, dan pembahasan"
        maxWidth="4xl"
      >
        <form onSubmit={handleSaveQuiz} className="space-y-6">
          
          {/* General info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mata Pelajaran:</label>
              <input
                type="text"
                required
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Durasi (Menit):</label>
              <input
                type="number"
                min={1}
                required
                value={formDuration}
                onChange={(e) => setFormDuration(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">KKM Kelulusan (%):</label>
              <input
                type="number"
                min={1}
                max={100}
                required
                value={formPassingScore}
                onChange={(e) => setFormPassingScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Paket Kuis:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Evaluasi Tengah Semester: Pemrograman Web & Database"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Kuis:</label>
            <textarea
              rows={2}
              required
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Question List in Form */}
          <div className="space-y-4 pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daftar Butir Soal ({formQuestions.length} Butir)
              </span>
              <button
                type="button"
                onClick={handleAddQuestionToForm}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold hover:bg-emerald-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal</span>
              </button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
              {formQuestions.map((q, qIdx) => (
                <div key={q.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-slate-800">
                      Soal #{qIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestionFromForm(q.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Hapus soal ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <input
                    type="text"
                    required
                    placeholder="Tuliskan teks pertanyaan soal..."
                    value={q.question_text}
                    onChange={(e) => {
                      const updated = [...formQuestions];
                      updated[qIdx].question_text = e.target.value;
                      setFormQuestions(updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                        Kunci Jawaban Benar (cth: &quot;A&quot; atau &quot;JSON&quot;):
                      </label>
                      <input
                        type="text"
                        required
                        value={q.correct_answer}
                        onChange={(e) => {
                          const updated = [...formQuestions];
                          updated[qIdx].correct_answer = e.target.value;
                          setFormQuestions(updated);
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg font-bold text-emerald-700"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                        Bobot Poin:
                      </label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={q.points}
                        onChange={(e) => {
                          const updated = [...formQuestions];
                          updated[qIdx].points = Number(e.target.value);
                          setFormQuestions(updated);
                        }}
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">
                      Pembahasan Soal Edukatif:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Penjelasan mengapa opsi ini benar..."
                      value={q.explanation}
                      onChange={(e) => {
                        const updated = [...formQuestions];
                        updated[qIdx].explanation = e.target.value;
                        setFormQuestions(updated);
                      }}
                      className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsQuizFormOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
            >
              {editingQuiz ? 'Simpan Perubahan' : 'Terbitkan Paket Kuis'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
