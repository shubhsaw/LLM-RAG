# ⚡ Quick Start - Smart Study Assistant

## For Running on Another Machine (Where You Have Python)

### 🎯 Overview

This is a **5-minute quick start** if you already have Python and Node.js installed.

---

## ✅ Prerequisites Check

```bash
python --version    # Should be 3.10+
node --version      # Should be 18+
npm --version       # Should be 9+
```

**Don't have these?** → See [SETUP_GUIDE.md](SETUP_GUIDE.md) for installation instructions.

---

## 🚀 Quick Setup (5 Steps)

### 1️⃣ Install Backend Dependencies

```bash
pip install -r requirements.txt
```

⏱️ Takes 2-3 minutes

### 2️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
cd ..
```

⏱️ Takes 2-3 minutes

### 3️⃣ Configure API Key

Edit `.env` file and add **ONE** free API key:

**Option A - Groq (Recommended):**

- Get key: https://console.groq.com/keys
- Add to `.env`: `GROQ_API_KEY=gsk_your_key_here`

**Option B - HuggingFace:**

- Get token: https://huggingface.co/settings/tokens
- Add to `.env`: `HUGGINGFACE_API_KEY=hf_your_token_here`

### 4️⃣ Start Backend (Terminal 1)

```bash
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 5️⃣ Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

### 6️⃣ Open Browser

Navigate to: **http://localhost:5173**

---

## 🎮 Using the Application

1. **Upload a PDF/PPTX** in the sidebar
2. **Wait for "Success"** message
3. **Ask questions** in the chat
4. **Get AI-powered answers!**

---

## 🪟 Windows Users - Use the Launcher!

Double-click: **`start.bat`**

This will:

- ✅ Check prerequisites
- ✅ Install dependencies (if needed)
- ✅ Start both servers
- ✅ Open browser automatically

---

## 🛑 Stopping the Application

- Press `CTRL + C` in both terminal windows
- Or close the terminal windows

---

## ❓ Having Issues?

**Backend won't start:**

```bash
pip install -r requirements.txt --upgrade
```

**Frontend won't start:**

```bash
cd frontend
rm -rf node_modules
npm install
```

**"No indexed documents" error:**

- Upload at least one PDF/PPTX file first

**Chat not working:**

- Check that API key is in `.env` file
- Check backend terminal for errors

---

## 📚 More Help

- **Detailed Setup:** [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Full Documentation:** [README.md](README.md)
- **Demo Guide:** [DEMO_GUIDE.md](DEMO_GUIDE.md)
- **Testing:** [TESTING_GUIDE.md](TESTING_GUIDE.md)

---

## 🎯 For Demonstration

1. ✅ Run this setup 1 hour before presentation
2. ✅ Upload 2-3 sample PDFs
3. ✅ Test with sample questions
4. ✅ Keep both terminals visible
5. ✅ Have backup screenshots ready

---

**Ready to go! 🚀**
