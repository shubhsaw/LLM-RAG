import React from "react";
import Chat from "./components/Chat";  // Fix: Changed from "../components/Chat"
import Upload from "./components/Upload";  // Fix: Changed from "../components/Upload"

export default function App() {
  return (
    <div className="app">
      <h2>Smart Study Assistant</h2>
      <Upload />
      <Chat />
    </div>
  );
}