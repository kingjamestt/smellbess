import "server-only";
import { JsonFileRepository } from "./json-repository";
import type { Repository } from "./repository";

const globalForRepo = globalThis as unknown as { smellbessRepo?: Repository };

/**
 * The app's single data entry point. Swap the implementation here (e.g. to a
 * SupabaseRepository chosen by env var) without touching pages or actions.
 */
export function getRepository(): Repository {
  globalForRepo.smellbessRepo ??= new JsonFileRepository();
  return globalForRepo.smellbessRepo;
}

export type { Repository };
