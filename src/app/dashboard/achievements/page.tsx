import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AchievementsList } from "@/components/dashboard/achievements-list"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AchievementsPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (!profile) {
    redirect("/dashboard")
  }

  // Define all possible achievements
  const allAchievements = [
    {
      id: "first_prompt",
      name: "First Prompt",
      description: "Create your first prompt",
      icon: "PenTool",
      unlocked: profile.prompts_created >= 1,
      progress: Math.min(profile.prompts_created, 1),
      total: 1,
      xpReward: 10,
    },
    {
      id: "prompt_master",
      name: "Prompt Master",
      description: "Create 5 prompts",
      icon: "PenTool",
      unlocked: profile.prompts_created >= 5,
      progress: Math.min(profile.prompts_created, 5),
      total: 5,
      xpReward: 25,
    },
    {
      id: "prompt_expert",
      name: "Prompt Expert",
      description: "Create 25 prompts",
      icon: "PenTool",
      unlocked: profile.prompts_created >= 25,
      progress: Math.min(profile.prompts_created, 25),
      total: 25,
      xpReward: 100,
    },
    {
      id: "level_5",
      name: "Rising Star",
      description: "Reach level 5",
      icon: "Star",
      unlocked: profile.level >= 5,
      progress: Math.min(profile.level, 5),
      total: 5,
      xpReward: 50,
    },
    {
      id: "level_10",
      name: "Prompt Prodigy",
      description: "Reach level 10",
      icon: "Star",
      unlocked: profile.level >= 10,
      progress: Math.min(profile.level, 10),
      total: 10,
      xpReward: 100,
    },
    {
      id: "ai_assistant",
      name: "AI Assistant",
      description: "Use AI to generate 5 prompts",
      icon: "Sparkles",
      unlocked: false, // We'll need to track this in a separate table
      progress: 0,
      total: 5,
      xpReward: 25,
    },
    {
      id: "community_member",
      name: "Community Member",
      description: "Follow 5 other users",
      icon: "Users",
      unlocked: false, // We'll need to track this in a separate table
      progress: 0,
      total: 5,
      xpReward: 25,
    },
    {
      id: "prompt_improver",
      name: "Prompt Improver",
      description: "Improve 10 prompts with AI",
      icon: "Wand2",
      unlocked: false, // We'll need to track this in a separate table
      progress: 0,
      total: 10,
      xpReward: 50,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Achievements" text="Track your progress and unlock rewards." />

      <AchievementsList achievements={allAchievements} unlockedCount={profile.achievements_count} />
    </div>
  )
}

