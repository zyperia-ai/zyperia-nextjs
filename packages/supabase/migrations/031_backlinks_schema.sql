-- Stage 7b: Backlink Hunting & Outreach Schema
-- Tracks backlink opportunities, outreach campaigns, and acquired backlinks

CREATE TABLE backlink_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  target_article_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  target_title TEXT NOT NULL,
  prospect_domain TEXT NOT NULL,
  prospect_url TEXT NOT NULL,
  prospect_title TEXT NOT NULL,
  prospect_contact TEXT, -- Email address if known
  relevance_score NUMERIC DEFAULT 0, -- 0-100, how relevant
  authority_score NUMERIC DEFAULT 0, -- 0-100, domain authority
  traffic_estimate INT DEFAULT 0, -- Estimated monthly traffic
  outreach_status TEXT DEFAULT 'pending' CHECK (outreach_status IN ('pending', 'sent', 'responded', 'rejected', 'linked')),
  outreach_message TEXT,
  outreach_sent_at TIMESTAMP,
  responded_at TIMESTAMP,
  linked_at TIMESTAMP,
  response_message TEXT, -- Prospect's response
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_score_relevance CHECK (relevance_score >= 0 AND relevance_score <= 100),
  CONSTRAINT valid_score_authority CHECK (authority_score >= 0 AND authority_score <= 100)
);

CREATE TABLE backlink_outreach (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  opportunity_id UUID REFERENCES backlink_opportunities(id) ON DELETE CASCADE,
  prospect_domain TEXT NOT NULL,
  outreach_message TEXT,
  outreach_sent_at TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'bounced', 'opened', 'clicked', 'responded')),
  response_text TEXT,
  response_received_at TIMESTAMP,
  follow_up_count INT DEFAULT 0,
  last_follow_up_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE backlink_acquisitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  opportunity_id UUID REFERENCES backlink_opportunities(id) ON DELETE CASCADE,
  backlink_url TEXT NOT NULL, -- The actual link pointing to us
  source_domain TEXT NOT NULL,
  anchor_text TEXT,
  link_type TEXT CHECK (link_type IN ('dofollow', 'nofollow')), -- If detectable
  discovered_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP, -- When we verified it exists
  status TEXT DEFAULT 'verified' CHECK (status IN ('pending_verification', 'verified', 'broken', 'removed')),
  estimated_traffic_gain INT DEFAULT 0, -- Estimated monthly traffic from this backlink
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE backlink_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  campaign_name TEXT NOT NULL,
  prospect_count INT DEFAULT 0,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'started', 'active', 'paused', 'completed')),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  success_rate NUMERIC DEFAULT 0, -- Percentage of successful links
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE ranking_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id TEXT NOT NULL,
  keyword TEXT NOT NULL,
  rank INT, -- Search result position (1-100+)
  views INT DEFAULT 0, -- Organic views from this keyword
  clicks INT DEFAULT 0, -- Organic clicks from GSC
  impressions INT DEFAULT 0, -- Search impressions (GSC)
  ctr NUMERIC DEFAULT 0, -- Click-through rate
  tracked_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_rank CHECK (rank > 0)
);

-- Indexes for fast queries
CREATE INDEX idx_backlink_opportunities_app_id ON backlink_opportunities(app_id);
CREATE INDEX idx_backlink_opportunities_status ON backlink_opportunities(outreach_status);
CREATE INDEX idx_backlink_opportunities_relevance ON backlink_opportunities(relevance_score DESC);
CREATE INDEX idx_backlink_acquisitions_app_id ON backlink_acquisitions(app_id);
CREATE INDEX idx_backlink_acquisitions_verified ON backlink_acquisitions(status);
CREATE INDEX idx_backlink_outreach_status ON backlink_outreach(status);
CREATE INDEX idx_ranking_history_keyword ON ranking_history(app_id, keyword);

-- Enable RLS (Row Level Security)
ALTER TABLE backlink_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlink_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlink_acquisitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE backlink_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: App owner can see their own backlink data
CREATE POLICY "Users can view backlink opportunities for their apps"
  ON backlink_opportunities FOR SELECT
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can manage backlink outreach for their apps"
  ON backlink_outreach FOR ALL
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view backlink acquisitions for their apps"
  ON backlink_acquisitions FOR SELECT
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can manage backlink campaigns"
  ON backlink_campaigns FOR ALL
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));

CREATE POLICY "Users can view ranking history for their apps"
  ON ranking_history FOR SELECT
  USING (app_id IN (SELECT app_id FROM blog_posts WHERE author_id = auth.uid()));
