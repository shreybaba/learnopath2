import sys
import os
import sqlite3
import json

# Setup system path to resolve local modules correctly regardless of execution directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

from database import DB_PATH, init_db
from recommender import generate_recommendations, build_roadmap_levels

# Ensure database is initialized and seeded on app startup
init_db()

app = FastAPI(
    title="GlobalCourse AI Recommendation Engine API",
    description="REST backend for elite university course matching and learning pathway generation.",
    version="1.0.0"
)

# Enable CORS for frontend integration (standard developer configuration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local sandbox access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas for API validation
class UserProfileSchema(BaseModel):
    educational_background: str
    current_skills: List[str]
    career_goals: str
    target_skills: List[str]
    budget: float
    weekly_hours: float
    learning_style: Optional[str] = "Self-Paced"

class CourseSchema(BaseModel):
    id: int
    title: str
    description: str
    university: str
    instructor: str
    skills_taught: List[str]
    duration_weeks: int
    weekly_hours: int
    difficulty: str
    rating: float
    cost: float
    certificate: bool
    category: str
    url: Optional[str] = None

class RegisterSchema(BaseModel):
    username: str
    password: str

class LoginSchema(BaseModel):
    username: str
    password: str

class ProfileSaveSchema(BaseModel):
    username: str
    profile: UserProfileSchema

class TrackEnrollSchema(BaseModel):
    username: str
    course_id: int

class TrackUpdateSchema(BaseModel):
    username: str
    course_id: int
    status: str
    completed_weeks: List[int]
    hours_studied: float
    notes: Optional[str] = ""

# Pre-defined high-demand career pathways
CAREER_PATHWAYS = [
    {
        "id": "gen-ai-eng",
        "title": "Generative AI & MLOps Architect",
        "description": "Design, deploy, and manage fine-tuned large language models, retrieval-augmented generation (RAG) pipelines, and enterprise-scale machine learning models in production.",
        "skills_required": ["Python", "Deep Learning", "Transformers", "Generative AI", "Large Language Models", "Prompt Engineering", "MLOps", "PyTorch", "Search Algorithms"],
        "avg_salary": "$135,000 - $215,000",
        "yoy_growth": "+48%",
        "market_demand": "Critical",
        "learning_timeline": "6 - 9 Months",
        "top_companies": ["Google", "OpenAI", "Anthropic", "Meta", "Microsoft"]
    },
    {
        "id": "fullstack-cloud",
        "title": "Full-Stack Software & Cloud Engineer",
        "description": "Construct high-performance database-backed web applications, configure cloud infrastructure, manage containerized services, and build microservice architectures.",
        "skills_required": ["JavaScript", "React", "Next.js", "Python", "SQL", "PostgreSQL", "RESTful APIs", "Docker", "AWS Services", "Google Cloud Platform"],
        "avg_salary": "$110,000 - $175,000",
        "yoy_growth": "+22%",
        "market_demand": "High",
        "learning_timeline": "5 - 7 Months",
        "top_companies": ["Amazon", "Stripe", "Netflix", "Salesforce", "Vercel"]
    },
    {
        "id": "cyber-architect",
        "title": "Enterprise Cybersecurity Architect",
        "description": "Secure distributed computer networks, construct firewall frameworks, design cryptographic structures, perform penetration testing, and supervise security compliance audits.",
        "skills_required": ["Cybersecurity", "Network Security", "Cryptography", "Penetration Testing", "Ethical Hacking", "Vulnerability Assessment", "Firewall Settings", "SSL/TLS"],
        "avg_salary": "$120,000 - $195,000",
        "yoy_growth": "+32%",
        "market_demand": "Very High",
        "learning_timeline": "6 - 8 Months",
        "top_companies": ["CrowdStrike", "Cloudflare", "Cisco", "Palo Alto Networks", "Deloitte"]
    },
    {
        "id": "ai-prod-mgr",
        "title": "AI Product Manager & Startup Lead",
        "description": "Bridge the gap between AI engineering and business strategy. Define market validations, align product requirements, set product roadmaps, and manage ethical ML concerns.",
        "skills_required": ["Product Management", "AI Lifecycle", "User Research", "Agile Roadmap", "Design Thinking", "Tech Entrepreneurship", "ML Ethics", "Figma"],
        "avg_salary": "$125,000 - $185,000",
        "yoy_growth": "+20%",
        "market_demand": "High",
        "learning_timeline": "4 - 6 Months",
        "top_companies": ["Apple", "Uber", "Airbnb", "Google", "Tesla"]
    }
]

