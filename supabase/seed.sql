-- Artists:
INSERT INTO users (id, clerk_id, username, display_name, city, country, genre, wins, losses, clout_score) VALUES
  ('11111111-1111-1111-1111-111111111111', 'user_clerk_1', 'LyricalX', 'LyricalX', 'Chicago', 'USA', 'freestyle', 23, 4, 920),
  ('22222222-2222-2222-2222-222222222222', 'user_clerk_2', 'P_Blaze', 'P-Blaze', 'Atlanta', 'USA', 'drill', 18, 9, 764),
  ('33333333-3333-3333-3333-333333333333', 'user_clerk_3', 'Queen_Spitt', 'Queen Spitt', 'Houston', 'USA', 'melodic', 15, 3, 810),
  ('44444444-4444-4444-4444-444444444444', 'user_clerk_4', 'FlowKing', 'FlowKing', 'Detroit', 'USA', 'written', 9, 5, 520),
  ('55555555-5555-5555-5555-555555555555', 'user_clerk_5', 'Mad_Mic', 'Mad Mic', 'NYC', 'USA', 'freestyle', 7, 7, 480),
  ('66666666-6666-6666-6666-666666666666', 'user_clerk_6', 'Cipher9', 'Cipher9', 'London', 'UK', 'drill', 3, 2, 220),
  ('77777777-7777-7777-7777-777777777777', 'user_clerk_7', 'Redhook', 'Redhook', 'Manchester', 'UK', 'written', 5, 1, 380),
  ('88888888-8888-8888-8888-888888888888', 'user_clerk_8', 'NovaMC', 'NovaMC', 'LA', 'USA', 'melodic', 11, 8, 610)
ON CONFLICT (id) DO NOTHING;

-- Battles:
INSERT INTO battles (id, artist_a_id, artist_b_id, scheduled_at, genre, title, status) VALUES
  ('ba111111-1111-1111-1111-111111111111', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', NOW() - INTERVAL '30 minutes', 'written', 'FlowKing vs Mad Mic', 'live'),
  ('ba222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', NOW() + INTERVAL '4 hours', 'freestyle', 'Featured Matchup', 'accepted'),
  ('ba333333-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', '88888888-8888-8888-8888-888888888888', NOW() + INTERVAL '1 day', 'melodic', 'Queen Spitt vs NovaMC', 'accepted'),
  ('ba444444-4444-4444-4444-444444444444', '77777777-7777-7777-7777-777777777777', '66666666-6666-6666-6666-666666666666', NOW() + INTERVAL '1 day 2 hours', 'drill', 'UK Division', 'accepted'),
  ('ba555555-5555-5555-5555-555555555555', '11111111-1111-1111-1111-111111111111', '33333333-3333-3333-3333-333333333333', NOW() + INTERVAL '7 days', 'all', 'Main Event (Championship Qualifier)', 'accepted')
ON CONFLICT (id) DO NOTHING;
