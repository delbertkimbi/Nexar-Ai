import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { LeaderboardTable } from "@/components/dashboard/leaderboard-table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase/server"

export default async function LeaderboardPage() {
  const supabase = createServerClient()

  // Fetch top users by XP
  const { data: topByXp } = await supabase
    .from("profiles")
    .select("id, username, level, xp, prompts_created, achievements_count")
    .order("xp", { ascending: false })
    .limit(10)

  // Fetch top users by prompts created
  const { data: topByPrompts } = await supabase
    .from("profiles")
    .select("id, username, level, xp, prompts_created, achievements_count")
    .order("prompts_created", { ascending: false })
    .limit(10)

  // Fetch top users by achievements
  const { data: topByAchievements } = await supabase
    .from("profiles")
    .select("id, username, level, xp, prompts_created, achievements_count")
    .order("achievements_count", { ascending: false })
    .limit(10)

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Leaderboard" text="See how you rank against other prompt engineers." />

      <Tabs defaultValue="xp" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="xp">Top by XP</TabsTrigger>
          <TabsTrigger value="prompts">Top by Prompts</TabsTrigger>
          <TabsTrigger value="achievements">Top by Achievements</TabsTrigger>
        </TabsList>
        <TabsContent value="xp">
          <LeaderboardTable users={topByXp || []} rankBy="xp" />
        </TabsContent>
        <TabsContent value="prompts">
          <LeaderboardTable users={topByPrompts || []} rankBy="prompts_created" />
        </TabsContent>
        <TabsContent value="achievements">
          <LeaderboardTable users={topByAchievements || []} rankBy="achievements_count" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

