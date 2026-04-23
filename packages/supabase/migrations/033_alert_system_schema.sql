-- Alert System Schema
-- Tracks all system alerts, thresholds, and notification history

CREATE TABLE alert_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN (
    'high_error_rate',
    'traffic_drop',
    'stage_error_recurring',
    'ranking_drop',
    'low_engagement',
    'revenue_drop',
    'low_quality',
    'backlink_acquired',
    'custom'
  )),
  threshold NUMERIC NOT NULL,
  operator TEXT NOT NULL CHECK (operator IN ('greater_than', 'less_than', 'equals', 'not_equals')),
  enabled BOOLEAN DEFAULT true,
  channels TEXT[] DEFAULT ARRAY['email'], -- 'email', 'slack', 'discord'
  cooldown_minutes INT DEFAULT 60, -- Don't alert again within X minutes
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(app_id, alert_type)
);

CREATE TABLE alert_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  message TEXT NOT NULL,
  data JSONB,
  triggered_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP,
  resolved_at TIMESTAMP,
  notes TEXT
);

CREATE TABLE alert_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_log_id UUID NOT NULL REFERENCES alert_logs(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'slack', 'discord', 'webhook')),
  recipient TEXT, -- Email address, Slack user ID, Discord channel ID
  sent_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'read', 'deleted'))
);

-- Indexes for fast queries
CREATE INDEX idx_alert_config_app_id ON alert_config(app_id);
CREATE INDEX idx_alert_config_enabled ON alert_config(enabled);
CREATE INDEX idx_alert_logs_app_id ON alert_logs(app_id);
CREATE INDEX idx_alert_logs_severity ON alert_logs(severity);
CREATE INDEX idx_alert_logs_triggered_at ON alert_logs(triggered_at DESC);
CREATE INDEX idx_alert_notifications_status ON alert_notifications(status);

-- Enable RLS
ALTER TABLE alert_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage alert config for their apps"
  ON alert_config FOR ALL
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view alert logs for their apps"
  ON alert_logs FOR SELECT
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can acknowledge alerts for their apps"
  ON alert_logs FOR UPDATE
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view notifications for their alerts"
  ON alert_notifications FOR SELECT
  USING (alert_log_id IN (
    SELECT id FROM alert_logs
    WHERE app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid())
  ));
