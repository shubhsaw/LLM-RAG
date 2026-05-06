import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:8000";

export default function Upload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFiles();
  }, []);

  async function fetchFiles() {
    try {
      const res = await fetch(`${API_URL}/files`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data);
      }
    } catch (err) {
      console.error("Failed to fetch files:", err);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first");
      return;
    }

    // Check file type
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.pdf') && !fileName.endsWith('.pptx') && !fileName.endsWith('.ppt')) {
      setError("Only PDF and PowerPoint files are supported");
      return;
    }

    setLoading(true);
    setError("");
    setStatus("Uploading and processing...");
    
    const fd = new FormData();
    fd.append("file", file);
    
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: fd
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus(`✅ Success! Indexed ${data.num_chunks} chunks from "${data.filename}"`);
        setFile(null);
        // Reset file input
        document.getElementById("file-input").value = "";
        // Refresh file list
        await fetchFiles();
        // Notify parent
        if (onUploadSuccess) onUploadSuccess();
      } else {
        setError(`❌ Upload failed: ${data.detail || JSON.stringify(data)}`);
        setStatus("");
      }
    } catch (err) {
      setError(`❌ Network error: ${err.message}`);
      setStatus("");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setStatus("");
  }

  return (
    <div className="upload-container">
      <form onSubmit={handleUpload} className="upload-form">
        <div className="file-input-wrapper">
          <input 
            id="file-input"
            type="file" 
            accept=".pdf,.pptx,.ppt" 
            onChange={handleFileChange}
            disabled={loading}
            className="file-input"
          />
          <label htmlFor="file-input" className="file-label">
            {file ? `📄 ${file.name}` : "Choose file..."}
          </label>
        </div>
        
        <button 
          type="submit" 
          disabled={!file || loading}
          className="upload-button"
        >
          {loading ? "⏳ Processing..." : "📤 Upload"}
        </button>
      </form>

      {status && <div className="status-message success">{status}</div>}
      {error && <div className="status-message error">{error}</div>}

      {files.length > 0 && (
        <div className="files-list">
          <h4>📁 Uploaded Documents ({files.length})</h4>
          <div className="files-items">
            {files.map((f) => (
              <div key={f.id} className="file-item">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <div className="file-name">{f.filename}</div>
                  <div className="file-meta">
                    {f.num_chunks} chunks • {new Date(f.uploaded_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}