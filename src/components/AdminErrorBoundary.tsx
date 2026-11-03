import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, ArrowLeft, Shield } from 'lucide-react';

interface Props {
  children: ReactNode;
  onBackToPortal: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('AdminDashboard encountered an error:', error, errorInfo);
  }

  private handleResetCache = () => {
    try {
      localStorage.removeItem('klepon_weekly_turnament_state_v5');
      sessionStorage.clear();
      window.location.reload();
    } catch {
      window.location.reload();
    }
  };

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#040817] text-slate-100">
          <div className="bg-[#070e28] border-2 border-rose-500/50 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold tracking-wide uppercase text-white font-display">
                Pemulihan Dashboard Admin
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Terjadi kendala saat membaca data panel. Jangan khawatir, sistem telah mengamankan data turnamen Anda.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-[#030614] border border-rose-900/60 p-2.5 rounded-lg text-[11px] font-mono text-rose-300 break-words text-left max-h-24 overflow-y-auto">
                {this.state.error.message}
              </div>
            )}

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={this.handleRetry}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 text-slate-950 font-bold rounded-lg text-xs cursor-pointer shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-98"
              >
                <Shield className="w-4 h-4" />
                <span>Coba Buka Kembali Dashboard</span>
              </button>

              <button
                type="button"
                onClick={this.handleResetCache}
                className="w-full py-2 bg-blue-950/70 hover:bg-blue-900 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-mono flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Menyegarkan cache browser dan menyinkronkan ulang data dari Firestore"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Segarkan Cache & Sinkronkan Ulang</span>
              </button>

              <button
                type="button"
                onClick={this.props.onBackToPortal}
                className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 mx-auto cursor-pointer pt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali ke Website Utama</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
