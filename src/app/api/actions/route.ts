import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create a local client that prefers Service Role Key for admin actions
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
    try {
        // Debug Logging
        console.log('API Request Received');
        console.log('Env Check:', {
            url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        });

        const body = await request.json();
        console.log('Payload:', JSON.stringify(body, null, 2));

        const { action, data } = body;

        if (!action) {
            return NextResponse.json({ error: 'Missing action' }, { status: 400 });
        }

        if (action === 'create_lead') {
            const insertData = {
                name: data.traveller_name, // Map to existing column
                phone: data.phone || '', // Empty string if missing
                from_location: data.from_location || '', // Map from_location
                to_location: data.destination || '', // Map destination to to_location
                traveller_name: data.traveller_name,
                destination: data.destination,
                start_date: data.startDate || new Date().toISOString(), // Default to now if missing
                end_date: data.endDate || new Date().toISOString(), // Default to now if missing
                travellers: data.paxCount || 1, // Map paxCount to travellers column
                // purpose: data.purpose || null, // Column missing
                // pax_count: data.paxCount || null, // Column missing
                created_by: data.created_by || null
            };
            console.log('Inserting into leads:', insertData);

            const { error } = await supabase
                .from('leads')
                .insert([insertData]);

            if (error) {
                console.error('Supabase Insert Error (leads):', error);
                throw error;
            }
        } else if (action === 'log_share') {
            if (!['whatsapp', 'email', 'link'].includes(data.shared_via)) {
                return NextResponse.json({ error: 'Invalid share method' }, { status: 400 });
            }

            const insertData = {
                itinerary_id: data.itinerary_id,
                shared_via: data.shared_via,
                created_by: data.created_by || null
            };
            console.log('Inserting into itinerary_shares:', insertData);

            // DEPRECATED: We no longer track shares in this table for stats.
            // Keeping the log for audit trail if needed, but for now we can even skip it
            // or just log to console. user requested "Remove / Disable... Any logic that increments... Any inserts"
            console.log('Share action triggered (logging disabled for strict state-based logic):', data);

            // If you want to keep strict "no inserts", we just do nothing here.
            // const { error } = await supabase.from('itinerary_shares').insert([insertData]);
        } else if (action === 'update_lead_status') {
            const { lead_id, status } = data;
            console.log('Updating lead status:', { lead_id, status });

            const updates: any = { status };

            // @ts-ignore
            const { data: updateData, error } = await supabase
                .from('leads')
                .update(updates)
                .eq('id', lead_id)
                .select();

            if (error) {
                console.error('Error updating lead status:', error);
                throw error;
            }
            console.log('Update success:', updateData);
        } else if (action === 'mark_lead_shared') {
            const { lead_id } = data;
            console.log(`Marking lead ${lead_id} as shared`);

            // just update status
            const updates: any = { status: 'shared' };

            // @ts-ignore
            const { error } = await supabase
                .from('leads')
                .update(updates)
                .eq('id', lead_id);

            if (error) {
                console.error('Supabase Update Error (mark_lead_shared):', error);
                throw error;
            }
        } else if (action === 'delete_lead') {
            const { lead_id } = data;
            console.log(`Deleting lead ${lead_id}`);

            // Optional: consistency delete from itinerary_shares if you want to be super clean, 
            // though we stopped using it for stats.
            await supabase.from('itinerary_shares').delete().eq('lead_id', lead_id);

            // Delete the lead
            // @ts-ignore
            const { error } = await supabase
                .from('leads')
                .delete()
                .eq('id', lead_id);

            if (error) {
                console.error('Supabase Delete Error:', error);
                throw error;
            }
        } else {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('CRITICAL API ERROR:', error);
        return NextResponse.json({
            error: 'Failed to process action',
            details: error.message || error,
            code: error.code || 'UNKNOWN'
        }, { status: 500 });
    }
}

