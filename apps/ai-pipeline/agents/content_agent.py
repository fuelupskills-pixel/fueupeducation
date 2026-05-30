import os
import json
from openai import OpenAI

class ContentAgent:
    """
    Autonomous AI Content Agent responsible for drafting course curriculums,
    lecture scripts, slide transitions, visual assets, and quiz questions.
    """
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if self.api_key:
            self.client = OpenAI(api_key=self.api_key)
        else:
            self.client = None

    def generate_lecture_script(self, topic: str, target_audience: str = "middle school") -> dict:
        """
        Drafts a fully fleshed script for a lecture video with slide descriptions,
        narrator voiceover transcript, and relevant visual directions.
        """
        if not self.client:
            return self._mock_script(topic, target_audience)

        prompt = f"""
        You are an elite educational content creator for FuelUp Education.
        Write a complete, structured video script for a lecture on: "{topic}"
        Targeting: {target_audience} students.

        Return a JSON object containing:
        - "title": Title of the lecture
        - "introduction": Short hook text
        - "slides": A list of slide objects. Each slide must contain:
           - "slide_number": Integer
           - "visual_prompt": Detailed description of what to draw or animate
           - "narration_text": The exact text the voiceover artist will say
        - "summary": Closing words
        - "suggested_quiz_questions": List of 3 multiple-choice questions. Each question must contain:
           - "question": Question text
           - "options": List of 4 answers
           - "correct_option_index": 0-indexed integer of the correct answer
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "You are a helpful educational AI scriptwriter that outputs clean JSON."},
                    {"role": "user", "content": prompt}
                ]
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            print(f"API generation failed: {e}. Falling back to standard template.")
            return self._mock_script(topic, target_audience)

    def _mock_script(self, topic: str, target_audience: str) -> dict:
        """
        Returns a beautifully detailed static fallback script for offline/development use.
        """
        if "solar system" in topic.lower() or "space" in topic.lower():
            title = "The Wondrous Solar System"
            slides = [
                {
                    "slide_number": 1,
                    "visual_prompt": "A glowing golden Sun in the center of a black space backdrop with swirling planetary orbits.",
                    "narration_text": "Welcome explorers! Today, we're taking a journey into the cosmos to explore our cosmic home: the Solar System. At the heart of it all lies the Sun, a giant star holding everything in its gravitational embrace."
                },
                {
                    "slide_number": 2,
                    "visual_prompt": "Close-up of Mercury and Venus, one grey and cratered, the other shrouded in thick yellow clouds.",
                    "narration_text": "Closest to the Sun are Mercury and Venus. Mercury is a rocky, cratered world with wild temperatures, while Venus is wrapped in a thick greenhouse blanket, making it the hottest planet in the system."
                },
                {
                    "slide_number": 3,
                    "visual_prompt": "A vibrant blue and white Earth next to the red, dusty plains of Mars.",
                    "narration_text": "Next, we find Earth, our watery oasis teeming with life, and Mars, the red planet where massive volcanoes and dry valleys hint at a wet planetary past."
                },
                {
                    "slide_number": 4,
                    "visual_prompt": "A massive swirling Gas Giant, Jupiter, displaying its signature Great Red Spot.",
                    "narration_text": "Beyond the rocky inner planets lies Jupiter, the king of planets. It is a massive ball of hydrogen and helium, featuring a giant storm called the Great Red Spot that has raged for centuries."
                }
            ]
            quiz = [
                {
                    "question": "Which planet is the hottest in our Solar System?",
                    "options": ["Mercury", "Venus", "Mars", "Jupiter"],
                    "correct_option_index": 1
                },
                {
                    "question": "What is the name of Jupiter's famous giant storm?",
                    "options": ["The Great Blue Eye", "The Golden Ring", "The Great Red Spot", "The Space Cyclone"],
                    "correct_option_index": 2
                }
            ]
        else:
            title = f"Learning about {topic}"
            slides = [
                {
                    "slide_number": 1,
                    "visual_prompt": f"Graphical title slide showing {topic} concept art.",
                    "narration_text": f"Hello, today we are going to learn all about {topic}. Let's dive in!"
                },
                {
                    "slide_number": 2,
                    "visual_prompt": f"Detailed diagram showing key mechanics of {topic}.",
                    "narration_text": f"Here, you can see how {topic} operates. Pay close attention to these key features."
                }
            ]
            quiz = [
                {
                    "question": f"What is the main theme of this lecture?",
                    "options": ["History", "Science", topic, "Arts"],
                    "correct_option_index": 2
                }
            ]

        return {
            "title": title,
            "introduction": f"An overview of {topic} tailored for {target_audience} students.",
            "slides": slides,
            "summary": "This concludes our introductory lesson. Keep exploring the stars!",
            "suggested_quiz_questions": quiz
        }

if __name__ == "__main__":
    agent = ContentAgent()
    script = agent.generate_lecture_script("Solar System")
    print(json.dumps(script, indent=2))
