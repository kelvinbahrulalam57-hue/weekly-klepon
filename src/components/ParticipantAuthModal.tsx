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
      alert('Nomor telepon dan nama wajib diisi!');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const participant = esportsStore.authParticipant({
        phone,
        name,
        photoUrl,
      });

      setIsSubmitting(false);
      onNotify(
        detectedUser
          ? `Selamat datang kembali, ${participant.name}! Akun terverifikasi, Anda dapat langsung menyetor kemenangan FT.`
          : `Pendaftaran berhasil! Tim ${participant.name} terdaftar dengan nomor ${participant.phone}.`
      );
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#070f2c] border border-blue-800/80 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-xs">
        {/* Header */}
        <div className="bg-[#050b20] border-b border-blue-900/60 p-4 sm:p-5 flex items-center justify-between">
          <div>
            <div className="text-cyan-400 font-mono text-[11px] font-bold uppercase mb-0.5">
              AUTENTIKASI PESERTA FREE FIRE CS
            </div>
            <h3 className="text-base font-bold font-display uppercase text-white">
              {currentParticipant ? 'Profil Peserta Terdaftar' : 'Pendaftaran / Login Peserta'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-blue-950 hover:bg-blue-900 text-slate-300 flex items-center justify-center cursor-pointer border border-blue-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Logged In Session */}
        {currentParticipant ? (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="p-4 bg-[#030616] rounded-xl border border-blue-900 flex items-center gap-3">
              <img
                src={currentParticipant.photoUrl}
                alt={currentParticipant.name}
                className="w-12 h-12 rounded-full object-cover border border-cyan-400/60"
              />
              <div className="flex-1">
                <div className="text-white font-bold text-sm">{currentParticipant.name}</div>
                <div className="text-[11px] font-mono text-cyan-400">
                  WA: {currentParticipant.phone}
                </div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Poin Saat Ini: <strong className="text-amber-400">{currentParticipant.points} Pts</strong> ({currentParticipant.wins} Win)
                </div>
              </div>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-xl p-3 text-cyan-200 text-[11px] leading-relaxed">
              💡 <strong>Akun Anda sudah aktif.</strong> Tidak perlu mendaftar ulang! Langsung setorkan screenshot stiker DONE admin setiap memenangkan match di GB untuk menambah poin kualifikasi Top 10.
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {onOpenReportModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenReportModal();
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs"
                >
                  <Trophy className="w-4 h-4 fill-current" />
                  <span>Langsung Setor Kemenangan (+1 Poin)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  esportsStore.logoutParticipant();
                  onNotify('Anda telah keluar dari akun peserta.');
                }}
                className="w-full py-2 bg-blue-950/60 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-blue-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Ganti Akun Peserta Lain
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            {/* Guidance banner */}
            <div className="bg-blue-950/50 border border-blue-800/80 rounded-xl p-3 text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-cyan-400">Hanya butuh Nama, Nomor Telepon & Foto!</strong>
              <br />
              Jika nomor WhatsApp atau nama Anda sudah pernah didaftarkan sebelumnya, sistem akan otomatis login tanpa membuat akun ganda.
            </div>

            {/* Detected existing user card */}
            {detectedUser && (
              <div className="bg-cyan-950/60 border border-cyan-400/50 rounded-xl p-3 flex items-center gap-3 animate-fade-in">
                <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0" />
                <div className="text-[11px] text-cyan-200">
                  <span>Data terdeteksi: <strong>{detectedUser.name}</strong> ({detectedUser.phone}).</span>
                  <span className="block text-[10px] text-cyan-300">Klik tombol di bawah untuk langsung masuk & setor poin.</span>
                </div>
              </div>
            )}

            {/* Input Phone */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nomor WhatsApp Aktif *</span>
              </label>
              <input
                type="tel"
                required
                placeholder="Contoh: 081234567890"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-400 text-xs shadow-inner"
              />
              <span className="text-[10px] text-slate-500">
                Wajib nomor WhatsApp aktif agar panitia dapat menghubungi jika Anda masuk Top 10!
              </span>
            </div>

            {/* Input Name */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nama Tim / Player *</span>
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: KLEPON CS / KAPTEN ALOK"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#030616] border border-blue-900 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-cyan-400 text-xs shadow-inner font-semibold"
              />
            </div>

            {/* Input Photo Avatar */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Foto Profil / Logo Squad (Galeri HP)</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#030616] border border-blue-800 flex items-center justify-center overflow-hidden shrink-0">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-slate-600" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <label className="inline-block px-3 py-1.5 bg-blue-950 hover:bg-blue-900 border border-blue-800 text-cyan-300 font-bold rounded-lg cursor-pointer text-xs transition-colors">
                    <span>{isCompressing ? 'Mengompres...' : 'Pilih Foto dari Galeri'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  {!photoUrl && (
                    <button
                      type="button"
                      onClick={useDefaultPhoto}
                      className="block text-[10px] text-slate-400 hover:text-cyan-300 cursor-pointer"
                    >
                      Gunakan Avatar Default
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isCompressing}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 text-xs disabled:opacity-50"
              >
                <span>{detectedUser ? 'Masuk & Lanjutkan' : 'Daftar Peserta Sekarang'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
