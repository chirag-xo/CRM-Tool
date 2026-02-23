import React from 'react';
import { X, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MediaModal } from '../MediaLibrary/MediaModal';

interface ImageGridProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onChange, maxImages = 4 }) => {
    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        onChange(newImages);
    };

    const handleSelect = (url: string, replaceIdx?: number) => {
        if (replaceIdx !== undefined) {
            const newImages = [...images];
            newImages[replaceIdx] = url;
            onChange(newImages);
        } else {
            onChange([...images, url].slice(0, maxImages));
        }
    };

    return (
        <div className="mt-2">
            <div className="grid grid-cols-4 gap-2 mb-2">
                {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-muted group cursor-pointer">
                        <MediaModal onSelect={(url) => handleSelect(url, idx)}>
                            <div className="w-full h-full">
                                <img src={img} alt={`Day img ${idx}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="text-[10px] text-white font-medium">Replace</span>
                                </div>
                            </div>
                        </MediaModal>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(idx);
                            }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-destructive"
                        >
                            <X size={12} />
                        </button>
                    </div>
                ))}
                {images.length < maxImages && (
                    <MediaModal onSelect={(url) => handleSelect(url)}>
                        <div
                            className={cn(
                                "aspect-square rounded-md border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25 text-muted-foreground"
                            )}
                        >
                            <Upload className="h-4 w-4 mb-1" />
                            <span className="text-[10px] text-center px-1">Add Img</span>
                        </div>
                    </MediaModal>
                )}
            </div>
            <p className="text-[10px] text-muted-foreground">
                {images.length}/{maxImages} images (Optional)
            </p>
        </div>
    );
};
