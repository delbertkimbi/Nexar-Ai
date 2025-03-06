import { io } from "socket.io-client"

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
  reconnectionDelays: [1000, 2000, 5000, 10000],
  reconnectionAttempts: 5,
  autoConnect: false,
  withCredentials: true,
})

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error)
})

socket.on("disconnect", (reason) => {
  console.log("Socket disconnected:", reason)
}) 