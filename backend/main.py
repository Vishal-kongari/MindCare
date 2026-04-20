from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pickle
import google.generativeai as genai
from pydantic import BaseModel
import os

# -------------------------------
# Load ML model
# -------------------------------
MODEL_PATH = "model.pkl"
try:
    with open(MODEL_PATH, "rb") as f:
        model_ml = pickle.load(f)
except FileNotFoundError:
    # Fallback or error if model doesn't exist yet
    model_ml = None
    print(f"Warning: {MODEL_PATH} not found.")

# -------------------------------
# Gemini Setup
# -------------------------------
# Using the key provided by the user
GEMINI_API_KEY = "AIzaSyBtnikscTcGJi6TWvw64z9fopM2bkyvqdk"
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("models/gemini-2.5-flash")
import pandas as pd

# -------------------------------
# FastAPI app
# -------------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------
# Models
# -------------------------------
class SurveyData(BaseModel):
    mental_score: int
    stress_score: int
    sleep_hours: float
    exercise_days: int
    screen_time: float
    lonely: int
    self_harm: int
    hobbies: str = ""

# -------------------------------
# Create Prompt
# -------------------------------
def create_prompt(data: SurveyData, level: str):
    return f"""
You are a supportive mental health assistant for a university student.

User Mental Health Profile:
- Assessment Level: {level}
- Core Mental Score: {data.mental_score}/30 (Higher means more symptoms)
- Stress Level: {data.stress_score}/20
- Sleep: {data.sleep_hours} hours/day
- Physical Activity: {data.exercise_days} days/week
- Screen Time: {data.screen_time} hours/day
- Loneliness Rating: {data.lonely}/3
- Personal Hobbies/Interests: {data.hobbies}

Based on their hobbies and health data, provide 5 personalized, practical, and highly encouraging suggestions to improve their wellbeing. 

Rules:
1. Incorporate their hobbies (e.g., if they like painting, suggest a creative session).
2. If sleep or exercise is low, suggest small ways to improve.
3. Keep the tone warm, empathetic, and non-clinical.
4. Do NOT give a medical diagnosis.
5. Use clear bullet points.
6. Keep it concise.
"""

# -------------------------------
# Gemini Suggestions (with Level-based Fallbacks)
# -------------------------------
async def get_suggestions(data: SurveyData, level: str):
    try:
        prompt = create_prompt(data, level)
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Gemini API Error: {e}")
        
        # Comprehensive Static Fallbacks
        fallbacks = {
            "Healthy": (
                "### Maintain Your Momentum\n\n"
                "- **Daily Reflection:** Since you're doing well, consider journaling once a week to maintain your positive mindset.\n"
                "- **Hydration & Sleep:** Focus on staying hydrated and getting consistent sleep to keep your energy high.\n"
                "- **Hobby Integration:** Dedicate time to " + (data.hobbies if data.hobbies else "your favorite creative activity") + " to keep stress low.\n"
                "- **Social Connection:** Share your positive energy with a friend or colleague today.\n"
                "- **New Goals:** Consider setting a small personal goal to challenge yourself further."
            ),
            "Mild": (
                "### Gentle Self-Care\n\n"
                "- **Mindful Breaks:** Take 5-minute deep breathing breaks during your core tasks.\n"
                "- **Activity Boost:** Try to add a 10-minute walk at least 3 times a week.\n"
                "- **Digital Detox:** Reduce screen time by 30 minutes before bed to improve sleep quality.\n"
                "- **Creative Outlet:** Engage in " + (data.hobbies if data.hobbies else "a hobby") + " for just 15 minutes today.\n"
                "- **Hydration:** Ensure you're drinking enough water throughout the day."
            ),
            "Moderate": (
                "### Proactive Wellness\n\n"
                "- **Prioritize Sleep:** Aim for at least 7-8 hours of sleep. Try a regular bedtime routine.\n"
                "- **Daily Movement:** Just 15-20 minutes of light exercise can significantly boost your mood.\n"
                "- **Structured Flow:** Break your academic or work tasks into smaller, manageable chunks with rest intervals.\n"
                "- **Soothing Activities:** Dedicate time to " + (data.hobbies if data.hobbies else "calming activities like reading or music") + ".\n"
                "- **Reach Out:** Consider talking to a trusted peer or counselor about your current stressors."
            ),
            "Severe": (
                "### Focused Support\n\n"
                "- **Immediate Support:** We strongly recommend reaching out to a professional counselor or your campus wellness team.\n"
                "- **Consistent Routine:** Establish a simple, daily routine for eating and sleeping to provide stability.\n"
                "- **Small Wins:** Focus on completing just one small, easy task today to build confidence.\n"
                "- **Safe Activity:** Engage in a gentle activity like " + (data.hobbies if data.hobbies else "listening to peaceful music") + ".\n"
                "- **Social Support:** Inform someone you trust about how you're feeling."
            )
        }
        return fallbacks.get(level, "Take regular breaks, stay hydrated, and consider reaching out to a professional counselor for guidance.")

# -------------------------------
# Predict API
# -------------------------------
@app.post("/predict")
async def predict(data: SurveyData):
    # 🚨 Safety check (Section E / self_harm)
    if data.self_harm >= 1:
        return {
            "level": "Critical",
            "suggestions": "### Immediate Action Required\n\n- **You are not alone.** Please reach out to a trusted friend, family member, or a professional counselor immediately.\n- **Emergency Support:** Contact your university's emergency wellness team or a 24/7 crisis helpline.\n- **Safe Space:** Try to stay in a well-lit, public area or with someone you trust right now."
        }

    # Features for model (Matches train.py)
    feature_names = ["mental_score", "stress_score", "sleep_hours", "exercise_days", "screen_time"]
    features_df = pd.DataFrame([[
            data.mental_score,
            data.stress_score,
            data.sleep_hours,
            data.exercise_days,
            data.screen_time
        ]], columns=feature_names)

    # ML prediction
    level = "Healthy"
    if model_ml:
        try:
            level_num = model_ml.predict(features_df)[0]
            level_map = {
                0: "Healthy",
                1: "Mild",
                2: "Moderate",
                3: "Severe"
            }
            level = level_map.get(level_num, "Moderate")
        except Exception as e:
            print(f"Model Prediction Error: {e}")
            # Heuristic fallback if model fails
            if data.mental_score > 20: level = "Severe"
            elif data.mental_score > 12: level = "Moderate"
            elif data.mental_score > 5: level = "Mild"
    else:
        # Heuristic fallback if model file missing
        if data.mental_score > 20: level = "Severe"
        elif data.mental_score > 12: level = "Moderate"
        elif data.mental_score > 5: level = "Mild"

    # Gemini suggestions
    suggestions = await get_suggestions(data, level)

    return {
        "level": level,
        "suggestions": suggestions
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
