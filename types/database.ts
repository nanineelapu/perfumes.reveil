export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          created_at: string
          name: string
          price: number
          image_url: string | null
          description: string | null
          stock: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          price: number
          image_url?: string | null
          description?: string | null
          stock?: number
        }
        Update: {
          id?: string
          created_at?: string
          name: string
          price: number
          image_url?: string | null
          description?: string | null
          stock?: number
        }
      }
    }
  }
}
