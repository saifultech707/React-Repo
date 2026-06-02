import React, { useState, useEffect, useRef } from "react";
import { 
  collection, 
  addDoc, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  setDoc, 
  serverTimestamp, 
  updateDoc 
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import "./contactus.css"; // Import the responsive CSS

export default function ContactUsPage() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem("userRole") || "user";
  
  const [authUser, setAuthUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  
  // Admin state
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  const messagesEndRef = useRef(null);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Admin: listen to all conversations
  useEffect(() => {
    if (userRole === "admin") {
      const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const convos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConversations(convos);
      });
      return () => unsubscribe();
    }
  }, [userRole]);

  // Listen to messages for active chat (user or admin)
  useEffect(() => {
    let chatId = null;
    if (userRole === "admin" && activeChat) {
      chatId = activeChat.id;
    } else if (userRole !== "admin" && authUser) {
      chatId = authUser.email;
    }

    if (chatId) {
      // Ensure the chat document exists for the user
      if (userRole !== "admin" && authUser) {
        setDoc(doc(db, "chats", chatId), {
          email: authUser.email,
          name: authUser.email.split('@')[0],
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      const q = query(collection(db, "chats", chatId, "messages"), orderBy("createdAt", "asc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMessages(msgs);
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      });
      return () => unsubscribe();
    } else {
      setMessages([]);
    }
  }, [userRole, activeChat, authUser]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    let chatId = null;
    let sender = userRole === "admin" ? "admin" : "user";

    if (userRole === "admin" && activeChat) {
      chatId = activeChat.id;
    } else if (userRole !== "admin" && authUser) {
      chatId = authUser.email;
    }

    if (!chatId) return;

    const messageText = inputText.trim();
    setInputText("");

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: messageText,
      sender,
      createdAt: serverTimestamp()
    });

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: messageText,
      updatedAt: serverTimestamp()
    });
  };

  const handleBackToList = () => {
    setActiveChat(null);
  };

  if (userRole === "admin") {
    return (
      <div className="contact-container">
        {/* Sidebar hides on mobile if a chat is active */}
        <div className={`admin-sidebar ${activeChat ? 'hidden-mobile' : ''}`}>
          <h2 className="sidebar-header">
            Conversations
          </h2>
          <div className="convo-list">
            {conversations.length === 0 ? (
              <p style={{ padding: "20px", color: "#888", textAlign: "center" }}>No active chats.</p>
            ) : (
              conversations.map(c => (
                <div 
                  key={c.id} 
                  className={`convo-item ${c.id === activeChat?.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(c)}
                >
                  <div className="convo-name">{c.name}</div>
                  <div className="convo-email">{c.email}</div>
                  <div className="convo-preview">
                    {c.lastMessage || "No messages yet"}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area hides on mobile if NO chat is active */}
        <div className={`chat-area ${!activeChat ? 'hidden-mobile' : ''}`}>
          {activeChat ? (
            <>
              <div className="chat-header">
                <div className="chat-header-info">
                  <button className="back-btn" onClick={handleBackToList}>
                    ←
                  </button>
                  <div>
                    <h3 style={{ margin: 0, color: "#111" }}>{activeChat.name}</h3>
                    <span style={{ fontSize: "13px", color: "#666" }}>{activeChat.email}</span>
                  </div>
                </div>
                <a href={`mailto:${activeChat.email}?subject=Reply from School Admin`} className="email-reply-btn">
                  ✉️ Reply via Email
                </a>
              </div>
              <div className="messages-area">
                {messages.length === 0 && (
                  <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>Say hello to start the conversation.</p>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`msg ${msg.sender === "admin" ? 'msg-right' : 'msg-left'}`}>
                    {msg.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={sendMessage} className="input-area">
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="chat-input"
                />
                <button type="submit" className="send-btn">Send</button>
              </form>
            </>
          ) : (
            <div className="no-chat-selected">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    );
  }

  // Normal User View
  return (
    <div className="user-container">
      {!authUser ? (
        <div className="start-chat-card">
          <h2 className="start-chat-title">Live Chat Support</h2>
          <p className="start-chat-text">
            Please log in or create an account to start chatting with our support team.
          </p>
          <button onClick={() => navigate("/auth")} className="start-btn">
            Go to Login
          </button>
        </div>
      ) : (
        <div className="user-chat-card">
          <div className="user-chat-header">
            <div>
              <h3 className="user-chat-title">Live Support</h3>
              <span className="user-chat-subtitle">Chatting as {authUser.email}</span>
            </div>
          </div>
          <div className="messages-area">
            {messages.length === 0 && (
              <p style={{ textAlign: "center", color: "#888", marginTop: "20px" }}>Connecting... Say hello!</p>
            )}
            {messages.map(msg => (
              <div key={msg.id} className={`msg ${msg.sender === "user" ? 'msg-right' : 'msg-left'}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={sendMessage} className="input-area">
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
            />
            <button type="submit" className="send-btn">Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
