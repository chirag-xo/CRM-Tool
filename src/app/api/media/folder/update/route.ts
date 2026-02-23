import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { folderId, name } = await request.json();

        if (!folderId || !name) {
            return NextResponse.json({ error: 'Folder ID and name are required' }, { status: 400 });
        }

        const { data: folder, error } = await supabaseAdmin
            .from('media_folders')
            .update({ name })
            .eq('id', folderId)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ folder });
    } catch (error: any) {
        console.error('Error updating folder:', error);
        return NextResponse.json({ error: 'Failed to update folder', details: error.message }, { status: 500 });
    }
}
