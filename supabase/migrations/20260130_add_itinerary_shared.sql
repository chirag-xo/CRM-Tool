
-- Add itinerary_shared column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS itinerary_shared BOOLEAN DEFAULT FALSE;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_leads_itinerary_shared ON leads(itinerary_shared);

-- Create itinerary_shares table if it doesn't exist (as per Option A)
CREATE TABLE IF NOT EXISTS itinerary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shared_via TEXT -- 'whatsapp', 'email', 'link', 'manual_status'
);

CREATE INDEX IF NOT EXISTS idx_itinerary_shares_lead_id ON itinerary_shares(lead_id);
