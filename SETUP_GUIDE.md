# 🚀 Complete Setup Guide - Smart Study Assistant

This guide walks you through setting up the Smart Study Assistant on a **NEW machine** where Python is not yet installed.

## 📌 Part 1: Install Prerequisites

### 1.1 Install Python 3.10+

1. Go to https://www.python.org/downloads/
2. Download **Python 3.10** or higher (3.11/3.12 recommended)
3. Run the installer
4. ⚠️ **IMPORTANT**: Check the box "Add Python to PATH" at the bottom
5. Click "Install Now"
6. Wait for installation to complete

**Verify Installation:**

```bash
# Open Command Prompt (Windows) or Terminal (Mac/Linux)
python --version
# Should show: Python 3.10.x or higher

pip --version
# Should show: pip 23.x or higher
```

### 1.2 Install Node.js and npm

1. Go to https://nodejs.org/
2. Download the **LTS version** (recommended)
3. Run the installer
4. Accept all defaults
5. Wait for installation to complete

**Verify Installation:**

```bash
node --version
# Should show: v18.x or v20.x

npm --version
# Should show: 9.x or 10.x
```

### 1.3 Install Git (if cloning from repository)

1. Go to https://git-scm.com/downloads
2. Download for your OS
3. Run installer with default settings

**Verify Installation:**

```bash
git --version
# Should show: git version 2.x.x
```

## 📌 Part 2: Get the Project

### Option A: Clone from Git Repository

```bash
git clone <your-repository-url>
cd LLM-RAG
```

### Option B: Copy from USB/Drive

1. Copy the entire `LLM-RAG` folder to your machine
2. Open terminal/command prompt
3. Navigate to the project:

```bash
cd path\to\LLM-RAG
```

## 📌 Part 3: Backend Setup

### 3.1 Open Terminal in Project Root

```bash
# You should be in the LLM-RAG directory
# You should see: backend/, frontend/, README.md, etc.
```

### 3.2 Install Python Dependencies

```bash
# This will take 2-5 minutes depending on internet speed
pip install -r requirements.txt
```

**What gets installed:**

- FastAPI (web framework)
- LangChain (RAG framework)
- FAISS-CPU (vector database)
- Sentence Transformers (for embeddings)
- SQLAlchemy (database)
- PyPDF2 (PDF processing)
- python-pptx (PowerPoint processing)
- And 15+ other dependencies

**If you see errors:**

```bash
# Try upgrading pip first
python -m pip install --upgrade pip

# Then try again
pip install -r requirements.txt
```

### 3.3 Configure Environment Variables

```bash
# Copy the example file
copy .env.example .env
# On Mac/Linux: cp .env.example .env
```

Now edit `.env` file (use Notepad or any text editor):

```env
# Database Configuration
DATABASE_URL=sqlite:///./smart_study.db

# Directory Configuration
UPLOADS_DIR=./uploads
VECTORSTORE_DIR=./vectorstore

# LLM API Configuration - Add ONE of these:
GROQ_API_KEY=
HUGGINGFACE_API_KEY=
```

### 3.4 Get FREE API Key (Choose ONE)

#### Option 1: Groq API (Recommended - Fastest)

1. Go to https://console.groq.com/
2. Click "Sign Up" (can use Google/GitHub)
3. After login, go to "API Keys"
4. Click "Create API Key"
5. Give it a name (e.g., "StudyAssistant")
6. Copy the key (starts with `gsk_...`)
7. Paste into `.env` file:
   ```
   GROQ_API_KEY=gsk_your_actual_key_here
   ```

#### Option 2: HuggingFace API (Alternative)

1. Go to https://huggingface.co/
2. Sign up for free account
3. Go to Settings → Access Tokens
4. Click "New Token"
5. Give it a name and select "Read" permissions
6. Copy the token (starts with `hf_...`)
7. Paste into `.env` file:
   ```
   HUGGINGFACE_API_KEY=hf_your_actual_token_here
   ```

**Note:** You only need ONE API key. Groq is recommended as it's faster.

## 📌 Part 4: Frontend Setup

### 4.1 Navigate to Frontend Directory

```bash
cd frontend
```

### 4.2 Install Node Dependencies

```bash
# This will take 2-3 minutes
npm install
```

**What gets installed:**

- React 19
- Vite (build tool)
- React DOM
- ESLint (code quality)
- And other development dependencies

**If you see warnings:**

- Warnings are OK, errors are not
- As long as it completes, you're good

### 4.3 Return to Project Root

