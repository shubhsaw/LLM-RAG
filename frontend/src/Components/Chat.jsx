import React, { useState, useRef, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hello! I'm your Smart Study Assistant. Upload some study materials and ask me questions about them!"
    }
  ]);
  const [text, setText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();
  const inputRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!text.trim()) return;
    
    const userMsg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setText("");
    setLoading(true);
    
    try {
      const payload = { message: text };
      if (sessionId) {
        payload.session_id = sessionId;
      }
      
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSessionId(data.session_id);
        setMessages((m) => [...m, { 
          role: "assistant", 
          content: data.answer 
        }]);
      } else {
        setMessages((m) => [...m, { 
          role: "assistant", 
          content: `⚠️ Error: ${data.detail || "Something went wrong"}` 
        }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { 
        role: "assistant", 
        content: `❌ Network error: ${err.message}. Is the backend running?` 
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([{
      role: "assistant",
      content: "Chat cleared! Ask me another question."
    }]);
    setSessionId(null);
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <h2>💬 Chat with Your Documents</h2>
        <button onClick={clearChat} className="clear-button" title="Clear chat">
          🗑️ Clear
        </button>
      </div>

      <div className="chat-messages">
        {messages.map((m, idx) => (
          <div 
            className={`message ${m.role === "user" ? "message-user" : "message-assistant"}`} 
            key={idx}
          >
            <div className="message-avatar">
              {m.role === "user" ? "👤" : "🤖"}
            </div>
            <div className="message-content">
              <div className="message-text">{m.content}</div>
              {m.role === "assistant" && (
                <div className="message-time">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {loading && (
          <div className="message message-assistant">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={endRef} />
      </div>

      <div className="chat-input-container">
        <div className="suggested-questions">
          <button 
            onClick={() => setText("Summarize the main topics")}
            className="suggestion-chip"
          >
            📝 Summarize
          </button>
          <button 
            onClick={() => setText("What are the key concepts?")}
            className="suggestion-chip"
          >
            🔑 Key Concepts
          </button>
          <button 
            onClick={() => setText("Create practice questions")}
            className="suggestion-chip"
          >
            ❓ Practice Quiz
          </button>
        </div>

        <div className="input-row">
          <textarea
            ref={inputRef}
            placeholder="Ask a question about your study material..." 
            value={text} 
            onChange={(e) => setText(e.target.value)} 
            onKeyDown={handleKeyDown}
            disabled={loading}
            rows={1}
            className="chat-input"
          />
          <button 
            onClick={sendMessage} 
            disabled={loading || !text.trim()}
            className="send-button"
            title="Send message (Enter)"
          >
            {loading ? "⏳" : "📤"}
          </button>
        </div>
      </div>
    </div>
  );
}