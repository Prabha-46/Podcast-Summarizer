from app.services import ai_summarizer
from app.services.s3 import generate_presigned_url, upload_file
from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.db.models import SummarizedEpisode
from app.db.deps import get_db

router = APIRouter()

@router.post("/summary-path/{episode_id}")
def get_summary_path(episode_id: str, body: dict = Body(...), db: Session = Depends(get_db)):
    episode = db.query(SummarizedEpisode).filter(SummarizedEpisode.episode_id == episode_id).first()
    if not episode:
        audio_url = body.get("audio_url")
        saved_path = ai_summarizer.summarize_podcast_from_url(audio_url)
        s3_path = f"{episode_id}.mp3"
        upload_file(saved_path, s3_path)
        new_episode = SummarizedEpisode(episode_id=episode_id, s3_path=s3_path)
        db.add(new_episode)
        db.commit()
        episode = new_episode
    presigned_url = generate_presigned_url(episode.s3_path , 3600 * 12)
    return {
        "episode_id": episode.episode_id,
        "presigned_url": presigned_url
    }

