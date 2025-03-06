"use client"

import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Eye, EyeOff, MessageSquare, ThumbsUp } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

interface Prompt {
  id: string
  title: string
  content: string
  category: string
  is_public: boolean
  created_at: string
  user_id: string
  upvotes?: number
  comments?: number
}

interface PromptListProps {
  prompts: Prompt[]
}

export function PromptList({ prompts }: PromptListProps) {
  if (!prompts.length) {
    return null
  }

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
    <motion.div className="grid gap-4 md:grid-cols-2" variants={container} initial="hidden" animate="show">
      {prompts.map((prompt) => (
        <motion.div
          key={prompt.id}
          variants={item}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div>
                <CardTitle className="line-clamp-1">{prompt.title}</CardTitle>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="outline">{prompt.category}</Badge>
                  {prompt.is_public ? (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <EyeOff className="h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3 text-sm text-muted-foreground">{prompt.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
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
                  View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}

