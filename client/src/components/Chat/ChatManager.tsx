import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SessionStorageManager from '../../utils/sessionStorage';

const ChatManager: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Load existing chat history from sessionStorage
    const savedChatHistory = SessionStorageManager.getChatHistory();
    setMessages(savedChatHistory);
  }, []);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Send message to server
      await axios.post('/api/chat/message', { content: newMessage });

      // Create chat message object
      const chatMessage = {
        id: `msg-${Date.now()}`,
        content: newMessage,
        timestamp: new Date().toISOString(),
        sender: 'user'
      };

      // Update local state and sessionStorage
      const updatedMessages = [...messages, chatMessage];
      setMessages(updatedMessages);
      SessionStorageManager.saveChatMessage(chatMessage);

      // Clear input
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const clearChat = () => {
    // Clear messages from local state and sessionStorage
    setMessages([]);
    SessionStorageManager.clearChatHistory();
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`message ${msg.sender}`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
        <button onClick={clearChat}>Clear Chat</button>
      </div>
    </div>
  );
};

export default ChatManager;
