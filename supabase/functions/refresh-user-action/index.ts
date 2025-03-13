// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Starting refresh-user-action function");

// Define types based on your database schema
interface UserAction {
  id: string;
  user_id: string;
  action_id: string;
  completed: boolean;
  skipped: boolean;
  completion_date: string | null;
  assigned_date: string;
  notes: string | null;
  created_at: string;
}

// Refresh User Action
Deno.serve(async (req) => {
  try {
    // Get the request body
    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create a Supabase client with the project URL and service role key from environment variables
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log(`Processing user actions for user: ${userId}`);

    // 1. Get all user actions for the specified user
    const { data: userActions, error: fetchError } = await supabaseClient
      .from("user_actions")
      .select("*")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Error fetching user actions:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch user actions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!userActions || userActions.length === 0) {
      console.log(`No actions found for user: ${userId}`);
      return new Response(
        JSON.stringify({ message: "No actions found for user" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract action_ids from the user actions to exclude them when getting a new action
    const existingActionIds = userActions.map(
      (action: UserAction) => action.action_id
    );
    console.log(
      `Found ${userActions.length} actions to archive for user: ${userId}`
    );

    // 2. Insert all user actions into the history table
    const { error: insertError } = await supabaseClient
      .from("user_actions_history")
      .insert(
        userActions.map((action: UserAction) => ({
          ...action,
          archived_at: new Date().toISOString(),
        }))
      );

    if (insertError) {
      console.error("Error inserting into user_actions_history:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to archive user actions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Delete the original user actions
    const { error: deleteError } = await supabaseClient
      .from("user_actions")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("Error deleting from user_actions:", deleteError);
      return new Response(
        JSON.stringify({ error: "Failed to delete original user actions" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(
      `Successfully archived ${userActions.length} actions for user: ${userId}`
    );

    // 4. Get a new action that wasn't previously assigned to the user
    const { data: availableActions, error: newActionError } =
      await supabaseClient
        .from("actions")
        .select("*")
        .not("id", "in", `(${existingActionIds.join(",")})`);

    if (newActionError) {
      console.error("Error fetching available actions:", newActionError);
      return new Response(
        JSON.stringify({
          error: "Failed to fetch available actions",
          details: newActionError,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!availableActions || availableActions.length === 0) {
      console.log("No new actions available to assign");
      return new Response(
        JSON.stringify({
          message:
            "User actions successfully archived, but no new actions available to assign",
          count: userActions.length,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Select a random action from the available actions
    const randomIndex = Math.floor(Math.random() * availableActions.length);
    const newAction = availableActions[randomIndex];
    console.log(
      `Randomly selected action ${newAction.id} at index ${randomIndex} from ${availableActions.length} available actions`
    );

    // 5. Create a new user action with the fresh action
    const newUserAction = {
      user_id: userId,
      action_id: newAction.id,
      completed: false,
      skipped: false,
      completion_date: null,
      assigned_date: new Date().toISOString(),
      notes: null,
    };

    const { data: createdUserAction, error: createError } = await supabaseClient
      .from("user_actions")
      .insert(newUserAction)
      .select()
      .single();

    if (createError) {
      console.error("Error creating new user action:", createError);
      return new Response(
        JSON.stringify({
          error: "Failed to create new user action",
          details: createError,
          archivedCount: userActions.length,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(
      `Successfully assigned new action ${newAction.id} to user ${userId}`
    );

    return new Response(
      JSON.stringify({
        message: "User actions successfully archived and new action assigned",
        archivedCount: userActions.length,
        newAction: createdUserAction,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/refresh-user-action' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"userId":"54c0acc5-400c-44b6-8426-57f405a7882b"}'

*/

// user_action d69c1561-2484-4d7b-86ba-39ea0d323676
// action id 6b59973d-4ab8-40b0-a8e1-7bd6fb7d9cd4
