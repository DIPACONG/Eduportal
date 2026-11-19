'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Quiz, QuizQuestion } from '@/lib/types';
import { usePortal } from '@/lib/store';
import { triggerConfetti } from '@/lib/utils';
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Send,
  RotateCcw,
  BookOpen
} from 'lucide-react';

interface QuizRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  quiz: Quiz;
}

export const QuizRunnerModal: React.FC<QuizRunnerModalProps> = ({
  isOpen,
  onClose,
  quiz,
}) => {
  const { recordQuizResult } = usePortal();

  const [phase, setPhase] = useState<'intro' | 'running' | 'completed'>('intro');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(quiz.duration_minutes * 60);
  const [calculatedScore, setCalculatedScore] = useState<{
    score: number;
    total: number;
    percentage: number;
    passed: boolean;
    timeSpent: number;
  } | null>(null);

  // Timer countdown during 'running'
  useEffect(() => {
    if (phase !== 'running' || !isOpen) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, timeLeft, isOpen]);

  // Reset state when opening/closing
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setCurrentIdx(0);
      setAnswers({});
      setTimeLeft(quiz.duration_minutes * 60);
      setCalculatedScore(null);
    }
  }, [isOpen, quiz]);

  const handleStart = () => {
    setPhase('running');
    setTimeLeft(quiz.duration_minutes * 60);
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleFinishQuiz = () => {
    // Grade the answers automatically
    let totalScore = 0;
    let maxScore = 0;

    quiz.questions.forEach((q) => {
      maxScore += q.points;
      const studentAns = (answers[q.id] || '').trim().toLowerCase();
      const correctAns = q.correct_answer.trim().toLowerCase();

      if (q.type === 'mcq') {
        // MCQ answer could be "A" or the first char
        if (studentAns === correctAns || studentAns.startsWith(correctAns)) {
          totalScore += q.points;
        }
      } else {
        // Essay / short answer case-insensitive match or contains
        if (studentAns.length > 0 && (studentAns === correctAns || studentAns.includes(correctAns))) {
          totalScore += q.points;
        }
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const passed = percentage >= quiz.passing_score;
    const timeSpent = quiz.duration_minutes * 60 - timeLeft;

    setCalculatedScore({
      score: totalScore,
      total: maxScore,
      percentage,
      passed,
      timeSpent,
    });

    recordQuizResult({
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      score: totalScore,
      total_points: maxScore,
      percentage,
      passed,
      time_spent_seconds: timeSpent,
      answers,
    });

    setPhase('completed');
    if (passed) {
      triggerConfetti();
    }
  };

  // Format MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion: QuizQuestion = quiz.questions[currentIdx];
  const isTimeLow = timeLeft < 120; // less than 2 minutes

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={quiz.title}
      subtitle={`Mata Pelajaran: ${quiz.subject} • KKM: ${quiz.passing_score}%`}
      maxWidth="4xl"
    >
      {/* 1. INTRO SCREEN */}
      {phase === 'intro' && (
        <div className="text-center py-6 px-4 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto shadow-inner">
            <Timer className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h4 className="text-xl font-bold text-slate-800">{quiz.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{quiz.description}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto text-center">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Jumlah Soal</span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{quiz.questions.length} Butir</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Waktu Ujian</span>
              <p className="text-base font-extrabold text-slate-800 mt-0.5">{quiz.duration_minutes} Menit</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Standar KKM</span>
              <p className="text-base font-extrabold text-emerald-600 mt-0.5">{quiz.passing_score}%</p>
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl max-w-lg mx-auto text-xs text-amber-800 text-left flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Pastikan koneksi internet stabil. Timer akan langsung berjalan mundur saat Anda menekan tombol di bawah. Kuis akan otomatis dikumpulkan saat waktu habis.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStart}
              className="px-8 py-3 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-500/25 transition transform hover:scale-[1.02]"
            >
              Mulai Pengerjaan Kuis Sekarang
            </button>
          </div>
        </div>
      )}

      {/* 2. RUNNING QUIZ SCREEN */}
      {phase === 'running' && currentQuestion && (
        <div className="space-y-6">
          {/* Top Bar: Progress & Timer */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Soal Nomor:</span>
              <span className="text-sm font-extrabold text-brand-600">
                {currentIdx + 1} <span className="text-slate-400 font-normal">/ {quiz.questions.length}</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                Bobot: {currentQuestion.points} Poin
              </span>
            </div>

            {/* Countdown timer */}
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-bold text-sm shadow-xs ${
                isTimeLow
                  ? 'bg-rose-100 text-rose-700 border border-rose-300 animate-pulse'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              <Timer className={`w-4 h-4 ${isTimeLow ? 'text-rose-600' : 'text-brand-600'}`} />
              <span>Sisa Waktu: {formatTimer(timeLeft)}</span>
            </div>
          </div>

          {/* Question Navigator Pills */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {quiz.questions.map((q, idx) => {
              const isAnswered = Boolean(answers[q.id]);
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                    isCurrent
                      ? 'bg-brand-600 text-white shadow-md'
                      : isAnswered
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-4">
            <div className="text-sm sm:text-base font-semibold text-slate-900 leading-relaxed">
              {currentIdx + 1}. {currentQuestion.question_text}
            </div>

            {/* MCQ Options */}
            {currentQuestion.type === 'mcq' && (
              <div className="space-y-2.5 pt-2">
                {currentQuestion.options.map((opt, optIdx) => {
                  const optLetter = opt.charAt(0); // "A", "B", "C", "D"
                  const isSelected = answers[currentQuestion.id] === optLetter;

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectAnswer(currentQuestion.id, optLetter)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 text-brand-900 font-medium ring-2 ring-brand-500/20'
                          : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-600'
                        }`}
                      >
                        {optLetter}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Essay / Short answer */}
            {currentQuestion.type === 'essay' && (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-600">
                  Tuliskan Jawaban Singkat Anda:
                </label>
                <textarea
                  rows={3}
                  value={answers[currentQuestion.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQuestion.id, e.target.value)}
                  placeholder="Ketik jawaban Anda di sini secara tepat dan ringkas..."
                  className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentIdx < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-sm"
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm('Apakah Anda yakin sudah memeriksa seluruh jawaban dan ingin mengumpulkan kuis ini?')) {
                    handleFinishQuiz();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-500/20"
              >
                <Send className="w-4 h-4" />
                <span>Kumpulkan Jawaban Kuis</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. COMPLETED EVALUATION SCREEN */}
      {phase === 'completed' && calculatedScore && (
        <div className="space-y-6 py-2">
          
          {/* Result Banner */}
          <div
            className={`p-6 rounded-2xl border text-center space-y-3 ${
              calculatedScore.passed
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200'
                : 'bg-gradient-to-br from-rose-50 to-amber-50 border-rose-200'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-md ${
                calculatedScore.passed
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {calculatedScore.passed ? (
                <Award className="w-8 h-8" />
              ) : (
                <XCircle className="w-8 h-8" />
              )}
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Hasil Evaluasi Kuis
              </span>
              <h4 className="text-2xl font-black text-slate-900 mt-0.5">
                {calculatedScore.passed ? '🎉 Selamat, Anda Lulus!' : 'Perlu Belajar Lagi'}
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                {calculatedScore.passed
                  ? 'Pemahaman materi Anda sangat baik dan telah memenuhi standar KKM.'
                  : 'Skor Anda belum mencapai ambang batas KKM. Pelajari modul kembali.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto pt-2">
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Skor Akhir</span>
                <p className="text-lg font-black text-slate-900">
                  {calculatedScore.score} / {calculatedScore.total}
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Persentase</span>
                <p
                  className={`text-lg font-black ${
                    calculatedScore.passed ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {calculatedScore.percentage}%
                </p>
              </div>
              <div className="p-2.5 bg-white rounded-xl shadow-xs border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Durasi Pengerjaan</span>
                <p className="text-lg font-black text-slate-800">
                  {formatTimer(calculatedScore.timeSpent)}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Question Review & Academic Explanations */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Pembahasan Butir Soal Terperinci</span>
            </div>

            <div className="space-y-4">
              {quiz.questions.map((q, idx) => {
                const studentAns = (answers[q.id] || '').trim().toLowerCase();
                const correctAns = q.correct_answer.trim().toLowerCase();
                const isCorrect =
                  q.type === 'mcq'
                    ? studentAns === correctAns || studentAns.startsWith(correctAns)
                    : studentAns.length > 0 &&
                      (studentAns === correctAns || studentAns.includes(correctAns));

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2.5 ${
                      isCorrect
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-rose-50/50 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-semibold text-slate-800 text-xs sm:text-sm">
                        {idx + 1}. {q.question_text}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full text-[11px] shrink-0 ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>+{q.points} Poin</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            <span>0 Poin</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Jawaban Anda:
                        </span>
                        <span
                          className={`font-semibold ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {answers[q.id] || '(Kosong / Tidak dijawab)'}
                        </span>
                      </div>
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          Kunci Jawaban Benar:
                        </span>
                        <span className="font-semibold text-emerald-700">
                          {q.correct_answer}
                        </span>
                      </div>
                    </div>

                    {/* Academic Explanation */}
                    <div className="p-2.5 bg-white/80 rounded-lg border border-slate-200 text-slate-600 leading-relaxed text-[11px]">
                      <strong className="text-slate-800">💡 Pembahasan: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => {
                setPhase('running');
                setTimeLeft(quiz.duration_minutes * 60);
                setAnswers({});
                setCurrentIdx(0);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Coba Ulang Kuis</span>
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition"
            >
              Selesai & Tutup
            </button>
          </div>

        </div>
      )}
    </Modal>
  );
};
