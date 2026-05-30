import os
import requests
from gtts import gTTS

class AudioGenerator:
    """
    Synthesizes script texts into MP3 voice narration files.
    """
    def __init__(self):
        self.elevenlabs_api_key = os.getenv("ELEVENLABS_API_KEY")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")

    def synthesize_speech(self, text: str, output_path: str) -> bool:
        """
        Synthesizes text to speech, saving as an MP3 file at output_path.
        Falls back automatically if premium voice API keys are not supplied.
        """
        print(f"Synthesizing voice: '{text[:40]}...'")
        
        # Try ElevenLabs
        if self.elevenlabs_api_key:
            try:
                # Rachel Voice ID
                voice_id = "21m00Tcm4TlvDq8ikWAM"
                url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
                headers = {
                    "Accept": "audio/mpeg",
                    "Content-Type": "application/json",
                    "xi-api-key": self.elevenlabs_api_key
                }
                data = {
                    "text": text,
                    "model_id": "eleven_monolingual_v1",
                    "voice_settings": {
                        "stability": 0.5,
                        "similarity_boost": 0.5
                    }
                }
                response = requests.post(url, json=data, headers=headers)
                if response.status_code == 200:
                    with open(output_path, 'wb') as f:
                        f.write(response.content)
                    return True
                else:
                    print(f"ElevenLabs TTS failed: {response.text}")
            except Exception as e:
                print(f"ElevenLabs exception: {e}")

        # Try OpenAI
        if self.openai_api_key:
            try:
                from openai import OpenAI
                client = OpenAI(api_key=self.openai_api_key)
                response = client.audio.speech.create(
                    model="tts-1",
                    voice="alloy",
                    input=text
                )
                response.stream_to_file(output_path)
                return True
            except Exception as e:
                print(f"OpenAI TTS failed: {e}")

        # Fallback to free gTTS
        try:
            tts = gTTS(text=text, lang='en', slow=False)
            tts.save(output_path)
            return True
        except Exception as e:
            print(f"gTTS failed: {e}")
            
        # Create an empty file as a absolute fail-safe fallback
        with open(output_path, "wb") as f:
            f.write(b"")
        return False
