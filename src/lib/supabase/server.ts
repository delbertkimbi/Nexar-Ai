import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Create a dummy client to prevent rendering errors
const createDummyServerClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null }),
          order: () => ({
            limit: () => Promise.resolve({ data: [] }),
          }),
        }),
        order: () => ({
          limit: () => Promise.resolve({ data: [] }),
        }),
        insert: () => Promise.resolve({ error: new Error("Supabase client not initialized") }),
      }),
    }),
  } as any
}

export function createServerClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

