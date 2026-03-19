-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Scenes
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  scripture_ref TEXT,
  description TEXT,
  is_free BOOLEAN DEFAULT false,
  order_index INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Seed scenes
INSERT INTO scenes (slug, title, scripture_ref, is_free, order_index) VALUES
  ('gethsemane', 'Garden of Gethsemane', 'Matthew 26:36–46', true, 1),
  ('upper-room', 'The Upper Room', 'John 13–17', false, 2),
  ('calvary', 'Calvary', 'Luke 23:33–49', false, 3),
  ('empty-tomb', 'The Empty Tomb', 'John 20:1–18', false, 4),
  ('ascension', 'The Ascension', 'Acts 1:6–11', false, 5);

-- User progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  scene_id UUID REFERENCES scenes NOT NULL,
  completed BOOLEAN DEFAULT false,
  time_spent INTEGER DEFAULT 0,
  last_visited TIMESTAMP DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, scene_id)
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  tier TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

-- Group sessions
CREATE TABLE group_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  leader_id UUID REFERENCES auth.users NOT NULL,
  scene_id UUID REFERENCES scenes NOT NULL,
  session_code TEXT UNIQUE NOT NULL,
  max_participants INTEGER DEFAULT 20,
  created_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  ended_at TIMESTAMP
);

CREATE TABLE session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES group_sessions NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- ─── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view scenes" ON scenes FOR SELECT TO authenticated, anon USING (true);

ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON user_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE group_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leaders can manage their sessions" ON group_sessions FOR ALL USING (auth.uid() = leader_id);
CREATE POLICY "Anyone authenticated can view sessions" ON group_sessions FOR SELECT TO authenticated USING (true);

ALTER TABLE session_participants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own participation" ON session_participants FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Session leaders can view participants" ON session_participants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM group_sessions gs
    WHERE gs.id = session_id AND gs.leader_id = auth.uid()
  ));
