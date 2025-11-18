-- Create deload_weeks table
CREATE TABLE IF NOT EXISTS public.deload_weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,

  -- Deload period
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,

  -- Deload configuration
  reason TEXT NOT NULL CHECK (reason IN ('plateau', 'scheduled', 'manual')),
  weight_reduction_percentage INTEGER NOT NULL DEFAULT 10 CHECK (weight_reduction_percentage >= 5 AND weight_reduction_percentage <= 20),

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_deload_weeks_user_id ON public.deload_weeks(user_id);
CREATE INDEX IF NOT EXISTS idx_deload_weeks_dates ON public.deload_weeks(user_id, start_date, end_date);

-- Enable Row Level Security
ALTER TABLE public.deload_weeks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own deload weeks"
  ON public.deload_weeks
  FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own deload weeks"
  ON public.deload_weeks
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own deload weeks"
  ON public.deload_weeks
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can delete their own deload weeks"
  ON public.deload_weeks
  FOR DELETE
  USING (auth.uid()::text = user_id);

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_deload_weeks_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_deload_weeks_updated_at
  BEFORE UPDATE ON public.deload_weeks
  FOR EACH ROW
  EXECUTE FUNCTION update_deload_weeks_updated_at();
