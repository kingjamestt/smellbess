import type { BankAccount } from "./types";

const MAX_ACCOUNTS = 10;

/**
 * Read bank accounts from env vars SMELLBESS_BANK_<n>_BANK / _ACCOUNT_NAME /
 * _ACCOUNT_TYPE / _ACCOUNT_NUMBER, numbered from 1. Stops at the first gap.
 * Accounts missing a bank or number are skipped.
 *
 * Pure (takes the env as an argument) so it can be tested without real values.
 * Call it only from server code: see `getBankAccounts` in lib/server.
 */
export function parseBankAccounts(env: Record<string, string | undefined>): BankAccount[] {
  const accounts: BankAccount[] = [];
  for (let n = 1; n <= MAX_ACCOUNTS; n++) {
    const prefix = `SMELLBESS_BANK_${n}_`;
    const bank = env[`${prefix}BANK`]?.trim();
    const accountNumber = env[`${prefix}ACCOUNT_NUMBER`]?.trim();
    const accountName = env[`${prefix}ACCOUNT_NAME`]?.trim() ?? "";
    const accountType = env[`${prefix}ACCOUNT_TYPE`]?.trim() ?? "";
    if (!bank && !accountNumber && !accountName) break;
    if (!bank || !accountNumber) continue;
    accounts.push({ bank, accountName, accountType, accountNumber });
  }
  return accounts;
}
