'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePortal } from '@/lib/store';
import { RoleSwitcherBadge } from './RoleSwitcherBadge';
import { Modal } from './Modal';
import {
  GraduationCap,
  BookOpen,
  Database,
  CloudUpload,
  Key,
  CheckCircle,
  Menu,
  X,
  ExternalLink,
  Code2,
  Sparkles,
  Info
} from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { currentUser, isSupabaseMode } = usePortal();
  const [showDeployGuide, setShowDeployGuide] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Left: Mobile hamburger + Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
              aria-label="Buka Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">Edu<span className="text-brand-600">Portal</span></span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">v2.0</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 -mt-0.5">Media Pembelajaran & Jejaring Sosial</p>
              </div>
            </Link>
          </div>

          {/* Center / Right utilities */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Deploy & Supabase Guide Button */}
            <button
              onClick={() => setShowDeployGuide(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 hover:text-brand-600 bg-slate-100/80 hover:bg-brand-50 transition border border-slate-200"
              title="Panduan Koneksi Supabase & Deploy Vercel"
            >
              <CloudUpload className="w-3.5 h-3.5 text-brand-600" />
              <span>Panduan Deploy</span>
            </button>

            {/* Supabase status badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                isSupabaseMode
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-indigo-50 text-indigo-700 border-indigo-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isSupabaseMode ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
              <span>{isSupabaseMode ? 'Supabase Live' : 'Demo Mode (Siap Deploy)'}</span>
            </div>

            {/* Role Switcher */}
            <RoleSwitcherBadge />

            {/* Active User Avatar & Auth Link */}
            <Link
              href="/auth"
              className="flex items-center gap-2 pl-2 border-l border-slate-200 group hover:opacity-85 transition"
              title="Profil Pengguna & Masuk Akun"
            >
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={currentUser.full_name}
                className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm ring-1 ring-slate-200 group-hover:ring-brand-500"
              />
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none truncate max-w-[140px] group-hover:text-brand-600">
                  {currentUser.full_name}
                </p>
                <span className="text-[10px] text-slate-500 font-medium">
                  {currentUser.role === 'guru' ? 'Guru / Dosen' : 'Siswa Aktif'}
                </span>
              </div>
            </Link>

          </div>
        </div>
      </header>

      {/* Modal Panduan Setup Supabase & Deploy Vercel */}
      <Modal
        isOpen={showDeployGuide}
        onClose={() => setShowDeployGuide(false)}
        title="Panduan Langkah demi Langkah Deploy & Hubungkan Database"
        subtitle="EduPortal dirancang 100% siap online ke Vercel atau Netlify dengan backend Supabase"
        maxWidth="4xl"
      >
        <div className="space-y-6 text-sm text-slate-700">
          
          {/* Step 1: Supabase Setup */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-brand-700 font-bold text-base">
              <Database className="w-5 h-5 text-brand-600" />
              <span>1. Setup Database & Storage Supabase (Gratis)</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-slate-600 pl-1 leading-relaxed">
              <li>
                Buka <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-brand-600 underline font-semibold inline-flex items-center gap-1">supabase.com <ExternalLink className="w-3 h-3" /></a> dan buat project baru (misal: <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">eduportal-app</code>).
              </li>
              <li>
                Masuk ke menu <strong>SQL Editor</strong> di dashboard Supabase.
              </li>
              <li>
                Buka file <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">supabase/schema.sql</code> dari proyek ini, copy seluruh kodenya, lalu klik <strong>Run</strong>. Skema seluruh tabel (forum, e-modul, media, lkm, kuis, dan RLS security) akan otomatis terbuat!
              </li>
              <li>
                Buka menu <strong>Storage</strong> di Supabase, buat 2 bucket publik baru:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 font-mono text-xs text-brand-700">
                  <li>documents (Public bucket: ON)</li>
                  <li>media (Public bucket: ON)</li>
                </ul>
              </li>
              <li>
                Buka <strong>Project Settings &rarr; API</strong>, lalu salin:
                <ul className="list-disc list-inside pl-4 mt-1 space-y-0.5 font-mono text-xs text-slate-700">
                  <li>Project URL (NEXT_PUBLIC_SUPABASE_URL)</li>
                  <li>anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)</li>
                </ul>
              </li>
            </ol>
          </div>

          {/* Step 2: Environment Variables */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-700 font-bold text-base">
              <Key className="w-5 h-5 text-amber-600" />
              <span>2. Konfigurasi Environment Variables</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Buat file <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">.env.local</code> di root folder proyek (atau salin dari <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-800">.env.example</code>):
            </p>
            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto">
              <div>NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co</div>
              <div>NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</div>
            </div>
          </div>

          {/* Step 3: Deploy to Vercel */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-base">
              <CloudUpload className="w-5 h-5 text-emerald-600" />
              <span>3. Deploy Gratis ke Vercel (Siap Akses Publik)</span>
            </div>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-emerald-900/80 pl-1 leading-relaxed">
              <li>
                Push repositori ini ke akun <strong>GitHub</strong> Anda (<code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">git push origin main</code>).
              </li>
              <li>
                Buka <a href="https://vercel.com" target="_blank" rel="noreferrer" className="text-emerald-700 underline font-semibold inline-flex items-center gap-1">vercel.com <ExternalLink className="w-3 h-3" /></a>, klik <strong>Add New &rarr; Project</strong>, dan pilih repositori Anda.
              </li>
              <li>
                Pada bagian <strong>Environment Variables</strong> di Vercel, masukkan:
                <ul className="list-disc list-inside pl-4 mt-1 font-mono text-xs">
                  <li>NEXT_PUBLIC_SUPABASE_URL</li>
                  <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
                </ul>
              </li>
              <li>
                Klik <strong>Deploy</strong>. Dalam 1-2 menit, EduPortal Anda langsung aktif dengan domain publik gratis (misal: <code className="bg-emerald-100 px-1 py-0.5 rounded font-mono">https://eduportal-anda.vercel.app</code>)!
              </li>
            </ol>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowDeployGuide(false)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition"
            >
              Saya Mengerti, Tutup Panduan
            </button>
          </div>

        </div>
      </Modal>
    </>
  );
};
