import React, { useState } from 'react';
import { firebaseConfig } from '../firebase';
import { X, CheckCircle2, AlertCircle, ExternalLink, Copy, Check, Terminal, Flame, Info } from 'lucide-react';

interface FirebaseDiagnosticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseDiagnosticsModal: React.FC<FirebaseDiagnosticsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyConfig = () => {
    navigator.clipboard.writeText(JSON.stringify(firebaseConfig, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-0.5 shadow-lg shadow-orange-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Firebase Project Diagnostics</h2>
            <p className="text-xs text-slate-400">Connection details and configuration review</p>
          </div>
        </div>

        {/* Status Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">Target Project</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-white font-mono">{firebaseConfig.projectId}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Connected
              </span>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3.5 rounded-2xl">
            <span className="text-xs text-slate-400 block mb-1">Auth Domain</span>
            <span className="text-sm font-mono text-slate-200 truncate block">
              {firebaseConfig.authDomain}
            </span>
          </div>
        </div>

        {/* Firebase Console Requirements Guide */}
        <div className="bg-amber-950/20 border border-amber-500/30 rounded-2xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-2 text-slate-300">
              <p className="font-semibold text-amber-200">Firebase Console Settings Checklist:</p>
              <ol className="list-decimal list-inside space-y-1 text-slate-300">
                <li>
                  <strong className="text-white">Email/Password Provider:</strong> Go to{' '}
                  <a
                    href={`https://console.firebase.google.com/project/${firebaseConfig.projectId}/authentication/providers`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 underline hover:text-amber-300 inline-flex items-center"
                  >
                    Firebase Console &gt; Authentication &gt; Sign-in method <ExternalLink className="w-3 h-3 ml-1" />
                  </a>{' '}
                  and ensure <strong>Email/Password</strong> is toggled to <strong>Enabled</strong>.
                </li>
                <li>
                  <strong className="text-white">Email Verification:</strong> Firebase automatically handles sending verification emails. You can customize the template, sender name, and reply-to under <strong>Authentication &gt; Templates &gt; Email address verification</strong>.
                </li>
                <li>
                  <strong className="text-white">Authorized Domains:</strong> If testing in custom domains, ensure the hosting domain is in <strong>Authentication &gt; Settings &gt; Authorized domains</strong>.
                </li>
              </ol>
            </div>
          </div>
        </div>

        {/* Configuration Code Block */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center space-x-1.5">
              <Terminal className="w-4 h-4 text-slate-400" />
              <span>firebaseConfig Specification</span>
            </span>
            <button
              onClick={handleCopyConfig}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-amber-300 overflow-x-auto">
            <pre>{JSON.stringify(firebaseConfig, null, 2)}</pre>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close Diagnostics
        </button>
      </div>
    </div>
  );
};
