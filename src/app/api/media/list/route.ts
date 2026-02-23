import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const folderId = searchParams.get('folderId');
        const limit = parseInt(searchParams.get('limit') || '100');
        const offset = parseInt(searchParams.get('offset') || '0');

        // Fetch Folders (only if root or if explicitly requested)
        let folders = [];
        if (!offset) {
            const { data: folderData } = await supabaseAdmin
                .from('media_folders')
                .select('*')
                .order('name');
            folders = folderData || [];
        }

        // Fetch Assets
        let query = supabaseAdmin
            .from('media_assets')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (folderId) {
            query = query.eq('folder_id', folderId);
        } else {
            query = query.is('folder_id', null);
        }

        const { data: assets, count, error } = await query;

        if (error) throw error;

        return NextResponse.json({
            folders,
            assets,
            total: count,
            hasMore: (count || 0) > offset + limit
        });
    } catch (error) {
        console.error('Error listing media:', error);
        return NextResponse.json({ error: 'Failed to list media' }, { status: 500 });
    }
}
