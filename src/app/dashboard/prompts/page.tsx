import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { PromptList } from "@/components/dashboard/prompt-list"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function PromptsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="My Prompts" text="Create, manage, and share your AI prompts.">
        <Link href="/dashboard/prompts/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </Link>
      </DashboardHeader>

      <PromptList prompts={prompts || []} />

      {(!prompts || prompts.length === 0) && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-semibold">No prompts yet</h3>
          <p className="mb-6 text-sm text-muted-foreground">
            Create your first prompt to start earning XP and unlocking achievements.
          </p>
          <Link href="/dashboard/prompts/new">
            <Button>Create a Prompt</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

