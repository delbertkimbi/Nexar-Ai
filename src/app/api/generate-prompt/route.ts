import { NextResponse } from "next/server"
import { generatePromptSuggestion, improvePrompt } from "@/lib/deepseek"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Verify authentication
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { category, context, action, originalPrompt, feedback } = await request.json()

    let result: string

    try {
      if (action === "improve" && originalPrompt) {
        result = await improvePrompt(originalPrompt, feedback)
      } else {
        result = await generatePromptSuggestion(category, context)
      }

      // Log the generation for analytics
      await supabase.from("prompt_generations").insert([
        {
          user_id: session.user.id,
          category,
          action: action || "generate",
          result,
        },
      ])

      return NextResponse.json({ prompt: result })
    } catch (error: any) {
      console.error("DeepSeek API error:", error)
      return NextResponse.json({ error: "Failed to generate prompt. Please try again." }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Error in generate-prompt route:", error)
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 })
  }
}

