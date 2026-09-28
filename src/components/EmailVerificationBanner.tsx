import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, RefreshCw, Send, CheckCircle2, AlertTriangle, ExternalLink, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface EmailVerificationBannerProps {
  onNotify?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ onNotify }) => {
  const { currentUser, sendVerificationEmail, reloadUser } = useAuth();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [showTips, setShowTips] = useState(false);
  const [lastSentTime, setLastSentTime] = useState<number | null>(null);

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  if (!currentUser) return null;

  // If already verified, show a subtle verified badge or nothing
  if (currentUser.emailVerified) {
    return (
      <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-4 flex items-center justify-between text-emerald-200 mb-6 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-200">Email Address Verified</p>
            <p className="text-xs text-emerald-300/80">
              Your account has full access and verified status for <span className="font-mono">{currentUser.email}</span>.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
          Verified Account
        </span>
      </div>
    );
  }

  // Handle Resend Verification Email
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    const result = await sendVerificationEmail();
    setResending(false);

    if (result.success) {
      setCooldown(60);
      setLastSentTime(Date.now());
      if (onNotify) {
        onNotify('success', `Verification email dispatched to ${currentUser.email}! Please check your inbox and spam folder.`);
      }
    } else {
      if (onNotify) {
        onNotify('error', result.error || 'Failed to send verification email. Please try again.');
      }
    }
  };

  // Handle Check Verification Status (reload token)
  const handleCheckStatus = async () => {
    setChecking(true);
    const result = await reloadUser();
    setChecking(false);

    if (result.verified) {
      if (onNotify) {
        onNotify('success', 'Email confirmed! Your account is now verified.');
      }
    } else {
      if (onNotify) {
        onNotify('info', 'Email is not verified yet. If you just clicked the email link, wait a few seconds and try again.');
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-amber-950/70 via-amber-900/40 to-slate-900 border border-amber-500/40 rounded-2xl p-5 mb-6 text-slate-100 shadow-xl shadow-amber-950/20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left column */}
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <Mail className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-semibold text-amber-200">Email Verification Pending</h3>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full">
                Action Required
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1">
              A verification link was sent to <strong className="text-white font-mono">{currentUser.email}</strong>.
              Click the link in your email to verify your ownership.
            </p>
            {lastSentTime && (
              <p className="text-xs text-amber-400/80 mt-1">
                Last sent just now. Please allow up to 1-2 minutes for email delivery.
              </p>
            )}
          </div>
        </div>

        {/* Right column buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0">
          <button
            onClick={handleCheckStatus}
            disabled={checking}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-900/30 disabled:opacity-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Checking...' : "I've Verified My Email"}</span>
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {resending
                ? 'Sending...'
                : cooldown > 0
                ? `Resend in ${cooldown}s`
                : 'Resend Email'}
            </span>
          </button>

          <button
            onClick={() => setShowTips(!showTips)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Email troubleshooting tips"
          >
            {showTips ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Accordion / Troubleshooting tips */}
      {showTips && (
        <div className="mt-4 pt-4 border-t border-amber-500/20 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-amber-300 flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4" />
            <span>Can't find the verification email?</span>
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
            <li>Check your <strong className="text-white">Spam</strong>, <strong className="text-white">Junk</strong>, or <strong className="text-white">Promotions</strong> folders.</li>
            <li>Firebase sends the email from <code className="bg-slate-800 px-1 py-0.5 rounded text-amber-200 font-mono">noreply@fir-87752.firebaseapp.com</code>.</li>
            <li>Ensure the email address was entered without typos (<span className="font-mono text-white">{currentUser.email}</span>).</li>
            <li>If you are in test development, make sure the email account genuinely exists and accepts incoming emails.</li>
          </ul>
        </div>
      )}
    </div>
  );
};
