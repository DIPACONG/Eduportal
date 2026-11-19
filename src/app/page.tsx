'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { ForumPost } from '@/lib/types';
import { ForumPostCard } from '@/components/ForumPostCard';
import { Modal } from '@/components/Modal';
import {
  MessageSquarePlus,
  Search,
  Sparkles,
  BookOpen,
  Clapperboard,
  FileCheck2,
  Timer,
  Users,
  Megaphone,
  Filter,
  CheckCircle2,
  Send
} from 'lucide-react';

export default function HomePage() {
  const {
    currentUser,
    posts,
    createPost,
    updatePost,
    modules,
    mediaList,
    lkms,
    quizzes
  } = usePortal();

  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ForumPost | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<ForumPost['category']>('Pemrograman Web');

  const categories: Array<ForumPost['category'] | 'Semua'> = [
    'Semua',
    'Pengumuman Guru',
    'Pemrograman Web',
    'Basis Data',
    'Algoritma & Struktur Data',
    'Jaringan Komputer',
    'Umum',
  ];

  // Open modal for new post
  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setFormTitle('');
    setFormContent('');
    setFormCategory(currentUser.role === 'guru' ? 'Pengumuman Guru' : 'Pemrograman Web');
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEditModal = (post: ForumPost) => {
    setEditingPost(post);
    setFormTitle(post.title);
    setFormContent(post.content);
    setFormCategory(post.category);
    setIsModalOpen(true);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    if (editingPost) {
      updatePost(editingPost.id, formTitle.trim(), formContent.trim(), formCategory);
    } else {
      createPost(formTitle.trim(), formContent.trim(), formCategory);
    }

    setIsModalOpen(false);
  };

  // Filter and search posts
  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === 'Semua' || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Recent announcement
  const announcement = posts.find((p) => p.category === 'Pengumuman Guru');

  return (
    <div className="space-y-6">
      
      {/* 1. Academic Greeting Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-brand-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>EduPortal • Smart Collaborative Learning System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Selamat Datang, {currentUser.full_name}!
          </h1>
          <p className="text-brand-100 text-xs sm:text-sm leading-relaxed">
            Portal pembelajaran interaktif semester ini menghadirkan modul digital komprehensif, media ajar multimedia, evaluasi berbasis komputer (CBT), serta forum diskusi akademis.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 bottom-0 -mb-10 w-48 h-48 bg-brand-400/20 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* 2. Quick Overview Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">E-Modul</span>
            <p className="text-lg font-black text-slate-900">{modules.length} Bab</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Clapperboard className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Media Ajar</span>
            <p className="text-lg font-black text-slate-900">{mediaList.length} Item</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <FileCheck2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tugas LKM</span>
            <p className="text-lg font-black text-slate-900">{lkms.length} Lembar</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kuis CBT</span>
            <p className="text-lg font-black text-slate-900">{quizzes.length} Paket</p>
          </div>
        </div>
      </div>

      {/* 3. Official Announcement Highlight Card */}
      {announcement && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50/50 border border-amber-200 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Megaphone className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">
                Pengumuman Resmi Dosen / Guru
              </span>
              <span className="text-[10px] text-amber-600 font-semibold px-2 py-0.2 rounded-full bg-amber-100">
                Penting
              </span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 mt-0.5">{announcement.title}</h4>
            <p className="text-xs text-slate-600 mt-1 line-clamp-2">{announcement.content}</p>
          </div>
        </div>
      )}

      {/* 4. Social Discussion Forum Feed */}
      <div className="space-y-4">
        
        {/* Forum Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-brand-600" />
              <span>Forum Diskusi Jejaring Sosial Pendidikan</span>
            </h2>
            <p className="text-xs text-slate-500">
              Diskusikan materi kuliah, bagikan solusi pemrograman, dan ajukan pertanyaan kepada Dosen & rekan sejawat.
            </p>
          </div>

          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition transform hover:scale-[1.02] shrink-0"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Buat Postingan Baru</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari topik diskusi, pertanyaan, atau nama penulis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter Pills (Horizontal scroll on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

        </div>

        {/* Posts Feed */}
        <div className="space-y-4 pt-1">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12 px-4 bg-white rounded-2xl border border-slate-200 text-slate-400">
              <MessageSquarePlus className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">Tidak ada postingan yang sesuai</p>
              <p className="text-xs text-slate-400 mt-1">
                Coba ubah kata kunci pencarian atau ganti filter kategori mata pelajaran.
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <ForumPostCard
                key={post.id}
                post={post}
                onEdit={handleOpenEditModal}
              />
            ))
          )}
        </div>

      </div>

      {/* Modal Buat / Edit Postingan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPost ? 'Edit Postingan Diskusi' : 'Buat Diskusi / Pengumuman Baru'}
        subtitle="Bagikan pemikiran, pertanyaan kode, atau materi baru kepada seluruh komunitas"
        maxWidth="2xl"
      >
        <form onSubmit={handleSavePost} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kategori Mata Pelajaran:
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value as ForumPost['category'])}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {currentUser.role === 'guru' && (
                <option value="Pengumuman Guru">📢 Pengumuman Guru / Dosen</option>
              )}
              <option value="Pemrograman Web">Pemrograman Web</option>
              <option value="Basis Data">Basis Data</option>
              <option value="Algoritma & Struktur Data">Algoritma & Struktur Data</option>
              <option value="Jaringan Komputer">Jaringan Komputer</option>
              <option value="Umum">Umum</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Judul Topik / Pertanyaan:
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Bagaimana cara optimasi query JOIN pada database berskala besar?"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Isi Penjelasan Lengkap:
            </label>
            <textarea
              required
              rows={5}
              placeholder="Tuliskan uraian pertanyaan, potongan kode sumber, atau latar belakang masalah..."
              value={formContent}
              onChange={(e) => setFormContent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Batal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition shadow-md shadow-brand-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{editingPost ? 'Simpan Perubahan' : 'Terbitkan Postingan'}</span>
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
