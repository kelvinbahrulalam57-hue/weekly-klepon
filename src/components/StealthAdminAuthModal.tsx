import React, { useState } from 'react';
import { X, Shield, Lock, AlertCircle } from 'lucide-react';
import { esportsStore } from '../services/store';

interface StealthAdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const StealthAdminAuthModal: React.FC<StealthAdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = esportsStore.verifyAndLoginAdmin(password.trim());
    if (ok) {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
      setPassword('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-[#070e24] border border-blue-500/30 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative text-xs">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 text-slate-500 hover:text-slate-300 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-blue-950/60 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner shadow-cyan-500/10">
            <Lock className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-200 font-mono">
              System Access Authorization
            </h3>
            <p className="text-[11px] text-slate-400 mt-1">
              Masukkan kode sandi otentikasi internal untuk melanjutkan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              autoFocus
              autoComplete="off"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              className="w-full bg-[#030614] border border-blue-900/60 focus:border-cyan-400 rounded-lg px-3.5 py-2.5 text-white font-mono text-center tracking-widest text-sm focus:outline-none shadow-inner"
            />
            {error && (
              <div className="flex items-center gap-1.5 text-rose-400 text-[11px] mt-2 justify-center font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Kode sandi tidak valid. Akses ditolak.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-slate-950 font-bold rounded-lg transition-all text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
          >
            Verifikasi Akses
          </button>
        </form>
      </div>
    </div>
  );
};
