"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"
import { useToast } from "@/components/ui/use-toast"
import { motion } from "framer-motion"
import { createBrowserClient } from "@/lib/supabase/client"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [supabase, setSupabase] = useState<any>(null)
  const [isClientReady, setIsClientReady] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  // Initialize Supabase client
  useEffect(() => {
    try {
      const client = createBrowserClient()
      setSupabase(client)
      setIsClientReady(true)
    } catch (error) {
      console.error("Error initializing Supabase client:", error)
      toast({
        title: "Error",
        description: "Failed to initialize authentication. Please try again later.",
        variant: "destructive",
      })
    }
  }, [toast])

  useEffect(() => {
    if (error) {
      toast({
        title: "Authentication Error",
        description:
          error === "OAuthCallback"
            ? "There was a problem with the OAuth provider. Please try again."
            : "There was an error signing in. Please try again.",
        variant: "destructive",
      })
    }
  }, [error, toast])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!supabase || !isClientReady) {
      toast({
        title: "Error",
        description: "Authentication service is not available. Please try again later.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  async function signInWithProvider(provider: "github" | "google") {
    setIsLoading(true)
    try {
      await signIn(provider, { callbackUrl: "/dashboard" })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign in with provider. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-foreground opacity-90" />
        <motion.div
          className="relative z-20 flex items-center text-lg font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Icons.sparkles className="mr-2 h-6 w-6" />
          Nexar Pro
        </motion.div>
        <motion.div
          className="relative z-20 mt-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Nexar Pro has completely transformed how I approach prompt engineering. The gamification makes learning
              fun, and the community feedback is invaluable."
            </p>
            <footer className="text-sm">Alex Johnson, AI Researcher</footer>
          </blockquote>
        </motion.div>
      </div>
      <div className="lg:p-8">
        <motion.div
          className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to sign in to your account</p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={onSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading || !isClientReady}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    placeholder="********"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading || !isClientReady}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
                <Button
                  disabled={isLoading || !isClientReady}
                  className="transition-all duration-200 hover:bg-primary/90"
                >
                  {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Sign In
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => signInWithProvider("github")}
                className="transition-all duration-200 hover:bg-muted"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.github className="mr-2 h-4 w-4" />
                )}
                GitHub
              </Button>
              <Button
                variant="outline"
                type="button"
                disabled={isLoading}
                onClick={() => signInWithProvider("google")}
                className="transition-all duration-200 hover:bg-muted"
              >
                {isLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Google
              </Button>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            <Link href="/register" className="hover:text-primary underline underline-offset-4 transition-colors">
              Don&apos;t have an account? Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}

