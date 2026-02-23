"use client";

import React, { useState } from 'react';
import { Folder, FolderPlus, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface MediaFolder {
    id: string;
    name: string;
}

interface FolderSidebarProps {
    folders: MediaFolder[];
    activeFolderId: string | null;
    onFolderSelect: (id: string | null) => void;
    onFolderCreate: (name: string) => void;
    onFolderUpdate: (id: string, newName: string) => void;
    onFolderDelete: (id: string) => void;
}

export const FolderSidebar: React.FC<FolderSidebarProps> = ({
    folders,
    activeFolderId,
    onFolderSelect,
    onFolderCreate,
    onFolderUpdate,
    onFolderDelete
}) => {
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const handleCreate = () => {
        if (newFolderName.trim()) {
            onFolderCreate(newFolderName.trim());
            setNewFolderName('');
            setIsCreating(false);
        }
    };

    const handleUpdate = (id: string) => {
        if (editName.trim()) {
            onFolderUpdate(id, editName.trim());
            setEditingFolderId(null);
            setEditName('');
        }
    };

    return (
        <div className="w-64 border-r bg-muted/10 h-full flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-card">
                <h3 className="font-semibold">Folders</h3>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsCreating(true)}
                    title="New Folder"
                >
                    <FolderPlus size={18} />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-2">
                {isCreating && (
                    <div className="px-4 py-2 space-y-2">
                        <Input
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder name..."
                            autoFocus
                            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                        />
                        <div className="flex gap-2">
                            <Button size="sm" className="flex-1" onClick={handleCreate}>Add</Button>
                            <Button size="sm" variant="ghost" className="flex-1" onClick={() => setIsCreating(false)}>Cancel</Button>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => onFolderSelect(null)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-sm transition-colors ${activeFolderId === null ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-muted-foreground'
                        }`}
                >
                    <Folder size={16} />
                    <span>All Media</span>
                </button>

                {folders.map(folder => (
                    <div key={folder.id} className="group relative">
                        {editingFolderId === folder.id ? (
                            <div className="px-4 py-2 space-y-2">
                                <Input
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    placeholder="Rename..."
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleUpdate(folder.id);
                                        if (e.key === 'Escape') setEditingFolderId(null);
                                    }}
                                />
                                <div className="flex gap-1">
                                    <Button size="sm" variant="default" className="flex-1 text-[10px] h-7" onClick={() => handleUpdate(folder.id)}>Save</Button>
                                    <Button size="sm" variant="ghost" className="flex-1 text-[10px] h-7" onClick={() => setEditingFolderId(null)}>X</Button>
                                </div>
                            </div>
                        ) : (
                            <div className={`w-full flex items-center transition-colors ${activeFolderId === folder.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted/50 text-muted-foreground'
                                }`}>
                                <button
                                    onClick={() => onFolderSelect(folder.id)}
                                    className="flex-1 flex items-center gap-2 px-4 py-2 text-sm overflow-hidden"
                                >
                                    <Folder size={16} className="shrink-0" />
                                    <span className="truncate text-left">{folder.name}</span>
                                </button>
                                <div className="hidden group-hover:flex items-center gap-1 pr-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingFolderId(folder.id);
                                            setEditName(folder.name);
                                        }}
                                        className="p-1 hover:text-primary transition-colors"
                                        title="Rename"
                                    >
                                        <MoreVertical size={14} />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`Delete folder "${folder.name}"? Assets will be moved to All Media.`)) {
                                                onFolderDelete(folder.id);
                                            }
                                        }}
                                        className="p-1 hover:text-destructive transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
