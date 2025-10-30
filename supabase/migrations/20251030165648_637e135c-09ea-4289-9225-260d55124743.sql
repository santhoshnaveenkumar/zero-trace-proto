-- Create system_logs table for storing telemetry events
CREATE TABLE public.system_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  process_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('write', 'rename', 'delete', 'access')),
  entropy_score NUMERIC(5,2) NOT NULL CHECK (entropy_score >= 0 AND entropy_score <= 100),
  rename_count INTEGER DEFAULT 0,
  severity TEXT NOT NULL CHECK (severity IN ('safe', 'warning', 'threat')),
  action_taken TEXT NOT NULL CHECK (action_taken IN ('blocked', 'flagged', 'ignored')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create settings table for storing system configuration
CREATE TABLE public.settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  monitoring_enabled BOOLEAN NOT NULL DEFAULT true,
  entropy_threshold NUMERIC(5,2) NOT NULL DEFAULT 75.00 CHECK (entropy_threshold >= 0 AND entropy_threshold <= 100),
  rename_threshold INTEGER NOT NULL DEFAULT 50 CHECK (rename_threshold >= 0),
  auto_block_enabled BOOLEAN NOT NULL DEFAULT true,
  webhook_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (monitoring_enabled, entropy_threshold, rename_threshold, auto_block_enabled)
VALUES (true, 75.00, 50, true);

-- Enable Row Level Security
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required for demo)
CREATE POLICY "Allow public read access to system_logs"
  ON public.system_logs FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access to system_logs"
  ON public.system_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read access to settings"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "Allow public update access to settings"
  ON public.settings FOR UPDATE
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_system_logs_timestamp ON public.system_logs(timestamp DESC);
CREATE INDEX idx_system_logs_severity ON public.system_logs(severity);
CREATE INDEX idx_system_logs_action ON public.system_logs(action_taken);

-- Enable realtime for system_logs table
ALTER TABLE public.system_logs REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.system_logs;

-- Create function to update settings timestamp
CREATE OR REPLACE FUNCTION public.update_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_settings_timestamp
BEFORE UPDATE ON public.settings
FOR EACH ROW
EXECUTE FUNCTION public.update_settings_updated_at();