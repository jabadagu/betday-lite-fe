const readEnv = (key: string, fallback = "") => process.env[key] ?? fallback;

export const ENV = Object.freeze({
  NEXTAUTH_URL: readEnv("NEXTAUTH_URL", "http://localhost:3000"),
  NEXTAUTH_SECRET: readEnv("NEXTAUTH_SECRET", "betday-lite-local-secret"),
  NEXT_PUBLIC_APP_URL: readEnv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: readEnv("NEXT_PUBLIC_SUPABASE_URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: readEnv(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
  ),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: readEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  SUPABASE_SERVICE_ROLE_KEY: readEnv("SUPABASE_SERVICE_ROLE_KEY"),
} as const);
