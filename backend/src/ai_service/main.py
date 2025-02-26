# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import openai
# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# import requests

# load_dotenv()

# app = FastAPI()

# # קונפיגורציה של ה-API keys
# openai.api_key = os.getenv("OPENAI_API_KEY")
# # genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# # DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# class TextRequest(BaseModel):
#     text: str
#     model: str

# #     @app.post("/analyze")
# #     async def analyze_text(request: TextRequest):
# #         try:
# #             if request.model == "openai":
# #                 response = openai.ChatCompletion.create(
# #                     model="gpt-4",
# #                     messages=[{
# #                         "role": "system",
# #                         "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
# #                     }, {
# #                         "role": "user",
# #                         "content": request.text
# #                     }]
# #                 )
# #                 ideas = response.choices[0].message.content.split("\n")

# #             elif request.model == "gemini":
# #                 model = genai.GenerativeModel('gemini-pro')
# #                 response = model.generate_content(
# #                     f"Extract 10 main ideas from the following text:\n\n{request.text}"
# #                 )
# #                 ideas = response.text.split("\n")

# #             elif request.model == "deepseek":
# #                 response = deepseek_api.complete(
# #                     f"Extract 10 main ideas from the following text:\n\n{request.text}"
# #                 )
# #                 ideas = response.split("\n")

# #             else:
# #                 raise HTTPException(status_code=400, detail="Invalid model selection")

# #             # ניקוי ועיבוד התוצאות
# #             ideas = [idea.strip().lstrip("0123456789. ") for idea in ideas if idea.strip()][:10]
            
# #             return {"ideas": ideas}

# #         except Exception as e:
# #             raise HTTPException(status_code=500, detail=str(e))

# # if __name__ == "__main__":
# #     import uvicorn
# #     uvicorn.run(app, host="0.0.0.0", port=5000) 
    
    




# # def analyze_with_deepseek(text: str) -> list:
# #     headers = {
# #         "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
# #         "Content-Type": "application/json"
# #     }
    
# #     data = {
# #         "model": "deepseek-chat",
# #         "messages": [
# #             {
# #                 "role": "system",
# #                 "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
# #             },
# #             {
# #                 "role": "user",
# #                 "content": text
# #             }
# #         ]
# #     }
    
# #     response = requests.post(
# #         "https://api.deepseek.com/v1/chat/completions",
# #         json=data,
# #         headers=headers
# #     )
    
# #     if response.status_code != 200:
# #         raise Exception(f"DeepSeek API error: {response.text}")
        
# #     result = response.json()
# #     ideas = result['choices'][0]['message']['content'].split("\n")
# #     return ideas

# @app.post("/analyze")
# async def analyze_text(request: TextRequest):
#     # try:
#     #     if request.model == "openai":
#     #         response = openai.ChatCompletion.create(
#     #             model="gpt-4",
#     #             messages=[{
#     #                 "role": "system",
#     #                 "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
#     #             }, {
#     #                 "role": "user",
#     #                 "content": request.text
#     #             }]
#     #         )
#     #         ideas = response.choices[0].message.content.split("\n")

#     #     elif request.model == "gemini":
#     #         model = genai.GenerativeModel('gemini-pro')
#     #         response = model.generate_content(
#     #             f"Extract 10 main ideas from the following text:\n\n{request.text}"
#     #         )
#     #         ideas = response.text.split("\n")

#     #     elif request.model == "deepseek":
#     #         ideas = analyze_with_deepseek(request.text)

#         # else:
#         #     raise HTTPException(status_code=400, detail="Invalid model selection")

#         # ניקוי ועיבוד התוצאות
#         # ideas = [idea.strip().lstrip("0123456789. ") for idea in ideas if idea.strip()][:10]
        
#         return {"ideas": 'djfgn'}

#     # except Exception as e:
#     #     raise HTTPException(status_code=500, detail=str(e))

# if __name__ == "__main__":
#     import uvicorn
#     uvicorn.run(app, host="0.0.0.0", port=5000)
    
    
    
    
    
    
    
    
    
    
# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import openai
# import google.generativeai as genai
# import requests
# import os
# from dotenv import load_dotenv
# from googleapiclient.discovery import build

# load_dotenv()

# app = FastAPI()

# # קונפיגורציה של ה-API keys
# openai.api_key = os.getenv("OPENAI_API_KEY")
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
# DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
# YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")
# youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

# class TextRequest(BaseModel):
#     text: str
#     model: str

# class VideoRequest(BaseModel):
#     video_url: str
#     model: str

# def analyze_with_deepseek(text: str) -> list:
#     headers = {
#         "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
#         "Content-Type": "application/json"
#     }
    
#     data = {
#         "model": "deepseek-chat",
#         "messages": [
#             {
#                 "role": "system",
#                 "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
#             },
#             {
#                 "role": "user",
#                 "content": text
#             }
#         ]
#     }
    
#     response = requests.post(
#         "https://api.deepseek.com/v1/chat/completions",
#         json=data,
#         headers=headers
#     )
    
