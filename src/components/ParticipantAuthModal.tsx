import React, { useState } from 'react';
import { X, Phone, User, Upload, Image as ImageIcon, CheckCircle, Flame, Trophy, AlertTriangle, ArrowRight } from 'lucide-react';
import { esportsStore } from '../services/store';
import { compressImage } from '../utils/imageCompressor';

interface ParticipantAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
  onOpenReportModal?: () => void;
}

export const ParticipantAuthModal: React.FC<ParticipantAuthModalProps> = ({
  isOpen,
  onClose,
  onNotify,
  onOpenReportModal,
}) => {
  const currentParticipant = esportsStore.getCurrentParticipant();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);

  if (!isOpen) return null;

  // Check if entered phone or name is already in store
  const detectedUser =
    phone.trim().length >= 8
      ? esportsStore.findParticipantByPhone(phone) || (name.trim().length >= 3 ? esportsStore.findParticipantByName(name) : null)
      : null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressing(true);
      try {
        const compressed = await compressImage(file, 400, 400, 0.75);
        setPhotoUrl(compressed);
      } catch (err) {
        console.error('Image compression error:', err);
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const useDefaultPhoto = () => {
    setPhotoUrl('https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !name.trim()) {
      alert('Harap isi nomor telepon dan nama Anda!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const user = esportsStore.authParticipant({
        phone: phone.trim(),
        name: name.trim(),
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=200&q=80',
      });

      setIsSubmitting(false);
      onNotify(`Berhasil masuk sebagai peserta: ${user.name} (${user.phone})!`);
      onClose();

      // Suggest proceeding directly to win report if provided
      if (onOpenReportModal) {
        onOpenReportModal();
      }
    }, 350);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative text-xs">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 to-slate-900 border-b border-slate-800 p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-bold uppercase mb-0.5">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>PESERTA FREE FIRE CLASH SQUAD</span>
            </div>
            <h3 className="text-base font-bold font-display uppercase text-white">
              Pendaftaran & Login Peserta
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Daftar satu kali, selanjutnya langsung setor kemenangan FT.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CASE 1: USER IS ALREADY LOGGED IN */}
        {currentParticipant ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle className="w-7 h-7" />
            </div>

            <div>
              <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-[10px] px-2.5 py-0.5 rounded font-bold uppercase mb-2">
                Status: Sudah Terdaftar & Aktif
              </div>
              <h4 className="text-lg font-bold text-white mb-1">
                Halo, {currentParticipant.name}!
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                Nomor WhatsApp Anda (<strong>{currentParticipant.phone}</strong>) sudah tercatat di sistem turnamen.
              </p>
              
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-around">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">POIN KUALIFIKASI</span>
                  <span className="text-base font-bold text-amber-400 font-mono">{currentParticipant.points} Pts</span>
                </div>
                <div className="w-px h-8 bg-slate-800" />
                <div>
                  <span className="text-[10px] text-slate-400 font-mono block">TOTAL WIN FT</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">{currentParticipant.wins} Win</span>
                </div>
              </div>

              <div className="mt-3 p-2.5 bg-amber-950/40 border border-amber-500/30 rounded text-amber-200 text-[11px] leading-relaxed text-left">
                💡 <strong>Info Penting:</strong> Anda <strong>tidak perlu mendaftar lagi</strong>! Cukup langsung klik tombol di bawah untuk menyetor bukti foto stiker DONE di GB agar poin Anda terus bertambah.
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {onOpenReportModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-xs cursor-pointer transition-all"
                >
                  <Trophy className="w-4 h-4 fill-current" />
                  <span>Lanjut Setor Kemenangan (+1 Poin)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-semibold text-xs cursor-pointer"
              >
                Tutup Jendela
              </button>
            </div>
          </div>
        ) : (
          /* CASE 2: REGISTRATION / LOGIN FORM */
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {/* Free Entry Badge */}
            <div className="bg-emerald-950/40 border border-emerald-500/30 rounded p-2.5 text-emerald-300 flex items-center justify-between">
              <span className="font-semibold">Turnamen Mingguan 100% Gratis</span>
              <span className="font-mono font-bold bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px]">
                FREE ENTRY
              </span>
            </div>

            {/* Notification when phone or name is already detected */}
            {detectedUser && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 p-3 rounded-lg space-y-2 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Akun Anda Sudah Terdaftar!</span>
                </div>
                <p className="text-[11px] text-slate-200 leading-relaxed">
                  Nomor <strong>{detectedUser.phone}</strong> sudah terdaftar atas nama <strong>{detectedUser.name}</strong> dengan <strong>{detectedUser.points} Poin</strong>.
                  Anda <strong>tidak perlu mendaftar ulang</strong>!
                </p>
                <button
                  type="button"
                  onClick={() => {
                    esportsStore.setCurrentParticipant(detectedUser);
                    onNotify(`Selamat datang kembali, ${detectedUser.name}!`);
                    onClose();
                    if (onOpenReportModal) onOpenReportModal();
                  }}
                  className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center justify-center gap-1.5 text-xs shadow-md shadow-emerald-500/20 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5 fill-current" />
                  <span>Gunakan Akun Ini & Langsung Setor Menang</span>
                </button>
              </div>
            )}

            {/* 1. Phone */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nomor Telepon / WhatsApp Peserta *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Nomor ini akan otomatis dihubungi panitia jika Anda masuk 10 Besar untuk dimasukkan ke grup turnamen mingguan.
              </p>
            </div>

            {/* 2. Name */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>Nama Lengkap / Nickname FF / Nama Tim *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian 'Vortex' (KLEPON CS)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
              />
            </div>

            {/* 3. Photo Proof */}
            <div>
              <label className="block text-slate-300 font-bold mb-1 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Bukti Foto Peserta / Avatar Profil *</span>
              </label>

              <div className="border border-dashed border-slate-700 rounded-lg p-3 text-center bg-slate-950/60">
                {isCompressing ? (
                  <div className="py-2 text-emerald-400 font-mono text-[11px] animate-pulse">
                    Memproses foto profil...
                  </div>
                ) : photoUrl ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={photoUrl}
                        alt="Preview Foto"
                        className="w-12 h-12 rounded object-cover border border-emerald-500/50"
                      />
                      <div className="text-left">
                        <span className="text-emerald-400 font-semibold block text-xs">Foto Terpasang</span>
                        <span className="text-[10px] text-slate-500">Siap digunakan untuk profil peserta</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPhotoUrl('')}
                      className="text-rose-400 hover:underline text-[11px] cursor-pointer"
                    >
                      Ganti
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-slate-300">
                      <label className="text-emerald-400 hover:underline cursor-pointer font-semibold">
                        <span>Unggah Foto Profil (Galeri/Kamera)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div className="flex items-center justify-center gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        type="button"
                        onClick={useDefaultPhoto}
                        className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800 px-2 py-1 rounded cursor-pointer"
                      >
                        <ImageIcon className="w-3 h-3 text-teal-400" />
                        <span>Gunakan Foto Profil Standar</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 text-sm transition-all"
              >
                {isSubmitting ? (
                  <span>Menyimpan Akun...</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Daftar / Masuk Peserta</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
