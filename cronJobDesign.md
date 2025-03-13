# Cron Job Design for BeeGood App

This document outlines the cron job design for the BeeGood application, which gamifies daily good deeds with personalized suggestions and stats-based progression.

## Overview

The BeeGood app uses cron jobs to manage various tasks:

1. **Daily Action Assignment** - Assigns new actions to users each day
2. **Notification Management** - Sends timely reminders to users

## Proactive Historical Data Architecture

### Implementing Historical Tables Now

Creating a historical table structure from the beginning offers significant advantages:

1. **Two-Table Architecture**

   - `user_actions`: Contains only current day's active actions
   - `user_actions_history`: Archives all previous day actions (completed, skipped, or expired)

2. **Initial Schema Setup**

   ```sql
   -- History table has identical structure to main table
   CREATE TABLE user_actions_history (
     LIKE user_actions INCLUDING ALL
   );

   -- Add index optimized for historical queries
   CREATE INDEX idx_history_user_date ON user_actions_history(user_id, assigned_date);
   ```

3. **Data Management Process**
   - Daily cron job archives previous day's actions to `user_actions_history` table
   - Same daily cron job assigns new actions to users in `user_actions` table
   - `user_actions` table remains extremely lean with only current actions

### Benefits of This Approach

1. **Maximum Performance**: Main table stays extremely small and efficient
2. **Clear Separation**: Current vs. historical data is clearly defined
3. **Simplified Queries**: Current day queries are extremely fast
4. **Clean Slate Daily**: Each day starts with fresh records
5. **Comprehensive History**: Complete historical record maintained separately

### Cron Job Implementation

1. **Daily Action Management (3:00 AM)**

   - Archive all previous day's actions to history table
   - Assign new actions to users based on preferences and history
   - Update streak counts and user statistics

2. **Daily Archival Process (part of the same job)**
   ```
   - Move ALL actions from previous days to user_actions_history table
   - This includes completed, skipped, and expired (not acted upon) actions
   - The user_actions table will only contain the current day's actions
   ```

This aggressive archiving strategy maximizes performance of the active table while maintaining a complete historical record. It's particularly well-suited for applications where users primarily interact with the current day's content.
