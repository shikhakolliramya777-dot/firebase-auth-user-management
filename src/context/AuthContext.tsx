import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  updateEmail,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  ParsedToken
} from 'firebase/auth';
import { auth } from '../firebase';
import { formatFirebaseError } from '../types/auth';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  tokenClaims: ParsedToken | null;
  registerUser: (email: string, password: string, displayName: string) => Promise<{ success: boolean; error?: string }>;
  loginUser: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
  sendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
  reloadUser: () => Promise<{ success: boolean; verified: boolean; error?: string }>;
  sendResetPasswordEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  updateDisplayName: (name: string) => Promise<{ success: boolean; error?: string }>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUserEmailAddress: (currentPassword: string, newEmail: string) => Promise<{ success: boolean; error?: string }>;
  deleteUserAccount: (currentPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenClaims, setTokenClaims] = useState<ParsedToken | null>(null);

  const fetchTokenClaims = useCallback(async (user: User | null) => {
    if (!user) {
      setTokenClaims(null);
      return;
    }
    try {
      const idTokenResult = await user.getIdTokenResult(true);
      setTokenClaims(idTokenResult.claims);
    } catch {
      // Ignored if unable to fetch claims
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        await fetchTokenClaims(user);
      } else {
        setTokenClaims(null);
      }
    });

    return () => unsubscribe();
  }, [fetchTokenClaims]);

  // Register with email and password, set display name, and dispatch verification email
  const registerUser = async (email: string, password: string, displayName: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      
      // Update display name if provided
      if (displayName.trim()) {
        await updateProfile(credential.user, {
          displayName: displayName.trim(),
        });
      }

      // Automatically send verification email
      try {
        await sendEmailVerification(credential.user);
      } catch (verificationErr) {
        console.warn('Initial verification email sending notice:', verificationErr);
      }

      // Refresh local user state
      await credential.user.reload();
      setCurrentUser({ ...auth.currentUser! });
      await fetchTokenClaims(auth.currentUser);

      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Sign in with email and password
  const loginUser = async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
      await fetchTokenClaims(credential.user);
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Sign out
  const logoutUser = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setTokenClaims(null);
  };

  // Send verification email to currently authenticated user
  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      return { success: false, error: 'No user is currently signed in.' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Reload current user state from Firebase servers (e.g. after clicking email link)
  const reloadUser = async () => {
    if (!auth.currentUser) {
      return { success: false, verified: false, error: 'No user signed in.' };
    }
    try {
      await auth.currentUser.reload();
      const updated = auth.currentUser;
      setCurrentUser(updated ? Object.assign(Object.create(Object.getPrototypeOf(updated)), updated) : null);
      if (updated) {
        await fetchTokenClaims(updated);
      }
      return { success: true, verified: updated?.emailVerified ?? false };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, verified: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Send password reset email
  const sendResetPasswordEmail = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Update Display Name
  const updateDisplayName = async (name: string) => {
    if (!auth.currentUser) return { success: false, error: 'No user signed in.' };
    try {
      await updateProfile(auth.currentUser, { displayName: name.trim() });
      await auth.currentUser.reload();
      setCurrentUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Update Password (requires re-auth with current password)
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, error: 'No authenticated user found.' };
    }
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Update Email Address (requires re-auth with current password)
  const updateUserEmailAddress = async (currentPassword: string, newEmail: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, error: 'No authenticated user found.' };
    }
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail.trim());
      await auth.currentUser.reload();
      setCurrentUser(Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser));
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  // Delete User Account (requires re-auth)
  const deleteUserAccount = async (currentPassword: string) => {
    if (!auth.currentUser || !auth.currentUser.email) {
      return { success: false, error: 'No authenticated user found.' };
    }
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await deleteUser(auth.currentUser);
      setCurrentUser(null);
      setTokenClaims(null);
      return { success: true };
    } catch (err: any) {
      const code = err.code || '';
      return { success: false, error: formatFirebaseError(code, err.message) };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        tokenClaims,
        registerUser,
        loginUser,
        logoutUser,
        sendVerificationEmail,
        reloadUser,
        sendResetPasswordEmail,
        updateDisplayName,
        updateUserPassword,
        updateUserEmailAddress,
        deleteUserAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
