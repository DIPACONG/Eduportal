'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { LkmAssignment, LkmSubmission } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import {
  FileCheck2,
  Plus,
  Calendar,
  Clock,
  Download,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  FileText,
  UserCheck,
  Edit3,
  Trash2,
  Award,
  Send,
  MessageSquareQuote
} from 'lucide-react';

export default function LkmPage() {
  const {
    currentUser,
    lkms,
    submissions,
    createLkm,
    updateLkm,
    deleteLkm,
    submitLkmWork,
    gradeSubmission
  } = usePortal();

  const isGuru = currentUser.role === 'guru';
  const [activeTab, setActiveTab] = useState<'tugas' | 'pengumpulan'>('tugas');

  // Student submission modal
  const [submittingLkm, setSubmittingLkm] = useState<LkmAssignment | null>(null);
  const [studentAnswerText, setStudentAnswerText] = useState('');
  const [studentFileName, setStudentFileName] = useState('');
  const [studentFileUrl, setStudentFileUrl] = useState('');

  // Teacher grading modal
  const [gradingSub, setGradingSub] = useState<LkmSubmission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(90);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  // Teacher create/edit LKM modal
  const [isLkmFormOpen, setIsLkmFormOpen] = useState(false);
  const [editingLkm, setEditingLkm] = useState<LkmAssignment | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState('Pemrograman Web Lanjutan');
  const [formDescription, setFormDescription] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formAttachmentName, setFormAttachmentName] = useState('Panduan_Tugas_LKM.pdf');
  const [formAttachmentUrl, setFormAttachmentUrl] = useState('');

  // Open submit form for student
  const handleOpenSubmitForm = (lkm: LkmAssignment) => {
    setSubmittingLkm(lkm);
    // Find existing submission if any
    const existing = submissions.find(
      (s) => s.assignment_id === lkm.id && s.student_id === currentUser.id
    );
    if (existing) {
      setStudentAnswerText(existing.content_text);
      setStudentFileName(existing.attachment_name || '');
      setStudentFileUrl(existing.attachment_url || '');
    } else {
      setStudentAnswerText('');
      setStudentFileName(`Laporan_${currentUser.full_name.replace(/\s+/g, '_')}_${lkm.id}.pdf`);
      setStudentFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    }
  };

  const handleSaveStudentSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingLkm || !studentAnswerText.trim()) return;

    submitLkmWork(
      submittingLkm.id,
      studentAnswerText.trim(),
      studentFileName.trim() || undefined,
      studentFileUrl.trim() || undefined
    );

    setSubmittingLkm(null);
  };

  // Open grading modal for teacher
  const handleOpenGradeModal = (sub: LkmSubmission) => {
    setGradingSub(sub);
    setGradeScore(sub.score || 85);
    setGradeFeedback(sub.feedback || 'Kerja bagus, analisis konsep dan implementasi sudah tepat.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSub) return;

    gradeSubmission(gradingSub.id, Number(gradeScore), gradeFeedback.trim());
    setGradingSub(null);
  };

  // Open create/edit LKM form for teacher
  const handleOpenCreateLkm = () => {
    setEditingLkm(null);
    setFormTitle('');
    setFormSubject('Pemrograman Web Lanjutan');
    setFormDescription('');
    const defaultDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 16);
    setFormDeadline(defaultDate);
    setFormAttachmentName('Panduan_Instruksi_LKM.pdf');
    setFormAttachmentUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setIsLkmFormOpen(true);
  };

  const handleOpenEditLkm = (lkm: LkmAssignment) => {
    setEditingLkm(lkm);
    setFormTitle(lkm.title);
    setFormSubject(lkm.subject);
    setFormDescription(lkm.description);
    setFormDeadline(new Date(lkm.deadline).toISOString().slice(0, 16));
    setFormAttachmentName(lkm.attachment_name || '');
    setFormAttachmentUrl(lkm.attachment_url || '');
    setIsLkmFormOpen(true);
  };

  const handleSaveLkm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingLkm) {
      updateLkm(editingLkm.id, {
        title: formTitle.trim(),
        subject: formSubject.trim(),
        description: formDescription.trim(),
        deadline: new Date(formDeadline).toISOString(),
        attachment_name: formAttachmentName.trim() || undefined,
        attachment_url: formAttachmentUrl.trim() || undefined,
      });
    } else {
      createLkm({
        title: formTitle.trim(),
        subject: formSubject.trim(),
        description: formDescription.trim(),
        deadline: new Date(formDeadline).toISOString(),
        max_score: 100,
        attachment_name: formAttachmentName.trim() || undefined,
        attachment_url: formAttachmentUrl.trim() || undefined,
      });
    }

    setIsLkmFormOpen(false);
  };

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full mb-1">
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Student Worksheet & Assignment Portal</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            LKM (Lembar Kerja Murid / Mahasiswa)
          </h1>
          <p className="text-xs text-slate-500">
            Pengerjaan tugas berbasis instruksi kerja, pengumpulan laporan berkas digital, serta rekap penilaian & umpan balik dosen.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={handleOpenCreateLkm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-500/20 transition transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Tugas LKM Baru</span>
          </button>
        )}
      </div>

      {/* Teacher Tabs: Tugas vs Pengumpulan */}
      {isGuru && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('tugas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'tugas'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Daftar Tugas LKM ({lkms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pengumpulan')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'pengumpulan'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Daftar Pengumpulan Siswa</span>
            {pendingCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[10px] font-extrabold">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* TAB 1: LIST TUGAS LKM */}
      {(!isGuru || activeTab === 'tugas') && (
        <div className="space-y-4">
          {lkms.map((lkm) => {
            // Find current student submission
            const mySub = submissions.find(
              (s) => s.assignment_id === lkm.id && s.student_id === currentUser.id
            );

            return (
              <div
                key={lkm.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-6 space-y-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                      {lkm.subject}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                      {lkm.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                      <span>Batas: {formatDate(lkm.deadline)}</span>
                    </div>

                    {isGuru && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditLkm(lkm)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-100"
                          title="Edit LKM"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus tugas LKM "${lkm.title}"?`)) {
                              deleteLkm(lkm.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                          title="Hapus LKM"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {lkm.description}
                </p>

                {/* Attachment file from teacher */}
                {lkm.attachment_url && (
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="w-4 h-4 text-amber-600 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-800 truncate">
                          {lkm.attachment_name || 'Berkas_Panduan_LKM.pdf'}
                        </p>
                        <span className="text-[10px] text-slate-400 font-medium">
                          Lampiran Panduan Resmi Guru
                        </span>
                      </div>
                    </div>
                    <a
                      href={lkm.attachment_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition"
                    >
                      <Download className="w-3 h-3 text-amber-600" />
                      <span>Unduh File</span>
                    </a>
                  </div>
                )}

                {/* Student Submission Status Card & Action */}
                {!isGuru && (
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      {mySub ? (
                        mySub.status === 'graded' ? (
                          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-xs font-bold text-emerald-900">
                                Sudah Dinilai: {mySub.score} / {lkm.max_score}
                              </span>
                            </div>
                            {mySub.feedback && (
                              <p className="text-[11px] text-emerald-800 italic">
                                &quot;{mySub.feedback}&quot;
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>Tugas Telah Dikumpulkan (Menunggu Penilaian Guru)</span>
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
                          <AlertCircle className="w-4 h-4 text-rose-500" />
                          <span>Anda belum mengumpulkan tugas ini</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenSubmitForm(lkm)}
                      className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition transform hover:scale-[1.02] shrink-0"
                    >
                      <UploadCloud className="w-4 h-4" />
                      <span>{mySub ? 'Perbarui Pengumpulan' : 'Kumpulkan Tugas LKM'}</span>
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TEACHER GRADING RECAP TABLE */}
      {isGuru && activeTab === 'pengumpulan' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">
              Rekapitulasi Pengumpulan Tugas Siswa ({submissions.length} Pengumpulan)
            </h3>
            <span className="text-xs text-slate-500">
              Klik &quot;Beri Nilai&quot; untuk menginput skor dan umpan balik
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Nama Siswa</th>
                  <th className="px-4 py-3">Tugas LKM</th>
                  <th className="px-4 py-3">Waktu Kumpul</th>
                  <th className="px-4 py-3">File Lampiran</th>
                  <th className="px-4 py-3">Status / Nilai</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {submissions.map((sub) => {
                  const targetLkm = lkms.find((l) => l.id === sub.assignment_id);

                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/80 transition">
                      {/* Student info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={sub.student_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80'}
                            alt={sub.student_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{sub.student_name}</p>
                            <p className="text-[10px] text-slate-400">{sub.student_email}</p>
                          </div>
                        </div>
                      </td>

                      {/* LKM Title */}
                      <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">
                        {targetLkm ? targetLkm.title : 'Tugas LKM'}
                      </td>

                      {/* Submitted at */}
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {formatDate(sub.submitted_at)}
                      </td>

                      {/* Attachment file */}
                      <td className="px-4 py-3">
                        {sub.attachment_url ? (
                          <a
                            href={sub.attachment_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-brand-600 hover:text-brand-700 font-semibold"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span className="truncate max-w-[120px]">
                              {sub.attachment_name || 'File.pdf'}
                            </span>
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">Hanya teks</span>
                        )}
                      </td>

                      {/* Status / Grade */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {sub.status === 'graded' ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Nilai: {sub.score}/100</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Perlu Dinilai</span>
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenGradeModal(sub)}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-2xs transition"
                        >
                          {sub.status === 'graded' ? 'Ubah Nilai' : 'Beri Nilai'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Pengumpulan Jawaban LKM (Siswa) */}
      {submittingLkm && (
        <Modal
          isOpen={Boolean(submittingLkm)}
          onClose={() => setSubmittingLkm(null)}
          title={`Pengumpulan: ${submittingLkm.title}`}
          subtitle="Isi uraian jawaban tertulis dan lampirkan file dokumen hasil pengerjaan (PDF/DOCX/Gambar)"
          maxWidth="3xl"
        >
          <form onSubmit={handleSaveStudentSubmission} className="space-y-4">
            
            {/* Task Info Summary */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <span className="font-bold text-slate-800">Petunjuk Tugas:</span>
              <p>{submittingLkm.description}</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Uraian Jawaban / Laporan Tertulis:
              </label>
              <textarea
                rows={6}
                required
                placeholder="Tuliskan analisis, ringkasan jawaban, penjelasan langkah kerja, atau kesimpulan..."
                value={studentAnswerText}
                onChange={(e) => setStudentAnswerText(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Berkas Lampiran:
                </label>
                <input
                  type="text"
                  placeholder="Laporan_Tugas_Rizky.pdf"
                  value={studentFileName}
                  onChange={(e) => setStudentFileName(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL / Simpanan File Cloud (Supabase Storage):
                </label>
                <input
                  type="url"
                  placeholder="https://... atau Cloud Storage URL"
                  value={studentFileUrl}
                  onChange={(e) => setStudentFileUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubmittingLkm(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Kirim Jawaban Tugas</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Penilaian & Feedback Guru */}
      {gradingSub && (
        <Modal
          isOpen={Boolean(gradingSub)}
          onClose={() => setGradingSub(null)}
          title={`Penilaian Tugas: ${gradingSub.student_name}`}
          subtitle={`Waktu pengumpulan: ${formatDate(gradingSub.submitted_at)}`}
          maxWidth="2xl"
        >
          <form onSubmit={handleSaveGrade} className="space-y-4">
            
            {/* Student answer preview */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-800">Jawaban Mahasiswa:</span>
              <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto">
                {gradingSub.content_text}
              </p>

              {gradingSub.attachment_url && (
                <div className="pt-2 border-t border-slate-200">
                  <a
                    href={gradingSub.attachment_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Lihat / Unduh Berkas: {gradingSub.attachment_name || 'Berkas.pdf'}</span>
                  </a>
                </div>
              )}
            </div>

            {/* Score input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nilai Siswa (Skala 0 - 100):
              </label>
              <input
                type="number"
                min={0}
                max={100}
                required
                value={gradeScore}
                onChange={(e) => setGradeScore(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm font-extrabold text-brand-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Constructive feedback */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Catatan Umpan Balik (Feedback Guru):
              </label>
              <textarea
                rows={3}
                required
                placeholder="Berikan catatan perbaikan, apresiasi pengerjaan, atau masukan teknis..."
                value={gradeFeedback}
                onChange={(e) => setGradeFeedback(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setGradingSub(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20"
              >
                <Award className="w-3.5 h-3.5" />
                <span>Simpan Nilai & Feedback</span>
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal Buat / Edit Tugas LKM (Guru) */}
      <Modal
        isOpen={isLkmFormOpen}
        onClose={() => setIsLkmFormOpen(false)}
        title={editingLkm ? 'Edit Tugas LKM' : 'Buat Tugas LKM Baru'}
        subtitle="Rancang instruksi lembar kerja murid dan tentukan tenggat waktu pengumpulan"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveLkm} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Mata Kuliah / Pelajaran:
              </label>
              <input
                type="text"
                required
                value={formSubject}
                onChange={(e) => setFormSubject(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tenggat Waktu (Batas Pengumpulan):
              </label>
              <input
                type="datetime-local"
                required
                value={formDeadline}
                onChange={(e) => setFormDeadline(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Tugas LKM:</label>
            <input
              type="text"
              required
              placeholder="Contoh: LKM 03 - Desain Arsitektur Microservices & Database Sharding"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Petunjuk Soal & Instruksi Kerja:
            </label>
            <textarea
              rows={5}
              required
              placeholder="Tuliskan butir-butir tugas, kriteria penilaian, dan format pengerjaan yang diinginkan..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama File Lampiran Panduan (Opsional):
              </label>
              <input
                type="text"
                placeholder="Panduan_Tugas.pdf"
                value={formAttachmentName}
                onChange={(e) => setFormAttachmentName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Lampiran Panduan:
              </label>
              <input
                type="url"
                placeholder="https://... atau Supabase Storage URL"
                value={formAttachmentUrl}
                onChange={(e) => setFormAttachmentUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsLkmFormOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md shadow-amber-500/20"
            >
              {editingLkm ? 'Simpan Perubahan' : 'Terbitkan Tugas LKM'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
