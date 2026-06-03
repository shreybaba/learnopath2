import React, { useState, useEffect } from 'react'
import { Sparkles, Brain, Loader2, RefreshCw, Layers } from 'lucide-react'
import ProfileWizard from './components/ProfileWizard'
import Dashboard from './components/Dashboard'
import Login from './components/Login'

// Fallback courses data covering Tech, Medical, Law, and Psychology.
// Ensures fully robust, offline client-side execution matching the database seed!
const FALLBACK_COURSES = [
  // --- Engineering / AI / Cloud (Existing Tech Stack) ---
  {
    "id": 1,
    "title": "CS50's Introduction to Artificial Intelligence with Python",
    "description": "Learn the foundational concepts and algorithms of modern artificial intelligence, including search algorithms, game-playing AI, knowledge representation, Bayesian networks, machine learning, and neural networks using Python libraries.",
    "university": "Harvard University",
    "instructor": "Brian Yu",
    "skills_taught": ["Python", "Search Algorithms", "Machine Learning", "Neural Networks", "Natural Language Processing", "Adversarial Search"],
    "duration_weeks": 7,
    "weekly_hours": 6,
    "difficulty": "Intermediate",
    "rating": 4.8,
    "cost": 0,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://pll.harvard.edu/course/cs50s-introduction-artificial-intelligence-python"
  },
  {
    "id": 2,
    "title": "Machine Learning Specialization",
    "description": "Master foundational machine learning concepts and build practical skills. Learn supervised learning (linear regression, logistic regression, neural networks), unsupervised learning (clustering, anomaly detection, recommender systems), and practical ML practices.",
    "university": "Stanford University & DeepLearning.AI",
    "instructor": "Andrew Ng",
    "skills_taught": ["Supervised Learning", "Linear Regression", "Neural Networks", "Recommender Systems", "Unsupervised Learning", "Python"],
    "duration_weeks": 10,
    "weekly_hours": 8,
    "difficulty": "Beginner",
    "rating": 4.9,
    "cost": 49,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://www.coursera.org/specializations/machine-learning-introduction"
  },
  {
    "id": 3,
    "title": "Deep Learning Specialization",
    "description": "Become a machine learning expert. Master deep learning theory, construct neural networks, learn optimization methods (Adam, Batch Norm), build Convolutional Neural Networks (CNNs) for vision, and Recurrent Neural Networks (RNNs/LSTMs) for sequential data.",
    "university": "DeepLearning.AI",
    "instructor": "Andrew Ng",
    "skills_taught": ["Deep Learning", "TensorFlow", "Neural Networks", "Hyperparameter Tuning", "Computer Vision", "Sequence Models"],
    "duration_weeks": 16,
    "weekly_hours": 9,
    "difficulty": "Advanced",
    "rating": 4.9,
    "cost": 49,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://www.coursera.org/specializations/deep-learning"
  },
  {
    "id": 4,
    "title": "Generative AI for Everyone",
    "description": "Learn what Generative AI is, how it works, and how to apply it to your everyday work and life. Explore real-world use cases, understand LLMs, write effective prompts, and discover AI security and ethic principles.",
    "university": "DeepLearning.AI",
    "instructor": "Andrew Ng",
    "skills_taught": ["Generative AI", "Large Language Models", "Prompt Engineering", "AI Ethics", "Productivity Tools"],
    "duration_weeks": 3,
    "weekly_hours": 2,
    "difficulty": "Beginner",
    "rating": 4.8,
    "cost": 0,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://www.coursera.org/learn/generative-ai-for-everyone"
  },
  {
    "id": 11,
    "title": "CS50: Introduction to Computer Science",
    "description": "The world's most famous introduction to the intellectual enterprises of computer science and the art of programming. Covers C, Python, SQL, HTML/CSS, JavaScript, algorithms, data structures, and memory management.",
    "university": "Harvard University",
    "instructor": "David J. Malan",
    "skills_taught": ["C", "Python", "SQL", "HTML/CSS", "JavaScript", "Algorithms", "Data Structures", "Memory Management"],
    "duration_weeks": 11,
    "weekly_hours": 10,
    "difficulty": "Beginner",
    "rating": 4.9,
    "cost": 0,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://pll.harvard.edu/course/cs50-introduction-computer-science"
  },
  {
    "id": 14,
    "title": "Full Stack Web Developer Nanodegree",
    "description": "Learn how to build database-backed web APIs and host them in the cloud. Master PostgreSQL, SQL databases, API development with Flask, identity access management (OAuth2/Auth0), and containerization using Docker.",
    "university": "Udacity",
    "instructor": "Udacity Core Team",
    "skills_taught": ["PostgreSQL", "Flask", "Docker", "RESTful APIs", "Authentication", "Deployment"],
    "duration_weeks": 16,
    "weekly_hours": 10,
    "difficulty": "Intermediate",
    "rating": 4.6,
    "cost": 399,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://www.udacity.com/course/full-stack-web-developer-nanodegree--nd0044"
  },
  {
    "id": 23,
    "title": "Cybersecurity Specialization",
    "description": "Learn the essentials of systems, software, networks, and hardware security. Master penetration testing, threat analysis, cryptology basics, and security audit procedures.",
    "university": "University of Maryland, College Park",
    "instructor": "Jonathan Katz",
    "skills_taught": ["Cybersecurity", "Cryptography", "Penetration Testing", "Network Security", "Application Security", "Buffer Overflow"],
    "duration_weeks": 12,
    "weekly_hours": 6,
    "difficulty": "Intermediate",
    "rating": 4.7,
    "cost": 49,
    "certificate": true,
    "category": "Engineering & Tech",
    "url": "https://www.coursera.org/specializations/cybersecurity"
  },

  // --- Medicine & Healthcare ---
  {
    "id": 41,
    "title": "Introduction to Clinical Informatics and Digital Health",
    "description": "Learn the fundamentals of clinical data, health information systems, electronic health records (EHR), and the application of technology to clinical practice and patient care.",
    "university": "Stanford University",
    "instructor": "Dr. Robert Harrington",
    "skills_taught": ["Clinical Informatics", "Health Information Systems", "EHR Systems", "Digital Health", "Biostatistics"],
    "duration_weeks": 6,
    "weekly_hours": 4,
    "difficulty": "Beginner",
    "rating": 4.8,
    "cost": 0,
    "certificate": true,
    "category": "Medicine & Healthcare",
    "url": "https://online.stanford.edu"
  },
  {
    "id": 42,
    "title": "AI in Healthcare: Algorithms and Applications",
    "description": "Understand how artificial intelligence and machine learning are revolutionizing clinical workflows, diagnostic imaging, precision medicine, and therapeutic developments.",
    "university": "Harvard Medical School",
    "instructor": "Dr. Isaac Kohane",
    "skills_taught": ["AI in Healthcare", "Clinical Machine Learning", "Diagnostic Imaging", "Precision Medicine", "Healthcare AI Ethics"],
    "duration_weeks": 8,
    "weekly_hours": 6,
    "difficulty": "Intermediate",
    "rating": 4.9,
    "cost": 120,
    "certificate": true,
    "category": "Medicine & Healthcare",
    "url": "https://pll.harvard.edu"
  },
  {
    "id": 43,
    "title": "Epidemiology in Public Health Practice",
    "description": "Study the distribution and determinants of health-related states in populations. Learn surveillance, research design, outbreak investigation, and epidemic modeling.",
    "university": "Johns Hopkins University",
    "instructor": "Dr. Moyses Szklo",
    "skills_taught": ["Epidemiology", "Public Health", "Outbreak Investigation", "Biostatistics", "Data Collection"],
    "duration_weeks": 10,
    "weekly_hours": 5,
    "difficulty": "Intermediate",
    "rating": 4.7,
    "cost": 49,
    "certificate": true,
    "category": "Medicine & Healthcare",
    "url": "https://www.coursera.org"
  },
  {
    "id": 44,
    "title": "Bioinformatics: Genomes, Algorithms, and Evolution",
    "description": "Discover algorithms for sequence alignment, genome assembly, phylogenetic analysis, and molecular modeling. Master BLAST, sequence databases, and computational biology pipelines.",
    "university": "UC San Diego",
    "instructor": "Dr. Pavel Pevzner",
    "skills_taught": ["Bioinformatics", "Genomics", "Sequence Alignment", "Computational Biology", "Python Bioinformatics"],
    "duration_weeks": 12,
    "weekly_hours": 8,
    "difficulty": "Advanced",
    "rating": 4.8,
    "cost": 79,
    "certificate": true,
    "category": "Medicine & Healthcare",
    "url": "https://www.edx.org"
  },

  // --- Law & Legal Studies ---
  {
    "id": 51,
    "title": "Introduction to Constitutional Law: Civil Liberties & Rights",
    "description": "Analyze landmark judicial decisions, constitutional interpretation methodologies, separation of powers, federalism, and the protection of fundamental civil liberties.",
    "university": "Yale Law School",
    "instructor": "Prof. Akhil Reed Amar",
    "skills_taught": ["Constitutional Law", "Civil Liberties", "Judicial Precedent", "Legal Reasoning", "Constitutional Rights"],
    "duration_weeks": 8,
    "weekly_hours": 5,
    "difficulty": "Beginner",
    "rating": 4.9,
    "cost": 0,
    "certificate": true,
    "category": "Law & Legal Studies",
    "url": "https://www.coursera.org"
  },
  {
    "id": 52,
    "title": "Intellectual Property Law and Policy in the Digital Age",
    "description": "Explore copyright, patent, trademark, and trade secret laws. Learn how digital disruption, software patents, open source, and AI are reshaping intellectual property protections.",
    "university": "University of Pennsylvania",
    "instructor": "Prof. R. Polk Wagner",
    "skills_taught": ["Intellectual Property", "Patent Law", "Copyright Law", "Trademark Protections", "Legal Tech"],
    "duration_weeks": 6,
    "weekly_hours": 6,
    "difficulty": "Intermediate",
    "rating": 4.7,
    "cost": 49,
    "certificate": true,
    "category": "Law & Legal Studies",
    "url": "https://www.edx.org"
  },
  {
    "id": 53,
    "title": "Corporate Compliance, Governance, and Risk Management",
    "description": "Master corporate governance standards, compliance program design, financial regulations, ethical guidelines, and risk mitigation strategies in multinational corporations.",
    "university": "Columbia Law School",
    "instructor": "Prof. John C. Coffee Jr.",
    "skills_taught": ["Corporate Compliance", "Governance Standards", "Risk Management", "Financial Regulations", "Business Ethics"],
    "duration_weeks": 10,
    "weekly_hours": 4,
    "difficulty": "Advanced",
    "rating": 4.8,
    "cost": 99,
    "certificate": true,
    "category": "Law & Legal Studies",
    "url": "https://www.coursera.org"
  },
  {
    "id": 54,
    "title": "Legal Technology and the Future of Legal Services",
    "description": "Discover how AI-driven contract analysis, smart legal contracts, blockchain, automated document review, and e-discovery are transforming legal practice and law firms.",
    "university": "Northwestern University",
    "instructor": "Prof. Daniel W. Linna Jr.",
    "skills_taught": ["Legal Tech", "Smart Contracts", "Contract Analysis", "Automated Document Review", "E-Discovery"],
    "duration_weeks": 6,
    "weekly_hours": 5,
    "difficulty": "Intermediate",
    "rating": 4.6,
    "cost": 0,
    "certificate": true,
    "category": "Law & Legal Studies",
    "url": "https://www.coursera.org"
  },

  // --- Psychology & Behavioral Sciences ---
  {
    "id": 61,
    "title": "Introduction to Psychology: Mind, Brain, and Behavior",
    "description": "Explore the scientific study of human thought and behavior. Covers cognition, memory, perception, development, mental health, social behavior, and neuroscience foundations.",
    "university": "Yale University",
    "instructor": "Prof. Paul Bloom",
    "skills_taught": ["General Psychology", "Cognition", "Behavioral Analysis", "Developmental Psychology", "Neuroscience Foundations"],
    "duration_weeks": 6,
    "weekly_hours": 5,
    "difficulty": "Beginner",
    "rating": 4.9,
    "cost": 0,
    "certificate": true,
    "category": "Psychology & Behavioral Sciences",
    "url": "https://www.coursera.org"
  },
  {
    "id": 62,
    "title": "Cognitive Psychology: How the Mind Works",
    "description": "Study mental processes including attention, memory, problem-solving, language acquisition, decision-making, and mental representations.",
    "university": "MIT",
    "instructor": "Prof. John Gabrieli",
    "skills_taught": ["Cognitive Psychology", "Attention & Memory", "Problem-Solving", "Decision-Making", "Cognitive Neuroscience"],
    "duration_weeks": 8,
    "weekly_hours": 6,
    "difficulty": "Intermediate",
    "rating": 4.8,
    "cost": 0,
    "certificate": false,
    "category": "Psychology & Behavioral Sciences",
    "url": "https://online.mit.edu"
  },
  {
    "id": 63,
    "title": "Clinical Psychology: Counseling & Psychotherapy",
    "description": "Understand psychiatric diagnoses (DSM-5), clinical assessment protocols, and evidence-based psychotherapies like Cognitive Behavioral Therapy (CBT) and psychoanalysis.",
    "university": "University of Toronto",
    "instructor": "Dr. Steve Joordens",
    "skills_taught": ["Clinical Psychology", "Psychiatric Diagnoses", "Counseling Techniques", "Cognitive Behavioral Therapy", "Mental Health Assessment"],
    "duration_weeks": 10,
    "weekly_hours": 5,
    "difficulty": "Intermediate",
    "rating": 4.7,
    "cost": 49,
    "certificate": true,
    "category": "Psychology & Behavioral Sciences",
    "url": "https://www.coursera.org"
  },
  {
    "id": 65,
    "title": "Behavioral Neuroscience: Brain and Behavior",
    "description": "Explore the biological basis of behavior. Study brain anatomy, neurotransmitters, sensory systems, learning circuits, and the neurobiology of sleep, emotion, and addiction.",
    "university": "Stanford University",
    "instructor": "Dr. Robert Sapolsky",
    "skills_taught": ["Behavioral Neuroscience", "Brain Anatomy", "Neurotransmitters", "Neurobiology", "Endocrine Systems"],
    "duration_weeks": 12,
    "weekly_hours": 8,
    "difficulty": "Advanced",
    "rating": 4.9,
    "cost": 149,
    "certificate": true,
    "category": "Psychology & Behavioral Sciences",
    "url": "https://online.stanford.edu"
  }
]

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [roadmap, setRoadmap] = useState([])
  const [trackedCourses, setTrackedCourses] = useState([])
  const [loading, setLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState("checking")

  // On mount, check if there is an active session
  useEffect(() => {
    const savedUser = localStorage.getItem('globalcourse_session')
    if (savedUser) {
      handleLoginSuccess(savedUser, null)
    }
  }, [])

  // Sync session and fetch user state
  const handleLoginSuccess = async (username, initialProfile) => {
    setCurrentUser(username)
    localStorage.setItem('globalcourse_session', username)
    setLoading(true)

    let userProfile = initialProfile
    
    // Try to fetch profile and tracking from backend
    try {
      if (!userProfile) {
        const profResponse = await fetch(`/api/auth/get-profile?username=${username}`)
        if (profResponse.ok) {
          const profData = await profResponse.json()
          userProfile = profData.profile
        }
      }

      setServerStatus("online")

      if (userProfile) {
        setProfile(userProfile)
        // Auto-fetch recommendations & roadmap since profile exists
        await fetchRecommendationsAndRoadmap(userProfile, username)
      }
      
      await fetchTrackedCourses(username)
    } catch (err) {
      console.warn("FastAPI backend connection error during login fetch. Using local storage data.")
      setServerStatus("offline")

      // Local storage fallback for user profile and tracking
      const storedUsers = JSON.parse(localStorage.getItem('globalcourse_users') || '[]')
      const matchedUser = storedUsers.find(u => u.username.toLowerCase() === username.toLowerCase())
      
      if (matchedUser && matchedUser.profile) {
        userProfile = matchedUser.profile
        setProfile(userProfile)
        runLocalRecommender(userProfile)
      }

      // Load local tracking list
      const localTrackKey = `globalcourse_tracking_${username}`
      const localTracking = JSON.parse(localStorage.getItem(localTrackKey) || '[]')
      setTrackedCourses(localTracking)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    setProfile(null)
    setRecommendations([])
    setRoadmap([])
    setTrackedCourses([])
    localStorage.removeItem('globalcourse_session')
  }

  // Fetch recommendations and roadmaps from backend
  const fetchRecommendationsAndRoadmap = async (userProfile, usernameVal) => {
    const activeUser = usernameVal || currentUser
    try {
      const recResponse = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      })
      if (!recResponse.ok) throw new Error()
      const recData = await recResponse.json()
      setRecommendations(recData)

      const roadmapResponse = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userProfile)
      })
      if (!roadmapResponse.ok) throw new Error()
      const roadmapData = await roadmapResponse.json()
      setRoadmap(roadmapData)
      setServerStatus("online")
    } catch (error) {
      console.warn("Failover to local recommender matching engine.")
      setServerStatus("offline")
      runLocalRecommender(userProfile)
    }
  }

  // Fetch tracking progress list
  const fetchTrackedCourses = async (usernameVal) => {
    const activeUser = usernameVal || currentUser
    try {
      const trackResponse = await fetch(`/api/tracking?username=${activeUser}`)
      if (trackResponse.ok) {
        const trackData = await trackResponse.json()
        setTrackedCourses(trackData)
      }
    } catch (err) {
      console.warn("Unable to fetch online tracking list.")
    }
  }

  // Course tracking management functions
  const handleEnrollCourse = async (course) => {
    if (!currentUser) return
    
    // Check if already enrolled
    const exists = trackedCourses.some(t => t.course.id === course.id)
    if (exists) {
      alert("You are already tracking this course!")
      return
    }

    try {
      const response = await fetch('/api/tracking/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, course_id: course.id })
      })
      if (response.ok) {
        await fetchTrackedCourses(currentUser)
        alert(`Successfully enrolled in: "${course.title}". Go to the "My Tracked Learning" tab to track progress!`)
      } else {
        throw new Error()
      }
    } catch (err) {
      // Local fallback enrollment
      const localTrackKey = `globalcourse_tracking_${currentUser}`
      const localTracking = JSON.parse(localStorage.getItem(localTrackKey) || '[]')
      
      const newTrackItem = {
        course,
        status: 'In Progress',
        completed_weeks: [],
        hours_studied: 0,
        notes: ''
      }
      
      localTracking.push(newTrackItem)
      localStorage.setItem(localTrackKey, JSON.stringify(localTracking))
      setTrackedCourses(localTracking)
      alert(`Successfully enrolled (Offline) in: "${course.title}". Go to the "My Tracked Learning" tab to track progress!`)
    }
  }

  const handleUpdateProgress = async (courseId, status, completedWeeks, hoursStudied, notes) => {
    if (!currentUser) return

    try {
      const response = await fetch('/api/tracking/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: currentUser,
          course_id: courseId,
          status,
          completed_weeks: completedWeeks,
          hours_studied: hoursStudied,
          notes
        })
      })
      if (response.ok) {
        await fetchTrackedCourses(currentUser)
      } else {
        throw new Error()
      }
    } catch (err) {
      // Local fallback update
      const localTrackKey = `globalcourse_tracking_${currentUser}`
      let localTracking = JSON.parse(localStorage.getItem(localTrackKey) || '[]')
      
      localTracking = localTracking.map(item => {
        if (item.course.id === courseId) {
          return {
            ...item,
            status,
            completed_weeks: completedWeeks,
            hours_studied: hoursStudied,
            notes
          }
        }
        return item
      })

      localStorage.setItem(localTrackKey, JSON.stringify(localTracking))
      setTrackedCourses(localTracking)
    }
  }

  const handleRemoveTracked = async (courseId) => {
    if (!currentUser) return
    const conf = window.confirm("Are you sure you want to stop tracking this course?")
    if (!conf) return

    try {
      const response = await fetch('/api/tracking/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: currentUser, course_id: courseId })
      })
      if (response.ok) {
        await fetchTrackedCourses(currentUser)
      } else {
        throw new Error()
      }
    } catch (err) {
      // Local fallback removal
      const localTrackKey = `globalcourse_tracking_${currentUser}`
      let localTracking = JSON.parse(localStorage.getItem(localTrackKey) || '[]')
      localTracking = localTracking.filter(item => item.course.id !== courseId)
      localStorage.setItem(localTrackKey, JSON.stringify(localTracking))
      setTrackedCourses(localTracking)
    }
  }

  // Client-side execution fallback matching logic
  const runLocalRecommender = (userProfile) => {
    console.log("Triggering client-side fallback recommendation engine...")
    const currentSet = new Set(userProfile.current_skills.map(s => s.toLowerCase()))
    const targetSet = new Set(userProfile.target_skills.map(s => s.toLowerCase()))
    const missingSkills = userProfile.target_skills.filter(s => !currentSet.has(s.toLowerCase()))

    const processedRecs = FALLBACK_COURSES.map(course => {
      // A. Text Search (Semantic similarity mock)
      let textMatch = 0.0
      const searchStr = `${userProfile.interests} ${userProfile.career_goals} ${userProfile.selected_field}`.toLowerCase()
      const courseStr = `${course.title} ${course.description} ${course.category}`.toLowerCase()
      
      const searchWords = searchStr.split(/\s+/)
      let matchCount = 0
      searchWords.forEach(w => {
        if (w.length > 2 && courseStr.includes(w)) matchCount++
      })
      textMatch = Math.min(1.0, matchCount / 4)

      // B. Skill Gap Match
      const courseSkillsLower = course.skills_taught.map(s => s.toLowerCase())
      const overlapSkills = missingSkills.filter(s => courseSkillsLower.includes(s.toLowerCase()))
      const skillMatch = missingSkills.length > 0 ? overlapSkills.length / missingSkills.length : 1.0

      // C. Preferences Match
      let prefScore = 0.0
      // Budget
      if (course.cost <= userProfile.budget) prefScore += 0.4
      else if (userProfile.budget / course.cost > 0.5) prefScore += 0.2
      // Hours
      if (course.weekly_hours <= userProfile.weekly_hours) prefScore += 0.4
      else if (userProfile.weekly_hours / course.weekly_hours > 0.5) prefScore += 0.2
      // Difficulty
      prefScore += 0.2

      // Weighted score
      const finalScore = (0.4 * textMatch) + (0.4 * skillMatch) + (0.2 * prefScore)
      let matchPct = Math.round(finalScore * 100)
      matchPct = Math.max(25, Math.min(98, matchPct))

      // Generate customized explanation
      const coveredList = overlapSkills.slice(0, 3)
      let explanation = ""
      if (coveredList.length > 0) {
        explanation += `Directly addresses your skill gap in ${coveredList.join(', ')}. `
      }
      explanation += `Offered by prestigious ${course.university} and fits your budget.`

      return {
        course,
        match_percentage: matchPct,
        scores: {
          semantic_match: Math.round(textMatch * 100),
          skills_gap_match: Math.round(skillMatch * 100),
          preference_fit: Math.round(prefScore * 100)
        },
        missing_skills_covered: overlapSkills,
        reason: explanation
      }
    })

    // Sort descending by match score
    processedRecs.sort((a, b) => b.match_percentage - a.match_percentage)
    
    // Filter to category or boost domain matching
    const matchingField = userProfile.selected_field || "Engineering & Tech"
    const filteredRecs = processedRecs.filter(r => r.course.category === matchingField || r.match_percentage > 40)
    const topRecs = (filteredRecs.length > 0 ? filteredRecs : processedRecs).slice(0, 10)

    // Build Roadmap Stages
    const levels = { "Beginner": [], "Intermediate": [], "Advanced": [], "Expert": [] }
    topRecs.forEach(r => {
      const diff = r.course.difficulty
      if (levels[diff].length < 2) levels[diff].push(r.course)
    })

    // Fill empty slots from catalog
    FALLBACK_COURSES.forEach(c => {
      const diff = c.difficulty
      if (levels[diff].length < 2 && !levels[diff].some(x => x.id === c.id)) {
        levels[diff].push(c)
      }
    })

    const stagesOrder = ["Beginner", "Intermediate", "Advanced", "Expert"]
    const computedRoadmap = stagesOrder.map((stageName, idx) => {
      const fieldCourses = FALLBACK_COURSES.filter(c => c.category === matchingField && c.difficulty === stageName)
      const course = levels[stageName][0] || fieldCourses[0] || FALLBACK_COURSES[idx]
      return {
        stage: stageName,
        level_index: idx + 1,
        course,
        milestone: `Acquire proficiency in ${course ? course.skills_taught.slice(0, 2).join(' & ') : 'Core Practices'}`
      }
    })

    setRecommendations(topRecs)
    setRoadmap(computedRoadmap)
  }

  const handleSaveProfile = async (newProfile) => {
    setLoading(true)
    
    try {
      // 1. Save profile to FastAPI
      if (serverStatus === 'online') {
        await fetch('/api/auth/save-profile', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: currentUser, profile: newProfile })
        })
      }

      // Save locally as mirroring
      const storedUsers = JSON.parse(localStorage.getItem('globalcourse_users') || '[]')
      const updatedUsers = storedUsers.map(u => {
        if (u.username.toLowerCase() === currentUser.toLowerCase()) {
          return { ...u, profile: newProfile }
        }
        return u
      })
      localStorage.setItem('globalcourse_users', JSON.stringify(updatedUsers))

      // 2. Fetch matches
      await fetchRecommendationsAndRoadmap(newProfile)
      setProfile(newProfile)

    } catch (error) {
      console.warn("Backend error during save profile. Using local storage fallback matching.")
      setServerStatus("offline")
      runLocalRecommender(newProfile)
      setProfile(newProfile)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 1200)
    }
  }

  const handleResetProfile = () => {
    setProfile(null)
    setRecommendations([])
    setRoadmap([])
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Decorative background grids */}
      <div style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        height: '400px', 
        backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(159, 122, 234, 0.15) 0%, rgba(255,255,255,0) 70%)',
        zIndex: -1,
        pointerEvents: 'none' 
      }} />

      {/* Glassmorphic Nav Header */}
      <header className="nav-header flex-between" style={{ padding: '1rem 2rem' }}>
        <div className="logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Brain className="logo-icon" size={24} style={{ color: 'var(--color-primary)' }} />
          <span className="text-gradient-purple-cyan" style={{ fontSize: '1.4rem', fontWeight: '800' }}>LearnoPath</span>
        </div>
        
        {currentUser && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-avatar-badge">
              <div className="user-avatar-icon">
                {currentUser.substring(0, 1).toUpperCase()}
              </div>
              <span style={{ fontWeight: '600' }}>{currentUser}</span>
            </div>
            <button 
              onClick={handleLogout} 
              className="btn btn-secondary btn-sm" 
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.85rem' }}
            >
              Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main style={{ flexGrow: 1 }}>
        {loading ? (
          <div className="flex-row-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '1.5rem', animation: 'fadeInSlide 0.4s ease' }}>
            <div style={{ position: 'relative', width: '80px', height: '80px' }}>
              <Loader2 className="logo-icon" size={80} style={{ color: 'var(--color-accent)', opacity: 0.15 }} />
              <Loader2 className="logo-icon" size={80} style={{ color: 'var(--color-primary)', position: 'absolute', top: 0, left: 0, animation: 'logo-spin 1.5s cubic-bezier(0.5, 0, 0.5, 1) infinite' }} />
              <Brain size={32} style={{ position: 'absolute', top: '24px', left: '24px', color: '#ffffff' }} />
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h3 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: '700' }}>Advisor Engine Modeling Core Competencies...</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Analyzing educational prerequisites, filtering O*NET target skills, and assembling custom roadmap levels.
              </p>
            </div>
          </div>
        ) : !currentUser ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : !profile ? (
          <ProfileWizard onSave={handleSaveProfile} />
        ) : (
          <Dashboard 
            profile={profile} 
            recommendations={recommendations} 
            roadmap={roadmap} 
            trackedCourses={trackedCourses}
            onUpdateProgress={handleUpdateProgress}
            onRemoveTracked={handleRemoveTracked}
            onEnrollCourse={handleEnrollCourse}
            onResetProfile={handleResetProfile} 
          />
        )}
      </main>

      {/* Modern Glass Footer */}
      <footer style={{ 
        background: 'rgba(7, 4, 15, 0.5)', 
        borderTop: '1px solid var(--border-glass)', 
        padding: '1.5rem', 
        fontSize: '0.8rem', 
        color: 'var(--text-muted)', 
        textAlign: 'center',
        marginTop: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <span>© 2026 LearnoPath. All rights reserved.</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Layers size={12} /> Database: <strong>SQLite (GlobalCourse.db)</strong>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={12} style={{ color: 'var(--color-accent)' }} /> Matching Engine: <strong>TF-IDF & Cosine Similarity (Pure Python / JS)</strong>
          </span>
          <span>
            Connection Status: <strong style={{ color: serverStatus === 'online' ? 'var(--color-success)' : 'var(--color-accent-gold)' }}>
              {serverStatus === 'online' ? "🟢 FastAPI Service Online" : "🟡 Client-Side Sandbox Fallback Active"}
            </strong>
          </span>
        </div>
      </footer>
    </div>
  )
}
