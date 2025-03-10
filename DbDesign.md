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

| Column               | Type                     | Constraints                             | Description                                            |
| -------------------- | ------------------------ | --------------------------------------- | ------------------------------------------------------ |
| id                   | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for each profile                     |
| user_id              | UUID                     | REFERENCES users(id) ON DELETE CASCADE  | Reference to the user this profile belongs to          |
| improvement_areas    | TEXT[]                   | NULL                                    | Areas user wants to improve (from first screen)        |
| current_goals        | TEXT                     | NULL                                    | User's current goals (from second screen)              |
| age_range            | TEXT                     | NULL                                    | User's age range (from third screen)                   |
| interests            | TEXT[]                   | NULL                                    | User's interests (from fourth screen)                  |
| values               | TEXT[]                   | NULL                                    | User's core values (from fourth screen)                |
| living_situation     | TEXT                     | NULL                                    | User's living arrangement (from fifth screen)          |
| daily_schedule       | TEXT                     | NULL                                    | User's activity pattern (from sixth screen)            |
| work_schedule        | TEXT                     | NULL                                    | User's work pattern (from sixth screen)                |
| available_time       | TEXT                     | NULL                                    | Time available for deeds (from seventh screen)         |
| available_minutes    | INTEGER                  | NULL                                    | Approximate minutes available per day                  |
| spiritual_background | TEXT                     | NULL                                    | Optional religious/spiritual info (from eighth screen) |
| created_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the profile was created                           |
| updated_at           | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the profile was last updated                      |

### 3. categories

Defines the six core goodness categories for deeds.

| Column      | Type                     | Constraints                             | Description                         |
| ----------- | ------------------------ | --------------------------------------- | ----------------------------------- |
| id          | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for each category |
| name        | TEXT                     | NOT NULL, UNIQUE                        | Name of the category                |
| description | TEXT                     | NULL                                    | Description of the category         |
| color       | TEXT                     | NOT NULL                                | Color code for UI representation    |
| icon        | TEXT                     | NULL                                    | Icon name for UI representation     |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the category was created       |

### 4. actions

Stores all possible positive actions that can be suggested to users.

| Column          | Type                     | Constraints                             | Description                               |
| --------------- | ------------------------ | --------------------------------------- | ----------------------------------------- |
| id              | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique identifier for each action         |
| title           | TEXT                     | NOT NULL                                | Title of the action                       |
| description     | TEXT                     | NULL                                    | Description of the action                 |
| category_id     | UUID                     | REFERENCES categories(id)               | Category this action belongs to           |
| times_completed | INTEGER                  | DEFAULT 0                               | Number of times this action was completed |
| times_skipped   | INTEGER                  | DEFAULT 0                               | Number of times this action was skipped   |
| created_at      | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                           | When the action was created               |
| is_custom       | BOOLEAN                  | DEFAULT FALSE                           | Whether this is a custom user action      |

### 5. user_actions

Tracks which actions are assigned to users and their completion status.

| Column          | Type                     | Constraints                              | Description                                   |
| --------------- | ------------------------ | ---------------------------------------- | --------------------------------------------- |
| id              | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4()  | Unique identifier for each user action record |
| user_id         | UUID                     | REFERENCES users(id) ON DELETE CASCADE   | Reference to the user                         |
| action_id       | UUID                     | REFERENCES actions(id) ON DELETE CASCADE | Reference to the action                       |
| completed       | BOOLEAN                  | DEFAULT FALSE                            | Whether the action was completed              |
| skipped         | BOOLEAN                  | DEFAULT FALSE                            | Whether the action was skipped                |
| completion_date | TIMESTAMP WITH TIME ZONE | NULL                                     | When the action was completed                 |
| assigned_date   | DATE                     | NOT NULL                                 | Date when the action was assigned             |
| notes           | TEXT                     | NULL                                     | User's notes about completing the action      |
| created_at      | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                            | When the record was created                   |

### 6. user_stats

Tracks user progress in each goodness category.

| Column      | Type                     | Constraints                                    | Description                              |
| ----------- | ------------------------ | ---------------------------------------------- | ---------------------------------------- |
| id          | UUID                     | PRIMARY KEY, DEFAULT uuid_generate_v4()        | Unique identifier for each stat record   |
| user_id     | UUID                     | REFERENCES users(id) ON DELETE CASCADE         | Reference to the user                    |
| category_id | UUID                     | REFERENCES categories(id) ON DELETE CASCADE    | Reference to the category                |
| score       | INTEGER                  | DEFAULT 0, CHECK (score >= 0 AND score <= 100) | User's score in this category (0-100)    |
| created_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                                  | When the record was created              |
| updated_at  | TIMESTAMP WITH TIME ZONE | DEFAULT NOW()                                  | When the record was last updated         |
|             |                          | UNIQUE(user_id, category_id)                   | Ensures one record per user per category |

## Relationships

- Each user has one profile and one bee character
- Users can have multiple deeds assigned to them
- Users can unlock multiple achievements
- Each deed belongs to one category
- User stats are tracked per category per user
