export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        const { count: leadsCount, error: leadsError } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true });

        if (leadsError) throw leadsError;

        // count shared (status = 'shared')
        // State-based counting as per new business rule
        const { count: sharedCount, error: sharedError } = await supabase
            .from('leads')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'shared');

        if (sharedError) throw sharedError;

        return NextResponse.json({
            leadsGenerated: leadsCount || 0,
            itinerariesShared: sharedCount || 0
        });
    } catch (error) {
        console.error('Error fetching activity stats:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
