import React from 'react';
import { useAuth } from '../context/AuthContext';
import { firebaseConfig } from '../firebase';
import { Flame, ShieldCheck, AlertCircle, LogOut, Wrench, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  onOpenDiagnostics: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDiagnostics }) => {
  const { currentUser, logoutUser } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white">Firebase Auth</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium">
                fir-87752
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">User Management &amp; Email Verification</p>
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenDiagnostics}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800/80 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors"
            title="Inspect Firebase Auth configuration &amp; connection status"
          >
            <Wrench className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Firebase Status</span>
          </button>

          {currentUser ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-inner">
                  {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
                </div>
                <div className="hidden md:block text-left">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    {currentUser.emailVerified ? (
                      <span title="Email is Verified">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
                      </span>
                    ) : (
                      <span title="Email Not Verified">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 inline" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono truncate max-w-[140px]">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              <button
                onClick={() => logoutUser()}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-950/30 hover:bg-red-900/40 border border-red-800/40 transition-colors"
                title="Sign out of your account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                <UserIcon className="w-3 h-3 mr-1 text-slate-500" />
                Guest Mode
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
