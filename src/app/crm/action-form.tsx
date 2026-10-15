"use client";

import { useActionState, type ReactNode } from "react";
import type { FormState } from "./actions";

const initial: FormState = { ok: true };

// A form whose server action returns { ok, error } (see ./actions.ts).
// When the action says something went wrong, the message shows under the
// fields instead of the page crashing. Use it for any CRM form people type into.
export function ActionForm({
  action,
  className,
  children,
}: {
  action: (previous: FormState, form: FormData) => Promise<FormState>;
  className?: string;
  children: ReactNode;
}) {
  const [state, formAction] = useActionState(action, initial);

  return (
    <form action={formAction} className={className}>
      {children}
      {!state.ok && (
        <p role="alert" className="col-span-full basis-full text-sm text-danger">
          {state.error}
        </p>
      )}
    </form>
  );
}
