import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
        days: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER },
                    title: { type: Type.STRING },
                    activities: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                time: { type: Type.STRING },
                                activity: { type: Type.STRING },
                                location: { type: Type.STRING }
                            },
                            required: ["time", "activity", "location"]
                        }
                    }
                },
                required: ["day", "title", "activities"]
            }
        }
    },
    required: ["days"]
};

/**
 * Generates an itinerary using Gemini 1.5 Flash.
 */
export async function generateItineraryAI(
    destination: string,
    days: number,
    travellerCount: number
): Promise<any> {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: `Generate a highly detailed ${days}-day travel itinerary for ${destination} for ${travellerCount} travellers. 
            Include specific times, activities, and locations for each day.
            Ensure the output strictly follows the provided JSON schema.`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7
            }
        });

        if (response.text) {
            const parsed = JSON.parse(response.text);

            // Map the AI output to our internal DayActivity structure if needed, 
            // but the prompt demands a specific format. We'll store this JSON as the itinerary.
            // For the builder to work, we might need to map it to DayActivity[] format later 
            // or update the builder to handle this new format.
            // The requirement says: Return JSON itinerary and load into store.

            return parsed;
        }
        throw new Error("Empty response from AI");
    } catch (error) {
        console.error('Gemini generation error:', error);
        throw error;
    }
}
