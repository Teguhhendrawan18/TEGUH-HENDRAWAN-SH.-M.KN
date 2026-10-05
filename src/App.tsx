import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { RegisterTable } from './components/RegisterTable';
import { BerkasFormModal } from './components/BerkasFormModal';
import { PdfViewerModal } from './components/PdfViewerModal';
import { QrLabelModal } from './components/QrLabelModal';
import { TandaTerimaView } from './components/TandaTerimaView';
import { LokasiFisikView } from './components/LokasiFisikView';
import { RekapLaporanView } from './components/RekapLaporanView';
import { ProfilKantorModal } from './components/ProfilKantorModal';
import { ReminderPanel } from './components/ReminderPanel';
import { LoginScreen } from './components/LoginScreen';
import { ArsipBerkas, LayananType, TandaTerimaBerkas, KantorProfile, UserSession } from './types';
import { 
  getAllBerkas, 
  getAllTandaTerima, 
  initializeDatabaseSeed, 
  deleteBerkas,
  getKantorProfile,
  DEFAULT_KANTOR_PROFILE
} from './services/db';
import { getStoredSession, clearSession } from './services/auth';

export default function App() {
  const [userSession, setUserSession] = useState<UserSession | null>(getStoredSession());
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [berkasList, setBerkasList] = useState<ArsipBerkas[]>([]);
  const [tandaTerimaList, setTandaTerimaList] = useState<TandaTerimaBerkas[]>([]);
  const [kantorProfile, setKantorProfile] = useState<KantorProfile>(DEFAULT_KANTOR_PROFILE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals
  const [pdfModalBerkas, setPdfModalBerkas] = useState<ArsipBerkas | null>(null);
  const [qrLabelModalBerkas, setQrLabelModalBerkas] = useState<ArsipBerkas | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [formModalState, setFormModalState] = useState<{
    isOpen: boolean;
    berkas: ArsipBerkas | null;
    defaultLayanan: LayananType;
  }>({
    isOpen: false,
    berkas: null,
    defaultLayanan: 'NOTARIS'
  });
  const [openNewTandaTerimaDirect, setOpenNewTandaTerimaDirect] = useState<boolean>(false);

  // Load database on start
  const refreshData = async () => {
    try {
      await initializeDatabaseSeed();
      const [allB, allTT, profile] = await Promise.all([
        getAllBerkas(),
        getAllTandaTerima(),
        getKantorProfile()
      ]);
      setBerkasList(allB);
      setTandaTerimaList(allTT);
      if (profile) setKantorProfile(profile);
    } catch (err) {
      console.error('Failed to load database:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOpenNewBerkas = (type: LayananType = 'NOTARIS') => {
    setFormModalState({
      isOpen: true,
      berkas: null,
      defaultLayanan: type
    });
  };

  const handleEditBerkas = (item: ArsipBerkas) => {
    setFormModalState({
      isOpen: true,
      berkas: item,
      defaultLayanan: item.jenisLayanan
    });
  };

  const handleDeleteBerkas = async (id: string) => {
    try {
      await deleteBerkas(id);
      await refreshData();
    } catch (err) {
      console.error('Failed to delete deed:', err);
      alert('Gagal menghapus berkas.');
    }
  };

  const handleBerkasSaved = async (saved: ArsipBerkas) => {
    await refreshData();
    // If the PDF viewer was open for this deed, update it too
    if (pdfModalBerkas && pdfModalBerkas.id === saved.id) {
      setPdfModalBerkas(saved);
    }
  };

  const handleProfileUpdated = (updated: KantorProfile) => {
    setKantorProfile(updated);
  };

  const reminderCount = useMemo(() => {
    const urgentSkmht = berkasList.filter(b => 
      (b.kategoriAkta === 'SKMHT' || !!b.reminderSKMHT) && 
      b.reminderSKMHT?.statusAPHT !== 'SUDAH_APHT'
    ).length;
    const activeAjb = berkasList.filter(b => 
      (b.kategoriAkta === 'AJB' || !!b.progresAJB) && 
      b.progresAJB?.status !== 'SELESAI'
    ).length;
    return urgentSkmht + activeAjb;
  }, [berkasList]);

  // Auth Guard: If not logged in, render LoginScreen
  if (!userSession) {
    return (
      <LoginScreen
        onLoginSuccess={(session) => {
          setUserSession(session);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewBerkas={handleOpenNewBerkas}
        onOpenNewTandaTerima={() => {
          setActiveTab('tanda-terima');
          setOpenNewTandaTerimaDirect(true);
        }}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        kantorProfile={kantorProfile}
        totalBerkas={berkasList.length}
        userSession={userSession}
        onLogout={() => {
          clearSession();
          setUserSession(null);
        }}
        reminderCount={reminderCount}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-400">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs">Memuat arsip dan basis data Notaris & PPAT...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                berkasList={berkasList}
                kantorProfile={kantorProfile}
                onOpenPdf={(b) => setPdfModalBerkas(b)}
                onOpenQrLabel={(b) => setQrLabelModalBerkas(b)}
                onOpenNewBerkas={handleOpenNewBerkas}
                onOpenNewTandaTerima={() => {
                  setActiveTab('tanda-terima');
                  setOpenNewTandaTerimaDirect(true);
                }}
                onOpenProfileModal={() => setIsProfileModalOpen(true)}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'notaris' && (
              <RegisterTable
                layanan="NOTARIS"
                berkasList={berkasList}
                onOpenPdf={(b) => setPdfModalBerkas(b)}
                onOpenQrLabel={(b) => setQrLabelModalBerkas(b)}
                onEditBerkas={handleEditBerkas}
                onDeleteBerkas={handleDeleteBerkas}
                onAddNew={() => handleOpenNewBerkas('NOTARIS')}
              />
            )}

            {activeTab === 'ppat' && (
              <RegisterTable
                layanan="PPAT"
                berkasList={berkasList}
                onOpenPdf={(b) => setPdfModalBerkas(b)}
                onOpenQrLabel={(b) => setQrLabelModalBerkas(b)}
                onEditBerkas={handleEditBerkas}
                onDeleteBerkas={handleDeleteBerkas}
                onAddNew={() => handleOpenNewBerkas('PPAT')}
              />
            )}

            {activeTab === 'lokasi' && (
              <LokasiFisikView
                berkasList={berkasList}
                onOpenPdf={(b) => setPdfModalBerkas(b)}
                onOpenQrLabel={(b) => setQrLabelModalBerkas(b)}
                onEditBerkas={handleEditBerkas}
              />
            )}

            {activeTab === 'tanda-terima' && (
              <TandaTerimaView
                tandaTerimaList={tandaTerimaList}
                kantorProfile={kantorProfile}
                onTandaTerimaUpdated={refreshData}
                openCreateModalDirectly={openNewTandaTerimaDirect}
                onCloseCreateModalDirectly={() => setOpenNewTandaTerimaDirect(false)}
              />
            )}

            {activeTab === 'rekap' && (
              <RekapLaporanView
                berkasList={berkasList}
                kantorProfile={kantorProfile}
                onDataImported={refreshData}
              />
            )}

            {activeTab === 'reminder' && (
              <ReminderPanel
                berkasList={berkasList}
                onOpenBerkas={handleEditBerkas}
                onUpdateBerkas={handleBerkasSaved}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Kantor Notaris & PPAT {kantorProfile.namaNotaris}, {kantorProfile.gelar}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="hover:text-amber-400 transition-colors"
            >
              Pengaturan Profil Kantor
            </button>
            <span>·</span>
            <span>IndexedDB Secured Storage</span>
          </div>
        </div>
      </footer>

      {/* Form Modal (Create / Edit) */}
      {formModalState.isOpen && (
        <BerkasFormModal
          initialBerkas={formModalState.berkas}
          defaultLayanan={formModalState.defaultLayanan}
          existingCount={berkasList.filter(b => b.jenisLayanan === formModalState.defaultLayanan).length}
          onClose={() => setFormModalState({ isOpen: false, berkas: null, defaultLayanan: 'NOTARIS' })}
          onSaved={handleBerkasSaved}
        />
      )}

      {/* PDF Viewer Modal */}
      {pdfModalBerkas && (
        <PdfViewerModal
          berkas={pdfModalBerkas}
          onClose={() => setPdfModalBerkas(null)}
          onBerkasUpdated={handleBerkasSaved}
        />
      )}

      {/* QR Label Print Modal */}
      {qrLabelModalBerkas && (
        <QrLabelModal
          berkas={qrLabelModalBerkas}
          kantorProfile={kantorProfile}
          onClose={() => setQrLabelModalBerkas(null)}
        />
      )}

      {/* Office Profile Settings Modal */}
      {isProfileModalOpen && (
        <ProfilKantorModal
          currentProfile={kantorProfile}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onProfileUpdated={handleProfileUpdated}
        />
      )}
    </div>
  );
}
