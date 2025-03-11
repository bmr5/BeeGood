-- Bypass RLS for seeding
SET LOCAL rls.force_admin_role = TRUE;

-- Seed data for categories
INSERT INTO categories (name, description, color, icon) VALUES
('Personal Growth', 'Actions that help you grow as a person', '#E0B040', 'brain'),
('Family Bonds', 'Actions that strengthen family relationships', '#C88F50', 'home-heart'),
('Friendship', 'Actions that nurture friendships', '#E9B5A0', 'handshake'),
('Community Impact', 'Actions that benefit your community', '#E7E7E0', 'city'),
('Environmental Care', 'Actions that help the environment', '#A0C090', 'leaf'),
('Compassion', 'Actions that show kindness to others', '#E9B5A0', 'heart');

-- Seed data for actions
INSERT INTO actions (title, category_id, is_custom) VALUES
-- Personal Growth
('Take 5 minutes to meditate and clear your mind', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),
('Spend 15 minutes learning about a new topic', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),
('Write down three things you are grateful for today', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),

-- Family Bonds
('Have a meal with your family without devices', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),
('Call a family member you have not spoken to in a while', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),
('Organize a game night with your family', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),

-- Friendship
('Send a message to check how a friend is doing', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),
('Schedule time to meet with a friend', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),
('Send a friend a message about a good memory you share', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),

-- Community Impact
('Spend 10 minutes picking up litter in your neighborhood', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),
('Buy something from a local small business', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),
('Volunteer for a local community organization', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),

-- Environmental Care
('Take a shorter shower today', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),
('Use reusable bags, bottles, or containers today', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),
('Plant a tree, flower, or herb', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),

-- Compassion
('Give a genuine compliment to someone today', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE),
('Offer help to someone who needs it', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE),
('Have a conversation where you focus entirely on listening', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE);

-- Create test users with device_ids
INSERT INTO users (email, username, full_name, onboarding_completed, device_id, timezone)
VALUES 
('ben@BeeGood.com', 'ben', 'Ben', TRUE, 'ben-device-123', 'America/Chicago'),
('nick@BeeGood.com', 'nick', 'Nick', TRUE, 'nick-device-789', 'America/Los_Angeles');

-- Create user profiles for test users
INSERT INTO user_profiles (
    user_id,
    improvement_areas,
    current_goals,
    age_range,
    interests,
    values,
    living_situation,
    daily_schedule,
    work_schedule,
    available_time,
    available_minutes,
    spiritual_background
)
SELECT 
    id,
    ARRAY['Mental wellbeing', 'Relationships'],
    'Reduce stress and connect more with others',
    '25-34',
    ARRAY['reading', 'fitness', 'nature'],
    ARRAY['kindness', 'personal growth'],
    'With partner/spouse',
    'Mid-day person (most active 10am-5pm)',
    'Standard weekday (9-5, M-F)',
    'Short breaks (10-20 minutes)',
    15,
    'Spiritual but not religious'
FROM users
WHERE email IN ('ben@BeeGood.com', 'nick@BeeGood.com');

-- Initialize user stats for test users
INSERT INTO user_stats (user_id, category_id, score)
SELECT 
    u.id,
    c.id,
    10 -- Starting score
FROM users u
CROSS JOIN categories c
WHERE u.email IN ('ben@BeeGood.com', 'nick@BeeGood.com');

-- Assign just one action to each test user
INSERT INTO user_actions (user_id, action_id, assigned_date)
SELECT 
    u.id,
    (SELECT id FROM actions ORDER BY RANDOM() LIMIT 1),
    CURRENT_DATE
FROM users u
WHERE u.email IN ('ben@BeeGood.com', 'nick@BeeGood.com');