import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folderId = formData.get('folderId') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = folderId ? `${folderId}/${fileName}` : fileName;

        // 1. Ensure bucket exists (Auto-setup for convenience)
        const { data: bucket, error: bucketError } = await supabaseAdmin.storage.getBucket('media-library');
        if (bucketError && bucketError.message.includes('not found')) {
            console.log('Bucket "media-library" not found. Creating it...');
            const { error: createError } = await supabaseAdmin.storage.createBucket('media-library', {
                public: true,
                allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
                fileSizeLimit: 2 * 1024 * 1024 // 2MB
            });
            if (createError) {
                console.error('Failed to auto-create bucket:', createError);
                // Continue anyway, maybe it's a permission issue and it actually exists
            }
        }

        // 2. Upload to Supabase Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from('media-library')
            .upload(filePath, file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('media-library')
            .getPublicUrl(filePath);

        // 3. Save to media_assets table
        const { data: asset, error: dbError } = await supabaseAdmin
            .from('media_assets')
            .insert({
                folder_id: folderId || null,
                file_name: file.name,
                file_path: filePath,
                public_url: publicUrl,
                file_size: file.size
            })
            .select()
            .single();

        if (dbError) throw dbError;

        return NextResponse.json({ asset });
    } catch (error: any) {
        console.error('Error uploading asset:', error);
        return NextResponse.json({
            error: 'Failed to upload asset',
            details: error?.message || 'Unknown error'
        }, { status: 500 });
    }
}
