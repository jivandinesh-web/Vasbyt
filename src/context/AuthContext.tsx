import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  auth,
  db,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  updateProfile,
  fbSignOut,
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  handleFirestoreError,
  OperationType,
  FirebaseUser,
} from '../lib/firebase';
import { UserProfile, UserFavorites } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  authLoading: boolean;
  loginError: string | null;
  syncState: 'saved' | 'saving' | 'offline' | 'error';
  lastSyncedAt: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  loginAsGuestRunner: (name?: string, license?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearLoginError: () => void;
  saveCloudProfile: (profile: UserProfile, favorites?: UserFavorites) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
  onProfileSyncedFromCloud?: (profile: UserProfile, favorites: UserFavorites) => void;
  currentLocalProfile: UserProfile;
  currentLocalFavorites: UserFavorites;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  onProfileSyncedFromCloud,
  currentLocalProfile,
  currentLocalFavorites,
}) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [syncState, setSyncState] = useState<'saved' | 'saving' | 'offline' | 'error'>('saved');
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const openLoginModal = useCallback(() => {
    setLoginError(null);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginError(null);
  }, []);

  // Clear any login error message
  const clearLoginError = useCallback(() => {
    setLoginError(null);
  }, []);

  // Sync profile & favorites to Firestore
  const saveCloudProfile = useCallback(
    async (profileToSave: UserProfile, favoritesToSave?: UserFavorites) => {
      if (!auth.currentUser) return;
      const uid = auth.currentUser.uid;
      const path = `users/${uid}`;
      setSyncState('saving');

      try {
        const payload = {
          uid,
          email: auth.currentUser.email || profileToSave.email || '',
          name: profileToSave.name || auth.currentUser.displayName || '',
          photoURL: auth.currentUser.photoURL || profileToSave.photoURL || '',
          province: profileToSave.province || '',
          club: profileToSave.club || '',
          licenseNumber: profileToSave.licenseNumber || '',
          category: profileToSave.category || '',
          pb5k: profileToSave.pb5k || '',
          pb10k: profileToSave.pb10k || '',
          pbHalf: profileToSave.pbHalf || '',
          pbFull: profileToSave.pbFull || '',
          pbUltra: profileToSave.pbUltra || '',
          goal: profileToSave.goal || '',
          favorites: favoritesToSave || { races: [], clubs: [] },
          updatedAt: new Date().toISOString(),
        };

        await setDoc(doc(db, 'users', uid), payload, { merge: true });
        setSyncState('saved');
        setLastSyncedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
      } catch (err: unknown) {
        console.error('Error saving profile to Firestore:', err);
        setSyncState('error');
        try {
          handleFirestoreError(err, OperationType.WRITE, path);
        } catch {
          // Handled and logged
        }
      }
    },
    []
  );

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        // User logged in: Listen or fetch their Firestore document
        const userDocRef = doc(db, 'users', currentUser.uid);
        const path = `users/${currentUser.uid}`;

        try {
          const docSnap = await getDoc(userDocRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const cloudProfile: UserProfile = {
              uid: currentUser.uid,
              email: currentUser.email || '',
              photoURL: currentUser.photoURL || '',
              name: data.name || currentUser.displayName || '',
              province: data.province || '',
              club: data.club || '',
              licenseNumber: data.licenseNumber || '',
              category: data.category || '',
              pb5k: data.pb5k || '',
              pb10k: data.pb10k || '',
              pbHalf: data.pbHalf || '',
              pbFull: data.pbFull || '',
              pbUltra: data.pbUltra || '',
              goal: data.goal || '',
              updatedAt: data.updatedAt || '',
            };

            const cloudFavorites: UserFavorites = {
              races: Array.isArray(data.favorites?.races) ? data.favorites.races : [],
              clubs: Array.isArray(data.favorites?.clubs) ? data.favorites.clubs : [],
            };

            if (onProfileSyncedFromCloud) {
              onProfileSyncedFromCloud(cloudProfile, cloudFavorites);
            }
            setSyncState('saved');
            setLastSyncedAt(new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }));
          } else {
            // First-time sign in: Seed cloud document with current local profile & favorites
            const initialProfile: UserProfile = {
              ...currentLocalProfile,
              uid: currentUser.uid,
              email: currentUser.email || '',
              name: currentLocalProfile.name || currentUser.displayName || '',
              photoURL: currentUser.photoURL || '',
            };

            await setDoc(userDocRef, {
              uid: currentUser.uid,
              email: currentUser.email || '',
              name: initialProfile.name,
              photoURL: currentUser.photoURL || '',
              province: initialProfile.province || '',
              club: initialProfile.club || '',
              licenseNumber: initialProfile.licenseNumber || '',
              category: initialProfile.category || '',
              pb5k: initialProfile.pb5k || '',
              pb10k: initialProfile.pb10k || '',
              pbHalf: initialProfile.pbHalf || '',
              pbFull: initialProfile.pbFull || '',
              pbUltra: initialProfile.pbUltra || '',
              goal: initialProfile.goal || '',
              favorites: currentLocalFavorites,
              updatedAt: new Date().toISOString(),
            });

            if (onProfileSyncedFromCloud) {
              onProfileSyncedFromCloud(initialProfile, currentLocalFavorites);
            }
            setSyncState('saved');
          }
        } catch (err: unknown) {
          console.error('Error fetching user document from Firestore:', err);
          try {
            handleFirestoreError(err, OperationType.GET, path);
          } catch {
            // Logged
          }
        }

        // Setup real-time listener for multi-tab synchronization
        const unsubSnapshot = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.data();
              const updatedProfile: UserProfile = {
                uid: currentUser.uid,
                email: currentUser.email || '',
                photoURL: currentUser.photoURL || '',
                name: data.name || currentUser.displayName || '',
                province: data.province || '',
                club: data.club || '',
                licenseNumber: data.licenseNumber || '',
                category: data.category || '',
                pb5k: data.pb5k || '',
                pb10k: data.pb10k || '',
                pbHalf: data.pbHalf || '',
                pbFull: data.pbFull || '',
                pbUltra: data.pbUltra || '',
                goal: data.goal || '',
                updatedAt: data.updatedAt || '',
              };
              const updatedFavs: UserFavorites = {
                races: Array.isArray(data.favorites?.races) ? data.favorites.races : [],
                clubs: Array.isArray(data.favorites?.clubs) ? data.favorites.clubs : [],
              };
              if (onProfileSyncedFromCloud) {
                onProfileSyncedFromCloud(updatedProfile, updatedFavs);
              }
            }
          },
          (err) => {
            console.error('Snapshot listener error:', err);
            handleFirestoreError(err, OperationType.GET, path);
          }
        );

        return () => {
          unsubSnapshot();
        };
      }
    });

    return () => unsubscribe();
  }, [onProfileSyncedFromCloud]);

  // Google Login function
  const loginWithGoogle = async () => {
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (err: unknown) {
      console.error('Google Sign-In failed:', err);
      const errorMsg =
        err instanceof Error
          ? err.message
          : 'Failed to sign in with Google. Please try again.';

      if (errorMsg.includes('popup-closed-by-user')) {
        setLoginError('Sign-in cancelled. Please click "Sign in with Google" to try again.');
      } else if (errorMsg.includes('popup-blocked')) {
        setLoginError('The Google sign-in popup was blocked by your browser. Please allow popups for this site.');
      } else {
        setLoginError('Google Sign-In could not be completed. Please try again or open the app in a new tab.');
      }
    }
  };

  // Email & Password Sign-In
  const loginWithEmail = async (email: string, pass: string) => {
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
      setIsLoginModalOpen(false);
    } catch (err: unknown) {
      console.error('Email login failed:', err);
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('user-not-found') || errorMsg.includes('invalid-credential') || errorMsg.includes('wrong-password')) {
        setLoginError('Invalid email or password. Please check your credentials or register a new runner account.');
      } else if (errorMsg.includes('invalid-email')) {
        setLoginError('Please enter a valid email address.');
      } else if (errorMsg.includes('too-many-requests')) {
        setLoginError('Too many failed login attempts. Please wait a moment and try again.');
      } else {
        setLoginError('Sign-in failed. Please verify your details or use Google Sign-In.');
      }
    }
  };

  // Email & Password Registration
  const registerWithEmail = async (email: string, pass: string, name?: string) => {
    setLoginError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (name && userCredential.user) {
        try {
          await updateProfile(userCredential.user, { displayName: name.trim() });
        } catch {
          // Ignored
        }
      }
      setIsLoginModalOpen(false);
    } catch (err: unknown) {
      console.error('Registration failed:', err);
      const errorMsg = err instanceof Error ? err.message : '';
      if (errorMsg.includes('email-already-in-use')) {
        setLoginError('An account with this email already exists. Please switch to the Sign In tab.');
      } else if (errorMsg.includes('weak-password')) {
        setLoginError('Password should be at least 6 characters.');
      } else if (errorMsg.includes('invalid-email')) {
        setLoginError('Please enter a valid email address.');
      } else {
        setLoginError('Registration failed. Please check your information and try again.');
      }
    }
  };

  // Quick Guest / Runner Passport Sign-In
  const loginAsGuestRunner = async (name?: string, license?: string) => {
    setLoginError(null);
    try {
      const userCredential = await signInAnonymously(auth);
      if (userCredential.user && name) {
        try {
          await updateProfile(userCredential.user, { displayName: name.trim() });
        } catch {
          // Ignored
        }
      }
      if (userCredential.user && (name || license)) {
        // Save initial license and name to local profile state
        const updatedLocal = {
          ...currentLocalProfile,
          name: name?.trim() || currentLocalProfile.name || 'Runner',
          licenseNumber: license?.trim() || currentLocalProfile.licenseNumber || '',
        };
        await saveCloudProfile(updatedLocal, currentLocalFavorites);
      }
      setIsLoginModalOpen(false);
    } catch (err: unknown) {
      console.error('Guest sign-in failed:', err);
      setLoginError('Unable to initialize guest session. Please try Google Sign-In.');
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fbSignOut(auth);
      setUser(null);
      setSyncState('saved');
    } catch (err: unknown) {
      console.error('Sign-out failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        loginError,
        syncState,
        lastSyncedAt,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        loginAsGuestRunner,
        logout,
        clearLoginError,
        saveCloudProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
