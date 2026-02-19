import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/chatbot/types';
import { ChatMessage } from './ChatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatWindowProps {
    isOpen: boolean;
    onClose: () => void;
    messages: ChatMessageType[];
    loading: boolean;
    onSendMessage: (message: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
    isOpen,
    onClose,
    messages,
    loading,
    onSendMessage
}) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;
        onSendMessage(input);
        setInput('');
    };

    if (!isOpen) return null;

    return (
        <div className={cn(
            "fixed bottom-4 right-4 z-50 w-[95vw] md:w-[380px] h-[70vh] md:h-[500px]",
            "bg-card border shadow-2xl rounded-2xl flex flex-col overflow-hidden",
            "animate-in slide-in-from-bottom-10 fade-in duration-300"
        )}>
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <h3 className="font-bold text-primary-foreground text-sm">Travel Assistant</h3>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20 rounded-full" onClick={onClose}>
                    <X size={16} />
                </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/30" ref={scrollRef}>
                <div className="space-y-4">
                    {messages.map((msg) => (
                        <ChatMessage key={msg.id} message={msg} />
                    ))}
                    {loading && (
                        <div className="flex w-full mb-4 justify-start animate-pulse">
                            <div className="flex max-w-[80%] items-end gap-2 flex-row">
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Loader2 size={12} className="animate-spin text-primary" />
                                </div>
                                <div className="px-4 py-2 bg-muted text-muted-foreground rounded-2xl rounded-bl-sm text-xs">
                                    Typing...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Input */}
            <div className="p-3 border-t bg-background shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a message..."
                        className="rounded-full bg-muted/50 border-transparent focus:bg-background focus:border-input transition-all"
                        disabled={loading}
                    />
                    <Button type="submit" size="icon" className="rounded-full w-10 h-10 shrink-0" disabled={!input.trim() || loading}>
                        <Send size={18} className={cn("ml-0.5", loading && "opacity-0")} />
                        {loading && <Loader2 size={18} className="absolute animate-spin" />}
                    </Button>
                </form>
            </div>
        </div>
    );
};
