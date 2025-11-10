from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from backend.db import Base

class FileMeta(Base):
    __tablename__ = "files"
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, nullable=False)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    num_chunks = Column(Integer, default=0)
    file_metadata = Column(Text, default="")  # NOT 'metadata'!

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, nullable=False)
    role = Column(String, nullable=False)  # "user" or "assistant"
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())