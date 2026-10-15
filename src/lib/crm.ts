// The stages a contact moves through, in order. This is the one list the
// app reads. The database checks the same names (the `contacts.stage` check
// constraint in supabase/migrations), so to change stages, change this list
// and that constraint together, in one new migration.
export const STAGES = ["lead", "talking", "customer", "partner", "archived"] as const;

// Everyone still in play. Archived contacts are hidden from the list and
// left out of the daily digest.
export const ACTIVE_STAGES = STAGES.filter((stage) => stage !== "archived");
