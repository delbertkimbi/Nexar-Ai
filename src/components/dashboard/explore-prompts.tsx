import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MessageSquare, ThumbsUp } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  created_at: string
  upvotes: number
  comments: number
  profiles: {
    username: string
    avatar_url?: string
  }
}

interface ExplorePromptsProps {
  prompts: Prompt[]
}

export function ExplorePrompts({ prompts }: ExplorePromptsProps) {
  if (!prompts.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="mb-2 text-lg font-semibold">No prompts found</h3>
        <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt) => (
        <Card key={prompt.id} className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="line-clamp-1">{prompt.title}</CardTitle>
              <div className="mt-2">
                <Badge variant="outline">{prompt.category}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="line-clamp-3 text-sm text-muted-foreground">{prompt.content}</p>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  {prompt.upvotes || 0}
                </span>
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  {prompt.comments || 0}
                </span>
                <span>{formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}</span>
              </div>
              <Link href={`/dashboard/prompts/${prompt.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2 w-full">
              <Avatar className="h-6 w-6">
                <AvatarImage src={prompt.profiles.avatar_url} alt={prompt.profiles.username} />
                <AvatarFallback>{prompt.profiles.username.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <Link href={`/dashboard/profile/${prompt.id}`} className="text-sm hover:underline">
                {prompt.profiles.username}
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

