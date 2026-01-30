-- Add status column to leads table
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';

-- Create an index for faster filtering
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
