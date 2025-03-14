// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// OneSignal API credentials
const ONESIGNAL_APP_ID = Deno.env.get("ONESIGNAL_APP_ID");
const ONESIGNAL_REST_API_KEY = Deno.env.get("ONESIGNAL_REST_API_KEY");

// Define the expected request payload structure based on OneSignalTest
interface NotificationRequest {
  // Required fields
  app_id?: string; // Optional - will use env var if not provided
  contents: {
    en: string;
  };
  headings: {
    en: string;
  };

  // Targeting - at least one must be provided
  include_aliases?: {
    external_id: string[];
  };
  include_external_user_ids?: string[]; // Legacy format support

  // Optional fields
  target_channel?: string; // e.g., "push"
  url?: string; // Deep link URL
}

// Define a type for the OneSignal notification payload
interface OneSignalNotificationPayload {
  app_id: string;
  contents: { en: string };
  headings: { en: string };
  include_aliases?: { external_id: string[] };
  include_external_user_ids?: string[];
  target_channel?: string;
  url?: string;
}

Deno.serve(async (req) => {
  console.log("notification function called");
  try {
    if (!ONESIGNAL_APP_ID || !ONESIGNAL_REST_API_KEY) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY must be set",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    // Parse the request body
    const requestData: NotificationRequest = await req.json();

    // Validate required fields
    if (!requestData.contents?.en || !requestData.headings?.en) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "Missing required fields: contents.en and headings.en are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate that at least one targeting method is provided
    if (
      !requestData.include_aliases?.external_id?.length &&
      !requestData.include_external_user_ids?.length
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error:
            "No recipients specified. Provide include_aliases.external_id or include_external_user_ids",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Construct the OneSignal notification payload
    const notificationPayload: OneSignalNotificationPayload = {
      app_id: ONESIGNAL_APP_ID || "",
      contents: requestData.contents,
      headings: requestData.headings,
    };

    // Add targeting parameters
    if (requestData.include_aliases?.external_id) {
      notificationPayload.include_aliases = {
        external_id: requestData.include_aliases.external_id,
      };
    }

    if (requestData.include_external_user_ids) {
      notificationPayload.include_external_user_ids =
        requestData.include_external_user_ids;
    }

    // Add optional parameters if provided
    if (requestData.target_channel) {
      notificationPayload.target_channel = requestData.target_channel;
    }

    if (requestData.url) {
      notificationPayload.url = requestData.url;
    }

    // Send to OneSignal
    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        Authorization: `Key ${ONESIGNAL_REST_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationPayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`OneSignal API error: ${JSON.stringify(responseData)}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        oneSignalId: responseData.id,
        recipients: responseData.recipients,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending notification:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
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

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{
      "contents": {
        "en": "This is a test notification from the OneSignal Test component!"
      },
      "headings": {
        "en": "Test Notification"
      },
      "target_channel": "push",
      "include_aliases": {
        "external_id": ["ben-device-123"]
      }
    }'

*/
