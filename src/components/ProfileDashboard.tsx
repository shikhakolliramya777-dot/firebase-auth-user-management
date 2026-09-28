import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { EmailVerificationBanner } from './EmailVerificationBanner';
import {
  User,
  Mail,
  Shield,
  ShieldCheck,
  ShieldAlert,
  KeyRound,
  Copy,
  Check,
  Clock,
  Calendar,
  Trash2,
  Save,
  Loader2,
  RefreshCw,
  Code2,
  AlertTriangle,
  Fingerprint,
  Lock,
  ChevronRight
} from 'lucide-react';

interface ProfileDashboardProps {
  onNotify: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ProfileDashboard: React.FC<ProfileDashboardProps> = ({ onNotify }) => {
  const {
    currentUser,
    tokenClaims,
    updateDisplayName,
    updateUserPassword,
    updateUserEmailAddress,
    deleteUserAccount,
    reloadUser,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'session' | 'danger'>('profile');
  
  // Profile state
  const [newDisplayName, setNewDisplayName] = useState(currentUser?.displayName || '');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [copiedUid, setCopiedUid] = useState(false);

  // Email update state
  const [newEmail, setNewEmail] = useState('');
  const [emailCurrentPassword, setEmailCurrentPassword] = useState('');
  const [updatingEmail, setUpdatingEmail] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  // Account deletion state
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!currentUser) return null;

  const handleCopyUid = () => {
    if (currentUser?.uid) {
      navigator.clipboard.writeText(currentUser.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
      onNotify('info', 'UID copied to clipboard');
    }
  };

  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      onNotify('error', 'Display name cannot be empty.');
      return;
    }
    setUpdatingProfile(true);
    const res = await updateDisplayName(newDisplayName);
    setUpdatingProfile(false);
    if (res.success) {
      onNotify('success', 'Profile display name updated successfully!');
    } else {
      onNotify('error', res.error || 'Failed to update display name.');
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !emailCurrentPassword) {
      onNotify('error', 'Please enter your new email and current password.');
      return;
    }
    setUpdatingEmail(true);
    const res = await updateUserEmailAddress(emailCurrentPassword, newEmail);
    setUpdatingEmail(false);
    if (res.success) {
      setNewEmail('');
      setEmailCurrentPassword('');
      onNotify('success', 'Email updated successfully. Please verify your new address.');
    } else {
      onNotify('error', res.error || 'Failed to update email address.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      onNotify('error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword.length < 6) {
      onNotify('error', 'New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      onNotify('error', 'New passwords do not match.');
      return;
    }
    setUpdatingPassword(true);
    const res = await updateUserPassword(currentPassword, newPassword);
    setUpdatingPassword(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      onNotify('success', 'Password successfully changed!');
    } else {
      onNotify('error', res.error || 'Failed to update password.');
    }
  };

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletePassword) {
      onNotify('error', 'Password is required to delete this account.');
      return;
    }
    setDeleting(true);
    const res = await deleteUserAccount(deletePassword);
    setDeleting(false);
    if (res.success) {
      setShowDeleteModal(false);
      onNotify('info', 'Your Firebase account has been permanently deleted.');
    } else {
      onNotify('error', res.error || 'Failed to delete account. Check your password.');
    }
  };

