
-- Drop the restrictive constraint on shared_via
ALTER TABLE itinerary_shares DROP CONSTRAINT IF EXISTS itinerary_shares_shared_via_check;

-- Optional: If you want to enforce it with new values, uncomment below:
-- ALTER TABLE itinerary_shares ADD CONSTRAINT itinerary_shares_shared_via_check 
-- CHECK (shared_via IN ('whatsapp', 'email', 'link', 'manual_status', 'link_cleanup'));
