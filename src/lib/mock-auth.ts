/**
 * Mock authentication for demo purposes
 * Allows viewing the platform without real Supabase setup
 */

export interface MockUser {
  id: string;
  email: string;
  profile: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: 'team_staff' | 'admin';
    team_id: string | null;
    created_at: string;
    updated_at: string;
  };
}

export const mockUsers = {
  teamStaff: {
    id: 'mock-team-staff-id',
    email: 'sarah.johnson@lakers.com',
    profile: {
      id: 'mock-team-staff-id',
      first_name: 'Sarah',
      last_name: 'Johnson',
      email: 'sarah.johnson@lakers.com',
      role: 'team_staff' as const,
      team_id: '550e8400-e29b-41d4-a716-446655440001',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  },
  admin: {
    id: 'mock-admin-id',
    email: 'admin@athleticlabs.com',
    profile: {
      id: 'mock-admin-id',
      first_name: 'Athletic',
      last_name: 'Labs',
      email: 'admin@athleticlabs.com',
      role: 'admin' as const,
      team_id: null,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z'
    }
  }
} as const;

export function getMockUser(type: 'teamStaff' | 'admin'): MockUser {
  return mockUsers[type];
}