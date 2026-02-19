export type MessageRole = 'user' | 'bot';

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    timestamp: number;
}

export interface ChatRule {
    keywords: string[];
    reply: string;
}
