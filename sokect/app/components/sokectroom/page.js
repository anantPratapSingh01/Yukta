"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

let socket;

export default function Room() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  const joinRoom = () => {
    if (!room || !username) return;

    socket = io("http://localhost:8080");
    socket.emit("join_room", { username, room });

    socket.on("joinedRoom", (data) => {
      router.push(`/componet/chat?username=${username}&room=${data}`);
    });
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* floating animated background circles */}
      <motion.div
        className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ top: "10%", left: "20%" }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{ bottom: "10%", right: "20%" }}
      />

      {/* main card */}
      <AnimatePresence>
        <motion.div
          key="room-card"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 bg-white/70 backdrop-blur-md p-8 rounded-2xl shadow-xl flex flex-col items-center w-80 md:w-96"
        >
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold text-gray-800 mb-6"
          >
            Join Chat Room
          </motion.h1>

          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="text"
            placeholder="Your Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border border-gray-300 p-2 mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />
          <motion.input
            whileFocus={{ scale: 1.03 }}
            type="text"
            placeholder="Room ID"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-full border border-gray-300 p-2 mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={joinRoom}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            Join Room
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}