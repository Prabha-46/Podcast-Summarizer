import os
import tempfile
import mimetypes
from google import genai
from google.genai import types
import wave
import tempfile

def save_pcm_as_wav(audio_data: bytes, sample_rate: int = 24000) -> str:
    file_path = tempfile.mktemp(suffix=".wav")
    with wave.open(file_path, 'wb') as wf:
        wf.setnchannels(1)            # Mono
        wf.setsampwidth(2)            # 16-bit PCM = 2 bytes
        wf.setframerate(sample_rate)
        wf.writeframes(audio_data)
    return file_path

def convert_summary_to_audio_gemini(summary: str) -> str:
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )
    model = "gemini-2.5-flash-preview-tts"
    
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=summary),
            ],
        ),
    ]
    
    generate_content_config = types.GenerateContentConfig(
        temperature=1,
        response_modalities=[
            "audio",
        ],
        speech_config=types.SpeechConfig(
            multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
                speaker_voice_configs=[
                    types.SpeakerVoiceConfig(
                        speaker="Speaker 1",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Zephyr"
                            )
                        ),
                    ),
                    types.SpeakerVoiceConfig(
                        speaker="Speaker 2",
                        voice_config=types.VoiceConfig(
                            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                                voice_name="Puck"
                            )
                        ),
                    ),
                ]
            ),
        ),
    )

    response = client.models.generate_content(
        model=model,
        contents=contents,
        config=generate_content_config,
    )
    part = response.candidates[0].content.parts[0]
    print(part)
    if hasattr(part, "inline_data") and hasattr(part.inline_data, "data"):
        audio_data = part.inline_data.data
        return save_pcm_as_wav(audio_data)
    else:
        raise ValueError("No audio data returned from Gemini.")