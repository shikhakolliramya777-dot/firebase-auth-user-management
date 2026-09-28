import type { User } from 'firebase/auth';

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  creationTime?: string;
  lastSignInTime?: string;
  providerId: string;
}

export interface AuthNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  timestamp: number;
}

export function formatFirebaseError(errorCode: string, defaultMessage?: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'The email address is invalid. Please check the spelling and format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled by an administrator.';
    case 'auth/user-not-found':
      return 'No account found with this email address. Please register first.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable Email/Password provider under Authentication > Sign-in method in Firebase Console.';
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters including letters and numbers.';
    case 'auth/too-many-requests':
      return 'Access to this account has been temporarily disabled due to many failed login attempts. Please reset your password or try again later.';
    case 'auth/network-request-failed':
      return 'Network connection failed. Please verify your internet connection.';
    case 'auth/requires-recent-login':
      return 'This sensitive operation requires recent authentication. Please log out and log back in before retrying.';
    case 'auth/popup-closed-by-user':
      return 'Authentication popup was closed before completing.';
    default:
      return defaultMessage || errorCode.replace('auth/', '').replace(/-/g, ' ');
  }
}