#     if response.status_code != 200:
#         raise Exception(f"DeepSeek API error: {response.text}")
        
#     result = response.json()
#     ideas = result['choices'][0]['message']['content'].split("\n")
#     return ideas

# def get_video_id(url: str):
#     """שליפת מזהה הסרטון מה-URL של YouTube"""
#     video_id = url.split("v=")[-1]
#     return video_id

# def get_video_transcript(video_id: str):
#     """שליפת תמלול מהסרטון"""
#     try:
#         captions = youtube.captions().list(part="snippet", videoId=video_id).execute()
#         if 'items' in captions and len(captions['items']) > 0:
#             caption_id = captions['items'][0]['id']
#             caption = youtube.captions().download(id=caption_id).execute()
#             return caption['body']
#         else:
#             return None
#     except Exception as e:
#         raise HTTPException(status_code=500, detail="Error fetching captions")

# @app.post("/analyze_text")
# async def analyze_text(request: TextRequest):
#     try:
#         if request.model == "openai":
#             response = openai.ChatCompletion.create(
#                 model="gpt-4",
#                 messages=[{
#                     "role": "system",
#                     "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
#                 }, {
#                     "role": "user",
#                     "content": request.text
#                 }]
#             )
#             ideas = response.choices[0].message.content.split("\n")

#         elif request.model == "gemini":
#             model = genai.GenerativeModel('gemini-pro')
#             response = model.generate_content(
#                 f"Extract 10 main ideas from the following text:\n\n{request.text}"
#             )
#             ideas = response.text.split("\n")

#         elif request.model == "deepseek":
#             ideas = analyze_with_deepseek(request.text)

#         else:
#             raise HTTPException(status_code=400, detail="Invalid model selection")

#         # ניקוי ועיבוד התוצאות
#         ideas = [idea.strip().lstrip("0123456789. ") for idea in ideas if idea.strip()][:10]
        
#         return {"ideas": ideas}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.post("/analyze_video")
# async def analyze_video(request: VideoRequest):
#     print("hi1")
#     try:
#         print("hi")
#         video_id = get_video_id(request.video_url)
#         print(video_id)
#         transcript = get_video_transcript(video_id)
        
#         if not transcript:
#             raise HTTPException(status_code=404, detail="Transcript not available")

#         # הפעלת המודל על התמלול שנשלף
#         if request.model == "openai":
#             response = openai.ChatCompletion.create(
#                 model="gpt-4",
#                 messages=[{
#                     "role": "system",
#                     "content": "Extract 10 main ideas from the following text. Format them as a numbered list."
#                 }, {
#                     "role": "user",
#                     "content": transcript
#                 }]
#             )
#             ideas = response.choices[0].message.content.split("\n")
#             print(ideas)

#         elif request.model == "gemini":
#             model = genai.GenerativeModel('gemini-pro')
#             response = model.generate_content(
#                 f"Extract 10 main ideas from the following text:\n\n{transcript}"
#             )
#             ideas = response.text.split("\n")

#         elif request.model == "deepseek":
#             ideas = analyze_with_deepseek(transcript)

#         else:
#             raise HTTPException(status_code=400, detail="Invalid model selection")

#         # ניקוי ועיבוד התוצאות
#         ideas = [idea.strip().lstrip("0123456789. ") for idea in ideas if idea.strip()][:10]
        
#         return {"ideas": ideas}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
# import asyncio
# if __name__ == "__main__":
#     video_request = VideoRequest(video_url="https://www.youtube.com/watch?v=-2k1rcRzsLA", model="openai")
#     result = asyncio.run(analyze_video(video_request))
#     print("hallo")
#     print(result)
#     print("hallo2")
#     # import uvicorn
#     # uvicorn.run(app, host="0.0.0.0", port=5000)


from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
from openai import OpenAI
import google.generativeai as genai
import requests
import os
from dotenv import load_dotenv
from googleapiclient.discovery import build
import re
from youtube_transcript_api import YouTubeTranscriptApi
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import json

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # בפיתוח בלבד! בproduction הגדר ספציפית
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize API clients
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

class TextRequest(BaseModel):
    text: str
    model: str

class VideoRequest(BaseModel):
    video_url: str
    model: str

def get_video_id(url: str) -> str:
    """Extract video ID from various YouTube URL formats"""
    patterns = [
        r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
        r'(?:embed\/)([0-9A-Za-z_-]{11})',
        r'(?:youtu\.be\/)([0-9A-Za-z_-]{11})'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    raise ValueError("Invalid YouTube URL")

def get_video_transcript(video_id: str) -> str:
    """Get video transcript using youtube_transcript_api"""
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        return " ".join([entry['text'] for entry in transcript_list])
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Could not fetch transcript: {str(e)}")


def analyze_with_deepseek(text: str) -> dict:
    headers = {
        "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": """Analyze the following text and provide:
                1. Extract 10 main ideas (format them as a numbered list)
                2. Generate 5-10 relevant tags that categorize the content (in English)
                
                Format the response as JSON:
                {
                    "ideas": ["idea1", "idea2", ...],
                    "tags": ["tag1", "tag2", ...]
                }"""
            },
            {
                "role": "user",
                "content": text
            }
        ]
    }
    
    response = requests.post(
        "https://api.deepseek.com/v1/chat/completions",
        json=data,
        headers=headers
    )
    
    if response.status_code != 200:
        raise Exception(f"DeepSeek API error: {response.text}")
        
    result = response.json()
    return json.loads(result['choices'][0]['message']['content'])

