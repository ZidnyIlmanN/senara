-- Add en_title and en_desc columns to timeline_events
ALTER TABLE public.timeline_events 
ADD COLUMN IF NOT EXISTS en_title text,
ADD COLUMN IF NOT EXISTS en_desc text;
