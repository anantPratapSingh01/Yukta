// socket-server.js
import express from 'express';
import http from 'http'; // 👈 You were missing this!
import { Server } from 'socket.io';
import Router from './router/router.js'; // Default import
import Router1 from './router/notification.model.js'
import Router2 from './router/chat.route.js'
import cors from 'cors';
import { connectDB } from './database/db.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/socket', Router);
app.use('/api/v1/socket',Router1)
app.use('/api/v1/socket', Router2);

const server = http.createServer(app); // 👈 Use http.createServer, not "new createServer"

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_room", (data) => {
    socket.join(data.room);
    // socket.data.username = data.username;
    // socket.to(data.room).emit("recivedmsg", {
    //   message: `${data.username} has joined the room`,
    //   room: data.room,
    //   username: "admin",
    // });
    socket.emit("joinedRoom", data.room);
  });

  socket.on("sendmsg", (data) => {
    io.to(data.room).emit("recivedmsg", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 8080;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});