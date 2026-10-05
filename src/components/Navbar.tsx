import React from 'react';
import { 
  FileText, 
  Layers, 
  FolderLock, 
  FileCheck, 
  BarChart3, 
  PlusCircle, 
  Receipt,
  Building2,
  BellRing,
  LogOut,
  UserCheck
} from 'lucide-react';
import { LayananType, KantorProfile, UserSession } from '../types';
import { NotarisPpatEmblemCombo } from './OfficialLogos';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewBerkas: (type?: LayananType) => void;
  onOpenNewTandaTerima: () => void;
  onOpenProfileModal: () => void;
  kantorProfile?: KantorProfile;
  totalBerkas: number;
  userSession?: UserSession | null;
  onLogout?: () => void;
  reminderCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewBerkas,
  onOpenNewTandaTerima,
  onOpenProfileModal,
  kantorProfile,
  totalBerkas,
  userSession,
  onLogout,
  reminderCount = 0
}) => {
  return (
    <header className="no-print sticky top-0 z-30 bg-slate-900/95 backdrop-blur border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Zone 1: Office Brand with PPAT & INI Logos */}
          <div className="flex items-center gap-3">
            <NotarisPpatEmblemCombo size={34} showSubtitle={false} className="hidden sm:flex" />

            <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white block uppercase">
                  NOTARIS & PPAT {kantorProfile?.namaNotaris || 'TEGUH HENDRAWAN'}
                </span>
              </div>
              <span className="text-[11px] text-amber-400 font-medium block">
                {kantorProfile?.gelar || 'S.H., M.Kn.'} · {kantorProfile?.wilayahKerja || 'Kota Administrasi Jakarta Selatan'}
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('notaris')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'notaris'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Register Notaris</span>
            </button>

            <button
              onClick={() => setActiveTab('ppat')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'ppat'
                  ? 'bg-slate-800 text-sky-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Register PPAT</span>
            </button>

            <button
              onClick={() => setActiveTab('lokasi')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'lokasi'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FolderLock className="w-4 h-4" />
              <span>Lokasi Rak Fisik</span>
            </button>

            <button
              onClick={() => setActiveTab('tanda-terima')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'tanda-terima'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>Tanda Terima</span>
            </button>

            <button
              onClick={() => setActiveTab('rekap')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 ${
                activeTab === 'rekap'
                  ? 'bg-slate-800 text-amber-400 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Rekap & Laporan</span>
            </button>

            <button
              onClick={() => setActiveTab('reminder')}
              className={`px-3 py-2 rounded-md transition-colors flex items-center gap-2 relative ${
                activeTab === 'reminder'
                  ? 'bg-amber-950/60 text-amber-300 font-semibold border border-amber-800/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Pengingat Jatuh Tempo SKMHT & Progres AJB"
            >
              <BellRing className="w-4 h-4 text-amber-400" />
              <span>Reminder SKMHT & AJB</span>
              {reminderCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {reminderCount}
                </span>
              )}
            </button>
          </nav>

          {/* Zone 3: Primary Actions & User Session */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfileModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-750 border border-slate-700 transition-colors whitespace-nowrap"
              title="Ubah Profil Resmi Kantor Notaris & PPAT"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline">Profil Kantor</span>
            </button>

            <button
              onClick={onOpenNewTandaTerima}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors whitespace-nowrap"
              title="Buat Tanda Terima Titipan Berkas Klien"
            >
              <Receipt className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Tanda Terima</span>
            </button>

            <button
              onClick={() => onOpenNewBerkas()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-950 bg-amber-400 hover:bg-amber-300 shadow transition-colors whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Berkas Baru</span>
            </button>

            {/* User Session Profile & Logout */}
            {userSession && (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800 ml-1">
                <div className="hidden xl:flex flex-col text-right leading-none max-w-[140px]">
                  <span className="text-xs font-bold text-white truncate" title={userSession.nama}>
                    {userSession.nama.split(',')[0]}
                  </span>
                  <span className="text-[10px] text-amber-400/90 truncate font-mono">
                    {userSession.email}
                  </span>
                </div>

                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title={`Keluar (${userSession.email})`}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Submenu Bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/60 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('notaris')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'notaris' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
            }`}
          >
            Akta Notaris
          </button>
          <button
            onClick={() => setActiveTab('ppat')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'ppat' ? 'bg-slate-800 text-sky-400 font-medium' : 'text-slate-400'
            }`}
          >
            Akta PPAT
          </button>
          <button
            onClick={() => setActiveTab('lokasi')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'lokasi' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
            }`}
          >
            Rak Fisik
          </button>
          <button
            onClick={() => setActiveTab('tanda-terima')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'tanda-terima' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
            }`}
          >
            Tanda Terima
          </button>
          <button
            onClick={() => setActiveTab('rekap')}
            className={`px-2.5 py-1 rounded whitespace-nowrap ${
              activeTab === 'rekap' ? 'bg-slate-800 text-amber-400 font-medium' : 'text-slate-400'
            }`}
          >
            Rekap Bulanan
          </button>
          <button
            onClick={() => setActiveTab('reminder')}
            className={`px-2.5 py-1 rounded whitespace-nowrap flex items-center gap-1 ${
              activeTab === 'reminder' ? 'bg-amber-950/60 text-amber-300 font-medium border border-amber-800/60' : 'text-slate-400'
            }`}
          >
            <span>Reminder</span>
            {reminderCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-rose-500 text-white">
                {reminderCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
