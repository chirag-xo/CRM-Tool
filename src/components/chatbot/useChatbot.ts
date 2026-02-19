"use client";

import { useState, useCallback } from 'react';
import { ChatMessage, MessageRole } from '@/lib/chatbot/types';
import { v4 as uuidv4 } from 'uuid';

export const useChatbot = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'bot',
            content: "Hello! 👋 I'm your travel assistant. Ask me about pricing, contact info, or how to build an itinerary!",
            timestamp: Date.now()
        }
    ]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => setIsOpen(prev => !prev);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        // Add user message
        const userMsg: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content,
            timestamp: Date.now()
        };

        setMessages(prev => [...prev, userMsg]);
        setLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            // Add bot response
            const botMsg: ChatMessage = {
                id: uuidv4(),
                role: 'bot',
                content: data.reply || "Sorry, I encountered an error.",
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMsg: ChatMessage = {
                id: uuidv4(),
                role: 'bot',
                content: "Sorry, I'm having trouble connecting right now. Please try again later.",
                timestamp: Date.now()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        messages,
        loading,
        isOpen,
        toggleOpen,
        sendMessage
    };
};
