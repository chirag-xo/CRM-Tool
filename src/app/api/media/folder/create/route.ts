import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('media_folders')
            .insert({ name })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ folder: data });
    } catch (error) {
        console.error('Error creating folder:', error);
        return NextResponse.json({ error: 'Failed to create folder' }, { status: 500 });
    }
}
