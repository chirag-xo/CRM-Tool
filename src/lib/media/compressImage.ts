import imageCompression from 'browser-image-compression';

export async function compressImage(file: File): Promise<File> {
    // Basic validation
    if (!file.type.startsWith('image/')) {
        throw new Error('File is not an image');
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB
        throw new Error('Image must be less than 2MB before compression');
    }

    const options = {
        maxSizeMB: 0.3, // 300KB
        maxWidthOrHeight: 1200,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile;
    } catch (error) {
        console.error('Image compression failed:', error);
        throw error;
    }
}
