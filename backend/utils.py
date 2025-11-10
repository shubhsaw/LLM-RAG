import os
import uuid
from langchain.document_loaders import PyPDFLoader, UnstructuredPowerPointLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from langchain.docstore.document import Document
from dotenv import load_dotenv

load_dotenv()

VECTORSTORE_DIR = os.getenv("VECTORSTORE_DIR", "./vectorstore")
UPLOADS_DIR = os.getenv("UPLOADS_DIR", "./uploads")
os.makedirs(VECTORSTORE_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# USE LOCAL EMBEDDINGS (free demo, no OpenAI needed)
EMBEDDINGS = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

def load_document(file_path: str):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        loader = PyPDFLoader(file_path)
    elif ext in [".pptx", ".ppt"]:
        loader = UnstructuredPowerPointLoader(file_path)
    else:
        raise ValueError("Unsupported file type: " + ext)
    docs = loader.load()
    return docs

def chunk_documents(docs, chunk_size=1000, chunk_overlap=200):
    splitter = CharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    splitted = []
    for d in docs:
        parts = splitter.split_text(d.page_content)
        for p in parts:
            splitted.append(Document(page_content=p, metadata=d.metadata or {}))
    return splitted

def get_vectorstore_path(name="faiss_index"):
    return os.path.join(VECTORSTORE_DIR, name)

def index_file(file_path: str, filename: str):
    # Load and chunk
    docs = load_document(file_path)
    splitted = chunk_documents(docs)

    # Create / update FAISS vectorstore
    vs_path = get_vectorstore_path()
    if os.path.exists(vs_path):
        db = FAISS.load_local(vs_path, EMBEDDINGS, allow_dangerous_deserialization=True)
        db.add_documents(splitted)
    else:
        db = FAISS.from_documents(splitted, EMBEDDINGS)
        db.save_local(vs_path)
    db.save_local(vs_path)
    return len(splitted)

def get_retriever(k=4):
    vs_path = get_vectorstore_path()
    if not os.path.exists(vs_path):
        return None
    db = FAISS.load_local(vs_path, EMBEDDINGS, allow_dangerous_deserialization=True)  # ✅ Add this
    return db.as_retriever(search_kwargs={"k": k})