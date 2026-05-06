# 🧪 Testing Guide for Smart Study Assistant

## Quick Test Checklist

Use this to verify everything works correctly.

## ✅ Pre-Test Setup

1. Backend running on http://localhost:8000
2. Frontend running on http://localhost:5173
3. At least one API key configured in `.env`

## 🧪 Test 1: Backend Health Check

**Method 1 - Browser:**

1. Open http://localhost:8000
2. Should see: `{"message": "Smart Study Assistant API is running", "status": "ok"}`

**Method 2 - API Docs:**

1. Open http://localhost:8000/docs
2. Should see interactive API documentation
3. Try the `/health` endpoint
4. Should show:
   ```json
   {
     "status": "healthy",
     "has_documents": false,
     "groq_configured": true,
     "hf_configured": false
   }
   ```

## 🧪 Test 2: Frontend Access

1. Open http://localhost:5173
2. Should see:
   - Header: "📚 Smart Study Assistant"
   - Sidebar with upload section
   - Chat area with welcome message
   - Clean, styled interface

## 🧪 Test 3: File Upload

**Test with Sample PDF:**

1. Create a simple test PDF or use an existing one
2. In sidebar, click "Choose file"
3. Select PDF or PPTX file
4. Click "Upload"
5. **Expected:** Green success message showing number of chunks
6. **Expected:** File appears in "Uploaded Documents" list

**Upload should work for:**

- ✅ `.pdf` files
- ✅ `.pptx` files
- ✅ `.ppt` files
- ❌ Other formats should show error

## 🧪 Test 4: Chat Without Documents

1. Before uploading any documents
2. Type: "What is the main topic?"
3. Press Enter
4. **Expected:** Error message "No indexed documents found"

## 🧪 Test 5: Chat With Documents

After uploading at least one document:

**Test Query 1 - General:**

- Input: "Summarize the main topics"
- **Expected:** Summary based on uploaded document
- **Expected:** Response time: 2-5 seconds

**Test Query 2 - Specific:**

- Input: "What is [specific term from your document]?"
- **Expected:** Definition or explanation from document

**Test Query 3 - Unrelated:**

- Input: "What is quantum physics?" (if not in your document)
- **Expected:** Message indicating information not found in documents

**Test Query 4 - Follow-up:**

- Ask first question
- Then ask related follow-up question
- **Expected:** Maintains conversation context

## 🧪 Test 6: Suggestion Chips

1. Click on "📝 Summarize" chip
2. **Expected:** Text appears in input box
3. Click Send
4. **Expected:** Gets response based on suggestion

## 🧪 Test 7: Clear Chat

1. After some conversation
2. Click "🗑️ Clear" button
3. **Expected:** All messages except welcome message disappear
4. **Expected:** Session resets

## 🧪 Test 8: Multiple Documents

1. Upload Document 1 (e.g., about Python)
2. Upload Document 2 (e.g., about JavaScript)
3. Ask: "Explain Python"
4. **Expected:** Answer from Document 1
5. Ask: "Explain JavaScript"
6. **Expected:** Answer from Document 2
7. Ask: "Compare Python and JavaScript"
8. **Expected:** Answer using info from both documents

## 🧪 Test 9: Session Persistence

1. Ask a question and get response
2. Check browser console for session_id
3. Ask another question
4. **Expected:** Same session_id used
5. **Expected:** Can refer back to previous context

## 🧪 Test 10: Error Handling

**Test Backend Down:**

1. Stop backend server
2. Try to upload file
3. **Expected:** Network error message
4. **Expected:** Application doesn't crash

**Test Invalid File:**

1. Try uploading .txt or .jpg file
2. **Expected:** Error message about unsupported format

**Test Network Issues:**

1. Disconnect internet (if using external API)
2. Ask question
3. **Expected:** Appropriate error message

## 🧪 Test 11: UI Responsiveness

**Desktop (1920x1080):**

