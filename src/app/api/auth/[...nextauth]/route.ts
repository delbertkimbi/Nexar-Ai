import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

const handler = NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false
      }

      const cookieStore = cookies()
      const supabase = createServerClient()

      // Check if user exists in Supabase
      const { data: existingUser } = await supabase.from("profiles").select("*").eq("email", user.email).single()

      if (!existingUser) {
        // Create new user in Supabase Auth
        const { data: authUser, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: crypto.randomUUID(), // Generate a random password
          options: {
            data: {
              name: user.name,
              avatar_url: user.image,
              provider: account?.provider,
            },
          },
        })

        if (authError) {
          console.error("Error creating user in Supabase Auth:", authError)
          return false
        }

        // Create profile record
        if (authUser.user) {
          const { error: profileError } = await supabase.from("profiles").insert([
            {
              id: authUser.user.id,
              email: user.email,
              username: user.name || user.email.split("@")[0],
              avatar_url: user.image,
              level: 1,
              xp: 0,
              prompts_created: 0,
              achievements_count: 0,
            },
          ])

          if (profileError) {
            console.error("Error creating profile:", profileError)
            return false
          }
        }
      } else {
        // User exists, sign them in
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: existingUser.password || crypto.randomUUID(),
        })

        if (signInError) {
          console.error("Error signing in existing user:", signInError)
          return false
        }
      }

      return true
    },
    async session({ session }) {
      // Add Supabase session to NextAuth session
      if (session.user?.email) {
        const cookieStore = cookies()
        const supabase = createServerClient()

        const { data: user } = await supabase.from("profiles").select("*").eq("email", session.user.email).single()

        if (user) {
          session.user.id = user.id
          session.user.username = user.username
          session.user.level = user.level
          session.user.xp = user.xp
        }
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
})

export { handler as GET, handler as POST }

