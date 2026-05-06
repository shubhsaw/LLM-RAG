# 📚 Smart Study Assistant - RAG-Powered Learning Platform

An intelligent academic support system using **Retrieval-Augmented Generation (RAG)** that helps students learn and revise their course material through AI-powered question answering.

## 🎯 Project Overview

The Smart Study Assistant processes university-level study material (PDFs, PowerPoint presentations) and enables students to ask questions, get summaries, and receive accurate, curriculum-aligned answers using Large Language Models combined with semantic search.

### Key Features

✅ **Multi-Format Document Support** - Upload PDF and PPTX files  
✅ **Semantic Search** - Find relevant content using meaning, not just keywords  
✅ **RAG Architecture** - Grounded answers from your actual study material  
✅ **Real-Time Chat Interface** - Interactive question-answering  
✅ **Context-Aware Responses** - AI understands and explains concepts  
✅ **Session Management** - Maintains conversation history  
✅ **Modern UI** - Clean, responsive React interface

## 🏗️ Architecture

```
┌─────────────┐
│   Frontend  │  React + Vite
│  (Port 5173)│
└──────┬──────┘
       │ HTTP/REST
┌──────┴──────┐
│   Backend   │  FastAPI + Python
│  (Port 8000)│
└──────┬──────┘
       │
   ┌───┴───┬────────────┐
   │       │            │
┌──┴──┐ ┌──┴──┐  ┌────┴────┐
│FAISS│ │SQLite│ │ LLM API │
│Vector│ │ DB  │ │(Groq/HF)│
└─────┘ └─────┘  └─────────┘
```

### Tech Stack

**Backend:**

- FastAPI (Web framework)
- LangChain (RAG framework)
- FAISS (Vector database)
- Sentence Transformers (Embeddings)
- SQLAlchemy (Database ORM)
- Groq/HuggingFace API (LLM)

**Frontend:**

- React 19
- Vite (Build tool)
- Modern CSS (Responsive design)

## 📋 Prerequisites

Before running this project on another machine, install:

1. **Python 3.10 or higher**
   - Download from: https://www.python.org/downloads/
   - ⚠️ During installation, check "Add Python to PATH"

2. **Node.js 18+ and npm**
   - Download from: https://nodejs.org/
   - This includes npm package manager

3. **Git** (for cloning)
   - Download from: https://git-scm.com/

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd LLM-RAG
```

### Step 2: Backend Setup

```bash
# Install Python dependencies
pip install -r requirements.txt

# This will install:
# - FastAPI, uvicorn (web server)
# - LangChain (RAG framework)
# - FAISS (vector search)
# - Sentence Transformers (embeddings)
# - SQLAlchemy (database)
# - And all other required packages
```

### Step 3: Configure Environment Variables

```bash
# Copy the example environment file
copy .env.example .env

# Edit .env file and add your API key (choose ONE):
```

Open `.env` file and add **ONE** of these FREE API keys:

#### Option 1: Groq API (Recommended - Fast & Free)

1. Go to https://console.groq.com/
2. Sign up/Login
3. Go to API Keys section
4. Create new key
5. Add to `.env`:

```
GROQ_API_KEY=your_actual_groq_key_here
```

#### Option 2: HuggingFace API (Alternative - Free)

1. Go to https://huggingface.co/
2. Sign up/Login
3. Go to Settings → Access Tokens
4. Create new token
5. Add to `.env`:

```
HUGGINGFACE_API_KEY=your_actual_hf_token_here
```

### Step 4: Frontend Setup

```bash
cd frontend
npm install
cd ..
```

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
# From project root directory
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# You should see:
# INFO:     Uvicorn running on http://0.0.0.0:8000
```

### Terminal 2: Start Frontend

```bash
# From project root directory (in a NEW terminal)
cd frontend
npm run dev

# You should see:
# VITE v5.x.x  ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

### Step 5: Open in Browser

Navigate to: **http://localhost:5173**

## 📖 How to Use

1. **Upload Documents**
   - Click "Choose file" in the sidebar
   - Select a PDF or PPTX file (your study material)
   - Click "Upload" and wait for processing
   - You'll see "Success! Indexed X chunks"

2. **Ask Questions**
   - Type your question in the chat input
   - Questions can be like:
     - "Summarize the main topics"
     - "What is the definition of X?"
     - "Explain concept Y"
     - "Create practice questions"
   - Press Enter or click Send

3. **Get AI Answers**
   - The system retrieves relevant content from your documents
   - Sends it to the LLM with your question
   - Returns a grounded, accurate answer

## 🔧 Troubleshooting

### Backend won't start

```bash
# Check Python is installed
python --version

