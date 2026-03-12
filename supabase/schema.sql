-- Users / Artists
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  city TEXT,
  country TEXT,
  genre TEXT CHECK (genre IN ('freestyle', 'written', 'melodic', 'drill', 'all')),
  bio TEXT,
  avatar_url TEXT,
  clout_score INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  no_shows INTEGER DEFAULT 0,
  battle_count INTEGER DEFAULT 0,
  tos_accepted_at TIMESTAMPTZ,
  tos_version TEXT DEFAULT '1.0',
  is_suspended BOOLEAN DEFAULT FALSE,
  suspension_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Battles
CREATE TABLE battles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_a_id UUID REFERENCES users(id),
  artist_b_id UUID REFERENCES users(id),
  challenger_id UUID REFERENCES users(id), -- who sent the challenge
  scheduled_at TIMESTAMPTZ NOT NULL,
  genre TEXT NOT NULL,
  title TEXT, -- optional custom title e.g. "East Coast vs South"
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',    -- challenge sent, not yet accepted
    'accepted',   -- both confirmed, on schedule
    'live',       -- currently streaming
    'voting',     -- battle ended, voting window open
    'completed',  -- winner declared
    'ghost_a',    -- artist_a no-showed
    'ghost_b',    -- artist_b no-showed
    'cancelled'
  )),
  voting_closes_at TIMESTAMPTZ, -- set to NOW() + 2 hours when battle ends
  winner_id UUID REFERENCES users(id),
  livekit_room_name TEXT,
  viewer_peak INTEGER DEFAULT 0,
  vote_count_a INTEGER DEFAULT 0,
  vote_count_b INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Votes
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES battles(id),
  voter_id UUID REFERENCES users(id),
  voted_for_id UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(battle_id, voter_id) -- one vote per user per battle
);

-- Live Chat
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_id UUID REFERENCES battles(id),
  user_id UUID REFERENCES users(id),
  message TEXT NOT NULL,
  is_flagged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clout History (audit trail)
CREATE TABLE clout_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  score_before INTEGER,
  score_after INTEGER,
  delta INTEGER,
  reason TEXT, -- 'win', 'loss', 'no_show', 'vote_margin', 'battle_bonus'
  battle_id UUID REFERENCES battles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT, -- 'challenge_received', 'battle_starting', 'voting_open', 'winner_declared'
  title TEXT,
  body TEXT,
  battle_id UUID REFERENCES battles(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tournament Brackets (Phase 2 but scaffold it now)
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  genre TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'upcoming',
  prize_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE tournament_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments(id),
  user_id UUID REFERENCES users(id),
  seed INTEGER,
  eliminated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime on key tables
ALTER PUBLICATION supabase_realtime ADD TABLE battles;
ALTER PUBLICATION supabase_realtime ADD TABLE votes;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
