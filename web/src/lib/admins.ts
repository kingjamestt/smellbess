/**
 * Who counts as an admin: the emails in SMELLBESS_ADMIN_EMAILS (comma
 * separated). Kept in an env var, not the repo or the database.
 */
export function parseAdminEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter((e) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e));
}

export function isAdminEmail(email: string | null | undefined, admins: readonly string[]): boolean {
  return !!email && admins.includes(email.trim().toLowerCase());
}
