"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Wand2 } from "lucide-react"
import { motion } from "framer-motion"
import * as Icons from "lucide-react"

export function PromptForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [context, setContext] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [isImproving, setIsImproving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createBrowserClient()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a prompt",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Create the prompt
    const { error } = await supabase.from("prompts").insert([
      {
        title,
        content: content || aiSuggestion,
        category,
        is_public: isPublic,
        user_id: userData.user.id,
      },
    ])

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Update user stats
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single()

    if (profile) {
      await supabase
        .from("profiles")
        .update({
          prompts_created: profile.prompts_created + 1,
          xp: profile.xp + 10, // Award XP for creating a prompt
        })
        .eq("id", userData.user.id)
    }

    toast({
      title: "Success",
      description: "Prompt created successfully! You earned 10 XP.",
    })

    router.push("/dashboard/prompts")
    router.refresh()
  }

  async function generateAiSuggestion() {
    if (!category) {
      toast({
        title: "Select a category",
        description: "Please select a category to generate a prompt suggestion.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          context,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate prompt")
      }

      const data = await response.json()
      setAiSuggestion(data.prompt)

      toast({
        title: "Prompt Generated",
        description: "AI has generated a prompt suggestion for you.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function improvePrompt() {
    if (!content && !aiSuggestion) {
      toast({
        title: "No content",
        description: "Please write or generate a prompt first.",
        variant: "destructive",
      })
      return
    }

    setIsImproving(true)

    try {
      const response = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "improve",
          originalPrompt: content || aiSuggestion,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to improve prompt")
      }

      const data = await response.json()

      if (content) {
        setContent(data.prompt)
      } else {
        setAiSuggestion(data.prompt)
      }

      toast({
        title: "Prompt Improved",
        description: "AI has improved your prompt.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to improve prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsImproving(false)
    }
  }

  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Prompt Details</CardTitle>
          <CardDescription>Create a new AI prompt to share with the community or keep for yourself.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <motion.div
            className="grid gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter a descriptive title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </motion.div>

          <Tabs defaultValue="write">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="write">Write Your Own</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="write" className="space-y-4">
              <motion.div
                className="grid gap-2"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Prompt Content</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={improvePrompt}
                    disabled={isImproving || !content}
                    className="transition-all duration-200 hover:bg-primary/10"
                  >
                    <Wand2 className="mr-2 h-4 w-4" />
                    Improve
                  </Button>
                </div>
                <Textarea
                  id="content"
                  placeholder="Write your prompt here..."
                  className="min-h-[200px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </motion.div>
            </TabsContent>
            <TabsContent value="ai" className="space-y-4">
              <div className="grid gap-4">
                <motion.div
                  className="grid gap-2"
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Label htmlFor="category-context">Context (Optional)</Label>
                  <Textarea
                    id="category-context"
                    placeholder="Add any specific context or requirements for the AI to consider..."
                    className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                </motion.div>
                <div className="flex justify-between">
                  <Label htmlFor="ai-suggestion">AI Generated Suggestion</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={improvePrompt}
                      disabled={isImproving || !aiSuggestion}
                      className="transition-all duration-200 hover:bg-primary/10"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Improve
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateAiSuggestion}
                      disabled={isLoading}
                      className="transition-all duration-200 hover:bg-primary/10"
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                  </div>
                </div>
                <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                  <Textarea
                    id="ai-suggestion"
                    placeholder="Click 'Generate' to get an AI suggestion..."
                    className="min-h-[200px] transition-all duration-200 focus:ring-2 focus:ring-primary"
                    value={aiSuggestion}
                    onChange={(e) => setAiSuggestion(e.target.value)}
                    readOnly={!aiSuggestion}
                  />
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>

          <motion.div
            className="grid gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger id="category" className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="writing">Writing</SelectItem>
                <SelectItem value="coding">Coding</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div
            className="grid gap-2"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Label htmlFor="visibility">Visibility</Label>
            <Select value={isPublic ? "public" : "private"} onValueChange={(value) => setIsPublic(value === "public")}>
              <SelectTrigger id="visibility" className="transition-all duration-200 focus:ring-2 focus:ring-primary">
                <SelectValue placeholder="Select visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Share with community</SelectItem>
                <SelectItem value="private">Private - Only visible to you</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            type="button"
            onClick={() => router.back()}
            className="transition-all duration-200 hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading || (!content && !aiSuggestion)}
            className="transition-all duration-200 hover:bg-primary/90"
          >
            {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Create Prompt
          </Button>
        </CardFooter>
      </Card>
    </motion.form>
  )
}

