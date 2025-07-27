from sqlalchemy import Column, String, Integer
from .database import Base

class SummarizedEpisode(Base):
    __tablename__ = "summarized_episodes"
    id = Column(Integer, primary_key=True, index=True)
    episode_id = Column(String(255), unique=True, nullable=False)
    s3_path = Column(String(512), nullable=False)