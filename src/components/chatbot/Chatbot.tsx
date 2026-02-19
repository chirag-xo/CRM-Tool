"use client";

import React from 'react';
import { useChatbot } from './useChatbot';
import { ChatWindow } from './ChatWindow';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Chatbot: React.FC = () => {
    const { isOpen, toggleOpen, messages, loading, sendMessage } = useChatbot();

    return (
        <>
            {/* Chat Window */}
            <ChatWindow
                isOpen={isOpen}
                onClose={toggleOpen}
                messages={messages}
                loading={loading}
                onSendMessage={sendMessage}
            />

            {/* Floating Toggle Button */}
            <Button
                onClick={toggleOpen}
                size="icon"
                className={cn(
                    "fixed bottom-4 right-4 z-40 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105",
                    isOpen ? "scale-0 opacity-0 pointer-events-none" : "scale-100 opacity-100"
                )}
            >
                <MessageCircle size={28} />
            </Button>
        </>
    );
};
