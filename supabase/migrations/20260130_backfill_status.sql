-- Ensure all existing leads have status 'pending' if null
UPDATE leads SET status = 'pending' WHERE status IS NULL;
