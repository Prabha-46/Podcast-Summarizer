import os
import tempfile
import requests
from faster_whisper import WhisperModel
from gtts import gTTS
import google.generativeai as genai
from dotenv import load_dotenv

from app.services.ai_summarizer_gemini import convert_summary_to_audio_gemini

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")
wisperModal = WhisperModel("base", compute_type="int8")

def download_audio_from_url(audio_url: str) -> str:
    response = requests.get(audio_url)
    if response.status_code != 200:
        raise Exception("Failed to download audio file")
    fd, path = tempfile.mkstemp(suffix=".mp3")
    with open(path, "wb") as f:
        f.write(response.content)
    return path

def transcribe_audio(audio_path: str) -> str:
    segments, _ = wisperModal.transcribe(audio_path)
    transcript = " ".join([segment.text for segment in segments])
    return transcript

def summarize_text_for_gemini(transcript: str) -> str:
    prompt = f"""
    You are a podcast summarizer.

    Your task is to condense the following transcript into a ~3-minute spoken-style summary suitable for audio playback. The summary should capture only the **core ideas and insights** shared in the episode. Ignore filler content like introductions, outros, ads, or off-topic banter.

    Output the summary as a **natural, engaging conversation** between two speakers. Use clear transitions, varied tone, and conversational flow to keep it engaging and human-like.

    Format your output exactly like the example below:

    -- Example --
    Speaker 1: Welcome! Today we’re unpacking how artificial intelligence is reshaping our lives.

    Speaker 2: From smart assistants to healthcare and education, AI is making waves everywhere.

    Speaker 1: One big takeaway was how personalized learning is being powered by AI.

    Speaker 2: And don’t miss the tools mentioned at the end — they’re a great starting point for beginners.

    Speaker 1: Let’s jump in!
    -- End of Example --

    -- Transcript --
    {transcript}
    -- End of Transcript --

    ### Important:
    - Do **not** add any explanation or intro about the summary itself.
    - Only return the conversation-format summary.
    """
    response = model.generate_content(prompt)
    return response.text

def summarize_text(transcript: str) -> str:
    prompt = f"""You are a podcast summarizer. Summarize the following podcast into a ~3 minute version in a natural, spoken tone suitable for listening:

    {transcript}

    Only include the summary. Do not mention that this is a summary or give any disclaimers.
    """
    response = model.generate_content(prompt)
    return response.text
def convert_summary_to_audio(summary: str) -> str:
    tts = gTTS(summary)
    output_path = tempfile.mktemp(suffix=".mp3")
    tts.save(output_path)
    return output_path

def summarize_podcast_from_url(audio_url: str) -> str:
    audio_path = download_audio_from_url(audio_url)
    print("Audio Downloaded")
    transcript = transcribe_audio(audio_path)
    print("Transcript Generated")
    # summary_text = summarize_text(transcript)
    summary_text = summarize_text_for_gemini(transcript)
    print("Summary Generated::")
    print(summary_text)
    summary_audio_path = convert_summary_to_audio_gemini(summary_text)
    print("Summary Audio Generated")
    return summary_audio_path