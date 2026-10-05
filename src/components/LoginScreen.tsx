import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, UserCheck, KeyRound } from 'lucide-react';
import { LogoINI, LogoIPPAT } from './OfficialLogos';
import { authenticateUser, PREDEFINED_ACCOUNTS } from '../services/auth';
import { UserSession } from '../types';

interface LoginScreenProps {
  onLoginSuccess: (session: UserSession) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState<string>('teguhhendrawan03@gmail.com');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const res = authenticateUser(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setErrorMessage(res.message || 'Email atau password salah');
      }
    }, 350);
  };

  const handleQuickLogin = (accEmail: string, accPass: string) => {
    setEmail(accEmail);
    setPassword(accPass);
    setErrorMessage('');
    const res = authenticateUser(accEmail, accPass);
    if (res.success && res.user) {
      onLoginSuccess(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden text-slate-100">
      {/* Background Subtle Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 space-y-6">
        {/* Header with PPAT & INI Official Logos */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="flex flex-col items-center gap-1 group">
              <div className="p-1.5 rounded-full bg-slate-800/80 border border-amber-500/40 shadow-md group-hover:scale-105 transition-transform">
                <LogoINI size={52} />
              </div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">INI</span>
            </div>

            <div className="h-12 w-[1px] bg-gradient-to-b from-transparent via-amber-500/40 to-transparent" />

            <div className="flex flex-col items-center gap-1 group">
              <div className="p-1.5 rounded-full bg-slate-800/80 border border-emerald-500/40 shadow-md group-hover:scale-105 transition-transform">
                <LogoIPPAT size={52} />
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">IPPAT</span>
            </div>
          </div>

          <div>
            <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
              KANTOR NOTARIS & PPAT
            </h1>
            <p className="text-xs font-semibold text-amber-400">
              TEGUH HENDRAWAN, S.H., M.Kn.
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              Sistem Buku Register Akta & Kearsipan Digital Protokol
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-rose-950/50 border border-rose-800/80 text-rose-300 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Pengguna (User)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@kantornotaris.id"
                className="w-full bg-slate-950 border border-slate-750 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Kata Sandi (Password)
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi"
                className="w-full bg-slate-950 border border-slate-750 focus:border-amber-400 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 p-0.5"
                title={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <span>Memverifikasi Akun...</span>
            ) : (
              <>
                <span>Masuk ke Dashboard Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Office Access Shortcuts */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>Pilihan Akun Kantor Bawaan Aktif:</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PREDEFINED_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickLogin(acc.email, acc.password)}
                className="flex flex-col text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-750 hover:border-amber-500/50 transition-all text-xs group"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-white group-hover:text-amber-300 truncate">
                    {acc.session.role === 'NOTARIS_PPAT' ? 'Notaris / PPAT' : 'Staf Kantor'}
                  </span>
                  <UserCheck className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-400 shrink-0" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono truncate">
                  {acc.email}
                </span>
                <span className="text-[9px] text-amber-400/80 font-mono mt-0.5">
                  Password: {acc.password}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Legal Footer Note */}
        <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Keamanan Arsip Lokal Terenkripsi & Standar UUJN / Perkaban</span>
        </div>
      </div>
    </div>
  );
};
