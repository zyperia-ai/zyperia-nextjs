-- ZYPERIA Newsletter System Migration
-- Created: 2026-05-09
-- Tables for newsletter subscription management

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'unsubscribed')),
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email
  ON newsletter_subscribers(email);

CREATE INDEX IF NOT EXISTS idx_newsletter_source
  ON newsletter_subscribers(source);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role only" ON newsletter_subscribers
  FOR ALL USING (TRUE) WITH CHECK (TRUE);