# Try installing dependencies again
pip install -r requirements.txt --upgrade

# Check if port 8000 is already in use
# On Windows: netstat -ano | findstr :8000
```

### Frontend won't start

```bash
# Check Node.js is installed
node --version
npm --version

# Try reinstalling dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### "No indexed documents" error

- Make sure you've uploaded at least one PDF or PPTX file
- Check backend console for indexing errors
- Verify `vectorstore/` directory was created

### LLM not responding / showing context only

- Make sure you added an API key to `.env`
- Verify the API key is valid
- Check backend console for API errors
- Groq API is faster than HuggingFace

### Database errors

- Delete `smart_study.db` file and restart backend
- This will reset the database

## 📁 Project Structure

```
LLM-RAG/
├── backend/
│   ├── main.py           # FastAPI endpoints
│   ├── db.py             # Database configuration
│   ├── models.py         # SQLAlchemy models
│   ├── utils.py          # RAG utilities (indexing, retrieval)
│   └── __init__.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx       # Main app component
│   │   ├── App.css       # Styling
│   │   ├── Components/
│   │   │   ├── Chat.jsx  # Chat interface
│   │   │   └── Upload.jsx # File upload
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── uploads/              # Uploaded files (created automatically)
├── vectorstore/          # FAISS index (created automatically)
├── .env                  # Environment configuration
├── .env.example          # Example environment file
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## 🎓 For Your College Project Presentation

### What to Show

1. **Upload Demo**: Upload a sample PDF/PPTX
2. **Query Demo**: Ask 3-4 different types of questions
3. **Show Architecture Diagram** (in this README)
4. **Explain RAG**: How it retrieves then generates
5. **Show Code**: Key parts of main.py and utils.py

### Key Points to Explain

- **Problem**: Students struggle with large study materials
- **Solution**: AI-powered assistant using RAG
- **How it works**:
  1. Document → Chunks → Embeddings → Vector Store
  2. Query → Embedding → Search → Retrieve Context
  3. Context + Query → LLM → Answer
- **Benefits**: Fast, accurate, curriculum-aligned answers

## 🌟 Features to Highlight

- ✅ No OpenAI API needed (uses free Groq/HF)
- ✅ Works completely locally (except LLM API)
- ✅ Supports multiple documents
- ✅ Semantic search (understands meaning)
- ✅ Production-ready architecture
- ✅ Modern, responsive UI
- ✅ Full-stack implementation

## 🔐 Security & Privacy

- All uploaded documents stored locally
- Only query+context sent to LLM API
- No document content stored externally
- SQLite database for local storage
- CORS configured for development

## 📚 API Documentation

Once backend is running, visit:

- **Interactive API docs**: http://localhost:8000/docs
- **Alternative docs**: http://localhost:8000/redoc

### Key Endpoints

- `POST /upload` - Upload and index document
- `POST /chat` - Send question, get answer
- `GET /files` - List all uploaded files
- `GET /health` - Check system status

## 🎯 Future Enhancements

- [ ] Support for more file formats (DOCX, TXT)
- [ ] Practice question generation
- [ ] Multi-language support
- [ ] Export chat history
- [ ] Admin dashboard
- [ ] Docker deployment
- [ ] Cloud deployment guides

## 👥 Credits

**Developed by:** [Your Name]  
**Institution:** [Your College]  
**Year:** 2026  
**Tech Stack:** Python, FastAPI, React, LangChain, FAISS

## 📝 License

This is an academic project for educational purposes.

## 🆘 Need Help?

If you encounter issues:

1. Check this README carefully
2. Verify all prerequisites are installed
3. Check both terminal outputs for errors
4. Ensure API key is configured correctly
5. Try restarting both backend and frontend

---

**Made with ❤️ for students by students**
