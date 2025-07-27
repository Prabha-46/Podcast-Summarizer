from fastapi import APIRouter, Query, HTTPException, Path
import httpx
import os
from dotenv import load_dotenv

router = APIRouter()

load_dotenv()
LISTEN_NOTES_API_KEY = os.getenv("LISTEN_NOTES_API_KEY")
LISTEN_NOTES_SEARCH_URL = "https://listen-api.listennotes.com/api/v2/search"
LISTEN_NOTES_PODCAST_EPISODES_URL = "https://listen-api.listennotes.com/api/v2/podcasts"
PAGE_SIZE = 10

@router.get("/search")
async def search_podcasts(
q: str = Query(..., description="Search term"),
page: int = Query(0, ge=0, description="Page number (0-based)")
):
    print("Calling Search API")
    headers = {"X-ListenAPI-Key": LISTEN_NOTES_API_KEY}
    offset = page * PAGE_SIZE
    params = {
        "q": q,
        "type": "podcast",
        "offset": offset,
        "len_min": 0,
        "len_max": 100,
        "only_in": "title,description",
        "language": "English",
        "safe_mode": 0,
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(LISTEN_NOTES_SEARCH_URL, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            print("Search API Response", data)
            results = [
                {
                    "id": item["id"],
                    "title": item["title_original"],
                    "description": item["description_original"],
                    "image": item.get("image", ""),
                    "publisher": item.get("publisher_original", "")
                }
                for item in data.get("results", [])
            ]

            return {
                "results": results,
                "total": data.get("total", 0),
                "page": page,
                "has_next": (page + 1) * PAGE_SIZE < data.get("total", 0)
            }

        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=str(e))

@router.get("/episodes/{podcast_id}")
async def get_podcast_episodes(
podcast_id: str = Path(..., description="Podcast ID from Listen Notes")
):
    print("Calling Episodes API")
    headers = {"X-ListenAPI-Key": LISTEN_NOTES_API_KEY}
    params = {
    "sort": "recent_first",
    "next_episode_pub_date": 0
    }
    async with httpx.AsyncClient() as client:
        try:
            url = f"{LISTEN_NOTES_PODCAST_EPISODES_URL}/{podcast_id}"
            response = await client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()

            episodes = [
                {
                    "id": ep["id"],
                    "title": ep["title"],
                    "description": ep.get("description", ""),
                    "audio": ep.get("audio", ""),
                    "pub_date": ep.get("pub_date_ms", 0),
                    "thumbnail": ep.get("thumbnail", "")
                }
                for ep in data.get("episodes", [])[:PAGE_SIZE]
            ]

            return {
                "podcast": {
                    "id": data.get("id"),
                    "title": data.get("title"),
                    "publisher": data.get("publisher"),
                    "image": data.get("image"),
                    "description": data.get("description"),
                },
                "episodes": episodes
            }

        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=str(e))
