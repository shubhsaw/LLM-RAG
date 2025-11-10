import os
import uuid
import shutil
from typing import Optional
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from sqlalchemy import select

# Import from Backend package (case-sensitive)
from backend import db as _db
from backend import models as _models
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

@app.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
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

    return {"status": "success", "file_id": fm.id, "num_chunks": num_chunks}

@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, db: Session = Depends(get_db)):
    print(f"Received chat request: {req.message}, session_id: {req.session_id}")  # Add this
    
    session_id = req.session_id or str(uuid.uuid4())

    # Save user message
    user_msg = ChatMessage(session_id=session_id, role="user", content=req.message)
    db.add(user_msg)
    db.commit()

    try:  # Add try-catch
        retriever = get_retriever()
        if retriever is None:
            raise HTTPException(status_code=400, detail="No indexed documents found. Please upload files first.")

        # Instead of LLM, just return most relevant document chunk
        hits = retriever.get_relevant_documents(req.message)
        if hits:
            answer = hits[0].page_content
        else:
            answer = "Sorry, no relevant content found."

        # Save assistant response
        assistant_msg = ChatMessage(session_id=session_id, role="assistant", content=answer)
        db.add(assistant_msg)
        db.commit()

        return ChatResponse(session_id=session_id, answer=answer)
    
    except Exception as e:  # Add this
        print(f"Error in chat endpoint: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))