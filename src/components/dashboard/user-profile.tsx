import type React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar, Edit, PenTool, Trophy, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Profile {
  id: string
  username: string
  level: number
  xp: number
  prompts_created: number
  achievements_count: number
  avatar_url?: string
  bio?: string
  created_at: string
  updated_at: string
}

interface UserProfileProps {
  profile: Profile
  isOwnProfile: boolean
}

export function UserProfile({ profile, isOwnProfile }: UserProfileProps) {
  // Calculate XP needed for next level (simple formula: level * 100)
  const nextLevelXP = profile.level * 100
  const xpProgress = Math.min(100, (profile.xp / nextLevelXP) * 100)
  const xpRemaining = nextLevelXP - profile.xp

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar_url} alt={profile.username} />
            <AvatarFallback className="text-lg">{profile.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">{profile.username}</CardTitle>
              {isOwnProfile && (
                <Link href="/dashboard/settings">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Profile</span>
                  </Button>
                </Link>
              )}
            </div>
            <CardDescription>
              {profile.bio ||
                (isOwnProfile ? "Add a bio to tell others about yourself." : "This user hasn't added a bio yet.")}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Level {profile.level}</span>
                <span className="text-muted-foreground">
                  {profile.xp} / {nextLevelXP} XP
                </span>
              </div>
              <Progress
                value={xpProgress}
                className="h-2 xp-progress-bar"
                style={{ "--progress-width": `${xpProgress}%` } as React.CSSProperties}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {xpRemaining} XP to level {profile.level + 1}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <PenTool className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{profile.prompts_created}</p>
                  <p className="text-xs text-muted-foreground">Prompts</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Trophy className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">{profile.achievements_count}</p>
                  <p className="text-xs text-muted-foreground">Achievements</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          {!isOwnProfile && (
            <Button variant="outline" className="w-full">
              <Users className="mr-2 h-4 w-4" />
              Follow
            </Button>
          )}
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
          <CardDescription>Badges and achievements earned by {isOwnProfile ? "you" : profile.username}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {profile.achievements_count > 0 ? (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">First Prompt</p>
                    <p className="text-sm text-muted-foreground">Created first prompt</p>
                  </div>
                </div>

                {profile.prompts_created >= 5 && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Prompt Master</p>
                      <p className="text-sm text-muted-foreground">Created 5+ prompts</p>
                    </div>
                  </div>
                )}

                {profile.level >= 5 && (
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Award className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Rising Star</p>
                      <p className="text-sm text-muted-foreground">Reached level 5</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Award className="mb-2 h-10 w-10 text-muted-foreground" />
                <h3 className="mb-1 text-lg font-semibold">No achievements yet</h3>
                <p className="text-sm text-muted-foreground">
                  {isOwnProfile
                    ? "Create prompts and engage with the community to earn achievements."
                    : `${profile.username} hasn't earned any achievements yet.`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

