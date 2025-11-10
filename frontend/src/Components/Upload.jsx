import React, { useState } from "react";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading...");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("Upload successful. Chunks: " + data.num_chunks);
      } else {
        setStatus("Upload failed: " + (data.detail || JSON.stringify(data)));
      }
    } catch (err) {
      setStatus("Upload error: " + err.message);
    }
  }

  return (
    <div className="upload-row">
      <input 
        type="file" 
        accept=".pdf,.pptx,.ppt" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <button onClick={handleUpload}>Upload</button>
      <div style={{marginLeft:12, alignSelf:"center"}}>{status}</div>
    </div>
  );
}