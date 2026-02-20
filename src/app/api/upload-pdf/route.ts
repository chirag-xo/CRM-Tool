import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Server-Role Supabase client to bypass RLS securely from the API route
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('pdf') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileName = `Itinerary_${Date.now()}_${file.name}`;

        const { error } = await supabaseAdmin.storage
            .from('itinerary_pdfs')
            .upload(fileName, file, {
                contentType: 'application/pdf',
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase Storage Error:', error);
            throw error;
        }

        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('itinerary_pdfs')
            .getPublicUrl(fileName);

        return NextResponse.json({ publicUrl });
    } catch (error: any) {
        console.error('Upload API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
