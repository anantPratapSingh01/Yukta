// app/componet/chat/page.js
"use client";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

export default function Chat() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const roomId = searchParams.get("room");

  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

   const messagesEndRef = useRef(null);

  // Scroll to bottom when chat updates
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [chat]);

  //  useEffect(() => {
  //   const stored = typeof window !== "undefined" ? localStorage.getItem('user') : null;
  //   if (stored) {
  //     try {
  //       const parsed = JSON.parse(stored);
  //       setUserData(parsed);
  //     } catch (e) {
  //       console.error("Failed to parse userData");
  //     }
  //   }
  // }, []);

  useEffect(()=>{
    const fetchChats=async()=>{
      try {
        const res= await fetch('http://localhost:8080/api/v1/socket/getChats');
        const data= await res.json();
        setChat(data.chats);
      }
      catch (error) {
        console.log("Error fetching chats", error);
      }
    }
    fetchChats();
  },[])

  useEffect(() => {
    if (!roomId || !username) return;

    const newSocket = io("http://localhost:8080");
    setSocket(newSocket);

    newSocket.emit("join_room", { username, room: roomId });

    newSocket.on("recivedmsg", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, username]);

  const sendMessage =async () => {
    if (socket && message.trim()) {
      const msgData = {
        room: roomId,
        username,
        message: message.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString(),
      };
      await fetch('http://localhost:8080/api/v1/socket/addChat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({  
          username: msgData.username,
          message: msgData.message,
          date: new Date(),
          time: msgData.time
        }),
      });
      socket.emit("sendmsg", msgData);
      setMessage("");
    }
  };

  if (!roomId || !username) {
    return <div className="flex items-center justify-center h-screen">Invalid room or username</div>;
  }

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col h-[80vh]">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-4 text-lg font-semibold flex justify-between">
          <span>Room: {roomId}</span>
          <span>{username}</span>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          <AnimatePresence>
            {chat.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex ${msg.username === username ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-xl text-sm shadow-sm ${
                    msg.username === username
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="font-semibold text-xs opacity-80">{msg.username}</p>
                  <p>{msg.message}</p>
                  <p className="text-[10px] opacity-60 text-right">{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input area */}
        <div className="p-3 flex gap-2 border-t bg-white">
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-grow border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl hover:bg-indigo-700 transition-all duration-200"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}