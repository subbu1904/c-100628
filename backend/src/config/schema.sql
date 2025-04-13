
-- Database Schema for CryptoView

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'free',
  avatar_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE,
  CONSTRAINT role_check CHECK (role IN ('free', 'premium', 'admin', 'expert'))
);

-- User Membership Table
CREATE TABLE user_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL DEFAULT 'free',
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT type_check CHECK (type IN ('free', 'premium'))
);

-- Assets Table
CREATE TABLE assets (
  id VARCHAR(100) PRIMARY KEY, -- Use the API provided ID (e.g., 'bitcoin')
  name VARCHAR(255) NOT NULL,
  symbol VARCHAR(50) NOT NULL,
  description TEXT,
  logo_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Super Categories Table
CREATE TABLE super_categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  color VARCHAR(50),
  description TEXT,
  is_enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Asset Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) NOT NULL UNIQUE,
  super_category_id VARCHAR(100) REFERENCES super_categories(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Category-Asset Mapping Table
CREATE TABLE category_assets (
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  asset_id VARCHAR(100) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (category_id, asset_id)
);

-- User Favorites Table
CREATE TABLE user_favorites (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id VARCHAR(100) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, asset_id)
);

-- User Predictions Table
CREATE TABLE predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  asset_id VARCHAR(100) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
  prediction VARCHAR(50) NOT NULL, -- 'buy', 'sell', 'hold'
  content TEXT,
  expected_direction VARCHAR(50) NOT NULL, -- 'up', 'down', 'stable'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT prediction_check CHECK (prediction IN ('buy', 'sell', 'hold')),
  CONSTRAINT direction_check CHECK (expected_direction IN ('up', 'down', 'stable'))
);

-- Prediction Outcomes Table
CREATE TABLE prediction_outcomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  result VARCHAR(50), -- 'correct', 'incorrect', 'pending'
  verified_at TIMESTAMP WITH TIME ZONE,
  actual_change DECIMAL,
  actual_direction VARCHAR(50), -- 'up', 'down', 'stable'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT result_check CHECK (result IN ('correct', 'incorrect', 'pending')),
  CONSTRAINT direction_check CHECK (actual_direction IN ('up', 'down', 'stable'))
);

-- Prediction Votes Table
CREATE TABLE prediction_votes (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  vote VARCHAR(10) NOT NULL, -- 'up', 'down'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, prediction_id),
  CONSTRAINT vote_check CHECK (vote IN ('up', 'down'))
);

-- Risk Assessments Table
CREATE TABLE risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prediction_id UUID NOT NULL REFERENCES predictions(id) ON DELETE CASCADE,
  level VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'very-high'
  score INTEGER NOT NULL, -- 0-100
  volatility_index INTEGER NOT NULL, -- 0-100
  community_consensus INTEGER NOT NULL, -- 0-100
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT level_check CHECK (level IN ('low', 'medium', 'high', 'very-high')),
  CONSTRAINT score_range CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT volatility_range CHECK (volatility_index BETWEEN 0 AND 100),
  CONSTRAINT consensus_range CHECK (community_consensus BETWEEN 0 AND 100)
);

-- User Badges Table
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon_url VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User-Badge Mapping Table
CREATE TABLE user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  acquired_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, badge_id)
);

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Conversation Participants Table
CREATE TABLE conversation_participants (
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (conversation_id, user_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert Insights Table
CREATE TABLE expert_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  asset_id VARCHAR(100) REFERENCES assets(id) ON DELETE SET NULL,
  category VARCHAR(50) NOT NULL, -- 'analysis', 'report', 'tutorial', 'news'
  published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  media_url VARCHAR(255),
  likes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT category_check CHECK (category IN ('analysis', 'report', 'tutorial', 'news'))
);

-- Expert Insight Tags Table
CREATE TABLE expert_insight_tags (
  insight_id UUID NOT NULL REFERENCES expert_insights(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (insight_id, tag)
);

-- Announcements Table
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 1,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert Verification Table
CREATE TABLE expert_verifications (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Expert Specialties Table
CREATE TABLE expert_specialties (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialty VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, specialty)
);

-- Expert Credentials Table
CREATE TABLE expert_credentials (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  credential VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, credential)
);

-- User Points Table
CREATE TABLE user_points (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  title VARCHAR(100) DEFAULT 'Novice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Followers Table
CREATE TABLE followers (
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX idx_category_assets_asset_id ON category_assets(asset_id);
CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_predictions_user_id ON predictions(user_id);
CREATE INDEX idx_predictions_asset_id ON predictions(asset_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_expert_insights_author_id ON expert_insights(author_id);
CREATE INDEX idx_expert_insights_asset_id ON expert_insights(asset_id);

-- Add triggers for updating timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply timestamp triggers to tables
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_memberships_timestamp BEFORE UPDATE ON user_memberships FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_assets_timestamp BEFORE UPDATE ON assets FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_super_categories_timestamp BEFORE UPDATE ON super_categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_categories_timestamp BEFORE UPDATE ON categories FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_predictions_timestamp BEFORE UPDATE ON predictions FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_prediction_outcomes_timestamp BEFORE UPDATE ON prediction_outcomes FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_risk_assessments_timestamp BEFORE UPDATE ON risk_assessments FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_expert_insights_timestamp BEFORE UPDATE ON expert_insights FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_announcements_timestamp BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_expert_verifications_timestamp BEFORE UPDATE ON expert_verifications FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
CREATE TRIGGER update_user_points_timestamp BEFORE UPDATE ON user_points FOR EACH ROW EXECUTE PROCEDURE update_timestamp();