@app.put("/note_card/{notecard_id}/ideas")
async def update_notecard_ideas(notecard_id: int, data: dict):
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_DATABASE"),
            user=os.getenv("DB_USERNAME"),
            password=os.getenv("DB_PASSWORD"),
            host=os.getenv("DB_HOST")
        )
        cursor = conn.cursor()

        ideas_array = data["ideas"] if isinstance(data["ideas"], list) else [data["ideas"]]
        tags_array = data.get("tags", []) if isinstance(data.get("tags"), list) else []
        
        update_query = """
            UPDATE note_card
            SET "keyTakeaways" = %s, 
                "tags" = %s
            WHERE id = %s 
            RETURNING id;
        """
        cursor.execute(update_query, (ideas_array, tags_array, notecard_id))
        
        updated_row = cursor.fetchone()
        if not updated_row:
            raise HTTPException(status_code=404, detail="Notecard not found")

        conn.commit()
        cursor.close()
        conn.close()

        return {"status": "success", "message": "Ideas and tags updated successfully"}

    except psycopg2.Error as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    except Exception as e:
        print(f"General error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_text")
async def analyze_text(request: TextRequest):
    try:
        if request.model == "openai":
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": """Analyze the following text and provide:
                    1. Extract 10 main ideas (format them as a numbered list)
                    2. Generate 5-10 relevant tags that categorize the content (in English)
                    
                    Format the response as JSON:
                    {
                        "ideas": ["idea1", "idea2", ...],
                        "tags": ["tag1", "tag2", ...]
                    }"""},
                    {"role": "user", "content": request.text}
                ]
            )
            result = json.loads(response.choices[0].message.content)

        elif request.model == "gemini":
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""Analyze the following text and provide:
            1. Extract 10 main ideas
            2. Generate 5-10 relevant tags that categorize the content (in English)
            
            Format the response as JSON:
            {{
                "ideas": ["idea1", "idea2", ...],
                "tags": ["tag1", "tag2", ...]
            }}
            
            Text to analyze:
            {request.text}"""
            
            response = model.generate_content(prompt)
            result = json.loads(response.text)

        elif request.model == "deepseek":
            result = analyze_with_deepseek(request.text)

        else:
            raise HTTPException(status_code=400, detail="Invalid model selection")

        # Clean and process results
        ideas = [idea.strip().lstrip("0123456789. ") for idea in result["ideas"] if idea.strip()][:10]
        tags = [tag.lower().strip() for tag in result["tags"] if tag.strip()]
        
        return {"ideas": ideas, "tags": tags}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze_video")
async def analyze_video(request: VideoRequest):
    try:
        video_id = get_video_id(request.video_url)
        transcript = get_video_transcript(video_id)
        
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not available")

        if request.model == "openai":
            response = client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": """Analyze the following text and provide:
                    1. Extract 10 main ideas (format them as a numbered list)
                    2. Generate 5-10 relevant tags that categorize the content (in English)
                    
                    Format the response as JSON:
                    {
                        "ideas": ["idea1", "idea2", ...],
                        "tags": ["tag1", "tag2", ...]
                    }"""},
                    {"role": "user", "content": transcript}
                ]
            )
            result = json.loads(response.choices[0].message.content)

        elif request.model == "gemini":
            model = genai.GenerativeModel('gemini-pro')
            prompt = f"""Analyze the following text and provide:
            1. Extract 10 main ideas
            2. Generate 5-10 relevant tags that categorize the content (in English)
            
            Format the response as JSON:
            {{
                "ideas": ["idea1", "idea2", ...],
                "tags": ["tag1", "tag2", ...]
            }}
            
            Text to analyze:
            {transcript}"""
            
            response = model.generate_content(prompt)
            result = json.loads(response.text)

        elif request.model == "deepseek":
            result = analyze_with_deepseek(transcript)

        else:
            raise HTTPException(status_code=400, detail="Invalid model selection")

        # Clean and process results
        ideas = [idea.strip().lstrip("0123456789. ") for idea in result["ideas"] if idea.strip()][:10]
        tags = [tag.lower().strip() for tag in result["tags"] if tag.strip()]
        print(tags)
        
        return {"ideas": ideas, "tags": tags}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import asyncio
if __name__ == "__main__":
    # video_request = VideoRequest(video_url="https://www.youtube.com/watch?v=-2k1rcRzsLA", model="openai")
    # result = asyncio.run(analyze_video(video_request))
    # print("hallo")
    # print(result)
    # print("hallo2")
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
