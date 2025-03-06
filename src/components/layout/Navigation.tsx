'use client'

import { useAuth } from '@/lib/context/AuthContext'
import { supabase } from '@/lib/supabase/auth'
import Link from 'next/link'
import { styles } from '@/components/ui/styles'

export default function Navigation() {
  const { user } = useAuth()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center">
              <span className="font-display text-2xl font-bold bg-gradient-to-r from-nexar-500 to-nexar-600 bg-clip-text text-transparent">
                Nexar AI
              </span>
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-6">
                <Link href="/prompts" className={styles.navLink}>
                  Prompts
                </Link>
                <Link href="/leaderboard" className={styles.navLink}>
                  Leaderboard
                </Link>
                <Link href="/challenges" className={styles.navLink}>
                  Challenges
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className={styles.xpBadge}>
                  <span className="mr-1">🌟</span>
                  <span>Level 1</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className={styles.buttonSecondary}
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
} 