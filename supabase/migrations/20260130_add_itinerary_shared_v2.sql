
-- Add itinerary_shared column to leads if not exists
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS itinerary_shared BOOLEAN DEFAULT FALSE;

-- Index for leads
CREATE INDEX IF NOT EXISTS idx_leads_itinerary_shared ON leads(itinerary_shared);

-- Handle itinerary_shares table
-- First, ensure the table exists (it might already exist with different columns)
CREATE TABLE IF NOT EXISTS itinerary_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    shared_via TEXT
);

-- Add lead_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='itinerary_shares' AND column_name='lead_id') THEN
        ALTER TABLE itinerary_shares ADD COLUMN lead_id UUID REFERENCES leads(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Add index on lead_id (safe to run if index exists usually, but let's be safe)
CREATE INDEX IF NOT EXISTS idx_itinerary_shares_lead_id ON itinerary_shares(lead_id);
