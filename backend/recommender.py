import math
import re
import json

# Set of standard English stop words to filter out for higher quality text matching
STOP_WORDS = {
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 
    'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 
    'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 
    'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 
    'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 
    'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 
    'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 
    'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 
    'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 
    'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 
    'should', 'now'
}

def tokenize(text):
    """Tokenize, lowercase, and filter stopwords from text."""
    if not text:
        return []
    # Lowercase and clean special characters
    text = text.lower()
    words = re.findall(r'[a-z0-9]+', text)
    # Filter stopwords and short strings
    return [w for w in words if w not in STOP_WORDS and len(w) > 1]

class PureTFIDF:
    """A pure-Python TF-IDF model for document vectorization."""
    def __init__(self):
        self.vocab = {}          # Maps word -> vocabulary index
        self.idf = {}            # Maps word -> inverse document frequency
        self.doc_count = 0
        
    def fit(self, docs):
        """Fits vocabulary and computes IDF for a list of documents (each a raw string)."""
        self.doc_count = len(docs)
        if self.doc_count == 0:
            return
            
        word_doc_freq = {}  # Maps word -> count of documents containing this word
        
        # Tokenize all documents and count document frequency
        tokenized_docs = [tokenize(doc) for doc in docs]
        
        # Gather all unique terms
        for doc_tokens in tokenized_docs:
            unique_tokens = set(doc_tokens)
            for token in unique_tokens:
                word_doc_freq[token] = word_doc_freq.get(token, 0) + 1
                
        # Build vocabulary (index mapping) and calculate IDF
        # Using smoothed IDF: ln(1 + doc_count / (1 + doc_freq)) + 1
        idx = 0
        for token, freq in word_doc_freq.items():
            self.vocab[token] = idx
            self.idf[token] = math.log((1 + self.doc_count) / (1 + freq)) + 1.0
            idx += 1
            
    def transform(self, doc_text):
        """Transforms a raw text document into a sparse-represented vector (dict of index: value)."""
        tokens = tokenize(doc_text)
        if not tokens:
            return {}
            
        # Count term frequencies
        tf = {}
        for token in tokens:
            if token in self.vocab:
                tf[token] = tf.get(token, 0) + 1
                
        # Calculate TF-IDF: tf[t] * idf[t] (L2 normalized vector representation)
        vector = {}
        sq_sum = 0.0
        for token, count in tf.items():
            vocab_idx = self.vocab[token]
            tfidf_val = count * self.idf[token]
            vector[vocab_idx] = tfidf_val
            sq_sum += tfidf_val ** 2
            
        # L2 Normalization
        norm = math.sqrt(sq_sum)
        if norm > 0:
            for idx in vector:
                vector[idx] /= norm
                
        return vector

def cosine_similarity(vec1, vec2):
    """Computes cosine similarity between two L2-normalized sparse vectors (dicts)."""
    if not vec1 or not vec2:
        return 0.0
    # Since vectors are L2-normalized, dot product equals cosine similarity
    dot_product = 0.0
    for idx, val in vec1.items():
        if idx in vec2:
            dot_product += val * vec2[idx]
    return dot_product

def compute_skills_overlap(user_missing_skills, course_skills):
    """Calculates how much a course overlaps with what the user is missing."""
    if not user_missing_skills:
        return 1.0  # No gaps to fill, excellent!
        
    course_skills_set = {s.lower() for s in course_skills}
    user_missing_skills_set = {s.lower() for s in user_missing_skills}
    
    overlap = course_skills_set.intersection(user_missing_skills_set)
    return len(overlap) / len(user_missing_skills_set)

