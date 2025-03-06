import { Award, Brain, Compass, Lightbulb, Share2, Sparkles, Trophy, Users } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="container py-12 md:py-24 lg:py-32">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-5xl">Features</h2>
        <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
          Nexar Pro combines learning, creation, and community in one platform.
        </p>
      </div>
      <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 lg:grid-cols-4 mt-12">
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">AI-Powered</h3>
          <p className="text-muted-foreground">Get intelligent prompt suggestions and improvements from DeepSeek AI.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Gamification</h3>
          <p className="text-muted-foreground">
            Earn XP, level up, and unlock achievements as you create and share prompts.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Community</h3>
          <p className="text-muted-foreground">Connect with other prompt engineers, share ideas, and collaborate.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Learn</h3>
          <p className="text-muted-foreground">Improve your prompt engineering skills with tutorials and examples.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Share2 className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Share</h3>
          <p className="text-muted-foreground">Publish your best prompts and get feedback from the community.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Award className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Rewards</h3>
          <p className="text-muted-foreground">Earn badges and climb the leaderboard as you contribute.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Discover</h3>
          <p className="text-muted-foreground">Explore a vast library of prompts across different categories.</p>
        </div>
        <div className="relative overflow-hidden rounded-lg border bg-background p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <Brain className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-bold text-xl mb-2">Personalized</h3>
          <p className="text-muted-foreground">Get recommendations based on your interests and usage patterns.</p>
        </div>
      </div>
    </section>
  )
}

