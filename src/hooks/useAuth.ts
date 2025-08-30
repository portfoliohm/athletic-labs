"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, type AuthUser } from '@/lib/auth';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        console.log('useAuth: Getting initial session...');
        
        // First check if there's an active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('useAuth: Session check:', session ? 'FOUND' : 'NOT FOUND', sessionError);
        
        if (sessionError) {
          console.error('useAuth: Session error:', sessionError);
          setError(sessionError.message);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log('useAuth: Session user found, getting profile...');
          const currentUser = await getCurrentUser();
          console.log('useAuth: Current user:', currentUser);
          setUser(currentUser);
        } else {
          console.log('useAuth: No active session');
          setUser(null);
        }
      } catch (err) {
        console.error('useAuth: Error in getInitialSession:', err);
        setError(err instanceof Error ? err.message : 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        setLoading(true);
        setError(null);

        try {
          if (session?.user) {
            const currentUser = await getCurrentUser();
            setUser(currentUser);
          } else {
            setUser(null);
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Authentication error');
          setUser(null);
        } finally {
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const isAdmin = user?.profile?.role === 'admin';
  const isTeamStaff = user?.profile?.role === 'team_staff';

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAdmin,
    isTeamStaff,
    teamId: user?.profile?.team_id || null
  };
}