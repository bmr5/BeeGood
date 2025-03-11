-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    username TEXT UNIQUE NULL,
    full_name TEXT NULL,
    avatar_url TEXT NULL,
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    streak_count INTEGER DEFAULT 0,
    last_action_date DATE NULL,
    timezone TEXT DEFAULT 'UTC'
);

-- Create user_profiles table
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    improvement_areas TEXT[] NULL,
    current_goals TEXT NULL,
    age_range TEXT NULL,
    interests TEXT[] NULL,
    values TEXT[] NULL,
    living_situation TEXT NULL,
    daily_schedule TEXT NULL,
    work_schedule TEXT NULL,
    available_time TEXT NULL,
    available_minutes INTEGER NULL,
    spiritual_background TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT NULL,
    color TEXT NOT NULL,
    icon TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create actions table
CREATE TABLE actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    times_completed INTEGER DEFAULT 0,
    times_skipped INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_custom BOOLEAN DEFAULT FALSE
);

-- Create user_actions table
CREATE TABLE user_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_id UUID REFERENCES actions(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    skipped BOOLEAN DEFAULT FALSE,
    completion_date TIMESTAMP WITH TIME ZONE NULL,
    assigned_date DATE NOT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_stats table
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category_id)
);

-- Create user_stats_view
CREATE VIEW user_stats_view AS
SELECT
    us.user_id,
    u.username,
    c.name as category_name,
    c.color as category_color,
    us.score,
    COUNT(ua.id) FILTER (WHERE ua.completed = TRUE) as completed_actions_count
FROM user_stats us
JOIN users u ON us.user_id = u.id
JOIN categories c ON us.category_id = c.id
LEFT JOIN user_actions ua ON ua.user_id = us.user_id AND ua.action_id IN (
    SELECT id FROM actions WHERE category_id = c.id
)
GROUP BY us.user_id, u.username, c.name, c.color, us.score;