"use client"

import { UserStats } from "@/components/dashboard/user-stats"
import { PromptList } from "@/components/dashboard/prompt-list"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { motion } from "framer-motion"

export default async function DashboardPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user profile data
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  // Fetch user's prompts
  const { data: prompts } = await supabase
    .from("prompts")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div className="flex flex-col gap-8" variants={container} initial="hidden" animate="show">
      <motion.div variants={item}>
        <DashboardHeader heading="Dashboard" text="Welcome back! Track your progress and manage your prompts.">
          <Link href="/dashboard/prompts/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Prompt
            </Button>
          </Link>
        </DashboardHeader>
      </motion.div>

      <motion.div variants={item}>
        <UserStats
          level={profile?.level || 1}
          xp={profile?.xp || 0}
          promptsCreated={profile?.prompts_created || 0}
          achievements={profile?.achievements_count || 0}
        />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          className="col-span-2"
          variants={item}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Prompts</h2>
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
        </motion.div>
        <motion.div
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <h2 className="text-2xl font-bold tracking-tight mb-4">Achievements</h2>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-6">
              <div className="flex flex-col gap-4">
                {/* Placeholder for achievements */}
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-medium">First Prompt</h3>
                    <p className="text-sm text-muted-foreground">Create your first prompt</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary">🔥</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Streak Master</h3>
                    <p className="text-sm text-muted-foreground">Create prompts 3 days in a row</p>
                  </div>
                </div>
                <Link href="/dashboard/achievements" className="text-sm text-primary hover:underline">
                  View all achievements
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