def score_course_preferences(course, profile):
    """Scores how well the course budget, available hours, and difficulty fit user preferences."""
    pref_score = 0.0
    details = []
    
    # 1. Budget Fit (Weight: 40%)
    max_budget = profile.get("budget", 1000)
    course_cost = course["cost"]
    
    if course_cost <= max_budget:
        pref_score += 0.40
        if course_cost == 0:
            details.append("100% Free / Open Access")
        else:
            details.append(f"Fits your ${max_budget} budget (${course_cost})")
    else:
        # Penalize over-budget courses, but give fractional credit if within 1.5x
        ratio = max_budget / max(1.0, course_cost)
        if ratio > 0.5:
            pref_score += 0.40 * ratio
            details.append(f"Slightly over your budget of ${max_budget}")
        else:
            details.append("Exceeds your preferred budget limit")

    # 2. Time Fit (Weight: 40%)
    avail_hours = profile.get("weekly_hours", 10)
    course_hours = course["weekly_hours"]
    
    if course_hours <= avail_hours:
        pref_score += 0.40
        details.append(f"Easily fits your schedule ({course_hours}h/wk requested vs {avail_hours}h/wk available)")
    else:
        ratio = avail_hours / course_hours
        if ratio > 0.5:
            pref_score += 0.40 * ratio
            details.append(f"Slightly demanding ({course_hours}h/wk commitment required)")
        else:
            details.append(f"Requires high commitment ({course_hours}h/wk)")

    # 3. Difficulty Alignment (Weight: 20%)
    # Map user background to expected learning curve
    user_difficulty = "Beginner"
    edu = profile.get("educational_background", "").lower()
    skills_count = len(profile.get("current_skills", []))
    
    if "phd" in edu or "master" in edu or skills_count > 6:
        user_difficulty = "Advanced"
    elif "bachelor" in edu or skills_count > 3:
        user_difficulty = "Intermediate"
        
    course_diff = course["difficulty"]
    
    if course_diff == user_difficulty:
        pref_score += 0.20
        details.append(f"Matches your '{course_diff}' learning level")
    elif (user_difficulty == "Advanced" and course_diff == "Intermediate") or \
         (user_difficulty == "Intermediate" and course_diff == "Beginner") or \
         (user_difficulty == "Beginner" and course_diff == "Intermediate"):
        pref_score += 0.12
        details.append(f"Good progression ({course_diff} level)")
    else:
        details.append(f"Offered at a different pace ({course_diff} level)")

    return pref_score, details

def generate_recommendations(profile, courses):
    """
    Ranks courses based on semantic overlap, skill-gap analysis, and user preferences.
    
    profile: {
        "interests": "...",
        "career_goals": "...",
        "current_skills": [...],
        "target_skills": [...],
        "budget": 100,
        "weekly_hours": 10,
        "educational_background": "..."
    }
    courses: list of course dictionaries from SQLite.
    
    Returns top 10 recommended courses with scoring matrices and explanations.
    """
    if not courses:
        return []
        
    # 1. Fit TF-IDF model on all courses
    course_docs = []
    for c in courses:
        skills_str = " ".join(c["skills_taught"])
        doc = f"{c['title']} {c['description']} {skills_str} {c['university']} {c['category']}"
        course_docs.append(doc)
        
    tfidf = PureTFIDF()
    tfidf.fit(course_docs)
    
    # Transform all courses
    course_vectors = [tfidf.transform(doc) for doc in course_docs]
    
    # 2. Build User query vector
    user_interests = profile.get("interests", "")
    user_goals = profile.get("career_goals", "")
    user_target_skills = " ".join(profile.get("target_skills", []))
    user_query = f"{user_interests} {user_goals} {user_target_skills}"
    
    user_vector = tfidf.transform(user_query)
    
    # 3. Calculate missing skills (Skill-Gap)
    current_skills_set = {s.lower() for s in profile.get("current_skills", [])}
    target_skills_set = {s.lower() for s in profile.get("target_skills", [])}
    missing_skills = list(target_skills_set - current_skills_set)
    
    recommendations = []
    
    for idx, course in enumerate(courses):
        # Calculate individual subscores
        
        # A. Semantic Match (Cosine similarity over TF-IDF vectors)
        semantic_sim = cosine_similarity(user_vector, course_vectors[idx])
        
        # B. Skill-Gap Match
        skill_match = compute_skills_overlap(missing_skills, course["skills_taught"])
        
        # C. Preference Fit
        pref_score, pref_details = score_course_preferences(course, profile)
        
        # D. Combined Score: 40% Semantic, 40% Skill-Gap, 20% Preferences
        final_score = (0.40 * semantic_sim) + (0.40 * skill_match) + (0.20 * pref_score)
        match_percentage = round(final_score * 100)
        # Cap range nicely between 10% and 99% for display purposes (keeps it realistic!)
        match_percentage = max(15, min(98, match_percentage))
        
        # E. Formulate the "Reason for Recommendation"
        reconstruct_reasons = []
        
        # Skill coverage comments
        course_skills_lower = [s.lower() for s in course["skills_taught"]]
        covered_gaps = [s for s in missing_skills if s.lower() in course_skills_lower]
        if covered_gaps:
            reconstruct_reasons.append(f"Teaches vital skills: {', '.join(covered_gaps[:3])}")
            
        # Prestige and academic standard comment
        reconstruct_reasons.append(f"Offered by prestigious {course['university']}")
        
        # Preference comment
        if len(pref_details) > 0:
            reconstruct_reasons.append(pref_details[0])
            
        reason_string = " | ".join(reconstruct_reasons) + "."
        
        recommendations.append({
            "course": course,
            "match_percentage": match_percentage,
            "scores": {
                "semantic_match": round(semantic_sim * 100),
                "skills_gap_match": round(skill_match * 100),
                "preference_fit": round(pref_score * 100)
            },
            "missing_skills_covered": covered_gaps,
            "reason": reason_string
        })
        
    # Sort by match percentage in descending order
    recommendations.sort(key=lambda x: x["match_percentage"], reverse=True)
    
    # Return top 10 courses
    return recommendations[:10]

