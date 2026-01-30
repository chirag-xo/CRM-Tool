export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            leads: {
                Row: {
                    id: string
                    created_at: string
                    created_by: string | null
                    name: string | null
                    phone: string | null
                    from_location: string | null
                    to_location: string | null
                    traveller_name: string | null
                    destination: string | null
                    start_date: string | null
                    end_date: string | null
                    travellers: number | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    created_by?: string | null
                    name?: string | null
                    phone?: string | null
                    from_location?: string | null
                    to_location?: string | null
                    traveller_name?: string | null
                    destination?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    travellers?: number | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    created_by?: string | null
                    name?: string | null
                    phone?: string | null
                    from_location?: string | null
                    to_location?: string | null
                    traveller_name?: string | null
                    destination?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    travellers?: number | null
                }
                Relationships: []
            }
            itinerary_shares: {
                Row: {
                    id: string
                    created_at: string
                    created_by: string | null
                    itinerary_id: string | null
                    shared_via: 'whatsapp' | 'email' | 'link' | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    created_by?: string | null
                    itinerary_id?: string | null
                    shared_via?: 'whatsapp' | 'email' | 'link' | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    created_by?: string | null
                    itinerary_id?: string | null
                    shared_via?: 'whatsapp' | 'email' | 'link' | null
                }
                Relationships: []
            }
        }
    }
}
