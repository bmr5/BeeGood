# Database Design for BeeGood App

This document outlines the database schema for the BeeGood application, which gamifies daily good deeds with personalized suggestions and stats-based progression.

## Core Tables

### 1. users

Stores basic user information and (optional) authentication details.

| Column               | Type                     | Constraints                             | Description                                                 |
| -------------------- | ------------------------ | --------------------------------------- | ----------------------------------------------------------- |
| id                   | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for each user                             |
| email                | TEXT                     | UNIQUE, NULL                            | User's email address (optional for non-authenticated users) |
| created_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the user record was created                            |
| updated_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the user record was last updated                       |
| username             | TEXT                     | UNIQUE, NULL                            | Optional username for social features                       |
| full_name            | TEXT                     | NULL                                    | User's full name (optional)                                 |
| avatar_url           | TEXT                     | NULL                                    | URL to user's profile image (optional)                      |
| preferences          | JSONB                    | DEFAULT '{}'                            | User preferences stored as JSON                             |
| onboarding_completed | BOOLEAN                  | DEFAULT FALSE                           | Whether user has completed onboarding                       |
| streak_count         | INTEGER                  | DEFAULT 0                               | Current streak of consecutive days with completed deeds     |
| last_deed_date       | DATE                     | NULL                                    | Date of the last completed deed                             |

### 2. user_profiles

Stores detailed user preferences and information collected during onboarding.

sql
CREATE TABLE user_profiles (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
daily_schedule TEXT,
living_situation TEXT,
interests TEXT[],
values TEXT[],
available_time INTEGER, -- minutes per day
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### 3. categories

Defines the six core goodness categories for deeds.

sql
CREATE TABLE categories (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL UNIQUE,
description TEXT,
color TEXT NOT NULL,
icon TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### 4. deeds

Stores all possible good deeds that can be suggested to users.

sql
CREATE TABLE deeds (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
title TEXT NOT NULL,
description TEXT,
category_id UUID REFERENCES categories(id),
difficulty_level TEXT CHECK (difficulty_level IN ('easy', 'medium', 'challenge')),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
is_custom BOOLEAN DEFAULT FALSE
);

### 5. user_deeds

Tracks which deeds are assigned to users and their completion status.

sql
CREATE TABLE user_deeds (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
deed_id UUID REFERENCES deeds(id) ON DELETE CASCADE,
completed BOOLEAN DEFAULT FALSE,
completion_date TIMESTAMP WITH TIME ZONE,
assigned_date DATE NOT NULL,
notes TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### 6. user_stats

Tracks user progress in each goodness category.

sql
CREATE TABLE user_stats (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
UNIQUE(user_id, category_id)
);

### 7. achievements

Defines achievements that users can unlock.

sql
CREATE TABLE achievements (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
name TEXT NOT NULL,
description TEXT NOT NULL,
icon TEXT,
requirement_type TEXT NOT NULL, -- streak, category_score, total_deeds, etc.
requirement_value INTEGER NOT NULL, -- threshold to unlock
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

### 8. user_achievements

Tracks which achievements each user has unlocked.

sql
CREATE TABLE user_achievements (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
UNIQUE(user_id, achievement_id)
);

### 9. bee_characters

Stores information about each user's bee character and its evolution.

sql
CREATE TABLE bee_characters (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
user_id UUID REFERENCES users(id) ON DELETE CASCADE,
evolution_stage INTEGER DEFAULT 1 CHECK (evolution_stage BETWEEN 1 AND 3),
customizations JSONB DEFAULT '{}'::JSONB,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

## Initial Data

### Categories

sql
INSERT INTO categories (name, description, color, icon) VALUES
('Personal Growth', 'Deeds that help you grow as a person', '#E0B040', 'brain'),
('Family Bonds', 'Deeds that strengthen family relationships', '#C88F50', 'home-heart'),
('Friendship', 'Deeds that nurture friendships', '#E9B5A0', 'handshake'),
('Community Impact', 'Deeds that benefit your community', '#E7E7E0', 'city'),
('Environmental Care', 'Deeds that help the environment', '#E0B040', 'leaf'),
('Compassion', 'Deeds that show kindness to others', '#E9B5A0', 'heart');

## Views

### user_stats_view

Provides a comprehensive view of user stats across all categories.

sql
CREATE VIEW user_stats_view AS
SELECT
us.user_id,
u.username,
c.name as category_name,
c.color as category_color,
us.score,
COUNT(ud.id) FILTER (WHERE ud.completed = TRUE) as completed_deeds_count
FROM user_stats us
JOIN users u ON us.user_id = u.id
JOIN categories c ON us.category_id = c.id
LEFT JOIN user_deeds ud ON ud.user_id = us.user_id AND ud.deed_id IN (
SELECT id FROM deeds WHERE category_id = c.id
)
GROUP BY us.user_id, u.username, c.name, c.color, us.score;

### daily_deed_suggestions

Provides a view of all available deeds for suggestion to users.

sql
CREATE VIEW daily_deed_suggestions AS
SELECT
d.id,
d.title,
d.description,
d.difficulty_level,
c.name as category_name,
c.color as category_color,
c.icon as category_icon
FROM deeds d
JOIN categories c ON d.category_id = c.id
WHERE d.is_custom = FALSE;

## Functions

### update_user_streak

Updates a user's streak when they complete a deed.

sql
CREATE OR REPLACE FUNCTION update_user_streak()
RETURNS TRIGGER AS $$
BEGIN
-- If a deed was completed
IF NEW.completed = TRUE AND OLD.completed = FALSE THEN
-- Update the user's last deed date
UPDATE users
SET last_deed_date = CURRENT_DATE
WHERE id = NEW.user_id;
-- Check if this continues a streak
UPDATE users
SET streak_count = streak_count + 1
WHERE id = NEW.user_id
AND (last_deed_date = CURRENT_DATE - INTERVAL '1 day' OR last_deed_date = CURRENT_DATE);
END IF;
RETURN NEW;
END;

$$
LANGUAGE plpgsql;
CREATE TRIGGER update_streak_on_deed_completion
AFTER UPDATE ON user_deeds
FOR EACH ROW
EXECUTE FUNCTION update_user_streak();


### calculate_overall_goodness
Calculates a user's overall goodness score based on their category scores.

sql
CREATE OR REPLACE FUNCTION calculate_overall_goodness(user_id UUID)
RETURNS INTEGER AS
$$

DECLARE
overall_score INTEGER;
BEGIN
SELECT ROUND(AVG(score))
INTO overall_score
FROM user_stats
WHERE user_id = $1;
RETURN overall_score;
END;

$$
LANGUAGE plpgsql;


## Relationships

- Each user has one profile and one bee character
- Users can have multiple deeds assigned to them
- Users can unlock multiple achievements
- Each deed belongs to one category
- User stats are tracked per category per user

## Data Flow

1. During onboarding, a user profile is created
2. Based on profile, daily deeds are suggested and assigned
3. When deeds are completed:
   - User stats are updated
   - Streaks are calculated
   - Achievements may be unlocked
   - Bee character may evolve
4. Stats view provides data for the stats screen and sharing

This database design supports all core MVP features while allowing for future expansion.
$$
