"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Icons } from "@/components/icons"

interface UserStatsProps {
  level: number
  xp: number
  promptsCreated: number
  achievements: number
}

export function UserStats({ level, xp, promptsCreated, achievements }: UserStatsProps) {
  // Calculate XP needed for next level (simple formula: level * 100)
  const nextLevelXP = level * 100
  const xpProgress = Math.min(100, (xp / nextLevelXP) * 100)
  const xpRemaining = nextLevelXP - xp

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
    <motion.div
      className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Level</CardTitle>
            <Icons.trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{level}</div>
            <p className="text-xs text-muted-foreground">
              {xpRemaining} XP to level {level + 1}
            </p>
            <div className="mt-3">
              <Progress
                value={xpProgress}
                className="h-2 xp-progress-bar"
                style={{ "--progress-width": `${xpProgress}%` } as React.CSSProperties}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Icons.zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{xp}</div>
            <p className="text-xs text-muted-foreground">+10 XP in the last day</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Prompts Created</CardTitle>
            <Icons.penTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{promptsCreated}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={item}
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Icons.award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievements}</div>
            <p className="text-xs text-muted-foreground">{10 - achievements} more to unlock next badge</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

