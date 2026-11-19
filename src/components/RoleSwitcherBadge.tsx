'use client';

import React, { useState } from 'react';
import { usePortal } from '@/lib/store';
import { ShieldCheck, GraduationCap, ChevronDown, CheckCircle2 } from 'lucide-react';

export const RoleSwitcherBadge: React.FC = () => {
  const { currentUser, switchRole } = usePortal();
  const [isOpen, setIsOpen] = useState(false);

  const isGuru = currentUser.role === 'guru';

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition shadow-sm ${
          isGuru
            ? 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
        }`}
        title="Klik untuk mengganti Role (Guru/Siswa)"
      >
        {isGuru ? (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Mode Guru / Admin (Full CRUD)</span>
          </>
        ) : (
          <>
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Mode Siswa / Pelajar</span>
          </>
        )}
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 animate-scaleUp">
            <div className="px-3 py-2 border-b border-slate-100 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pilih Role Pengguna (Demo Simultan)
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Uji coba hak akses CRUD materi vs hak akses siswa secara langsung
              </p>
            </div>

            {/* Guru Option */}
            <button
              onClick={() => {
                switchRole('guru');
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition ${
                isGuru ? 'bg-amber-50/80 border border-amber-200/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">Guru / Admin</p>
                  {isGuru && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Akses penuh CRUD: tambah modul, upload file, kelola kuis, dan beri nilai LKM.
                </p>
              </div>
            </button>

            {/* Siswa Option */}
            <button
              onClick={() => {
                switchRole('siswa');
                setIsOpen(false);
              }}
              className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition mt-1 ${
                !isGuru ? 'bg-emerald-50/80 border border-emerald-200/60' : 'hover:bg-slate-50'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">Siswa / Mahasiswa</p>
                  {!isGuru && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                  Akses belajar: baca modul, kuis interaktif, kumpul LKM, & diskusi sosial.
                </p>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
};
