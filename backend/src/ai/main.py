# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# from typing import List, Optional
# import google.generativeai as genai
# from openai import OpenAI
# import os
# from dotenv import load_dotenv
# from deepseek import DeepseekAI  # יש ליצור מחלקה זו

# load_dotenv()

# app = FastAPI()

# # הגדרת המודלים
# class VideoInput(BaseModel):
#     video_text: str
#     ai_model: str  # 'openai', 'gemini', או 'deepseek'

# class KeyTakeaway(BaseModel):
#     text: str

# class VideoAnalysis(BaseModel):
#     key_takeaways: List[KeyTakeaway]

# # הגדרת ה-prompts
# ANALYSIS_PROMPT = """
# אנא נתח את הטקסט הבא מסרטון יוטיוב וחלץ את 10 הרעיונות המרכזיים ביותר.
# כל רעיון צריך:
# 1. להיות בין 8 ל-35 מילים
# 2. להשתמש בשפה המקורית של היוטיובר
# 3. להיות רעיון שלם ומובן
# 4. להיות מדויק לתוכן המקורי

# הטקסט:
# {text}

# אנא החזר רק את 10 הרעיונות, כל אחד בשורה נפרדת.
# """

# class AIAnalyzer:
#     def __init__(self):
#         # אתחול המודלים
#         self.openai_client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
#         genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
#         self.gemini = genai.GenerativeModel('gemini-pro')
#         self.deepseek = DeepseekAI(api_key=os.getenv('DEEPSEEK_API_KEY'))

#     async def analyze_with_openai(self, text: str) -> List[str]:
#         response = await self.openai_client.chat.completions.create(
#             model="gpt-4",
#             messages=[
#                 {"role": "system", "content": "אתה מומחה בניתוח תוכן וידאו וחילוץ רעיונות מרכזיים."},
#                 {"role": "user", "content": ANALYSIS_PROMPT.format(text=text)}
#             ]
#         )
#         takeaways = response.choices[0].message.content.strip().split('\n')
#         return [t.strip() for t in takeaways if t.strip()]

#     async def analyze_with_gemini(self, text: str) -> List[str]:
#         response = await self.gemini.generate_content(ANALYSIS_PROMPT.format(text=text))
#         takeaways = response.text.strip().split('\n')
#         return [t.strip() for t in takeaways if t.strip()]

#     async def analyze_with_deepseek(self, text: str) -> List[str]:
#         response = await self.deepseek.analyze(ANALYSIS_PROMPT.format(text=text))
#         takeaways = response.strip().split('\n')
#         return [t.strip() for t in takeaways if t.strip()]

# analyzer = AIAnalyzer()

# @app.post("/analyze", response_model=VideoAnalysis)
# async def analyze_video(input_data: VideoInput):
#     try:
#         if input_data.ai_model == "openai":
#             takeaways = await analyzer.analyze_with_openai(input_data.video_text)
#         elif input_data.ai_model == "gemini":
#             takeaways = await analyzer.analyze_with_gemini(input_data.video_text)
#         elif input_data.ai_model == "deepseek":
#             takeaways = await analyzer.analyze_with_deepseek(input_data.video_text)
#         else:
#             raise HTTPException(status_code=400, detail="AI model not supported")

#         return VideoAnalysis(
#             key_takeaways=[KeyTakeaway(text=t) for t in takeaways[:10]]
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))