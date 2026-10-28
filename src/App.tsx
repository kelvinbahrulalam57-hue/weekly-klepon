/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { MainPosterModal } from './components/MainPosterModal';
import { BannerGallerySection } from './components/BannerGallerySection';
import { LeaderboardSection } from './components/LeaderboardSection';
import { CommunityInfoSection } from './components/CommunityInfoSection';
import { AntiCheatEducation } from './components/AntiCheatEducation';
import { AdminDashboard } from './components/AdminDashboard';
import { WinReportModal } from './components/WinReportModal';
import { ParticipantAuthModal } from './components/ParticipantAuthModal';
import { UserSubmissionHistoryModal } from './components/UserSubmissionHistoryModal';
import { FloatingWhatsAppBar } from './components/FloatingWhatsAppBar';
import { Footer } from './components/Footer';
import { StealthAdminAuthModal } from './components/StealthAdminAuthModal';
import { esportsStore } from './services/store';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'portal' | 'admin'>('portal');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isStealthAuthOpen, setIsStealthAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Subscribe to realtime state updates
  useEffect(() => {
    const unsubscribe = esportsStore.subscribe(() => {
      setTick((prev) => prev + 1);
    });
    return () => unsubscribe();
  }, []);

  // Global Stealth Shortcut for Admin Access: Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        if (esportsStore.isAdmin()) {
          setCurrentView((prev) => (prev === 'admin' ? 'portal' : 'admin'));
        } else {
          setIsStealthAuthOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleAdminTrigger = () => {
    if (esportsStore.isAdmin()) {
      setCurrentView('admin');
    } else {
      setIsStealthAuthOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#040817] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 font-sans bg-cyber-grid">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 max-w-md bg-[#070f2c] border border-cyan-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 backdrop-blur-md animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-cyan-400 block mb-0.5">KLEPON WEEKLY TURNAMENT FREE</span>
            <span className="text-slate-200 leading-snug">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1">
        {currentView === 'portal' ? (
          <>
            <HeroSection
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
            {/* Galeri Poster Turnamen */}
            <BannerGallerySection
              onNotify={triggerToast}
            />
            {/* Klasemen Poin Kualifikasi Top 10 (Tanpa Medali) */}
            <LeaderboardSection />
            {/* Saluran Informasi KLEPON FT & WA Konsultasi */}
            <CommunityInfoSection />
            {/* Edukasi Anti-Palsu Stiker DONE */}
            <AntiCheatEducation />
          </>
        ) : (
          <AdminDashboard
            onNotify={triggerToast}
            onBackToPortal={() => setCurrentView('portal')}
          />
        )}
      </main>

      {/* Pop-up Poster / Banner Turnamen saat Player Masuk Website */}
      <MainPosterModal
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Modal Setoran Kemenangan FT (Foto Stiker DONE di GB) */}
      <WinReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onNotify={triggerToast}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Modal Pendaftaran / Login Peserta (No HP, Nama, Foto) */}
      <ParticipantAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onNotify={triggerToast}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Modal Riwayat Storan Kemenangan Peserta dengan status 'Under Review' */}
      <UserSubmissionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
      />

      {/* Floating Speed Dial (Saluran Informasi & WA Konsultasi) */}
      {currentView === 'portal' && <FloatingWhatsAppBar />}

      {/* Footer with Stealth Secret Multi-Click Panitia Access */}
      <Footer onOpenAdmin={handleAdminTrigger} />

      {/* Stealth Admin Authentication Modal */}
      <StealthAdminAuthModal
        isOpen={isStealthAuthOpen}
        onClose={() => setIsStealthAuthOpen(false)}
        onSuccess={() => {
          setIsStealthAuthOpen(false);
          setCurrentView('admin');
          triggerToast('Akses Panitia Diterima. Masuk ke Dashboard Kontrol.');
        }}
      />
    </div>
  );
}