```bash
cd ..
```

## 📌 Part 5: Run the Application

### 5.1 Start Backend (Terminal 1)

```bash
# From project root
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Expected Output:**

```
INFO:     Will watch for changes in these directories: [...]
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [67890]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

✅ **Backend is running!** Keep this terminal open.

### 5.2 Start Frontend (Terminal 2)

Open a **NEW terminal/command prompt** window:

```bash
# Navigate to project again
cd path\to\LLM-RAG
cd frontend
npm run dev
```

**Expected Output:**

```
VITE v5.x.x  ready in 532 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.x.x:5173/
➜  press h + enter to show help
```

✅ **Frontend is running!** Keep this terminal open too.

### 5.3 Open in Browser

1. Open your web browser
2. Go to: **http://localhost:5173**
3. You should see the Smart Study Assistant interface!

## 📌 Part 6: Test the Application

### 6.1 Test File Upload

1. Find a PDF or PPTX file (any study material)
2. In the sidebar, click "Choose file"
3. Select your file
4. Click "Upload"
5. Wait for "Success! Indexed X chunks" message

### 6.2 Test Chat

1. In the chat area, type: "What are the main topics?"
2. Press Enter or click Send
3. You should get a response based on your uploaded document

### 6.3 Try Different Questions

- "Summarize the key concepts"
- "Explain [specific topic]"
- "Create practice questions"
- "What is the definition of [term]?"

## 🎉 You're Done!

Your Smart Study Assistant is now fully functional.

## 📌 Part 7: Stopping the Application

When you're done:

1. In the **Backend terminal** (Terminal 1):
   - Press `CTRL + C`
   - Wait for it to shut down

2. In the **Frontend terminal** (Terminal 2):
   - Press `CTRL + C`
   - Confirm with `Y` if asked

## 📌 Part 8: Running Again Later

Next time you want to run the application:

1. Open **Terminal 1**:

```bash
cd path\to\LLM-RAG\backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

2. Open **Terminal 2**:

```bash
cd path\to\LLM-RAG\frontend
npm run dev
```

3. Open browser to http://localhost:5173

## 🔧 Common Issues & Solutions

### Issue: "python is not recognized"

**Solution:** Python is not in PATH. Reinstall Python and check "Add Python to PATH"

### Issue: "pip is not recognized"

**Solution:** Same as above, or try `python -m pip` instead of `pip`

### Issue: "node is not recognized"

**Solution:** Node.js is not in PATH. Reinstall Node.js or restart your terminal

### Issue: "Port 8000 is already in use"

**Solution:**

```bash
# Find and kill the process using port 8000
# Windows: netstat -ano | findstr :8000
# Then: taskkill /PID <process_id> /F
```

### Issue: "Module not found" errors

**Solution:**

```bash
# Reinstall Python dependencies
pip install -r requirements.txt --force-reinstall

# Or install specific package
pip install <package-name>
```

### Issue: Frontend shows "Cannot connect to backend"

**Solution:**

- Make sure backend is running (Terminal 1)
- Check backend console for errors
- Try accessing http://localhost:8000/docs directly

### Issue: "No indexed documents" in chat

**Solution:**

- Upload at least one PDF or PPTX file first
- Wait for "Success" message after upload
- Check backend console for indexing errors

### Issue: Chat shows context but no AI answer

**Solution:**

- Check that you added API key to `.env` file
- Verify the API key is correct
- Check backend console for API errors
- Try Groq if HuggingFace is slow/failing

## 📝 Quick Reference Commands

### Check installations:

```bash
python --version
pip --version
node --version
npm --version
```

### Install dependencies:

```bash
# Python
pip install -r requirements.txt

# Node
cd frontend
npm install
```

### Run application:

```bash
# Terminal 1 - Backend
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🎓 For Demonstration

Before your college presentation:

1. ✅ Test on the actual presentation machine
2. ✅ Have sample PDFs ready (2-3 files)
3. ✅ Pre-upload at least one document
4. ✅ Prepare 3-4 sample questions to ask
5. ✅ Have this setup guide printed/available
6. ✅ Keep API keys backed up
7. ✅ Take screenshots of working system

## 📞 Need More Help?

Check these resources:

- Main README.md in project root
- Backend code comments in `backend/main.py`
- Frontend code in `frontend/src/App.jsx`
- Python docs: https://docs.python.org/
- React docs: https://react.dev/
- FastAPI docs: https://fastapi.tiangolo.com/

---

**Happy Learning! 📚🤖**
