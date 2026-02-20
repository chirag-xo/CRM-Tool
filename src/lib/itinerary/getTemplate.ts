import { createClient } from '@supabase/supabase-js';
import { normalizeDestination } from './saveTemplate';

// Initialize a server-only Supabase client using the Service Role Key
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Fetches an existing itinerary template based on destination and days.
 */
export async function getTemplate(
    destination: string,
    days: number
) {
    const normalizedDestination = normalizeDestination(destination);

    const { data, error } = await supabaseAdmin
        .from('itinerary_templates')
        .select('itinerary')
        .eq('destination', normalizedDestination)
        .eq('days', days)
        .maybeSingle();

    if (error) {
        console.error('Failed to fetch itinerary template:', error);
        return null;
    }

    return data?.itinerary || null;
}
