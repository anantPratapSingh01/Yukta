'use client';

import { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function ChatsPage() {
  // Sample contacts
  const contacts = [
    { id: '1', name: 'Rahul Sharma', lastMsg: 'Haan bhai, kal milenge', time: '10:30 AM', dp: '👤', email: 'rahul@example.com' },
    { id: '2', name: 'Priya Verma', lastMsg: 'Photos bhej diye?', time: '9:45 AM', dp: '👩', email: 'priya@example.com' },
    { id: '3', name: 'Amit Sir', lastMsg: 'Meeting 3 PM', time: 'Yesterday', dp: '👔', email: 'amit@example.com' },
    { id: '4', name: 'Family Group', lastMsg: 'Papa: Khana kha liya?', time: 'Mon', dp: '👪', email: 'family@example.com' },
  ];

  // Mock chat history per contact
  const chatHistory = {
    '1': [
      { id: 1, message: 'Hi!', sender: 'other', time: '10:30 AM' },
      { id: 2, message: 'Hey! Kya haal hai?', sender: 'me', time: '10:31 AM' },
    ],
    '2': [
      { id: 1, message: 'Kal party hai?', sender: 'me', time: '9:40 AM' },
      { id: 2, message: 'Haan! 7 baje', sender: 'other', time: '9:45 AM' },
    ],
    '3': [{ id: 1, message: 'Agenda bhejo', sender: 'other', time: '3:00 PM' }],
    '4': [{ id: 1, message: 'Khana kha liya?', sender: 'other', time: '8:00 PM' }],
  };

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(chatHistory['1']);
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [reciver, setReciver] = useState(null);
  const [userEmail, setUserEmail] = useState(''); 
  const [userName, setUserName] = useState(''); 
  const [contact, setContact] = useState([]);

  // New notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const messagesEndRef = useRef(null);
  const attachmentRef = useRef(null);

  useEffect(() => {
    const AllUser = async () => {
      try {
        const res = await fetch('/api/register-user');
        const data = await res.json();
        setAllUsers(data.users);
      } catch (error) {
        console.log("Error fetching users:", error);
      }
    };
    AllUser();
  }, []);

  useEffect(() => {
    // Fixed: Direct string fetch
    const email = localStorage.getItem('userEmail') || '';
    const user = localStorage.getItem('userName') || '';
    setUserName(user);
    setUserEmail(email);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, allUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    try {
      const newSocket = io('http://localhost:8080');
      setSocket(newSocket);
      return () => newSocket.disconnect();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // Close attachment menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (attachmentRef.current && !attachmentRef.current.contains(e.target)) {
        setShowAttachmentMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleContactClick = async(contact) => {
    console.log("ya contect ha",contact)
    setSelectedContact(contact);
    setMessages(chatHistory[contact.id] || []);
     
     try {
      const res=await fetch('http://localhost:8080/api/v1/socket/getChat',{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          room:contact.email
        })
      });
      const data=await res.json();
      console.log("chat data",data);
     setContact([{
        id: contact._id,
        name: contact.name,
        email: contact.email,
        lastMsg: data.chats.length>0 ? data.chats[data.chats.length-1].message : '',
        time: data.chats.length>0 ? data.chats[data.chats.length-1].time : '',
        dp: '👤'
      }])
      setMessages(data.chats || [])
    } catch (error) {
      console.log(error)
    }

    socket?.emit('join_room', { room: contact.email });
    setReciver(contact);
  };
 

  useEffect(() => {
    if (socket) {
      socket.on("recivedmsg", (data) => {
        setMessages((prev) => [...prev, data]);
      });
    }
    return () => {
      if (socket) socket.off("recivedmsg");
    };
  }, [socket]); // Fixed: Changed dependency from userName to socket

  useEffect(() => {
    // Fixed: Use userEmail in dependency
    const getNotifications = async () => {
      if (!userEmail) return; // Don't call if no email
      try {
        const res = await fetch('http://localhost:8080/api/v1/socket/getNotifications', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            reciver: userName,
          })
        });
        const data = await res.json(); 
        console.log(data); 
        setNotifications(data.notifications || []);
        console.log("ya data ha", data.notifications);
      } catch (error) {
        console.log(error);
      }
    };
    getNotifications();
  }, [userEmail, showNotifications]); 

  const handleSend = async () => {
    if (inputText.trim() === '' || !reciver) return;
    
    const newMsg = {
      sender: userName, 
      reciver: reciver.name||reciver.sender,
      message: inputText,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: reciver.email||reciver.room
    };

    try {
      const res1= await fetch('http://localhost:8080/api/v1/socket/chat', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: userName,
      reciver: reciver.name||reciver.sender,
      message: inputText,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: reciver.email||reciver.room
    })});
      const result1 = await res1.json();
      console.log(result1);
      const res = await fetch('http://localhost:8080/api/v1/socket/notification', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          sender: userName, 
      reciver: reciver.name||reciver.sender,
      message: inputText,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      room: reciver.email||reciver.room
    }) 
      });
      const result = await res.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }

    socket?.emit("sendmsg", newMsg);
    setInputText('');
  };
  

  const handleAttachmentSelect = (type) => {
    alert(`"${type}" select kiya gaya! Ab file upload modal aa sakta hai.`);
    setShowAttachmentMenu(false);
  };

  const handleOpen = (notification) => {
    console.log("notifi",notification)
    
    handleContactClick({ name: notification.sender, email: notification.room ,currentEmail:notification.email});
    setShowNotifications(false);
   
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onClick={() => setShowDropdown(true)}
          />
          
          {/* Dropdown container */}
          {showDropdown && (
            <div 
              ref={dropdownRef}
              className="absolute z-10 mt-1 w-[280px] bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              <ul>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <li 
                      key={user.id}
                      className="px-4 py-2 hover:bg-green-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        setShowDropdown(false);
                        handleContactClick(user);
                      }}
                    >
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-200 flex items-center justify-center mr-3">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No users found</li>
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {contact.map((contact) => (
            <div
              key={contact.id}
              onClick={() => handleContactClick(contact)}
              className={`flex items-center p-3 hover:bg-gray-100 cursor-pointer transition ${
                selectedContact.id === contact.id ? 'bg-gray-100' : ''
              }`}
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                <span className="text-xl">{contact.dp}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-black truncate">{contact.name}</div>
                <div className="text-sm text-gray-500 truncate">{contact.lastMsg}</div>
                <div className="text-sm text-gray-500 truncate">{contact.email}</div>
              </div>
              <div className="text-xs text-gray-400">{contact.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div
          className="border-b border-gray-200 p-3 flex items-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setShowProfile(true)}
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-3 text-white font-bold">
            {selectedContact.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-black">{selectedContact.name}</div>
            <div className="text-xs text-gray-500">online</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id || msg.time}
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                msg.sender === userName // ✅ Fixed: Check if sender is current user
                  ? 'ml-auto bg-green-600 text-white'
                  : 'mr-auto bg-white text-black border border-gray-200'
              }`}
            >
              <div>{msg.message}</div>
              <div className={`text-xs mt-1 ${
                msg.sender === userName ? 'text-green-100' : 'text-gray-500'
              }`}>
                {msg.time}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-3 relative" ref={attachmentRef}>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button
                className="text-gray-500 hover:text-green-600 text-xl"
                onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              >
                📎
              </button>

              {/* Attachment Dropdown */}
              {showAttachmentMenu && (
                <div className="absolute bottom-full mb-2 left-0 w-40 bg-white border border-gray-300 rounded-lg shadow-lg py-1 z-10">
                  <button
                    className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 text-sm flex items-center"
                    onClick={() => handleAttachmentSelect('Image')}
                  >
                    Image
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 text-sm flex items-center"
                    onClick={() => handleAttachmentSelect('Video')}
                  >
                    Video
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-black hover:bg-gray-100 text-sm flex items-center"
                    onClick={() => handleAttachmentSelect('Document')}
                  >
                    Document
                  </button>
                </div>
              )}
            </div>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message"
              className="flex-1 px-4 py-2 text-black border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className={`px-5 py-2 rounded-full font-medium ${
                inputText.trim()
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Notification Button - Added here */}
      <button
        className="fixed bottom-6 left-6 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 z-40"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <span className="text-xl">🔔</span>
        {notifications.filter(n => !n.read).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {notifications.filter(n => !n.read).length}
          </span>
        )}
      </button>

      {/* Notification Panel - New component */}
      {showNotifications && (
        <div className="fixed bottom-20 left-6 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <button 
              onClick={() => setShowNotifications(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {notifications.length > 0 ? (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className={`p-3 ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => handleOpen(notification)} // ✅ Fixed: Pass notification object
                >
                  <div className="flex justify-between">
                    <p className="text-gray-800">{notification.message}</p>
                    <span className="text-xs text-gray-500">{notification.sender}</span>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">No notifications</div>
            )}
          </div>
        </div>
      )}

      {/* Simple Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-80 p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowProfile(false)}
            >
              ✕
            </button>
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
              {selectedContact.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-center mb-1">{selectedContact.name}</h2>
            <p className="text-gray-500 text-center mb-4">+91 98765 43210</p>
            <div className="text-sm text-gray-700 space-y-2">
              <div className="flex justify-between">
                <span>Phone:</span>
                <span>+91 9876543210</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span>Hey there! I'm using WhatsApp</span>
              </div>
            </div>
            <button
              className="w-full mt-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={() => setShowProfile(false)}
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
}