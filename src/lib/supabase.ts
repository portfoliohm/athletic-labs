/**
 * Athletic Labs - Supabase Client Configuration
 * 
 * Provides authenticated database access for Athletic Labs platform
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Type definitions for our database
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          role: 'team_staff' | 'admin'
          team_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      teams: {
        Row: {
          id: string
          name: string
          league: string
          city: string
          nutrition_profile: {
            protein: number
            carbs: number
            fats: number
          }
          roster_size: number
          budget_limit: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['teams']['Insert']>
      }
      menu_templates: {
        Row: {
          id: string
          name: string
          description: string | null
          cuisine_type: string
          bundle_price: number
          serves_count: number
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['menu_templates']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['menu_templates']['Insert']>
      }
      orders: {
        Row: {
          id: string
          team_id: string
          order_number: string
          status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
          contact_name: string
          contact_phone: string
          contact_email: string
          delivery_date: string
          delivery_time: string | null
          delivery_location: string
          delivery_instructions: string | null
          estimated_people_count: number | null
          subtotal_amount: number
          tax_rate: number
          tax_amount: number
          rush_surcharge: number
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'order_number' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
    }
  }
}