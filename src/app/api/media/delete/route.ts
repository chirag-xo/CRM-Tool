import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(request: Request) {
    try {
        const { assetId } = await request.json();

        if (!assetId) {
            return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
        }

        // 1. Fetch asset details
        const { data: asset, error: fetchError } = await supabaseAdmin
            .from('media_assets')
            .select('file_path')
            .eq('id', assetId)
            .single();

        if (fetchError || !asset) throw new Error('Asset not found');

        // 2. Delete from Supabase Storage
        const { error: storageError } = await supabaseAdmin.storage
            .from('media-library')
            .remove([asset.file_path]);

        if (storageError) throw storageError;

        // 3. Delete from media_assets table
        const { error: dbError } = await supabaseAdmin
            .from('media_assets')
            .delete()
            .eq('id', assetId);

        if (dbError) throw dbError;

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting asset:', error);
        return NextResponse.json({ error: 'Failed to delete asset' }, { status: 500 });
    }
}
