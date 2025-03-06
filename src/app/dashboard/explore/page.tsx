import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { ExplorePrompts } from "@/components/dashboard/explore-prompts"
import { Input } from "@/components/ui/input"
import { createServerClient } from "@/lib/supabase/server"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string }
}) {
  const supabase = createServerClient()

  // Build query for prompts
  let query = supabase
    .from("prompts")
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq("is_public", true)
    .order("created_at", { ascending: false })

  // Apply search filter if provided
  if (searchParams.q) {
    query = query.ilike("title", `%${searchParams.q}%`)
  }

  // Apply category filter if provided
  if (searchParams.category && searchParams.category !== "all") {
    query = query.eq("category", searchParams.category)
  }

  // Fetch prompts
  const { data: prompts } = await query.limit(20)

  // Fetch trending prompts (most upvotes)
  const { data: trendingPrompts } = await supabase
    .from("prompts")
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq("is_public", true)
    .order("upvotes", { ascending: false })
    .limit(10)

  // Fetch categories for filter
  const { data: categories } = await supabase.from("prompts").select("category").eq("is_public", true).order("category")

  // Remove duplicates from categories
  const uniqueCategories = categories ? Array.from(new Set(categories.map((item) => item.category))) : []

  return (
    <div className="flex flex-col gap-8">
      <DashboardHeader heading="Explore Prompts" text="Discover and learn from prompts created by the community." />

      <div className="flex flex-col gap-6">
        <form className="flex w-full max-w-sm items-center space-x-2">
          <Input type="search" placeholder="Search prompts..." name="q" defaultValue={searchParams.q} />
        </form>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 flex flex-wrap h-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {uniqueCategories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <ExplorePrompts prompts={prompts || []} />
          </TabsContent>

          {uniqueCategories.map((category) => (
            <TabsContent key={category} value={category}>
              <ExplorePrompts prompts={prompts?.filter((p) => p.category === category) || []} />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Trending Prompts</h2>
        <ExplorePrompts prompts={trendingPrompts || []} />
      </div>
    </div>
  )
}

