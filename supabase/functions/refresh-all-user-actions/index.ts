// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

console.log("Starting refresh-all-user-actions function");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
console.log("SUPABASE_URL", SUPABASE_URL);
console.log("SUPABASE_SERVICE_ROLE_KEY", SUPABASE_SERVICE_ROLE_KEY);
const BATCH_SIZE = 50; // Adjust based on your user count and performance testing

// Define types for our results
interface ProcessResult {
  userId: string;
  success: boolean;
  result?: any;
  error?: string;
}

Deno.serve(async (_req) => {
  const startTime = Date.now();
  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get all active users
    const { data: users, error: fetchError } = await supabaseClient
      .from("users")
      .select("id");

    if (fetchError) {
      console.error("Error fetching users:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch users" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ message: "No users found" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(`Found ${users.length} users to process`);

    // Process users in batches to avoid timeout
    const results: ProcessResult[] = [];
    const errors: ProcessResult[] = [];

    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      console.log(
        `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}, size: ${
          batch.length
        }`
      );

      // Process each user in the batch
      const batchPromises = batch.map(async (user) => {
        try {
          // Call the refresh-user-action function for each user
          const response = await fetch(
            `${Deno.env.get("SUPABASE_URL")}/functions/v1/refresh-user-action`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Deno.env.get(
                  "SUPABASE_SERVICE_ROLE_KEY"
                )}`,
              },
              body: JSON.stringify({ userId: user.id }),
            }
          );

          const result = await response.json();
          return { userId: user.id, success: response.ok, result };
        } catch (error: unknown) {
          console.error(`Error processing user ${user.id}:`, error);
          return {
            userId: user.id,
            success: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);

      // Separate successes and failures
      batchResults.forEach((result) => {
        if (result.success) {
          results.push(result);
        } else {
          errors.push(result);
        }
      });

      // Check if we're approaching the timeout limit (50 seconds to be safe)
      if (i + BATCH_SIZE < users.length && Date.now() - startTime > 50000) {
        console.log("Approaching timeout limit, stopping batch processing");
        break;
      }
    }

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} users successfully with ${errors.length} errors`,
        successCount: results.length,
        errorCount: errors.length,
        errors: errors.length > 0 ? errors : undefined,
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/refresh-all-user-actions' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{}'

*/
