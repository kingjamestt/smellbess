import "server-only";
import { JsonFileRepository } from "./json-repository";
import type { Repository } from "./repository";
import { SupabaseRepository } from "./supabase-repository";

const globalForRepo = globalThis as unknown as { smellbessRepo?: Repository };

/**
 * The app's single data entry point. Supabase when SUPABASE_URL and
 * SUPABASE_SECRET_KEY are set (production, and local if you want), otherwise
 * the local JSON file. Production refuses to fall back to the JSON file.
 */
export function getRepository(): Repository {
  if (globalForRepo.smellbessRepo) return globalForRepo.smellbessRepo;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (url && key) {
    globalForRepo.smellbessRepo = new SupabaseRepository(url, key);
  } else if (process.env.NODE_ENV === "production" && !process.env.SMELLBESS_ALLOW_JSON_STORE) {
    throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY must be set in production.");
  } else {
    globalForRepo.smellbessRepo = new JsonFileRepository();
  }
  return globalForRepo.smellbessRepo;
}

export type { Repository };
