import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UserProfile } from "@/components/dashboard/user-profile"
import { PromptList } from "@/components/dashboard/prompt-list"
import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", params.id).single()

  if (!profile) {
    notFound()
  }

  // Fetch user's public prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", params.id)
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get current user to check if viewing own profile
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isOwnProfile = session?.user.id === params.id

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader
        heading={isOwnProfile ? "My Profile" : `${profile.username}'s Profile`}
        text={isOwnProfile ? "View and manage your profile" : `View ${profile.username}'s public profile and prompts`}
      />

      <UserProfile profile={profile} isOwnProfile={isOwnProfile} />

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">{isOwnProfile ? "My Prompts" : "Public Prompts"}</h2>
        <PromptList prompts={prompts || []} />

        {(!prompts || prompts.length === 0) && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">No public prompts</h3>
            <p className="text-sm text-muted-foreground">
              {isOwnProfile
                ? "You haven't created any public prompts yet."
                : `${profile.username} hasn't created any public prompts yet.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

