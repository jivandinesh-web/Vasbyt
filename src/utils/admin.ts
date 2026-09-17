import { FirebaseUser } from '../lib/firebase';
import { UserProfile } from '../types';

// Designated administrators authorized to publish and manage race fixtures
const DEFAULT_ADMIN_EMAILS = ['jivandinesh@gmail.com'];

export function getAdminEmails(): string[] {
  const metaEnv = (import.meta as any).env;
  const envAdmins = metaEnv?.VITE_ADMIN_EMAILS
    ? (metaEnv.VITE_ADMIN_EMAILS as string)
        .split(',')
        .map((e: string) => e.trim().toLowerCase())
        .filter(Boolean)
    : [];
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envAdmins]));
}

/**
 * Checks whether the current authenticated user has administrative privileges.
 * An administrator is identified by their verified email address matching the authorized list.
 */
export function isAdminUser(
  user: FirebaseUser | null | undefined,
  profile?: UserProfile | null
): boolean {
  if (!user) return false;

  const adminEmails = getAdminEmails();

  if (user.email) {
    const userEmail = user.email.toLowerCase().trim();
    if (adminEmails.includes(userEmail)) {
      return true;
    }
  }

  if (profile?.email) {
    const profileEmail = profile.email.toLowerCase().trim();
    if (adminEmails.includes(profileEmail)) {
      return true;
    }
  }

  return false;
}
