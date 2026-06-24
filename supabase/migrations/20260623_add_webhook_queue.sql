-- Add webhook queue table for improved webhook processing with retry logic
CREATE TABLE IF NOT EXISTS webhook_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'processing', -- processing, completed, failed
  attempts INTEGER DEFAULT 1,
  error_message TEXT,
  next_retry_at TIMESTAMP WITH TIME ZONE, -- When to retry failed webhooks
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_webhook_queue_status ON webhook_queue(status);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_event_id ON webhook_queue(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_created_at ON webhook_queue(created_at);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_attempts ON webhook_queue(attempts);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_next_retry ON webhook_queue(next_retry_at) WHERE status = 'failed';

-- Function to increment attempts counter
CREATE OR REPLACE FUNCTION increment_attempts()
RETURNS TRIGGER AS $$
BEGIN
  NEW.attempts = OLD.attempts + 1;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically increment attempts on update
CREATE TRIGGER webhook_queue_increment_attempts
  BEFORE UPDATE ON webhook_queue
  FOR EACH ROW
  WHEN (OLD.status = 'failed' AND NEW.status = 'failed')
  EXECUTE FUNCTION increment_attempts();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_webhook_queue_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER webhook_queue_update_timestamp
  BEFORE UPDATE ON webhook_queue
  FOR EACH ROW
  EXECUTE FUNCTION update_webhook_queue_updated_at();

-- Add comment
COMMENT ON TABLE webhook_queue IS 'Queue for processing Mercado Pago webhooks with retry logic';
COMMENT ON COLUMN webhook_queue.status IS 'Processing status: processing, completed, failed';
COMMENT ON COLUMN webhook_queue.attempts IS 'Number of processing attempts (max 5)';
COMMENT ON COLUMN webhook_queue.next_retry_at IS 'Scheduled time for next retry attempt (exponential backoff)';

ALTER TABLE IF EXISTS public.subscriptions
  ADD COLUMN IF NOT EXISTS cancel_reason TEXT;

CREATE TABLE IF NOT EXISTS public.webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  payment_id TEXT,
  subscription_id UUID REFERENCES public.subscriptions ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.webhook_events ENABLE ROW LEVEL SECURITY;
