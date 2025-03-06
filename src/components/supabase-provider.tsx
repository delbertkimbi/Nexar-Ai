"use client"

import { createBrowserClient } from "@/lib/supabase/client"
import { createContext, useContext, useEffect, useState } from "react"
import { type SupabaseClient } from "@supabase/supabase-js"

const Context = createContext<SupabaseClient | undefined>(undefined)

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserClient())

  return <Context.Provider value={supabase}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error("useSupabase must be used inside SupabaseProvider")
  }
  return context
}

