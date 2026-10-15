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
    [/authentication fails|invalid api key|incorrect api key|401/i, "DeepSeek rejected the API key. Check DEEPSEEK_API_KEY (run pnpm keys; on the live site, Vercel → Settings → Environment Variables)."],
    [/insufficient balance|402/i, "Your DeepSeek account is out of credit. Top up at platform.deepseek.com → Top up (a few dollars lasts the whole workshop)."],
    [/model not exist|model_not_found|does not exist/i, "AI_MODEL isn't a model DeepSeek knows. Set it to deepseek-flash."],
    [/API key is invalid/i, "Resend rejected the API key. Check RESEND_API_KEY (run pnpm keys; on the live site, Vercel → Settings → Environment Variables)."],
    [/testing emails to your own email|verify a domain/i, "Resend can only email your own address until you verify your domain (Resend → Domains), then change EMAIL_FROM."],
    [/domain is not verified/i, "EMAIL_FROM uses a domain Resend hasn't verified yet. Finish Resend → Domains, or use onboarding@resend.dev for now."],
  ];
  for (const [pattern, fix] of fixes) if (pattern.test(message)) return fix;
  return message;
}
