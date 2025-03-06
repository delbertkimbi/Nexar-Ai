import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  // Verify authentication
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Only return non-sensitive environment variables
  return NextResponse.json({
    hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY,
  })
}

