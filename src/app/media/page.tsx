'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { MediaAjar, MediaType } from '@/lib/types';
import { getYoutubeEmbedUrl } from '@/lib/utils';
import { Modal } from '@/components/Modal';
import {
  Clapperboard,
  Video,
  Presentation,
  Image as ImageIcon,
  Cpu,
  Plus,
  Play,
  ExternalLink,
  Trash2,
  Edit3,
  Search,
  Tag,
  Maximize2
} from 'lucide-react';

export default function MediaAjarPage() {
  const {
    currentUser,
    mediaList,
    createMedia,
    updateMedia,
    deleteMedia
  } = usePortal();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activePreview, setActivePreview] = useState<MediaAjar | null>(null);

  // Form CRUD state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaAjar | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formType, setFormType] = useState<MediaType>('youtube');
  const [formCategory, setFormCategory] = useState('Pemrograman Web');
  const [formUrl, setFormUrl] = useState('');
  const [formThumbUrl, setFormThumbUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('React, Next.js');

  const isGuru = currentUser.role === 'guru';

  const typeTabs = [
    { id: 'all', label: 'Semua Media', icon: Clapperboard },
    { id: 'youtube', label: 'Video YouTube', icon: Video },
    { id: 'slide', label: 'Slide Kuliah', icon: Presentation },
    { id: 'infografis', label: 'Infografis', icon: ImageIcon },
    { id: 'simulasi', label: 'Simulasi / Interaktif', icon: Cpu },
  ];

  const handleOpenCreateForm = () => {
    setEditingMedia(null);
    setFormTitle('');
    setFormType('youtube');
    setFormCategory('Pemrograman Web');
    setFormUrl('');
    setFormThumbUrl('');
    setFormDescription('');
    setFormTags('Web Development, Tutorial');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (media: MediaAjar) => {
    setEditingMedia(media);
    setFormTitle(media.title);
    setFormType(media.type);
    setFormCategory(media.category);
    setFormUrl(media.media_url);
    setFormThumbUrl(media.thumbnail_url || '');
    setFormDescription(media.description);
    setFormTags(media.tags.join(', '));
    setIsFormOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formUrl.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingMedia) {
      updateMedia(editingMedia.id, {
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        media_url: formUrl.trim(),
        thumbnail_url: formThumbUrl.trim() || undefined,
        description: formDescription.trim(),
        tags: tagsArray,
      });
    } else {
      createMedia({
        title: formTitle.trim(),
        type: formType,
        category: formCategory,
        media_url: formUrl.trim(),
        thumbnail_url: formThumbUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
        description: formDescription.trim(),
        tags: tagsArray,
      });
    }

    setIsFormOpen(false);
  };

  // Filter media
  const filteredMedia = mediaList.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const getMediaTypeBadge = (type: MediaType) => {
    switch (type) {
      case 'youtube':
        return { label: 'Video YouTube', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'slide':
        return { label: 'Slide Kuliah', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'infografis':
        return { label: 'Infografis', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'simulasi':
        return { label: 'Simulasi Interaktif', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full mb-1">
            <Clapperboard className="w-3.5 h-3.5" />
            <span>Interactive Multimedia Gallery</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Galeri Media Ajar Interaktif
          </h1>
          <p className="text-xs text-slate-500">
            Kumpulan video tutorial YouTube, slide materi presentasi perkuliahan, infografis dan simulasi visual.
          </p>
        </div>

        {isGuru && (
          <button
            onClick={handleOpenCreateForm}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition transform hover:scale-[1.02] shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Media Baru</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {typeTabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = selectedType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul media, tag (misal: Next.js, Database), atau penjelasan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMedia.map((item) => {
          const badge = getMediaTypeBadge(item.type);

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail / Preview container */}
                <div
                  onClick={() => setActivePreview(item)}
                  className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden group-hover:opacity-95 transition"
                >
                  <img
                    src={
                      item.thumbnail_url ||
                      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      {item.type === 'youtube' ? (
                        <Play className="w-5 h-5 fill-purple-600 translate-x-0.5" />
                      ) : (
                        <Maximize2 className="w-5 h-5" />
                      )}
                    </div>
                  </div>

                  {/* Badge top-left */}
                  <span
                    className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-xs ${badge.bg}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Content info */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-semibold uppercase">
                    <span>{item.category}</span>
                  </div>
                  <h3
                    onClick={() => setActivePreview(item)}
                    className="text-sm font-bold text-slate-900 group-hover:text-purple-600 transition cursor-pointer line-clamp-2 leading-snug"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-400" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-4 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActivePreview(item)}
                  className="font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <span>Buka Media</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                {isGuru && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditForm(item)}
                      className="p-1 text-slate-400 hover:text-blue-600 rounded transition"
                      title="Edit Media"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Hapus media "${item.title}"?`)) {
                          deleteMedia(item.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                      title="Hapus Media"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Interactive Player / Viewer */}
      {activePreview && (
        <Modal
          isOpen={Boolean(activePreview)}
          onClose={() => setActivePreview(null)}
          title={activePreview.title}
          subtitle={`Kategori: ${activePreview.category} • Tipe: ${activePreview.type.toUpperCase()}`}
          maxWidth="5xl"
        >
          <div className="space-y-4">
            
            {/* Player Container */}
            <div className="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
              {activePreview.type === 'youtube' ? (
                <iframe
                  src={getYoutubeEmbedUrl(activePreview.media_url) || activePreview.media_url}
                  title={activePreview.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              ) : (
                <img
                  src={activePreview.media_url}
                  alt={activePreview.title}
                  className="w-full h-full object-contain"
                />
              )}
            </div>

            {/* Media Information */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-base font-bold text-slate-900">{activePreview.title}</h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {activePreview.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activePreview.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <a
                href={activePreview.media_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-purple-600"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Tautan Asli / Sumber</span>
              </a>

              <button
                onClick={() => setActivePreview(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold"
              >
                Tutup
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* Modal CRUD Tambah / Edit Media (Guru) */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingMedia ? 'Edit Media Ajar' : 'Tambah Media Ajar Baru'}
        subtitle="Unggah tautan video YouTube, slide materi presentasi, atau infografis"
        maxWidth="2xl"
      >
        <form onSubmit={handleSaveMedia} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Media:</label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value as MediaType)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="youtube">🎬 Video YouTube</option>
                <option value="slide">📊 Slide Kuliah / Dokumen PPT</option>
                <option value="infografis">🖼️ Infografis / Gambar High-Res</option>
                <option value="simulasi">⚙️ Simulasi / Interaktif</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategori:</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="Pemrograman Web">Pemrograman Web</option>
                <option value="Basis Data">Basis Data</option>
                <option value="Algoritma & Struktur Data">Algoritma & Struktur Data</option>
                <option value="Jaringan Komputer">Jaringan Komputer</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Judul Media Ajar:</label>
            <input
              type="text"
              required
              placeholder="Contoh: Video Tutorial Lengkap React Server Components"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL Media (YouTube Link atau Gambar):
            </label>
            <input
              type="url"
              required
              placeholder="https://www.youtube.com/watch?v=... atau https://..."
              value={formUrl}
              onChange={(e) => setFormUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              URL Thumbnail Pratinjau (Opsional):
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/... (Kosongkan jika otomatis)"
              value={formThumbUrl}
              onChange={(e) => setFormThumbUrl(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Deskripsi Singkat Pembelajaran:
            </label>
            <textarea
              rows={3}
              required
              placeholder="Jelaskan ringkasan materi atau tujuan dari media ini..."
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tag Materi (Pisahkan dengan koma):
            </label>
            <input
              type="text"
              placeholder="Next.js, Tailwind, Fullstack"
              value={formTags}
              onChange={(e) => setFormTags(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
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
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-md shadow-purple-500/20"
            >
              {editingMedia ? 'Simpan Perubahan' : 'Terbitkan Media'}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
