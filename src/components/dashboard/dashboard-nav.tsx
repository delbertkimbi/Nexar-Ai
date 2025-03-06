"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, Compass, Layout, MessageSquare, PenTool, Settings, Trophy, Users } from "lucide-react"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import { motion } from "framer-motion"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Layout,
  },
  {
    title: "My Prompts",
    href: "/dashboard/prompts",
    icon: PenTool,
  },
  {
    title: "Explore",
    href: "/dashboard/explore",
    icon: Compass,
  },
  {
    title: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: BarChart,
  },
  {
    title: "Achievements",
    href: "/dashboard/achievements",
    icon: Trophy,
  },
  {
    title: "Community",
    href: "/dashboard/community",
    icon: Users,
  },
  {
    title: "Discussions",
    href: "/dashboard/discussions",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <SidebarMenu>
        {items.map((item, index) => (
          <motion.div key={item.href} variants={item}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                <Link href={item.href}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </motion.div>
        ))}
      </SidebarMenu>
    </motion.div>
  )
}

