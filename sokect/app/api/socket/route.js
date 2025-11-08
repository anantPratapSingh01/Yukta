// import { Server } from "socket.io";
// import socket from "@/lib/socket";
// let io;

// export const GET = async (req) => {
//  if (!io) {
//     io = new Server(global.server || 3001, {
//       cors: {
//         origin: "*",
//         methods: ["GET", "POST"],
//       },
//     });
// }
// io.on("connection", (socket)=>{
//     console.log("a user connected", socket.id);

//     socket.on("join_room",(data)=>{
//         socket.join(data.room);
//         socket.data.username=data.username;

//         socket.to(data.room).emit("recivedmsg", {message: `${data.username} has joined the room`, room: data.room, username: "admin"});
//         socket.emit("joinedRoom", data.room);
//     })
        
//             socket.on("sendmsg",(data)=>{
//         io.to(data.room).emit("recivedmsg", data);
//     })
 
//     socket.on("disconnect", ()=>{
//         console.log("user disconnected", socket.id);
//     });


// })
// return new Response("Socket.io initialized", { status: 200 });
// }