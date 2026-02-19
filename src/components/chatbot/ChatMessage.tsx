import React from 'react';
import { ChatMessage as ChatMessageType } from '@/lib/chatbot/types';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
    message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
    const isBot = message.role === 'bot';

    return (
        <div className={cn(
            "flex w-full mb-4",
            isBot ? "justify-start" : "justify-end"
        )}>
            <div className={cn(
                "flex max-w-[80%] items-end gap-2",
                isBot ? "flex-row" : "flex-row-reverse"
            )}>
                {/* Avatar */}
                <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border shadow-sm",
                    isBot ? "bg-primary text-primary-foreground border-primary" : "bg-muted text-muted-foreground border-border"
                )}>
                    {isBot ? <Bot size={14} /> : <User size={14} />}
                </div>

                {/* Bubble */}
                <div className={cn(
                    "px-4 py-2.5 rounded-2xl shadow-sm text-sm break-words",
                    isBot
                        ? "bg-muted text-foreground rounded-bl-sm"
                        : "bg-primary text-primary-foreground rounded-br-sm"
                )}>
                    {message.content}
                </div>
            </div>
        </div>
    );
};
