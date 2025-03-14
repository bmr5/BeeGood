// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { DateTime } from "luxon";

// Create a Supabase client with the auth context of the function
const supabaseClient = createClient(
  // Supabase API URL - env var exported by default
  Deno.env.get("SUPABASE_URL") ?? "",
  // Supabase API ANON KEY - env var exported by default
  Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  // Create client with Auth context of the function
  {
    global: {
      headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}` },
    },
  }
);

// Create an admin client with service role for bypassing RLS
const supabaseAdminClient = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  {
    global: {
      headers: {
        Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
      },
    },
  }
);

console.log("Starting send-daily-action-notifications function");

// Function to send a notification via the send-notification edge function
async function sendNotification(
  userId: string,
  deviceId: string,
  actionTitle: string
) {
  try {
    const { data, error } = await supabaseClient.functions.invoke(
      "send-notification",
      {
        body: {
          contents: {
            en: actionTitle,
          },
          headings: {
            en: "Your Daily Good Deed",
          },
          target_channel: "push",
          include_aliases: {
            external_id: [deviceId],
          },
        },
      }
    );

    if (error) {
      throw new Error(
        `Error calling send-notification function: ${error.message}`
      );
    }

    return data;
  } catch (error) {
    console.error(`Failed to send notification to user ${userId}:`, error);
    throw error;
  }
}

// Function to mark a user_action as notified by adding a flag to preferences
async function markActionAsNotified(userId: string, actionId: string) {
  // First get the current preferences
  const { data: userData, error: getUserError } = await supabaseAdminClient
    .from("users")
    .select("preferences")
    .eq("id", userId)
    .single();

  if (getUserError) {
    throw new Error(`Failed to get user preferences: ${getUserError.message}`);
  }

  // Update preferences to include notification status
  const preferences = userData.preferences || {};
  const notifiedActions = preferences.notifiedActions || {};
  notifiedActions[actionId] = DateTime.utc().toISO();
  preferences.notifiedActions = notifiedActions;

  // Update the user record
  const { error: updateError } = await supabaseAdminClient
    .from("users")
    .update({ preferences })
    .eq("id", userId);

  if (updateError) {
    throw new Error(
      `Failed to update user preferences: ${updateError.message}`
    );
  }

  return true;
}

// Main function to process notifications for eligible users
async function processNotifications({
  testMode = false,
  testHour = null,
  testUserId = null,
} = {}) {
  // Get current UTC time (or use test hour)
  const now = DateTime.utc();
  const currentHour = testHour !== null ? testHour : now.hour;
  const today = now.toFormat("yyyy-MM-dd");

  // Format current time in various timezones for debugging
  const formatTimeInTimezone = (timezone: string) => {
    try {
      return now
        .setZone(timezone)
        .toFormat("EEEE, MMMM d, yyyy h:mm:ss a ZZZZ");
    } catch (e) {
      console.error(`Error formatting time in timezone ${timezone}:`, e);
      return now.toFormat("EEEE, MMMM d, yyyy h:mm:ss a ZZZZ");
    }
  };

  // Log basic execution information
  console.log(`
Processing notifications:
UTC time: ${formatTimeInTimezone("UTC")} (Hour: ${currentHour})
Date: ${today}
Mode: ${testMode ? "TEST" : "PRODUCTION"}
${testUserId ? `Target user: ${testUserId}` : "Processing all eligible users"}
  `);

  // Query for eligible users with actions assigned today
  let query = supabaseAdminClient
    .from("users")
    .select(
      `
      id,
      device_id,
      timezone,
      preferences,
      user_actions!inner(
        id, 
        action_id,
        assigned_date
      )
    `
    )
    .eq("user_actions.assigned_date", today)
    .not("device_id", "is", null);

  // If testing a specific user, add that filter
  if (testUserId) {
    query = query.eq("id", testUserId);
  }

  const { data: eligibleUsers, error } = await query;

  if (error) {
    throw new Error(`Error querying eligible users: ${error.message}`);
  }

  console.log(
    `Found ${eligibleUsers?.length || 0} potential users with actions today`
  );

  // Filter users based on notification preferences and time of day
  const usersToNotify =
    eligibleUsers?.filter((user) => {
      // Skip users without device ID
      if (!user.device_id) return false;

      // Check if notifications are enabled in preferences
      const preferences = user.preferences || {};
      if (preferences.notificationsDisabled === true) return false;

      // Check if this action has already been notified
      const notifiedActions = preferences.notifiedActions || {};
      const actionId = user.user_actions[0].id;
      if (notifiedActions[actionId] && !testMode) return false;

      // If in test mode, skip time-of-day checks
      if (testMode) return true;

      // Improved timezone handling with Luxon
      if (user.timezone) {
        try {
          // Get the current hour in the user's timezone
          const userLocalTime = now.setZone(user.timezone);
          const userLocalHour = userLocalTime.hour;

          // Send notifications between 9am and 11am in user's local time
          return userLocalHour >= 9 && userLocalHour <= 11;
        } catch (e) {
          console.error(`Error handling timezone for user ${user.id}:`, e);
          // Default to UTC time window if timezone handling fails
          return currentHour >= 9 && currentHour <= 11;
        }
      }

      // Default: send notifications between 9am and 11am UTC
      return currentHour >= 9 && currentHour <= 11;
    }) || [];

  console.log(`Found ${usersToNotify.length} users to notify this hour`);

  // Process results
  const results = {
    total: usersToNotify.length,
    successful: 0,
    failed: 0,
    details: [] as Array<{
      userId: string;
      success: boolean;
      error?: string;
    }>,
  };

  // Process each eligible user
  for (const user of usersToNotify) {
    try {
      // Get the action title - Step 2: Get action details
      const userAction = user.user_actions[0];
      const actionId = userAction.action_id;

      // Fetch action title directly
      const { data: actionData, error: actionError } = await supabaseAdminClient
        .from("actions")
        .select("title")
        .eq("id", actionId)
        .single();

      if (actionError) {
        throw new Error(`Failed to get action details: ${actionError.message}`);
      }

      const actionTitle = actionData?.title || "Your daily good deed";

      // Send notification
      await sendNotification(user.id, user.device_id, actionTitle);

      // Mark as notified in user preferences
      await markActionAsNotified(user.id, userAction.id);

      // Update results
      results.successful++;
      results.details.push({
        userId: user.id,
        success: true,
      });

      console.log(`Successfully sent notification to user ${user.id}`);
    } catch (error) {
      // Update results for failed notification
      results.failed++;
      results.details.push({
        userId: user.id,
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      console.error(
        `Failed to process notification for user ${user.id}:`,
        error
      );
    }
  }

  return results;
}

Deno.serve(async (req) => {
  try {
    // Parse request parameters with defaults
    const {
      scheduled = true,
      testMode = false,
      testHour = null,
      testUserId = null,
    } = await req.json().catch(() => ({}));

    // Process notifications with test parameters
    const results = await processNotifications({
      testMode,
      testHour,
      testUserId,
    });

    // Return results
    return new Response(
      JSON.stringify({
        success: true,
        scheduled,
        testMode,
        results,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-daily-action-notifications:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-daily-action-notifications' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{}'

*/
