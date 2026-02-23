import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { folderId } = await request.json();

        if (!folderId) {
            return NextResponse.json({ error: 'Folder ID is required' }, { status: 400 });
        }

        // 1. Move all assets to root (set folder_id to null)
        const { error: moveError } = await supabaseAdmin
            .from('media_assets')
            .update({ folder_id: null })
            .eq('folder_id', folderId);

        if (moveError) throw moveError;

        // 2. Delete the folder
        const { error: deleteError } = await supabaseAdmin
            .from('media_folders')
            .delete()
            .eq('id', folderId);

        if (deleteError) throw deleteError;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Error deleting folder:', error);
        return NextResponse.json({ error: 'Failed to delete folder', details: error.message }, { status: 500 });
    }
}
