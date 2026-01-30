import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageGridProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onChange, maxImages = 4 }) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        // Convert to base64 or blob URL. 
        // Ideally we compress here, but for MVP we use FileReader to get base64 for PDF compatibility
        // standard `URL.createObjectURL` works for preview, but base64 better for PDF generation in some parsers.
        // Let's use Base64 to be safe for saving to localStorage too.

        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result as string;
                onChange([...images, base64].slice(0, maxImages));
            };
            reader.readAsDataURL(file);
        });
    }, [images, maxImages, onChange]);

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        disabled: images.length >= maxImages
    });

    return (
        <div className="mt-2">
            <div className="grid grid-cols-4 gap-2 mb-2">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-muted group">
                        <img src={img} alt={`Day img ${idx}`} className="w-full h-full object-cover" />
                        <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                {images.length < maxImages && (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors",
                            isDragActive ? "border-primary bg-primary/10" : "border-muted-foreground/25"
                        )}
                    >
                        <input {...getInputProps()} />
                        <Upload className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="text-[10px] text-muted-foreground text-center px-1">Add Img</span>
                    </div>
                )}
            </div>
            <p className="text-[10px] text-muted-foreground">
                {images.length}/{maxImages} images (Optional)
            </p>
        </div>
    );
};
