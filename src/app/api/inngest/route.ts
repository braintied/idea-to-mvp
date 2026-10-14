import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { functions } from "@/inngest/functions";

// Inngest calls this URL to run your background functions.
export const { GET, POST, PUT } = serve({ client: inngest, functions });
