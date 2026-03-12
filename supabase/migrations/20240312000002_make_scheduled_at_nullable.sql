-- Make scheduled_at nullable in battles to allow a pending challenge state without a fixed time
ALTER TABLE battles ALTER COLUMN scheduled_at DROP NOT NULL;
