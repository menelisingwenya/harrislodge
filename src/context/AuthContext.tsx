import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from 'react';
import type { Profile, UserRole } from '@/types/database';
import { StorageStore, SEED_PROFILES } from '@/lib/storage';

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  profile: Profile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password?: string) => Promise<void>;
  signUpWithEmail: (
    email: string,
    password?: string,
    fullName?: string,
    role?: UserRole,
    branchId?: string
  ) => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = StorageStore.getCurrentUser();
      if (savedUser) {
        setProfile(savedUser);
      }
    } catch (err) {
      console.warn('Auth init failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 100));
      const profiles = StorageStore.getProfiles();
      let matched = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());

      if (!matched) {
        // Create guest profile if not existing
        matched = {
          id: `usr-${Date.now()}`,
          email,
          role: 'guest',
          branch_id: null,
          full_name: email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        StorageStore.saveProfiles([...profiles, matched]);
      }

      setProfile(matched);
      StorageStore.saveCurrentUser(matched);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUpWithEmail = useCallback(
    async (
      email: string,
      _password?: string,
      fullName?: string,
      role: UserRole = 'guest',
      branchId?: string
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise((r) => setTimeout(r, 100));
        const profiles = StorageStore.getProfiles();
        const existing = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
        if (existing) {
          throw new Error('An account with this email already exists.');
        }

        const newProfile: Profile = {
          id: `usr-${Date.now()}`,
          email,
          role,
          branch_id: branchId ?? null,
          full_name: fullName ?? email.split('@')[0],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        StorageStore.saveProfiles([...profiles, newProfile]);
        setProfile(newProfile);
        StorageStore.saveCurrentUser(newProfile);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Sign up failed';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const switchDemoRole = useCallback((targetRole: UserRole) => {
    const matched = SEED_PROFILES.find((p) => p.role === targetRole) ?? SEED_PROFILES[0];
    setProfile(matched);
    StorageStore.saveCurrentUser(matched);
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 50));
      setProfile(null);
      StorageStore.saveCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const user: AuthUser | null = profile
    ? { id: profile.id, email: profile.email }
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role ?? 'guest',
        isAuthenticated: !!profile,
        isLoading,
        error,
        signInWithEmail,
        signUpWithEmail,
        switchDemoRole,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
