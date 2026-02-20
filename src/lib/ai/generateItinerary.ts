import { v4 as uuidv4 } from 'uuid';
import { GoogleGenAI, Type, Schema } from '@google/genai';

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const responseSchema: Schema = {
    type: Type.ARRAY,
    description: "An array of travel itinerary days",
    items: {
        type: Type.OBJECT,
        properties: {
            title: {
                type: Type.STRING,
                description: "The title of the day's itinerary, e.g., 'Arrival & Sightseeing'",
            },
            description: {
                type: Type.STRING,
                description: "A 1-2 sentence description of what the travellers will do.",
            },
            visitingPlaces: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING
                },
                description: "List of exactly 3 specific famous tourist spots or activities for this day.",
            },
            hotel: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of the hotel." },
                    category: { type: Type.STRING, description: "Star category (e.g., '4 Star')" }
                },
                required: ["name", "category"]
            },
            vehicle: {
                type: Type.OBJECT,
                properties: {
                    type: { type: Type.STRING, description: "Vehicle type (e.g., 'Sedan', 'SUV')" },
                },
                required: ["type"]
            }
        },
        required: ["title", "description", "visitingPlaces", "hotel", "vehicle"]
    }
};

/**
 * Generates an itinerary using Gemini 2.5 Flash.
 * Always generates maximum 3 real days of famous spots.
 * Any days beyond 3 are filled with generic spots.
 */
export async function generateItineraryAI(
    destination: string,
    days: number,
    travellerCount: number
): Promise<any> {

    // We only ask Gemini for up to 3 days to keep latency and costs low,
    // and to satisfy the requirement of "famous spots for first 3 days, generic after that".
    const daysToGenerate = Math.min(days, 3);
    let realDays: any[] = [];

    if (daysToGenerate > 0) {
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Generate a realistic ${daysToGenerate}-day travel itinerary for ${destination}. Ensure it includes the most famous and highly visited tourist spots.`,
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                    temperature: 0.7
                }
            });

            if (response.text) {
                const parsedDays = JSON.parse(response.text);
                realDays = parsedDays.map((day: any, i: number) => ({
                    id: uuidv4(),
                    dayNumber: i + 1,
                    title: day.title || `Day ${i + 1} in ${destination}`,
                    description: day.description || `Exploring ${destination}.`,
                    visitingPlaces: day.visitingPlaces || [`Popular Spot 1`, `Popular Spot 2`],
                    vehicle: { type: day.vehicle?.type || 'Sedan', model: '' },
                    hotel: day.hotel || { name: 'Sample Hotel', category: '4 Star' },
                    images: []
                }));
            }
        } catch (error) {
            console.error('Gemini generation error:', error);
            // If Gemini fails, we'll gracefully fall through and fill EVERYTHING with generics
        }
    }

    // Now construct the final array, filling any missing days up to `days` total
    const finalDays = [];

    for (let i = 0; i < days; i++) {
        if (i < realDays.length) {
            // Push the real generated day
            finalDays.push(realDays[i]);
        } else {
            // Push a generic placeholder day
            finalDays.push({
                id: uuidv4(),
                dayNumber: i + 1,
                title: `Day ${i + 1} in ${destination}`,
                description: `Exploring more hidden gems and local culture in ${destination}.`,
                visitingPlaces: [`Spot A in ${destination}`, `Spot B in ${destination}`],
                vehicle: { type: 'Sedan', model: '' },
                hotel: { name: 'Standard Hotel', category: '3 Star' },
                images: []
            });
        }
    }

    return finalDays;
}
