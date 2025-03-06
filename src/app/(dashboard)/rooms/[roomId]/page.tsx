"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { socket } from "@/lib/socket"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export default function CodeRoom() {
  const { roomId } = useParams()
  const { toast } = useToast()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Connect to Socket.IO server
    socket.connect()

    socket.on("connect", () => {
      setIsConnected(true)
      socket.emit("join_room", roomId)
      toast({
        title: "Connected to room",
        description: "You've successfully joined the coding room.",
      })
    })

    socket.on("connect_error", () => {
      toast({
        title: "Connection Error",
        description: "Failed to connect to the room. Please try again.",
        variant: "destructive",
      })
    })

    return () => {
      socket.emit("leave_room", roomId)
      socket.disconnect()
    }
  }, [roomId, toast])

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Code Room: {roomId}</h1>
      {/* Your existing room UI components */}
    </div>
  )
} 