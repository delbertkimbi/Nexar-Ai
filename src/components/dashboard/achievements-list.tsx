import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { PenTool, Star, Sparkles, Users, Wand2, Award, Lock } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  unlocked: boolean
  progress: number
  total: number
  xpReward: number
}

interface AchievementsListProps {
  achievements: Achievement[]
  unlockedCount: number
}

export function AchievementsList({ achievements, unlockedCount }: AchievementsListProps) {
  // Function to render the appropriate icon
  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "PenTool":
        return <PenTool className="h-5 w-5" />
      case "Star":
        return <Star className="h-5 w-5" />
      case "Sparkles":
        return <Sparkles className="h-5 w-5" />
      case "Users":
        return <Users className="h-5 w-5" />
      case "Wand2":
        return <Wand2 className="h-5 w-5" />
      default:
        return <Award className="h-5 w-5" />
    }
  }

  // Group achievements by unlocked status
  const unlockedAchievements = achievements.filter((a) => a.unlocked)
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Progress</h2>
          <Badge variant="outline" className="text-sm">
            {unlockedCount} / {achievements.length} Unlocked
          </Badge>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-muted-foreground">
                {unlockedCount} / {achievements.length}
              </span>
            </div>
            <Progress value={(unlockedCount / achievements.length) * 100} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Unlocked Achievements</h2>
        {unlockedAchievements.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {unlockedAchievements.map((achievement) => (
              <Card key={achievement.id} className="overflow-hidden">
                <div className="h-2 bg-primary" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {renderIcon(achievement.icon)}
                    </div>
                    <Badge>+{achievement.xpReward} XP</Badge>
                  </div>
                  <CardTitle className="mt-2">{achievement.name}</CardTitle>
                  <CardDescription>{achievement.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium">
                      {achievement.progress} / {achievement.total}
                    </span>
                  </div>
                  <Progress value={100} className="h-2 mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No achievements unlocked yet</h3>
              <p className="text-muted-foreground">
                Complete tasks and engage with the platform to unlock achievements and earn XP.
              </p>
            </div>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Locked Achievements</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {lockedAchievements.map((achievement) => (
            <Card key={achievement.id} className="overflow-hidden">
              <div className="h-2 bg-muted" />
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    {achievement.progress > 0 ? (
                      renderIcon(achievement.icon)
                    ) : (
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <Badge variant="outline">+{achievement.xpReward} XP</Badge>
                </div>
                <CardTitle className="mt-2">{achievement.name}</CardTitle>
                <CardDescription>{achievement.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">
                    {achievement.progress} / {achievement.total}
                  </span>
                </div>
                <Progress value={(achievement.progress / achievement.total) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

