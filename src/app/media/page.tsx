"use client";

import React, { useState, useEffect } from 'react';
import { Gallery } from '@/components/MediaLibrary/Gallery';
import { FolderSidebar } from '@/components/MediaLibrary/FolderSidebar';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MediaPage() {
    const router = useRouter();
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        fetchFolders();
    }, []);

    const fetchFolders = async () => {
        try {
            const res = await fetch('/api/media/list?limit=1');
            const data = await res.json();
            setFolders(data.folders || []);
        } catch (error) {
            console.error('Failed to fetch folders:', error);
        }
    };

    const handleFolderCreate = async (name: string) => {
        try {
            const res = await fetch('/api/media/folder/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            if (res.ok) {
                fetchFolders();
            }
        } catch (error) {
            console.error('Failed to create folder:', error);
        }
    };

    const handleFolderUpdate = async (id: string, name: string) => {
        try {
            const res = await fetch('/api/media/folder/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId: id, name })
            });
            if (res.ok) {
                fetchFolders();
            }
        } catch (error) {
            console.error('Failed to update folder:', error);
        }
    };

    const handleFolderDelete = async (id: string) => {
        try {
            const res = await fetch('/api/media/folder/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ folderId: id })
            });
            if (res.ok) {
                if (activeFolderId === id) setActiveFolderId(null);
                fetchFolders();
            }
        } catch (error) {
            console.error('Failed to delete folder:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-background">
            <header className="h-16 border-b flex items-center px-6 gap-4 bg-card">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft size={18} />
                </Button>
                <h1 className="text-xl font-bold">Media Library</h1>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <FolderSidebar
                    folders={folders}
                    activeFolderId={activeFolderId}
                    onFolderSelect={setActiveFolderId}
                    onFolderCreate={handleFolderCreate}
                    onFolderUpdate={handleFolderUpdate}
                    onFolderDelete={handleFolderDelete}
                />
                <Gallery
                    folderId={activeFolderId}
                />
            </div>
        </div>
    );
}
