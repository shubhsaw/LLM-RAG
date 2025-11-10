import React, { useState, useRef } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

async function sendMessage() {
  if (!text.trim()) return;
  const userMsg = { role: "user", content: text };
  setMessages((m) => [...m, userMsg]);
  setLoading(true);
  try {
    const payload = { message: text };
    if (sessionId) {
      payload.session_id = sessionId;
    }
    
    const res = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
      const data = await res.json();
      console.log("Response status:", res.status);  // Add this
      console.log("Response data:", data);  // Add this
      if (res.ok) {
        setSessionId(data.session_id);
        setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", content: "Error: " + JSON.stringify(data) }]);
      }
    } catch (err) {
      setMessages((m) => [...m, { role: "assistant", content: "Network error: " + err.message }]);
    } finally {
      setLoading(false);
      setText("");
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div>
      <div className="chat-window" id="chat-window">
        {messages.map((m, idx) => (
          <div className={"message " + (m.role === "user" ? "user" : "bot")} key={idx}>
            <div className="bubble">{m.content}</div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="input-row">
        <input 
          type="text" 
          placeholder="Ask a question..." 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          onKeyDown={(e) => { if(e.key === 'Enter') sendMessage(); }} 
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}