  const creationDate = currentUser.metadata.creationTime
    ? new Date(currentUser.metadata.creationTime).toLocaleString()
    : 'Unknown';
  const lastSignInDate = currentUser.metadata.lastSignInTime
    ? new Date(currentUser.metadata.lastSignInTime).toLocaleString()
    : 'Unknown';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Email Verification Banner */}
      <EmailVerificationBanner onNotify={onNotify} />

      {/* Profile Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-amber-500/10 via-orange-500/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-amber-400 font-extrabold text-2xl sm:text-3xl">
                {currentUser.displayName
                  ? currentUser.displayName[0].toUpperCase()
                  : currentUser.email
                  ? currentUser.email[0].toUpperCase()
                  : 'U'}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {currentUser.displayName || 'Firebase User'}
                </h1>
                {currentUser.emailVerified ? (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Unverified</span>
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-300 mt-0.5 font-mono">{currentUser.email}</p>

              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400">
                <span className="font-mono bg-slate-950/70 border border-slate-800 px-2 py-0.5 rounded text-[11px]">
                  UID: {currentUser.uid.slice(0, 14)}...
                </span>
                <button
                  onClick={handleCopyUid}
                  className="p-1 hover:text-white rounded hover:bg-slate-800 transition-colors"
                  title="Copy full UID"
                >
                  {copiedUid ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-800 gap-2">
            <span className="text-xs text-slate-400">Authentication Provider:</span>
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-800/90 rounded-xl border border-slate-700 text-xs font-medium text-slate-200">
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>Password &amp; Email</span>
            </div>
          </div>
        </div>

        {/* Quick Metadata Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block">Created On</span>
              <span className="text-slate-200 font-medium">{creationDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800">
            <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block">Last Sign-In</span>
              <span className="text-slate-200 font-medium">{lastSignInDate}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-950/50 p-3 rounded-xl border border-slate-800 sm:col-span-2 lg:col-span-1">
            <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="truncate">
              <span className="text-slate-400 block">Status Verification</span>
              <span className={currentUser.emailVerified ? 'text-emerald-300 font-medium' : 'text-amber-400 font-medium'}>
                {currentUser.emailVerified ? 'Email Confirmed' : 'Action Required'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'security'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Security &amp; Password</span>
        </button>

        <button
          onClick={() => setActiveTab('session')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'session'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Session &amp; Token Claims</span>
        </button>

        <button
          onClick={() => setActiveTab('danger')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'danger'
              ? 'bg-red-500/20 text-red-300 border border-red-500/30'
              : 'text-red-400/70 hover:text-red-300 hover:bg-red-950/20'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Danger Zone</span>
        </button>
      </div>

      {/* Tab 1: Profile Details */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Update Display Name */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Update Display Name</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Your name displayed across the app and verification records.
            </p>

            <form onSubmit={handleUpdateDisplayName} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  required
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  placeholder="Alex Johnson"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updatingProfile}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
              >
                {updatingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Name</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Update Email Address */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg">
            <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Change Email Address</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Requires entering your current password for security verification.
            </p>

            <form onSubmit={handleUpdateEmail} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  New Email Address
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new-email@example.com"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm With Current Password
                </label>
                <input
                  type="password"
                  required
                  value={emailCurrentPassword}
                  onChange={(e) => setEmailCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={updatingEmail}
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-all border border-slate-700 disabled:opacity-50 cursor-pointer"
              >
                {updatingEmail ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Email...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Update Email</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Password */}
      {activeTab === 'security' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg max-w-xl">
          <h3 className="text-base font-bold text-white mb-1 flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Change Your Password</span>
          </h3>
          <p className="text-xs text-slate-400 mb-6">
            Ensure your account is protected with a secure password at least 6 characters long.
          </p>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Re-type new password"
                className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={updatingPassword}
                className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
              >
                {updatingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Session & Token Claims */}
      {activeTab === 'session' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-slate-100 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span>Decoded Firebase ID Token Claims</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect JWT claims issued by Firebase Authentication for the current authenticated user.
              </p>
            </div>
            <button
              onClick={async () => {
                const res = await reloadUser();
                onNotify('info', `Token refreshed! Verified state: ${res.verified}`);
              }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs text-slate-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Token</span>
            </button>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-amber-300 overflow-x-auto">
            <pre>
              {JSON.stringify(
                {
                  uid: currentUser.uid,
                  email: currentUser.email,
                  email_verified: currentUser.emailVerified,
                  displayName: currentUser.displayName,
                  providerId: currentUser.providerId,
                  auth_time: tokenClaims?.auth_time
                    ? new Date(Number(tokenClaims.auth_time) * 1000).toISOString()
                    : undefined,
                  issued_at: tokenClaims?.iat
                    ? new Date(Number(tokenClaims.iat) * 1000).toISOString()
                    : undefined,
                  expires_at: tokenClaims?.exp
                    ? new Date(Number(tokenClaims.exp) * 1000).toISOString()
                    : undefined,
                  firebase: tokenClaims?.firebase,
                },
                null,
                2
              )}
            </pre>
          </div>

          <p className="text-[11px] text-slate-400">
            Note: The <code className="text-amber-300 font-mono">email_verified</code> claim updates when the user clicks the verification link in their email and reloads their session.
          </p>
        </div>
      )}

      {/* Tab 4: Danger Zone */}
      {activeTab === 'danger' && (
        <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-6 text-slate-100 shadow-lg space-y-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-red-200">Delete Account Permanently</h3>
              <p className="text-xs text-slate-300 mt-1">
                Once deleted, your account credentials, verification history, and user record will be permanently purged from the Firebase project (<span className="font-mono text-amber-200">fir-87752</span>). This action cannot be reversed.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-colors flex items-center space-x-2 shadow-md shadow-red-950/40 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-lg font-bold text-red-400 mb-2 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirm Permanent Deletion</span>
            </h3>
            <p className="text-xs text-slate-300 mb-4">
              Please enter your current password to confirm that you want to delete <strong className="text-white font-mono">{currentUser.email}</strong>.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <input
                  type="password"
                  required
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-3.5 py-2.5 text-sm text-white outline-none transition-all"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletePassword('');
                  }}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleting}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-md shadow-red-950/50 disabled:opacity-50 cursor-pointer"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
