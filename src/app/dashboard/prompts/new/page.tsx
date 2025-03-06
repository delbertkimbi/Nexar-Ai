import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PromptForm } from "@/components/dashboard/prompt-form"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function NewPromptPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Create New Prompt" text="Craft a new AI prompt and earn XP for your creativity." />

      <div className="grid gap-8">
        <PromptForm />
      </div>
    </div>
  )
}

