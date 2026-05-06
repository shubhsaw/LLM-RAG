import os
import uuid
import shutil
from typing import Optional, List
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
import requests

# Import from Backend package
from backend.utils import UPLOADS_DIR, index_file, get_retriever
from backend.db import SessionLocal, init_db
from backend.models import ChatMessage, FileMeta

load_dotenv()
init_db()

app = FastAPI(title="Smart Study Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get LLM API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY", "")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    answer: str

class FileInfo(BaseModel):
    id: int
    filename: str
    uploaded_at: str
    num_chunks: int

def call_llm_with_context(question: str, context: str) -> str:
    """Call LLM API with retrieved context"""
    
    prompt = f"""You are a helpful academic study assistant. Answer the student's question based ONLY on the provided context from their study material.

Context from study material:
{context}

Student's Question: {question}

Instructions:
- Answer based only on the context provided above
- If the context doesn't contain relevant information, say "I don't have enough information in the uploaded documents to answer this question."
- Be clear, concise, and educational
- Use bullet points or formatting to make answers easy to read

Answer:"""

    # Try Groq first (fastest free API)
    if GROQ_API_KEY:
        try:
            response = requests.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {GROQ_API_KEY}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "llama-3.1-8b-instant",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.7,
                    "max_tokens": 1024
                },
                timeout=30
            )
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Groq API error: {e}")
    
    # Try Hugging Face as fallback
    if HF_API_KEY:
        try:
            response = requests.post(
                "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
                headers={"Authorization": f"Bearer {HF_API_KEY}"},
                json={
                    "inputs": prompt,
                    "parameters": {"max_new_tokens": 512, "temperature": 0.7}
                },
                timeout=30
            )
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and len(result) > 0:
                    return result[0].get("generated_text", "").replace(prompt, "").strip()
        except Exception as e:
            print(f"HuggingFace API error: {e}")
    
    # Fallback response if no API is configured
    return f"""I can see your question: "{question}"

Based on the study material context provided:
{context[:500]}...

⚠️ Note: To get AI-powered answers, please configure either:
1. GROQ_API_KEY (recommended - fast & free at console.groq.com)
2. HUGGINGFACE_API_KEY (free at huggingface.co/settings/tokens)

Add your API key to the .env file and restart the server.

For now, I'm showing you the relevant context from your documents above."""

@app.get("/")
async def root():
    return {"message": "Smart Study Assistant API is running", "status": "ok"}

@app.post("/upload", response_model=FileInfo)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and index a document (PDF or PPTX)"""
    filename = file.filename
    uid = str(uuid.uuid4())
    saved_name = f"{uid}_{filename}"
    dest_path = os.path.join(UPLOADS_DIR, saved_name)

    with open(dest_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    try:
        num_chunks = index_file(dest_path, filename)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Indexing failed: {str(e)}")

    fm = FileMeta(filename=filename, num_chunks=num_chunks, file_metadata=saved_name)
    db.add(fm)
    db.commit()
    db.refresh(fm)

    return FileInfo(
        id=fm.id,
        filename=fm.filename,
        uploaded_at=str(fm.uploaded_at),
        num_chunks=fm.num_chunks
    )

@app.get("/files", response_model=List[FileInfo])
async def list_files(db: Session = Depends(get_db)):
    """List all uploaded files"""
    files = db.query(FileMeta).order_by(desc(FileMeta.uploaded_at)).all()
    return [
        FileInfo(
            id=f.id,
            filename=f.filename,
            uploaded_at=str(f.uploaded_at),
            num_chunks=f.num_chunks
        )
        for f in files
    ]

@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest, db: Session = Depends(get_db)):
    """Chat with the study assistant using RAG"""
    print(f"📩 Received question: {req.message}")
    
    session_id = req.session_id or str(uuid.uuid4())

    # Save user message
    user_msg = ChatMessage(session_id=session_id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    try:
        retriever = get_retriever(k=3)
        if retriever is None:
            raise HTTPException(
                status_code=400,
                detail="No indexed documents found. Please upload PDF or PPTX files first."
            )

        # Retrieve relevant context
        docs = retriever.get_relevant_documents(req.message)
        
        if not docs:
            answer = "I couldn't find relevant information in the uploaded documents. Try uploading more study material or rephrasing your question."
        else:
            # Combine context from top documents
            context = "\n\n".join([f"[Document {i+1}]:\n{doc.page_content}" for i, doc in enumerate(docs)])
            print(f"📚 Retrieved {len(docs)} relevant chunks")
            
            # Call LLM with context
            answer = call_llm_with_context(req.message, context)

        # Save assistant response
        assistant_msg = ChatMessage(session_id=session_id, role="assistant", content=answer)
        db.add(assistant_msg)
        db.commit()

        print(f"✅ Generated answer (length: {len(answer)} chars)")
        return ChatResponse(session_id=session_id, answer=answer)
    
    except Exception as e:
        print(f"❌ Error in chat endpoint: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        
        # Still save error message
        error_answer = f"Sorry, I encountered an error: {str(e)}"
        assistant_msg = ChatMessage(session_id=session_id, role="assistant", content=error_answer)
        db.add(assistant_msg)
        db.commit()
        
        return ChatResponse(session_id=session_id, answer=error_answer)

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    retriever = get_retriever()
    has_documents = retriever is not None
    
    return {
        "status": "healthy",
        "has_documents": has_documents,
        "groq_configured": bool(GROQ_API_KEY),
        "hf_configured": bool(HF_API_KEY)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)