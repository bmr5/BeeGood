-- Seed data for categories
INSERT INTO categories (name, description, color, icon) VALUES
('Personal Growth', 'Actions that help you grow as a person', '#E0B040', 'brain'),
('Family Bonds', 'Actions that strengthen family relationships', '#C88F50', 'home-heart'),
('Friendship', 'Actions that nurture friendships', '#E9B5A0', 'handshake'),
('Community Impact', 'Actions that benefit your community', '#E7E7E0', 'city'),
('Environmental Care', 'Actions that help the environment', '#A0C090', 'leaf'),
('Compassion', 'Actions that show kindness to others', '#E9B5A0', 'heart');

-- Seed data for actions
INSERT INTO actions (title, description, category_id, is_custom) VALUES
-- Personal Growth
('Daily meditation', 'Take 5 minutes to meditate and clear your mind', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),
('Learn something new', 'Spend 15 minutes learning about a new topic', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),
('Journal gratitude', 'Write down three things you are grateful for today', 
  (SELECT id FROM categories WHERE name = 'Personal Growth'), FALSE),

-- Family Bonds
('Family meal', 'Have a meal with your family without devices', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),
('Call a family member', 'Call a family member you have not spoken to in a while', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),
('Family game night', 'Organize a game night with your family', 
  (SELECT id FROM categories WHERE name = 'Family Bonds'), FALSE),

-- Friendship
('Check in on a friend', 'Send a message to check how a friend is doing', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),
('Plan a friend date', 'Schedule time to meet with a friend', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),
('Send a thoughtful message', 'Send a friend a message about a good memory you share', 
  (SELECT id FROM categories WHERE name = 'Friendship'), FALSE),

-- Community Impact
('Pick up litter', 'Spend 10 minutes picking up litter in your neighborhood', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),
('Support local business', 'Buy something from a local small business', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),
('Volunteer', 'Volunteer for a local community organization', 
  (SELECT id FROM categories WHERE name = 'Community Impact'), FALSE),

-- Environmental Care
('Reduce water usage', 'Take a shorter shower today', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),
('Reusable items', 'Use reusable bags, bottles, or containers today', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),
('Plant something', 'Plant a tree, flower, or herb', 
  (SELECT id FROM categories WHERE name = 'Environmental Care'), FALSE),

-- Compassion
('Compliment someone', 'Give a genuine compliment to someone today', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE),
('Help someone in need', 'Offer help to someone who needs it', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE),
('Practice active listening', 'Have a conversation where you focus entirely on listening', 
  (SELECT id FROM categories WHERE name = 'Compassion'), FALSE);

-- Create a test user with device_id
INSERT INTO users (email, username, full_name, onboarding_completed, device_id)
VALUES ('test@example.com', 'testuser', 'Test User', TRUE, 'test-device-123');

-- Create user profile for test user
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
VALUES (
    (SELECT id FROM users WHERE email = 'test@example.com'),
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
);

-- Initialize user stats for test user
INSERT INTO user_stats (user_id, category_id, score)
SELECT 
    (SELECT id FROM users WHERE email = 'test@example.com'),
    id,
    10 -- Starting score
FROM categories;

-- Assign some actions to test user
INSERT INTO user_actions (user_id, action_id, assigned_date)
SELECT 
    (SELECT id FROM users WHERE email = 'test@example.com'),
    id,
    CURRENT_DATE
FROM actions
LIMIT 3;