def build_roadmap_levels(profile, courses):
    """
    Builds a custom 4-tier Learning Roadmap (Beginner -> Intermediate -> Advanced -> Expert)
    based on course difficulties, tags, and current skill gap analysis.
    """
    # Sort courses by category and filter to overlap user interests or target skills
    target_skills = [s.lower() for s in profile.get("target_skills", [])]
    current_skills = [s.lower() for s in profile.get("current_skills", [])]
    missing_skills = set(target_skills) - set(current_skills)
    
    # Categorize courses by difficulty levels
    levels = {
        "Beginner": [],
        "Intermediate": [],
        "Advanced": [],
        "Expert": []
    }
    
    # Score all courses to see which fits best at each stage
    recs = generate_recommendations(profile, courses)
    ranked_courses = [r["course"] for r in recs]
    
    # Fallback to other courses if recommended pool is too small for full levels
    seen_ids = set()
    for rc in ranked_courses:
        lvl = rc["difficulty"]
        if len(levels[lvl]) < 2:  # Allow max 2 courses per level
            levels[lvl].append(rc)
            seen_ids.add(rc["id"])
            
    # Fill remaining gaps from global courses catalog
    for c in courses:
        if c["id"] not in seen_ids:
            lvl = c["difficulty"]
            if len(levels[lvl]) < 2:
                levels[lvl].append(c)
                seen_ids.add(c["id"])
                
    # Return structured roadmap stages
    roadmap_stages = []
    
    stages_order = ["Beginner", "Intermediate", "Advanced", "Expert"]
    for i, stage_name in enumerate(stages_order):
        stage_courses = levels[stage_name]
        stage_course = stage_courses[0] if stage_courses else None
        
        # If absolutely no courses in this level, clone a nearby one
        if not stage_course:
            for fallback_lvl in stages_order:
                if levels[fallback_lvl]:
                    stage_course = levels[fallback_lvl][0]
                    break
                    
        roadmap_stages.append({
            "stage": stage_name,
            "level_index": i + 1,
            "course": stage_course,
            "milestone": f"Master {', '.join(stage_course['skills_taught'][:2]) if stage_course else 'Core Concepts'}"
        })
        
    return roadmap_stages