def get_db_courses():
    """Helper to query all courses from SQLite and return as structured dicts."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM courses")
    rows = cursor.fetchall()
    
    courses = []
    for r in rows:
        courses.append({
            "id": r["id"],
            "title": r["title"],
            "description": r["description"],
            "university": r["university"],
            "instructor": r["instructor"],
            "skills_taught": json.loads(r["skills_taught"]),
            "duration_weeks": r["duration_weeks"],
            "weekly_hours": r["weekly_hours"],
            "difficulty": r["difficulty"],
            "rating": r["rating"],
            "cost": r["cost"],
            "certificate": True if r["certificate"] == 1 else False,
            "category": r["category"],
            "url": r["url"]
        })
    conn.close()
    return courses

@app.get("/")
def read_root():
    return {
        "status": "online",
        "message": "GlobalCourse AI Recommender Backend is operational.",
        "endpoints": {
            "get_courses": "/api/courses",
            "get_career_paths": "/api/career-paths",
            "post_recommendations": "/api/recommend",
            "post_roadmap": "/api/roadmap"
        }
    }

@app.get("/api/courses")
def get_courses(category: Optional[str] = None, search: Optional[str] = None):
    """Retrieves all courses, supporting category filter and text query searching."""
    try:
        courses = get_db_courses()
        
        # Apply filters
        if category:
            courses = [c for c in courses if c["category"].lower() == category.lower()]
            
        if search:
            search_term = search.lower()
            courses = [
                c for c in courses 
                if search_term in c["title"].lower() 
                or search_term in c["description"].lower() 
                or any(search_term in s.lower() for s in c["skills_taught"])
            ]
            
        return courses
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database query error: {str(e)}")

@app.get("/api/career-paths")
def get_career_paths():
    """Returns predefined high-demand career pathways with O*NET and salary analytics."""
    return CAREER_PATHWAYS

@app.post("/api/recommend")
def recommend_courses(profile: UserProfileSchema):
    """Runs content-based and skill-gap similarity models to yield top 10 personalized courses."""
    try:
        courses = get_db_courses()
        if not courses:
            raise HTTPException(status_code=404, detail="No courses found in database.")
            
        profile_dict = profile.model_dump()
        recs = generate_recommendations(profile_dict, courses)
        return recs
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation engine error: {str(e)}")

@app.post("/api/roadmap")
def recommend_roadmap(profile: UserProfileSchema):
    """Assembles a sequential learning roadmap (Beginner -> Intermediate -> Advanced -> Expert) tailored to user profile."""
    try:
        courses = get_db_courses()
        if not courses:
            raise HTTPException(status_code=404, detail="No courses found in database.")
            
        profile_dict = profile.model_dump()
        roadmap = build_roadmap_levels(profile_dict, courses)
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Roadmap generator error: {str(e)}")

# --- User Authentication Endpoints ---

@app.post("/api/auth/register")
def auth_register(payload: RegisterSchema):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password, profile) VALUES (?, ?, ?)", 
                       (payload.username, payload.password, ""))
        conn.commit()
        conn.close()
        return {"success": True, "message": "User registered successfully"}
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="Username already exists")
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/auth/login")
def auth_login(payload: LoginSchema):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (payload.username,))
    user = cursor.fetchone()
    conn.close()
    if not user or user["password"] != payload.password:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    profile_data = None
    if user["profile"]:
        try:
            profile_data = json.loads(user["profile"])
        except Exception:
            pass
            
    return {
        "success": True, 
        "username": user["username"], 
        "profile": profile_data
    }

@app.post("/api/auth/save-profile")
def auth_save_profile(payload: ProfileSaveSchema):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        profile_json = json.dumps(payload.profile.model_dump())
        cursor.execute("UPDATE users SET profile = ? WHERE username = ?", (profile_json, payload.username))
        conn.commit()
        conn.close()
        return {"success": True}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/auth/get-profile")
def auth_get_profile(username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    cursor.execute("SELECT profile FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    conn.close()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    profile_data = None
    if user["profile"]:
        try:
            profile_data = json.loads(user["profile"])
        except Exception:
            pass
    return {"profile": profile_data}

# --- Course Progress Tracking Endpoints ---

@app.get("/api/tracking")
def get_tracking(username: str):
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get user id first
    cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
    user = cursor.fetchone()
    if not user:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")
    
    user_id = user["id"]
    
    cursor.execute("""
        SELECT t.*, c.title, c.description, c.university, c.instructor, c.skills_taught,
               c.duration_weeks, c.weekly_hours, c.difficulty, c.rating, c.cost, c.certificate, c.category, c.url
        FROM tracking t
        JOIN courses c ON t.course_id = c.id
        WHERE t.user_id = ?
    """, (user_id,))
    rows = cursor.fetchall()
    
    tracking_list = []
    for r in rows:
        tracking_list.append({
            "course": {
                "id": r["course_id"],
                "title": r["title"],
                "description": r["description"],
                "university": r["university"],
                "instructor": r["instructor"],
                "skills_taught": json.loads(r["skills_taught"]),
                "duration_weeks": r["duration_weeks"],
                "weekly_hours": r["weekly_hours"],
                "difficulty": r["difficulty"],
                "rating": r["rating"],
                "cost": r["cost"],
                "certificate": True if r["certificate"] == 1 else False,
                "category": r["category"],
                "url": r["url"]
            },
            "status": r["status"],
            "completed_weeks": json.loads(r["completed_weeks"]),
            "hours_studied": r["hours_studied"],
            "notes": r["notes"]
        })
    conn.close()
    return tracking_list

@app.post("/api/tracking/enroll")
def enroll_course(payload: TrackEnrollSchema):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Get user id
        cursor.execute("SELECT id FROM users WHERE username = ?", (payload.username,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user[0]
        
        # Verify course exists
        cursor.execute("SELECT id FROM courses WHERE id = ?", (payload.course_id,))
        course = cursor.fetchone()
        if not course:
            conn.close()
            raise HTTPException(status_code=404, detail="Course not found")
            
        # Insert with default tracking values
        cursor.execute("""
            INSERT OR IGNORE INTO tracking (user_id, course_id, status, completed_weeks, hours_studied, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (user_id, payload.course_id, "In Progress", "[]", 0.0, ""))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Enrolled in course successfully"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tracking/update")
def update_tracking(payload: TrackUpdateSchema):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Get user id
        cursor.execute("SELECT id FROM users WHERE username = ?", (payload.username,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user[0]
        
        completed_weeks_json = json.dumps(payload.completed_weeks)
        cursor.execute("""
            UPDATE tracking 
            SET status = ?, completed_weeks = ?, hours_studied = ?, notes = ?
            WHERE user_id = ? AND course_id = ?
        """, (payload.status, completed_weeks_json, payload.hours_studied, payload.notes, user_id, payload.course_id))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Course tracking updated successfully"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tracking/remove")
def remove_tracking(payload: TrackEnrollSchema):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Get user id
        cursor.execute("SELECT id FROM users WHERE username = ?", (payload.username,))
        user = cursor.fetchone()
        if not user:
            conn.close()
            raise HTTPException(status_code=404, detail="User not found")
        user_id = user[0]
        
        cursor.execute("DELETE FROM tracking WHERE user_id = ? AND course_id = ?", (user_id, payload.course_id))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Course tracking removed successfully"}
    except Exception as e:
        conn.close()
        raise HTTPException(status_code=500, detail=str(e))
