import { Server } from "socket.io"
import { createServer } from "http"
import express from "express"
import cors from "cors"

const app = express()
const httpServer = createServer(app)

app.use(cors({
  origin: process.env.NEXT_PUBLIC_APP_URL,
  credentials: true
}))

const io = new Server(httpServer, {
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id)

  socket.on("join_room", (roomId) => {
    socket.join(roomId)
    console.log(`User ${socket.id} joined room ${roomId}`)
  })

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId)
    console.log(`User ${socket.id} left room ${roomId}`)
  })

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 3001
httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
}) 