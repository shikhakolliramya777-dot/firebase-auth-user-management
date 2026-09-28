import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginForm } from './components/LoginForm';
import { RegisterForm } from './components/RegisterForm';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { FirebaseDiagnosticsModal } from './components/FirebaseDiagnosticsModal';
import { ProfileDashboard } from './components/ProfileDashboard';
import { AuthNotification } from './types/auth';
import {
  ShieldCheck,
  MailCheck,
  Users,
  Flame,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  X,
  Sparkles,
  Lock,
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';

function MainContent() {
  const { currentUser, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [diagnosticsOpen, setDiagnosticsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AuthNotification[]>([]);

  const addNotification = (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, type, message, timestamp: Date.now() }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 6000);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleOpenForgotPassword = (email?: string) => {
    setForgotPasswordEmail(email || '');
    setForgotPasswordOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-xl shadow-orange-500/20 flex items-center justify-center animate-bounce">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Flame className="w-8 h-8 text-amber-400" />
          </div>
        </div>
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
          <span>Synchronizing with Firebase Authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Header */}
      <Navbar onOpenDiagnostics={() => setDiagnosticsOpen(true)} />

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`pointer-events-auto p-4 rounded-2xl border shadow-2xl flex items-start space-x-3 transition-all animate-in slide-in-from-bottom-3 duration-300 ${
              notif.type === 'success'
                ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-100'
                : notif.type === 'error'
                ? 'bg-red-950/90 border-red-500/50 text-red-100'
                : notif.type === 'warning'
                ? 'bg-amber-950/90 border-amber-500/50 text-amber-100'
                : 'bg-slate-900/90 border-slate-700 text-slate-100'
            }`}
          >
            {notif.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
            {notif.type === 'error' && <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />}
            {notif.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />}
            {notif.type === 'info' && <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />}
            <div className="flex-1 text-xs">{notif.message}</div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-slate-400 hover:text-white shrink-0 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {currentUser ? (
          /* Authenticated Dashboard */
          <ProfileDashboard onNotify={addNotification} />
        ) : (
          /* Unauthenticated Landing & Auth Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero & Explanations */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Powered by Firebase Auth • Project fir-87752</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Authentication &amp; User Management{' '}
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
                  with Email Verification
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                A complete, production-grade identity system featuring secure user registration, email verification flows, password reset recovery, and an interactive user management dashboard.
              </p>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                    <MailCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Automated Email Verification</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Dispatches verification links via Firebase with real-time status reload and resend throttling.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">User Management</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage display names, update email addresses, change passwords, and safely purge accounts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-3">
                    <Lock className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">Password Recovery</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Self-service password reset emails that securely direct users back into their accounts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-white text-sm">JWT Token Inspector</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Live inspection of token claims, email verification flags, timestamps, and provider metadata.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Authentication Card */}
            <div className="lg:col-span-5">
              {/* Tab Selector */}
              <div className="max-w-md mx-auto mb-4 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center shadow-lg">
                <button
                  type="button"
                  onClick={() => setAuthView('login')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    authView === 'login'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setAuthView('register')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                    authView === 'register'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {authView === 'login' ? (
                <LoginForm
                  onSwitchToRegister={() => setAuthView('register')}
                  onOpenForgotPassword={handleOpenForgotPassword}
                  onNotify={addNotification}
                />
              ) : (
                <RegisterForm
                  onSwitchToLogin={() => setAuthView('login')}
                  onNotify={addNotification}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
        defaultEmail={forgotPasswordEmail}
        onNotify={addNotification}
      />

      {/* Firebase Diagnostics Modal */}
      <FirebaseDiagnosticsModal
        isOpen={diagnosticsOpen}
        onClose={() => setDiagnosticsOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Firebase Authentication • Connected to Project ID: <code className="text-amber-400 font-mono">fir-87752</code></span>
          <button
            onClick={() => setDiagnosticsOpen(true)}
            className="hover:text-amber-400 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Diagnostics &amp; Configuration Settings
          </button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainContent />
    </AuthProvider>
  );
}
