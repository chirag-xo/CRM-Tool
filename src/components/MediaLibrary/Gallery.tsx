"use client";

import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Loader2, Image as ImageIcon, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { compressImage } from '@/lib/media/compressImage';

interface MediaAsset {
    id: string;
    public_url: string;
    file_name: string;
    file_size: number;
    created_at: string;
}

interface GalleryProps {
    folderId: string | null;
    onSelect?: (url: string) => void;
    selectionMode?: boolean;
}

export const Gallery: React.FC<GalleryProps> = ({ folderId, onSelect, selectionMode = false }) => {
    const [assets, setAssets] = useState<MediaAsset[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        fetchAssets(true);
    }, [folderId]);

    const fetchAssets = async (reset = false) => {
        setLoading(true);
        try {
            const currentOffset = reset ? 0 : offset;
            const res = await fetch(`/api/media/list?folderId=${folderId || ''}&offset=${currentOffset}`);
            const data = await res.json();

            if (reset) {
                setAssets(data.assets || []);
            } else {
                setAssets(prev => [...prev, ...(data.assets || [])]);
            }

            setHasMore(data.hasMore);
            setOffset(currentOffset + (data.assets?.length || 0));
        } catch (error) {
            console.error('Failed to fetch assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const processUpload = async (file: File) => {
        try {
            const compressed = await compressImage(file);
            const formData = new FormData();
            formData.append('file', compressed);
            if (folderId) formData.append('folderId', folderId);

            const res = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                const data = await res.json();
                setAssets(prev => [data.asset, ...prev]);
            } else {
                const errorData = await res.json();
                console.error(`Upload failed for ${file.name}:`, errorData.details || errorData.error);
                alert(`Failed to upload ${file.name}: ${errorData.details || errorData.error}`);
            }
        } catch (error: any) {
            console.error(`Error processing ${file.name}:`, error);
            alert(`Error processing ${file.name}: ${error.message}`);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setUploading(true);
        try {
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    await processUpload(file);
                }
            }
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm('Delete this image?')) return;

        try {
            const res = await fetch('/api/media/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assetId: id })
            });

            if (res.ok) {
                setAssets(prev => prev.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const formatSize = (bytes: number) => {
        if (!bytes) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setUploading(true);
            try {
                for (const file of files) {
                    if (file.type.startsWith('image/')) {
                        await processUpload(file);
                    }
                }
            } finally {
                setUploading(false);
            }
        }
    };

    return (
        <div
            className="flex-1 flex flex-col h-full bg-background relative"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {isDragging && (
                <div className="absolute inset-0 z-50 bg-primary/20 backdrop-blur-sm border-2 border-dashed border-primary flex flex-col items-center justify-center pointer-events-none">
                    <div className="bg-background p-6 rounded-full shadow-lg">
                        <Upload size={48} className="text-primary animate-bounce" />
                    </div>
                    <p className="mt-4 text-primary font-bold text-lg">Drop images anywhere to upload</p>
                </div>
            )}

            <div className="p-4 border-b flex justify-between items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search images..." className="pl-8 h-9" />
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="default"
                        size="sm"
                        className="gap-2"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                        Upload
                    </Button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading && assets.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-primary" />
                    </div>
                ) : assets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                        <ImageIcon size={48} className="mb-4 opacity-20" />
                        <p>No images found in this folder</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {assets.map(asset => (
                            <Card
                                key={asset.id}
                                className={`overflow-hidden group cursor-pointer border-2 transition-all ${selectionMode ? 'hover:border-primary' : 'border-transparent'
                                    }`}
                                onClick={() => selectionMode && onSelect?.(asset.public_url)}
                            >
                                <div className="aspect-square relative bg-muted">
                                    <img
                                        src={asset.public_url}
                                        alt={asset.file_name}
                                        className="object-cover w-full h-full"
                                        loading="lazy"
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="h-7 w-7"
                                            onClick={(e) => handleDelete(asset.id, e)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                                <div className="p-2 text-[10px] bg-card/50 backdrop-blur-sm border-t">
                                    <p className="font-medium truncate" title={asset.file_name}>{asset.file_name}</p>
                                    <p className="text-muted-foreground">{formatSize(asset.file_size)}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <Button variant="outline" onClick={() => fetchAssets()} disabled={loading}>
                            {loading ? 'Loading...' : 'Load More'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};
