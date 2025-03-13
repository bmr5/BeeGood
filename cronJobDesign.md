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

## Notification System Implementation

### Edge Function Architecture

The notification system will be implemented using a Supabase Edge Function with the following components:

1. **Hourly Notification Edge Function**

   - Called by a cron job every hour during morning hours (e.g., 6am-12pm)
   - Processes users in batches based on timezone and notification preferences
   - Securely interfaces with OneSignal API without exposing credentials

2. **Implementation Flow**

   ```
   - Query users where:
     * Current local time is their preferred notification time (default: 10am)
     * They have an active user_action for today
     * They haven't been notified yet today
     * Notifications are enabled for their account
   - For each eligible user:
     * Retrieve their current day's action details
     * Craft personalized notification title and message
     * Send notification via OneSignal REST API
     * Mark the user_action as notified
   ```

3. **OneSignal Integration**

   - Edge function will securely store OneSignal API credentials
   - Notification payload will include:
     - Title: "Your Daily Good Deed"
     - Message: The specific action text (e.g., "Help someone carry groceries")
     - Deep link: Direct to the action detail screen in the app
   - Batch notifications when possible for efficiency

4. **Timezone Handling**
   - Store user timezone preferences in user profile
   - Calculate local time for each user during processing
   - Default to 10am local time if no preference is specified

### Sample Edge Function Pseudocode

```javascript
// Hourly notification processor
async function processNotifications() {
  // Get current UTC time
  const now = new Date();

  // Find users where current hour matches their notification hour in their timezone
  const eligibleUsers = await supabase
    .from("users")
    .select(
      `
      id, 
      external_id,
      timezone,
      user_actions!inner(id, action_text, notified)
    `
    )
    .eq("notification_enabled", true)
    .eq("user_actions.assigned_date", new Date().toISOString().split("T")[0])
    .eq("user_actions.notified", false)
    .filter("timezone_hour(timezone) = ?", [now.getUTCHours()]);

  // Process eligible users
  for (const user of eligibleUsers) {
    // Craft notification
    const notificationPayload = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_external_user_ids: [user.external_id],
      headings: { en: "Your Daily Good Deed" },
      contents: { en: user.user_actions[0].action_text },
      url: `app://beegood/actions/${user.user_actions[0].id}`,
    };

    // Send to OneSignal
    await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationPayload),
    });

    // Mark as notified
    await supabase
      .from("user_actions")
      .update({ notified: true })
      .eq("id", user.user_actions[0].id);
  }

  return { processed: eligibleUsers.length };
}
```

0 6-12 \* \* \*
