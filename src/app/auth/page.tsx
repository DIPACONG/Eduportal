'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortal } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  BookOpen,
  GraduationCap,
  ShieldCheck,
  Mail,
  Lock,
  User,
  Building,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { setCurrentUser, isSupabaseMode } = usePortal();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('siswa');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [institution, setInstitution] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isSupabaseMode && supabase) {
        // Real Supabase Auth
        if (mode === 'login') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          if (data.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profile) {
              setCurrentUser(profile);
            }
            router.push('/');
          }
        } else {
          // Register
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: role,
                institution: institution,
              },
            },
          });
          if (error) throw error;
          setSuccessMsg('Pendaftaran berhasil! Silakan periksa email untuk konfirmasi atau login langsung.');
          setTimeout(() => setMode('login'), 2000);
        }
      } else {
        // Demo Mode - Instant Mock Auth
        if (mode === 'login') {
          setCurrentUser({
            id: role === 'guru' ? 'user-guru-1' : 'user-siswa-1',
            email: email || (role === 'guru' ? 'dosen.arya@eduportal.ac.id' : 'rizky@student.eduportal.ac.id'),
            full_name: role === 'guru' ? 'Dr. Ir. Arya Dipanegara, M.Kom.' : 'Rizky Ramadhan',
            role: role,
            avatar_url:
              role === 'guru'
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
            institution: institution || 'Universitas EduPortal',
            created_at: new Date().toISOString(),
          });
          router.push('/');
        } else {
          setCurrentUser({
            id: 'user-' + Date.now(),
            email,
            full_name: fullName,
            role: role,
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
            institution: institution || 'Institut Teknologi EduPortal',
            created_at: new Date().toISOString(),
          });
          setSuccessMsg('Akun berhasil dibuat! Mengalihkan ke Beranda...');
          setTimeout(() => router.push('/'), 1200);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat memproses autentikasi.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (isSupabaseMode && supabase) {
      supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
    } else {
      // Demo Google login
      setCurrentUser({
        id: 'user-google-' + Date.now(),
        email: 'user.google@gmail.com',
        full_name: 'Akun Google Pengguna',
        role: 'siswa',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
      });
      router.push('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 space-y-6">
        
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-700 to-indigo-500 flex items-center justify-center text-white mx-auto shadow-md shadow-brand-500/25">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            {mode === 'login' ? 'Masuk ke Akun EduPortal' : 'Daftar Akun Baru EduPortal'}
          </h2>
          <p className="text-xs text-slate-500">
            Platform Media Pembelajaran Digital & Jejaring Sosial Pendidikan
          </p>
        </div>

        {/* Mode Switch Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Masuk (Login)
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              mode === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Pendaftaran (Register)
          </button>
        </div>

        {/* Error / Success Alerts */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pilih Peran / Role:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('siswa')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                  role === 'siswa'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Siswa / Pelajar</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('guru')}
                className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 transition ${
                  role === 'guru'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-500/20'
                    : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Guru / Admin</span>
              </button>
            </div>
          </div>

          {/* Full Name for register */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap:</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan Pratama"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email:</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="nama@eduportal.ac.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Sandi (Password):</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Institution for register */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Asal Sekolah / Universitas:
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Contoh: Universitas Gadjah Mada / SMA Negeri 1"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftarkan Akun'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Google Sign-in Option */}
        <div className="space-y-3 pt-2">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 absolute">
              atau lanjutkan dengan
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-2.5 px-4 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center gap-2 shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Masuk Menggunakan Google</span>
          </button>
        </div>

        {/* Tip for quick role switcher */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            💡 <strong>Info Pengujian:</strong> Anda juga bisa langsung mengganti role (Guru/Siswa) sewaktu-waktu melalui tombol role di bagian atas halaman (Navbar).
          </p>
        </div>

      </div>
    </div>
  );
}
