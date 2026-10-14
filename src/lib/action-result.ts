import "server-only";

// What a server action returns when the page needs to show its outcome.
// On the live site, Next.js hides the message of any error a server action
// throws (the browser only sees "Minified React error"), so actions that call
// outside services catch their own errors and return a readable one instead.
export type ActionResult<T> = { ok: true; value: T } | { ok: false; error: string };

export async function attempt<T>(work: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    return { ok: true, value: await work() };
  } catch (error) {
    // The full error, with its stack, goes to the server log (Terminal locally,
    // Vercel → Logs live). The page gets one plain sentence.
    console.error(error);
    return { ok: false, error: explain(error) };
  }
}

// Turns the errors people actually hit while setting up into a next step.
function explain(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  const fixes: [RegExp, string][] = [
    [/x-api-key|authentication_error/i, "Anthropic rejected the API key. Check ANTHROPIC_API_KEY (run pnpm keys; on the live site, Vercel → Settings → Environment Variables)."],
    [/credit balance/i, "Your Anthropic account is out of credit. Add some at console.anthropic.com → Billing."],
    [/not_found_error|^model: /i, "AI_MODEL isn't a model Anthropic knows. Set it to a current Claude model id."],
    [/API key is invalid/i, "Resend rejected the API key. Check RESEND_API_KEY (run pnpm keys; on the live site, Vercel → Settings → Environment Variables)."],
    [/testing emails to your own email|verify a domain/i, "Resend can only email your own address until you verify your domain (Resend → Domains), then change EMAIL_FROM."],
    [/domain is not verified/i, "EMAIL_FROM uses a domain Resend hasn't verified yet. Finish Resend → Domains, or use onboarding@resend.dev for now."],
  ];
  for (const [pattern, fix] of fixes) if (pattern.test(message)) return fix;
  return message;
}
