import { NextResponse } from 'next/server';
import { findResponse } from '@/lib/chatbot/rules';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required and must be a string' },
                { status: 400 }
            );
        }

        const reply = findResponse(message);

        // Simulate a small network delay for a natural feel
        await new Promise(resolve => setTimeout(resolve, 500));

        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
