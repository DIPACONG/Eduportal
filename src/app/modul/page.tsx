'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { EModul } from '@/lib/types';
import { Modal } from '@/components/Modal';
import { PdfViewerModal } from '@/components/PdfViewerModal';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  Clock,
  FileText,
  Eye,
  Download,
  Trash2,
  Edit3,
  Search,
  Sparkles,
  BookmarkCheck,
  Check
} from 'lucide-react';

export default function EModulPage() {
  const {
    currentUser,
    modules,
    completedModuleIds,
    createModule,
    updateModule,
    deleteModule,
    toggleModuleComplete
  } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Viewer state
  const [readingModule, setReadingModule] = useState<EModul | null>(null);
  const [pdfPreviewModule, setPdfPreviewModule] = useState<EModul | null>(null);

  // Form CRUD state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<EModul | null>(null);
  const [formChapter, setFormChapter] = useState(1);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Pemrograman Web');
  const [formReadTime, setFormReadTime] = useState(20);
  const [formDescription, setFormDescription] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formPdfUrl, setFormPdfUrl] = useState('');
  const [formPdfName, setFormPdfName] = useState('');

  const isGuru = currentUser.role === 'guru';

  const categories = ['Semua', 'Pemrograman Web', 'Basis Data', 'Asesmen & Evaluasi'];

  // Handle open form
  const handleOpenCreateForm = () => {
    setEditingModule(null);
    setFormChapter(modules.length + 1);
    setFormTitle('');
    setFormCategory('Pemrograman Web');
    setFormReadTime(20);
    setFormDescription('');
    setFormContent('');
    setFormPdfUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
    setFormPdfName(`Modul_0${modules.length + 1}_Materi_Ajar.pdf`);
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (mod: EModul) => {
    setEditingModule(mod);
    setFormChapter(mod.chapter);
    setFormTitle(mod.title);
    setFormCategory(mod.category);
    setFormReadTime(mod.read_time_minutes);
    setFormDescription(mod.description);
    setFormContent(mod.content);
    setFormPdfUrl(mod.pdf_url || '');
    setFormPdfName(mod.pdf_name || '');
    setIsFormOpen(true);
  };

  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingModule) {
      updateModule(editingModule.id, {
        chapter: Number(formChapter),
        title: formTitle.trim(),
        category: formCategory,
        read_time_minutes: Number(formReadTime),
        description: formDescription.trim(),
        content: formContent.trim(),
        pdf_url: formPdfUrl.trim(),
        pdf_name: formPdfName.trim() || 'Modul_Ajar.pdf',
      });
    } else {
      createModule({
        chapter: Number(formChapter),
        title: formTitle.trim(),
        category: formCategory,
        read_time_minutes: Number(formReadTime),
        description: formDescription.trim(),
        content: formContent.trim(),
        pdf_url: formPdfUrl.trim() || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        pdf_name: formPdfName.trim() || `Modul_0${formChapter}.pdf`,
      });
    }

    setIsFormOpen(false);
  };

  // Filter modules
  const filteredModules = modules.filter((m) => {
    const matchesCategory = selectedCategory === 'Semua' || m.category === selectedCategory;
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate completion percentage
  const completionPercentage = modules.length > 0
    ? Math.round((completedModuleIds.length / modules.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      
      {/* Header & Progress Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Learning Modules</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            E-Modul Pembelajaran Digital
          </h1>
          <p className="text-xs text-slate-500">
            Akses materi ajar lengkap terstruktur, baca langsung secara daring, dan unduh berkas modul PDF.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={handleOpenCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Modul Baru</span>
          </button>
        )}
      </div>

      {/* Student Reading Progress Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Progres Membaca Modul
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black text-slate-900">
                {completedModuleIds.length} dari {modules.length} Bab Selesai
              </span>
              <span className="text-xs font-bold text-brand-600">({completionPercentage}%)</span>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-64 space-y-1.5">
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-600 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-400 text-right font-medium">
            Tandai selesai untuk menyimpan progres belajar
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul modul, bab, atau materi pembelajaran..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Module Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredModules.map((mod) => {
          const isCompleted = completedModuleIds.includes(mod.id);

          return (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 sm:p-6 space-y-3">
                {/* Chapter & Status Header */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-100">
                    Bab {mod.chapter}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{mod.read_time_minutes} mnt</span>
                    </span>

                    {/* Completion status pill */}
                    <button
                      onClick={() => toggleModuleComplete(mod.id)}
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border transition ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                      }`}
                      title="Klik untuk mengubah status selesai dibaca"
                    >
                      <CheckCircle2
                        className={`w-3.5 h-3.5 ${
                          isCompleted ? 'text-emerald-600 fill-emerald-100' : 'text-slate-400'
                        }`}
                      />
                      <span>{isCompleted ? 'Selesai' : 'Belum'}</span>
                    </button>
                  </div>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition leading-snug">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed line-clamp-3">
                    {mod.description}
                  </p>
                </div>

                {/* PDF info badge */}
                {mod.pdf_name && (
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600">
                    <FileText className="w-4 h-4 text-rose-500 shrink-0" />
                    <span className="truncate text-[11px] font-medium">{mod.pdf_name}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Bar */}
              <div className="px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Read Article */}
                  <button
                    onClick={() => setReadingModule(mod)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 text-xs font-bold text-slate-700 shadow-2xs transition"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-brand-600" />
                    <span>Baca Modul</span>
                  </button>

                  {/* Preview PDF */}
                  <button
                    onClick={() => setPdfPreviewModule(mod)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat PDF</span>
                  </button>
                </div>

                {/* Teacher CRUD Actions */}
                {isGuru && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditForm(mod)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit Modul"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus modul "Bab ${mod.chapter}: ${mod.title}"?`)) {
                          deleteModule(mod.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Hapus Modul"
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

      {/* Modal Baca Modul Online */}
      {readingModule && (
        <Modal
          isOpen={Boolean(readingModule)}
          onClose={() => setReadingModule(null)}
          title={`Bab ${readingModule.chapter}: ${readingModule.title}`}
          subtitle={`Estimasi waktu: ${readingModule.read_time_minutes} Menit • Kategori: ${readingModule.category}`}
          maxWidth="4xl"
        >
          <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <button
                onClick={() => toggleModuleComplete(readingModule.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                  completedModuleIds.includes(readingModule.id)
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-emerald-300'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>
                  {completedModuleIds.includes(readingModule.id)
                    ? 'Sudah Selesai Dibaca'
                    : 'Tandai Selesai Dibaca'}
                </span>
              </button>

              <button
                onClick={() => setPdfPreviewModule(readingModule)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold transition"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Buka PDF Dokumen</span>
              </button>
            </div>

            {/* Formatted Article Content */}
            <div className="prose max-w-none text-slate-800 text-sm leading-relaxed space-y-4 font-sans whitespace-pre-line bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              {readingModule.content}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReadingModule(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Tutup Modul
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Preview PDF */}
      {pdfPreviewModule && (
        <PdfViewerModal
          isOpen={Boolean(pdfPreviewModule)}
          onClose={() => setPdfPreviewModule(null)}
          title={`Bab ${pdfPreviewModule.chapter}: ${pdfPreviewModule.title}`}
          pdfUrl={pdfPreviewModule.pdf_url}
          pdfName={pdfPreviewModule.pdf_name}
        />
      )}

      {/* Modal CRUD Tambah / Edit Modul (Guru) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingModule ? 'Edit E-Modul Pembelajaran' : 'Tambah E-Modul Baru'}
        subtitle="Kelola materi digital, isi teks modul, dan lampirkan file PDF dokumen"
        maxWidth="3xl"
      >
        <form onSubmit={handleSaveModule} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nomor Bab:</label>
              <input
                type="number"
                min={1}
                required
                value={formChapter}
                onChange={(e) => setFormChapter(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Materi:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Pemrograman Web">Pemrograman Web</option>
                <option value="Basis Data">Basis Data</option>
                <option value="Algoritma & Struktur Data">Algoritma & Struktur Data</option>
                <option value="Asesmen & Evaluasi">Asesmen & Evaluasi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Estimasi Baca (Menit):
              </label>
              <input
                type="number"
                min={5}
                required
                value={formReadTime}
                onChange={(e) => setFormReadTime(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Modul:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Arsitektur Modern Web & Next.js App Router"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Ringkas:
            </label>
            <textarea
              rows={2}
              required
              placeholder="Ringkasan poin kunci yang akan dipelajari siswa..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Isi Teks Artikel Modul:
            </label>
            <textarea
              rows={6}
              required
              placeholder="Tulis materi penjelasan teori, langkah-langkah praktikum, atau kode contoh..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Berkas PDF:
              </label>
              <input
                type="text"
                placeholder="Modul_01_Materi.pdf"
                value={formPdfName}
                onChange={(e) => setFormPdfName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                URL Berkas Dokumen PDF:
              </label>
              <input
                type="url"
                placeholder="https://... atau Supabase Storage URL"
                value={formPdfUrl}
                onChange={(e) => setFormPdfUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20"
            >
              {editingModule ? 'Simpan Perubahan' : 'Terbitkan Modul'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
