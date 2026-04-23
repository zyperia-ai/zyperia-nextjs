-- Webhook Configuration Schema
-- Manages integrations with Slack, Discord, and custom webhooks

CREATE TABLE webhook_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  webhook_url TEXT NOT NULL,
  webhook_type TEXT NOT NULL CHECK (webhook_type IN ('slack', 'discord', 'custom')),
  events TEXT[] NOT NULL, -- Array of event types to subscribe to
  enabled BOOLEAN DEFAULT true,
  last_tested_at TIMESTAMP,
  test_successful BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_webhook_url CHECK (webhook_url LIKE 'http%')
);

CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_id UUID REFERENCES webhook_config(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB,
  response_status INT,
  response_body TEXT,
  success BOOLEAN,
  error_message TEXT,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_webhook_config_app_id ON webhook_config(app_id);
CREATE INDEX idx_webhook_config_enabled ON webhook_config(enabled);
CREATE INDEX idx_webhook_logs_webhook_id ON webhook_logs(webhook_id);
CREATE INDEX idx_webhook_logs_event_type ON webhook_logs(event_type);

-- Enable RLS
ALTER TABLE webhook_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage webhooks for their apps"
  ON webhook_config FOR ALL
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view webhook logs for their apps"
  ON webhook_logs FOR SELECT
  USING (webhook_id IN (
    SELECT id FROM webhook_config
    WHERE app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid())
  ));
