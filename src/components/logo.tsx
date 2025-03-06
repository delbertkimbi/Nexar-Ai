"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
        <Sparkles className="h-6 w-6" />
      </motion.div>
      <motion.span
        className="font-bold text-xl bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        Nexar Pro
      </motion.span>
    </Link>
  )
}

