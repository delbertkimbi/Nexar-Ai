import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Trophy, Medal } from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  level: number
  xp: number
  prompts_created: number
  achievements_count: number
  avatar_url?: string
}

interface LeaderboardTableProps {
  users: User[]
  rankBy: "xp" | "prompts_created" | "achievements_count"
}

export function LeaderboardTable({ users, rankBy }: LeaderboardTableProps) {
  // Get column title based on rankBy
  const getColumnTitle = () => {
    switch (rankBy) {
      case "xp":
        return "XP"
      case "prompts_created":
        return "Prompts"
      case "achievements_count":
        return "Achievements"
      default:
        return "Score"
    }
  }

  // Get rank icon based on position
  const getRankIcon = (position: number) => {
    switch (position) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />
      default:
        return <span className="text-sm font-medium">{position + 1}</span>
    }
  }

  return (
    <Card>
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Rank</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Level</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  {getColumnTitle()}
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                >
                  <td className="p-4 align-middle">
                    <div className="flex h-8 w-8 items-center justify-center">{getRankIcon(index)}</div>
                  </td>
                  <td className="p-4 align-middle">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar_url} alt={user.username} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        <Link href={`/dashboard/profile/${user.id}`} className="hover:underline">
                          {user.username}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-middle">
                    <Badge variant="outline" className="font-mono">
                      Lvl {user.level}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle font-medium">{user[rankBy].toLocaleString()}</td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="h-24 text-center text-muted-foreground">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Card>
  )
}

