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
      <header className="app-header">
        <div className="header-content">
          <h1>📚 Smart Study Assistant</h1>
          <p className="subtitle">AI-Powered Learning with RAG Technology</p>
        </div>
      </header>

      <div className="main-container">
        <aside className="sidebar">
          <div className="sidebar-section">
            <h2>📤 Upload Documents</h2>
            <Upload onUploadSuccess={handleUploadSuccess} />
          </div>
          
          <div className="sidebar-section info-box">
            <h3>ℹ️ How to Use</h3>
            <ol>
              <li>Upload PDF or PPTX files</li>
              <li>Wait for processing</li>
              <li>Ask questions about your material</li>
              <li>Get AI-powered answers!</li>
            </ol>
          </div>

          <div className="sidebar-section stats-box">
            <h3>📊 Features</h3>
            <ul>
              <li>✅ PDF & PowerPoint Support</li>
              <li>✅ Semantic Search</li>
              <li>✅ Context-Aware Answers</li>
              <li>✅ Multi-Document Knowledge Base</li>
            </ul>
          </div>
        </aside>

        <main className="chat-container">
          <Chat key={uploadKey} />
        </main>
      </div>

      <footer className="app-footer">
        <p>Built with FastAPI, React, LangChain & LLM | College Project 2026</p>
      </footer>
    </div>
  );
}