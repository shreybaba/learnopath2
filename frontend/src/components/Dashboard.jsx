import React, { useState, useEffect } from 'react'
import { Sparkles, GraduationCap, Clock, Award, Compass, RefreshCw, BarChart2, BookMarked, GitCompare, Landmark, HelpCircle, CheckSquare, Square, Check } from 'lucide-react'
import CourseCard from './CourseCard'
import LearningRoadmap from './LearningRoadmap'
import CourseComparison from './CourseComparison'
import CareerOutcome from './CareerOutcome'
import CourseTracker from './CourseTracker'

export default function Dashboard({ 
  profile, 
  recommendations, 
  roadmap, 
  trackedCourses,
  onUpdateProgress,
  onRemoveTracked,
  onEnrollCourse,
  onResetProfile 
}) {
  const [activeTab, setActiveTab] = useState('courses')
  const [comparedCourses, setComparedCourses] = useState([])
  
  // Real-time interactive skill checklist state to dynamically update readiness score
  const [masteredSkills, setMasteredSkills] = useState([])
  const [readinessScore, setReadinessScore] = useState(0)

  // Initialize mastered skills from the user profile on mount/profile change
  // and dynamically update it when tracked courses are completed!
  useEffect(() => {
    if (profile) {
      const baseSkills = profile.current_skills || []
      
      // Extract skills from courses marked "Completed"
      const completedCourseSkills = []
      if (trackedCourses) {
        trackedCourses.forEach(tc => {
          if (tc.status === 'Completed' && tc.course.skills_taught) {
            tc.course.skills_taught.forEach(s => {
              if (!completedCourseSkills.includes(s)) {
                completedCourseSkills.push(s)
              }
            })
          }
        })
      }

      // Merge and remove duplicates
      const merged = [...new Set([...baseSkills, ...completedCourseSkills])]
      setMasteredSkills(merged)
    }
  }, [profile, trackedCourses])

  // Calculate dynamic career readiness score
  useEffect(() => {
    if (!profile || !profile.target_skills || profile.target_skills.length === 0) {
      setReadinessScore(0)
      return
    }
    const targetSet = new Set(profile.target_skills.map(s => s.toLowerCase()))
    const masteredCount = masteredSkills.filter(s => targetSet.has(s.toLowerCase())).length
    
    // Standard starting score is based on current overlap, capped nicely
    const ratio = masteredCount / profile.target_skills.length
    const scoreVal = Math.round(ratio * 100)
    setReadinessScore(Math.max(10, Math.min(100, scoreVal)))
  }, [masteredSkills, profile])

  const toggleMasteredSkill = (skill) => {
    if (masteredSkills.includes(skill)) {
      setMasteredSkills(masteredSkills.filter(s => s !== skill))
    } else {
      setMasteredSkills([...masteredSkills, skill])
    }
  }

  // Comparison logic
  const handleAddToCompare = (course) => {
    const exists = comparedCourses.find(c => c.id === course.id)
    if (exists) {
      // Remove if toggled again
      setComparedCourses(comparedCourses.filter(c => c.id !== course.id))
    } else {
      if (comparedCourses.length >= 3) {
        alert("You can compare up to 3 courses simultaneously.")
        return
      }
      setComparedCourses([...comparedCourses, course])
    }
  }

  const handleRemoveComparedCourse = (courseId) => {
    setComparedCourses(comparedCourses.filter(c => c.id !== courseId))
  }

  // Calculations for stats
  const totalRoadmapCost = roadmap ? roadmap.reduce((sum, node) => sum + (node.course ? node.course.cost : 0), 0) : 0
  const totalRoadmapWeeks = roadmap ? roadmap.reduce((sum, node) => sum + (node.course ? node.course.duration_weeks : 0), 0) : 0
  const monthlyTimeline = Math.ceil(totalRoadmapWeeks / 4.3)

  // Circular SVG ring properties
  const radius = 60
  const stroke = 10
  const normalizedRadius = radius - stroke * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - (readinessScore / 100) * circumference

  return (
    <div className="container" style={{ animation: 'fadeInSlide 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)' }}>
      
      {/* Upper Navigation / Meta telemetry */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="text-gradient-purple-cyan" style={{ fontSize: '2.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={28} /> GlobalCourse AI
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Academic Advisor & Course recommendations tailored for: <strong>{profile.selected_field || 'Engineering & Tech'}</strong>
          </p>
        </div>
        <button onClick={onResetProfile} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
          <RefreshCw size={14} /> Retake Skill Profile
        </button>
      </div>

      {/* Grid of Key Telemetry metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
        
        {/* Readiness circular progress panel */}
        <div className="glass-panel glow-purple" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem' }}>
          
          <div className="readiness-ring-container">
            <svg className="readiness-ring-svg">
              <defs>
                <linearGradient id="purpleCyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--color-primary)" />
                  <stop offset="100%" stopColor="var(--color-accent)" />
                </linearGradient>
              </defs>
              <circle
                className="readiness-ring-bg"
                cx={70}
                cy={70}
                r={normalizedRadius}
              />
              <circle
                className="readiness-ring-fill"
                cx={70}
                cy={70}
                r={normalizedRadius}
                style={{
                  strokeDasharray: `${circumference} ${circumference}`,
                  strokeDashoffset: strokeDashoffset
                }}
              />
            </svg>
            <div className="readiness-val">
              {readinessScore}%
              <span>READY</span>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', color: '#ffffff' }}>Career Readiness</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
              Your composite qualifications index relative to hiring standards for <strong>{profile.career_goals}</strong>.
            </p>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', fontWeight: '600', display: 'block', marginTop: '0.5rem' }}>
              ✦ Finish course checkpoints to automatically master skills!
            </span>
          </div>

        </div>

        {/* Dynamic Interactive Checklist & Budget telemetry */}
        <div className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', padding: '1.5rem' }}>
          
          {/* Real-time skills master checker */}
          <div style={{ borderRight: '1px solid rgba(255,255,255,0.05)', paddingRight: '1.25rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Skills Checklist ({masteredSkills.length} / {profile.target_skills.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '110px', overflowY: 'auto', paddingRight: '0.25rem' }}>
              {profile.target_skills.map(skill => {
                const isMastered = masteredSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())
                return (
                  <div 
                    key={skill} 
                    onClick={() => toggleMasteredSkill(skill)}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      fontSize: '0.8rem', 
                      color: isMastered ? '#ffffff' : 'var(--text-secondary)', 
                      cursor: 'pointer',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {isMastered ? (
                      <CheckSquare size={14} style={{ color: 'var(--color-success)', fill: 'rgba(16, 185, 129, 0.1)' }} />
                    ) : (
                      <Square size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                    <span style={{ textDecoration: isMastered ? 'line-through' : 'none' }}>{skill}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Quick budget, time commitment readout */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                Roadmap Overview
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Landmark size={14} style={{ color: 'var(--color-success)' }} />
                  <span>Cost: <strong style={{ color: 'var(--color-success)' }}>${totalRoadmapCost}</strong> / limit ${profile.budget}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={14} style={{ color: 'var(--color-accent)' }} />
                  <span>Velocity: <strong>{profile.weekly_hours}h/wk</strong> commitment</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <GraduationCap size={14} style={{ color: 'var(--color-primary-light)' }} />
                  <span>Timeline: <strong>{monthlyTimeline} Months</strong> ({totalRoadmapWeeks} wks)</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.03)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              🏫 Dynamic curriculum mapping for {profile.selected_field}
            </div>
          </div>

        </div>

      </div>

      {/* Tabs Header Navigation */}
      <div className="tabs-header">
        <button 
          onClick={() => setActiveTab('courses')} 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
        >
          <BookMarked size={16} /> Course Recommendations
        </button>
        <button 
          onClick={() => setActiveTab('roadmap')} 
          className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
        >
          <Compass size={16} /> Structured Roadmap
        </button>
        <button 
          onClick={() => setActiveTab('tracking')} 
          className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
        >
          <CheckSquare size={16} /> My Tracked Learning ({trackedCourses.length})
        </button>
        <button 
          onClick={() => setActiveTab('compare')} 
          className={`tab-btn ${activeTab === 'compare' ? 'active' : ''}`}
        >
          <GitCompare size={16} /> Course Comparison ({comparedCourses.length})
        </button>
        <button 
          onClick={() => setActiveTab('career')} 
          className={`tab-btn ${activeTab === 'career' ? 'active' : ''}`}
        >
          <BarChart2 size={16} /> Career Projections
        </button>
      </div>

      {/* Tab Panels Content */}
      <div style={{ minHeight: '400px' }}>
        
        {activeTab === 'courses' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Your AI Recommended Course Matches</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                Academic scoring evaluated {recommendations.length} ideal matches based on semantic similarity and budget/time constraints.
              </p>
            </div>
            
            <div className="grid-3">
              {recommendations.map(rec => (
                <CourseCard 
                  key={rec.course.id} 
                  recommendation={rec} 
                  onAddToCompare={handleAddToCompare}
                  isCompared={comparedCourses.some(c => c.id === rec.course.id)}
                  onEnrollCourse={onEnrollCourse}
                  isEnrolled={trackedCourses.some(t => t.course.id === rec.course.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roadmap' && (
          <LearningRoadmap 
            roadmap={roadmap} 
            onEnrollCourse={onEnrollCourse}
            trackedCourses={trackedCourses}
          />
        )}

        {activeTab === 'tracking' && (
          <CourseTracker 
            trackedCourses={trackedCourses}
            onUpdateProgress={onUpdateProgress}
            onRemoveTracked={onRemoveTracked}
          />
        )}

        {activeTab === 'compare' && (
          <CourseComparison 
            comparedCourses={comparedCourses} 
            onRemoveCourse={handleRemoveComparedCourse}
          />
        )}

        {activeTab === 'career' && (
          <CareerOutcome profile={profile} />
        )}

      </div>
      
    </div>
  )
}
