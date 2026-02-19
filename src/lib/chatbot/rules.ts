import { ChatRule } from './types';

export const chatbotRules: ChatRule[] = [
    {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        reply: "Hello! 👋 How can I help you today with your travel plans?",
    },
    {
        keywords: ['pricing', 'price', 'cost', 'rates'],
        reply: "Our pricing ensures the best value for your personalized itineraries. You can view detailed pricing on our Pricing page.",
    },
    {
        keywords: ['contact', 'email', 'phone', 'support', 'help'],
        reply: "You can reach our support team via the Contact page or email us directly at support@example.com.",
    },
    {
        keywords: ['feature', 'what does this do', 'capabilities'],
        reply: "I can help you build detailed travel itineraries, manage leads, and export plans to PDF. Just ask!",
    },
    {
        keywords: ['itinerary', 'create', 'build'],
        reply: "To create a new itinerary, go to the Dashboard and click 'New Lead'. Then you can start building day-by-day plans.",
    },
    {
        keywords: ['thank', 'thanks'],
        reply: "You're welcome! Happy planning! ✈️",
    }
];

export const fallbackResponse = "I'm not sure I understand. key topics I know about: pricing, contact info, creating itineraries. Can you try rephrasing?";

export function findResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    for (const rule of chatbotRules) {
        if (rule.keywords.some(keyword => lowerMessage.includes(keyword))) {
            return rule.reply;
        }
    }

    return fallbackResponse;
}
