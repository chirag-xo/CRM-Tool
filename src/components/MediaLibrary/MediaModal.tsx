"use client";

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Gallery } from './Gallery';
import { FolderSidebar } from './FolderSidebar';

interface MediaModalProps {
    onSelect: (url: string) => void;
    children: React.ReactNode;
}

export const MediaModal: React.FC<MediaModalProps> = ({ onSelect, children }) => {
    const [open, setOpen] = useState(false);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        if (open) {
            fetchFolders();
        }
    }, [open]);

    const fetchFolders = async () => {
        try {
            const res = await fetch('/api/media/list?limit=1'); // Limit 1 to just get folders
            const data = await res.json();
            setFolders(data.folders || []);
        } catch (error) {
            console.error('Failed to fetch folders:', error);
        }
    };

    const handleSelect = (url: string) => {
        onSelect(url);
        setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="max-w-5xl h-[80vh] p-0 flex flex-col">
                <DialogHeader className="p-4 border-b">
                    <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>
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
                        onSelect={handleSelect}
                        selectionMode={true}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};
