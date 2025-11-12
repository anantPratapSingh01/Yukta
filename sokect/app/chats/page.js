'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatsPage() {
  // Sample contacts
  const contacts = [
    { id: '1', name: 'Rahul Sharma', lastMsg: 'Haan bhai, kal milenge', time: '10:30 AM', dp: '👤' },
    { id: '2', name: 'Priya Verma', lastMsg: 'Photos bhej diye?', time: '9:45 AM', dp: '👩' },
    { id: '3', name: 'Amit Sir', lastMsg: 'Meeting 3 PM', time: 'Yesterday', dp: '👔' },
    { id: '4', name: 'Family Group', lastMsg: 'Papa: Khana kha liya?', time: 'Mon', dp: '👪' },
  ];

  // Mock chat history per contact
  const chatHistory = {
    '1': [
      { id: 1, text: 'Hi!', sender: 'other', time: '10:30 AM' },
      { id: 2, text: 'Hey! Kya haal hai?', sender: 'me', time: '10:31 AM' },
    ],
    '2': [
      { id: 1, text: 'Kal party hai?', sender: 'me', time: '9:40 AM' },
      { id: 2, text: 'Haan! 7 baje', sender: 'other', time: '9:45 AM' },
    ],
    '3': [{ id: 1, text: 'Agenda bhejo', sender: 'other', time: '3:00 PM' }],
    '4': [{ id: 1, text: 'Khana kha liya?', sender: 'other', time: '8:00 PM' }],
  };

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState(chatHistory['1']);
  const [inputText, setInputText] = useState('');
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const messagesEndRef = useRef(null);
  const attachmentRef = useRef(null);

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

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setMessages(chatHistory[contact.id] || []);
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;
    const newMsg = {
      id: Date.now(),
      text: inputText,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
  };

  const handleAttachmentSelect = (type) => {
    alert(`"${type}" select kiya gaya! Ab file upload modal aa sakta hai.`);
    setShowAttachmentMenu(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-300 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-4 py-2 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
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
            {selectedContact.name.charAt(0)}
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
              key={msg.id}
              className={`max-w-xs px-4 py-2 rounded-lg shadow-sm ${
                msg.sender === 'me'
                  ? 'ml-auto bg-green-600 text-white'
                  : 'mr-auto bg-white text-black border border-gray-200'
              }`}
            >
              <div>{msg.text}</div>
              <div className={`text-xs mt-1 ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'}`}>
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
                <span>Hey there! I’m using WhatsApp</span>
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