- Two-column layout visible
- Sidebar on left
- Chat on right

**Tablet (768px):**

- Stacked layout
- Chat appears before sidebar

**Mobile (375px):**

- Everything stacked
- Touch-friendly buttons
- Readable text

## 🧪 Test 12: Performance

**Small Document (<10 pages):**

- Upload time: < 10 seconds
- Query response: < 3 seconds

**Medium Document (50 pages):**

- Upload time: < 30 seconds
- Query response: < 5 seconds

**Large Document (100+ pages):**

- Upload time: < 60 seconds
- Query response: < 5 seconds

## 🧪 Test 13: API Key Validation

**Without API Key:**

1. Remove API key from `.env`
2. Restart backend
3. Upload document (should work)
4. Ask question
5. **Expected:** Falls back to showing context without LLM answer
6. **Expected:** Message about configuring API key

**With Invalid API Key:**

1. Set `GROQ_API_KEY=invalid_key_123`
2. Restart backend
3. Ask question
4. **Expected:** Error handled gracefully
5. **Expected:** Fallback response

## 🧪 Test 14: Database Persistence

1. Upload a document
2. Ask some questions
3. Stop backend (CTRL+C)
4. Start backend again
5. **Expected:** Uploaded documents still listed
6. **Expected:** Can query existing documents
7. **Expected:** Chat history may be lost (new session)

## 🧪 Test 15: Browser Compatibility

Test on these browsers:

- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari (Mac)

All should work identically.

## 🐛 Common Issues & Solutions

### Issue: Upload succeeds but chat says "No documents"

**Check:**

- Look for `vectorstore/faiss_index/` directory
- Check backend console for indexing errors
- Try restarting backend

### Issue: Very slow responses

**Check:**

- Which API you're using (Groq is faster)
- Internet connection speed
- Backend console for timeout errors

### Issue: Incorrect answers

**Check:**

- Quality of uploaded document
- Is document text-based or scanned image?
- Try more specific questions

### Issue: Frontend won't connect to backend

**Check:**

- Is backend actually running?
- Port 8000 not blocked by firewall
- CORS headers configured (already done in code)

## 📊 Test Results Template

```
Test Date: _____________
Tested By: _____________

Backend Health: [PASS/FAIL]
Frontend Access: [PASS/FAIL]
File Upload: [PASS/FAIL]
Chat Functionality: [PASS/FAIL]
UI Responsiveness: [PASS/FAIL]
Error Handling: [PASS/FAIL]
Performance: [PASS/FAIL]

Notes:
_______________________________
_______________________________
_______________________________
```

## 🎯 Pre-Demo Test Sequence

Run this 30 minutes before demonstration:

1. ✅ Start both servers
2. ✅ Test health endpoint
3. ✅ Upload 2-3 test documents
4. ✅ Test 4-5 sample questions
5. ✅ Test all suggestion chips
6. ✅ Test clear chat
7. ✅ Check UI on presentation laptop
8. ✅ Have backup screenshots ready

## 📝 Sample Test Document

Create a simple `test.txt` file with this content and convert to PDF:

```
Introduction to Machine Learning

Machine Learning is a subset of Artificial Intelligence that enables
computers to learn from data without being explicitly programmed.

Key Concepts:
1. Supervised Learning - Learning from labeled data
2. Unsupervised Learning - Finding patterns in unlabeled data
3. Neural Networks - Computing systems inspired by biological brains

Applications:
- Image Recognition
- Natural Language Processing
- Recommendation Systems
- Autonomous Vehicles

Important Terms:
- Training Data: Data used to train the model
- Features: Input variables used for prediction
- Model: The learned representation of patterns
```

**Sample Questions for This Document:**

- "What is Machine Learning?"
- "Explain supervised learning"
- "List the applications of machine learning"
- "What are the key concepts covered?"

---

**All tests passing? You're ready for demonstration! 🚀**
