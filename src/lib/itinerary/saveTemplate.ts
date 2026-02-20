import { createClient } from '@supabase/supabase-js';

// Initialize a server-only Supabase client using the Service Role Key
// This bypasses RLS and should ONLY be used in server environments (API routes/Server actions)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Normalizes a destination string for consistent database storage
 */
export function normalizeDestination(destination: string): string {
    return destination.trim().toLowerCase();
}

/**
 * Saves a generated itinerary to the 'itinerary_templates' table if it doesn't already exist.
 */
export async function saveTemplateIfNotExists(
    destination: string,
    days: number,
    itinerary: any
) {
    const normalizedDestination = normalizeDestination(destination);

    // Check if it already exists
    const { data: existing } = await supabaseAdmin
        .from('itinerary_templates')
        .select('id')
        .eq('destination', normalizedDestination)
        .eq('days', days)
        .maybeSingle();

    if (existing) return;

    // Insert the new template
    const { error } = await supabaseAdmin
        .from('itinerary_templates')
        .insert({
            destination: normalizedDestination,
            days,
            itinerary
        });

    if (error) {
        console.error('Failed to save itinerary template:', error);
    }
}
