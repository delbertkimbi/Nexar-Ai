import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Master AI Prompts Through Play
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Nexar Pro is a gamified platform where you can learn, create, and refine AI prompts while earning
                rewards and unlocking achievements.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full">
                  Get Started
                </Button>
              </Link>
              <Link href="/learn">
                <Button size="lg" variant="outline" className="w-full">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 via-secondary/20 to-muted/20 p-2">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4 p-4">
                  <div className="space-y-2 rounded-lg border bg-background p-4 shadow-sm">
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/2 rounded bg-muted"></div>
                  </div>
                  <div className="space-y-2 rounded-lg border bg-background p-4 shadow-sm">
                    <div className="h-4 w-full rounded bg-muted"></div>
                    <div className="h-4 w-3/4 rounded bg-muted"></div>
                    <div className="h-4 w-1/2 rounded bg-muted"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="h-8 w-20 rounded bg-primary"></div>
                    <div className="h-8 w-8 rounded-full bg-muted"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

