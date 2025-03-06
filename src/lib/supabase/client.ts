import { createBrowserClient as createClient } from "@supabase/ssr"

// Create a dummy client to prevent rendering errors
const createDummyClient = () => {
  return {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null } }),
      getUser: () => Promise.resolve({ data: { user: null } }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: new Error("Supabase client not initialized") }),
      signUp: () => Promise.resolve({ error: new Error("Supabase client not initialized") }),
      signOut: () => Promise.resolve({ error: null }),
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

export function createBrowserClient() {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return createDummyClient()
    }

    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Validate environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase URL or Anon Key is missing. Check your environment variables.")
      return createDummyClient()
    }

    // Create the actual client
    return createClient(supabaseUrl, supabaseAnonKey)
  } catch (error) {
    console.error("Error creating Supabase client:", error)
    return createDummyClient()
  }
}

