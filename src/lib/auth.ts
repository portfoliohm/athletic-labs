/**
 * Athletic Labs - Authentication Utilities
 * 
 * Handles user authentication, session management, and role-based access
 */

import { supabase } from './supabase';
import type { User } from '@supabase/supabase-js';
import type { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = 'team_staff' | 'admin';

export interface AuthUser extends User {
  profile?: Profile;
}

/**
 * Get current user session and profile
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    console.log('getCurrentUser: Starting...');
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    console.log('getCurrentUser: Auth user result:', user ? 'FOUND' : 'NOT FOUND', error);
    
    if (error || !user) {
      console.log('getCurrentUser: No user or error:', error?.message);
      return null;
    }

    // Fetch user profile
    console.log('getCurrentUser: Fetching profile for user:', user.id);
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    console.log('getCurrentUser: Profile result:', profile, 'Error:', profileError);

    return {
      ...user,
      profile: profile || undefined
    };
  } catch (error) {
    console.error('getCurrentUser: Caught error:', error);
    return null;
  }
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Sign out current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    throw new Error(error.message);
  }
}

/**
 * Check if user has specific role
 */
export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.profile?.role === role;
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  return hasRole(user, 'admin');
}

/**
 * Check if user is team staff
 */
export function isTeamStaff(user: AuthUser | null): boolean {
  return hasRole(user, 'team_staff');
}

/**
 * Check if user belongs to specific team
 */
export function belongsToTeam(user: AuthUser | null, teamId: string): boolean {
  return user?.profile?.team_id === teamId;
}

/**
 * Get user's team ID
 */
export function getUserTeamId(user: AuthUser | null): string | null {
  return user?.profile?.team_id || null;
}

/**
 * Create user profile after signup
 */
export async function createProfile(
  userId: string,
  profileData: Omit<Database['public']['Tables']['profiles']['Insert'], 'id'>
) {
  const { data, error } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      ...profileData
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

/**
 * Update user profile
 */
export async function updateProfile(
  userId: string,
  updates: Database['public']['Tables']['profiles']['Update']
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}