ALTER TABLE battles
ADD COLUMN is_admin_scheduled BOOLEAN DEFAULT false,
ADD COLUMN artist_a_accepted BOOLEAN DEFAULT false,
ADD COLUMN artist_b_accepted BOOLEAN DEFAULT false;
