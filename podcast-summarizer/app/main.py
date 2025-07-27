from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search
from app.db.database import Base, engine
from app.routers import summary

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Podcast Summarizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],           # Allow all origins
    allow_credentials=True,        # Allow cookies/auth headers
    allow_methods=["*"],           # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],           # Allow all headers
)
app.include_router(search.router) 
app.include_router(summary.router)

@app.get("/")
def read_root():
    return {"message": "Moneshwar Changed This"}