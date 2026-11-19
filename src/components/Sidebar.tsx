'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePortal } from '@/lib/store';
import {
  Home,
  BookOpen,
  Clapperboard,
  FileCheck2,
  Timer,
  Sparkles,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpenMobile, onCloseMobile }) => {
  const pathname = usePathname();
  const {
    currentUser,
    modules,
    completedModuleIds,
    lkms,
    submissions,
    quizzes,
    resetDemoData
  } = usePortal();

  // Calculate badges
  const pendingSubmissionsCount = submissions.filter((s) => s.status === 'pending').length;
  const userSubmissionsCount = submissions.filter((s) => s.student_id === currentUser.id).length;

  const navItems = [
    {
      href: '/',
      label: 'Beranda & Forum Diskusi',
      shortLabel: 'Forum Edukasi',
      icon: Home,
      badge: null,
      description: 'Feed jejaring sosial & pengumuman',
    },
    {
      href: '/modul',
      label: 'E-Modul Interaktif',
      shortLabel: 'E-Modul',
      icon: BookOpen,
      badge: `${completedModuleIds.length}/${modules.length}`,
      badgeColor: 'bg-brand-100 text-brand-700',
      description: 'Materi digital & preview PDF',
    },
    {
      href: '/media',
      label: 'Galeri Media Ajar',
      shortLabel: 'Media Ajar',
      icon: Clapperboard,
      badge: '4 Media',
      badgeColor: 'bg-purple-100 text-purple-700',
      description: 'Video, slide kuliah, & infografis',
    },
    {
      href: '/lkm',
      label: 'LKM (Lembar Kerja)',
      shortLabel: 'LKM Siswa',
      icon: FileCheck2,
      badge: currentUser.role === 'guru' ? `${pendingSubmissionsCount} perlu nilai` : `${lkms.length} Tugas`,
      badgeColor: currentUser.role === 'guru' && pendingSubmissionsCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700',
      description: 'Tugas siswa & penilaian guru',
    },
    {
      href: '/asesmen',
      label: 'Asesmen & Kuis Online',
      shortLabel: 'Kuis & Evaluasi',
      icon: Timer,
      badge: `${quizzes.length} Kuis`,
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Kuis interaktif CBT dengan timer',
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      
      {/* Mobile close button header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">
            E
          </div>
          <span className="font-bold text-slate-900">EduPortal Menu</span>
        </div>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Menu Navigasi
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`group flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-500/25'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="truncate text-left">
                  <div className="truncate">{item.label}</div>
                  <div
                    className={`text-[10px] font-normal truncate ${
                      isActive ? 'text-white/80' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                    isActive ? 'bg-white/25 text-white' : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick Tips / Role Info Card */}
        <div className="pt-6 px-1">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-50 to-brand-50/30 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span>Status Role Aktif</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Anda sedang login sebagai{' '}
              <strong className="text-slate-900">
                {currentUser.role === 'guru' ? 'Guru / Admin' : 'Siswa'}
              </strong>
              . {currentUser.role === 'guru' ? 'Anda dapat menambah/edit/hapus semua materi, file PDF, dan kuis.' : 'Anda dapat membaca modul, kuis dengan timer, dan kumpul LKM.'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer / Reset Action */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <button
          onClick={() => {
            if (confirm('Reset semua data demo kembali ke data awal bawaan?')) {
              resetDemoData();
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition border border-dashed border-slate-200 hover:border-rose-200"
          title="Kembalikan semua postingan, modul, dan nilai ke data awal"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Data Demo Awal</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-80 max-w-full z-10 animate-slideRight">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
