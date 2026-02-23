import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getTemplate } from '@/lib/itinerary/getTemplate';
import { saveTemplateIfNotExists } from '@/lib/itinerary/saveTemplate';
import { generateItineraryAI } from '@/lib/ai/generateItinerary';
import { normalizeDestination } from '@/lib/itinerary/saveTemplate';

// Server-Role Supabase client to bypass RLS securely from the API route
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { leadId, destination, days, travellers = 2, source = 'Web' } = body;

        // Validate inputs
        if (!leadId || !destination || !days) {
            return NextResponse.json(
                { error: 'Missing required fields (leadId, destination, days)' },
                { status: 400 }
            );
        }

        const startTimer = Date.now();
        const normalizedDest = normalizeDestination(destination);

        // 1. Check itinerary_templates (FIRST PRIORITY)
        const existingTemplate = await getTemplate(normalizedDest, days);

        if (existingTemplate) {
            console.log(`[Cache Hit] Serving ${normalizedDest} (${days} days) from template. ϟ ${Date.now() - startTimer}ms`);
            return NextResponse.json({ itinerary: existingTemplate, source: 'template' });
        }

        // 2. Not found, generate via AI (Fallback)
        console.log(`[Cache Miss] Generating itinerary for ${normalizedDest} (${days} days) via AI...`);
        const finalItineraryStructure = await generateItineraryAI(destination, days, travellers);

        // 3. Save specific generation to lead tracked table
        await supabaseAdmin
            .from("generated_itineraries")
            .insert({
                lead_id: leadId,
                destination: normalizedDest,
                source: source,
                days: days,
                travellers: travellers,
                itinerary: finalItineraryStructure
            });

        // 4. Save to templates mapping for future self-learning
        await saveTemplateIfNotExists(
            normalizedDest,
            days,
            finalItineraryStructure
        );

        console.log(`[AI Gen Saved] ${normalizedDest} (${days} days) completed in ${Date.now() - startTimer}ms`);
        return NextResponse.json({ itinerary: finalItineraryStructure, source: 'ai' });

    } catch (error) {
        console.error('Error generating itinerary:', error);
        // Failure Handling Step: Do NOT crash API, return safe fallback
        return NextResponse.json(
            { error: false, itinerary: { days: [] } },
            { status: 500 }
        );
    }
}
