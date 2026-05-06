import React, { useState } from "react";
import Chat from "./Components/Chat";
import Upload from "./Components/Upload";
import "./App.css";

export default function App() {
  const [uploadKey, setUploadKey] = useState(0);

  const handleUploadSuccess = () => {
    setUploadKey(prev => prev + 1);
  };

  return (
    <div className="app">

      {/* HEADER */}
      <header className="app-header">
        <div className="header-brand">
          <div className="logo-mark">AI</div>
          <div className="brand-text">
            <h1>Smart Study Assistant</h1>
            <p className="subtitle">AI-Powered Learning with RAG</p>
          </div>
        </div>

        <div className="header-right">
          <div className="status-badge">
            <span className="status-dot"></span>
            System Ready
          </div>
        </div>
      </header>

      {/* NEW BODY LAYOUT */}
      <div className="layout">

        {/* LEFT SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">📂 Documents</div>
          <Upload onUploadSuccess={handleUploadSuccess} />
        </aside>

        {/* CHAT AREA */}
        <main className="main-body">
          <Chat key={uploadKey} />
        </main>

      </div>

      {/* FOOTER */}
      <footer className="app-footer">
        <span className="footer-text">
          Built with FastAPI • React • LangChain • LLM
        </span>
        <span className="footer-sep"></span>
        <span className="footer-group">Group ID: AIA-110</span>
      </footer>

    </div>
  );
}