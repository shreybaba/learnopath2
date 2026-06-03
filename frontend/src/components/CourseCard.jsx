import React, { useState } from 'react'
import { Star, Clock, Award, ExternalLink, ChevronDown, ChevronUp, CheckCircle, BarChart3, Plus, Check } from 'lucide-react'

export default function CourseCard({ recommendation, onAddToCompare, isCompared, onEnrollCourse, isEnrolled }) {
  const [expanded, setExpanded] = useState(false)
  const { course, match_percentage, scores, reason, missing_skills_covered } = recommendation

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'Beginner': return '#10b981'  // Emerald
      case 'Intermediate': return '#38bdf8'  // Cyan
      case 'Advanced': return '#f59e0b'  // Amber
      case 'Expert': return '#ef4444'  // Rose
      default: return '#9ca3af'
    }
  }

  const getMatchColorClass = (pct) => {
    if (pct >= 90) return 'linear-gradient(135deg, #10b981 0%, #38bdf8 100%)' // Green-Cyan
    if (pct >= 75) return 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)' // Purple-Cyan
    return 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)' // Orange-Red
  }

  const getCategoryClass = (category) => {
    const cat = category.toLowerCase()
    if (cat.includes('ai') || cat.includes('software') || cat.includes('tech') || cat.includes('cloud')) return 'category-tech'
    if (cat.includes('medical') || cat.includes('health') || cat.includes('bio')) return 'category-medical'
    if (cat.includes('law') || cat.includes('legal')) return 'category-law'
    if (cat.includes('psychology') || cat.includes('behavioral')) return 'category-psychology'
    return 'category-tech'
  }

  return (
    <div className="glass-panel glass-panel-hover shimmer" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Upper info row */}
      <div className="flex-between" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              fontSize: '0.7rem', 
              fontWeight: '600', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em', 
              color: 'var(--text-secondary)',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px'
            }}
          >
            {course.university}
          </span>
          <span className={`category-badge ${getCategoryClass(course.category)}`} style={{ fontSize: '0.65rem' }}>
            {course.category}
          </span>
        </div>
        
        {/* Match Percentage Badge */}
        <div 
          style={{ 
            background: getMatchColorClass(match_percentage),
            color: '#ffffff',
            fontWeight: '800',
            fontSize: '0.85rem',
            padding: '0.35rem 0.75rem',
            borderRadius: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}
        >
          {match_percentage}% Match
        </div>
      </div>

      <h3 style={{ fontSize: '1.2rem', lineHeight: '1.4', marginBottom: '0.5rem', color: '#ffffff' }}>{course.title}</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Instructed by: <span style={{ color: '#ffffff' }}>{course.instructor}</span></p>

      {/* Primary specs grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '0.75rem 0', margin: '0.5rem 0 1rem 0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>COST</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '700', color: course.cost === 0 ? 'var(--color-success)' : '#ffffff' }}>
            {course.cost === 0 ? "FREE" : `$${course.cost}`}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DURATION</span>
          <span style={{ fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Clock size={12} style={{ color: 'var(--text-secondary)' }} /> {course.duration_weeks} wks
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DIFFICULTY</span>
          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: getDifficultyColor(course.difficulty) }}>
            {course.difficulty}
          </span>
        </div>
      </div>

      {/* Snippet text */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineBreak: 'auto', flexGrow: 1, marginBottom: '1.25rem' }}>
        {course.description.substring(0, 110)}...
      </p>

      {/* Custom matching explanation */}
      <div 
        style={{ 
          background: 'rgba(255, 255, 255, 0.02)', 
          borderLeft: '2.5px solid var(--color-accent)', 
          padding: '0.65rem 0.85rem', 
          borderRadius: '0 6px 6px 0', 
          fontSize: '0.8rem', 
          color: 'var(--text-primary)',
          marginBottom: '1.25rem'
        }}
      >
        <span style={{ color: 'var(--color-accent)', fontWeight: '600' }}>Advisor Note:</span> {reason}
      </div>

      {/* Interactive Expand Details toggler */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', marginTop: '0.5rem', marginBottom: '1rem', animation: 'fadeInSlide 0.3s ease' }}>
          {/* Subscores Analytics */}
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <BarChart3 size={12} /> ALGORITHM SUBSCORES BREAKDOWN
            </h5>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.75rem' }}>
              <div>
                <div className="flex-between" style={{ marginBottom: '0.15rem' }}>
                  <span>Semantic Vector Match</span>
                  <span style={{ color: 'var(--color-primary-light)' }}>{scores.semantic_match}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--color-primary)', height: '100%', width: `${scores.semantic_match}%` }} />
                </div>
              </div>

              <div>
                <div className="flex-between" style={{ marginBottom: '0.15rem' }}>
                  <span>Competency / Skill-Gap Coverage</span>
                  <span style={{ color: 'var(--color-accent)' }}>{scores.skills_gap_match}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--color-accent)', height: '100%', width: `${scores.skills_gap_match}%` }} />
                </div>
              </div>

              <div>
                <div className="flex-between" style={{ marginBottom: '0.15rem' }}>
                  <span>Preference Compliance (Budget & Time)</span>
                  <span style={{ color: 'var(--color-success)' }}>{scores.preference_fit}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', height: '4px', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ background: 'var(--color-success)', height: '100%', width: `${scores.preference_fit}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Covered gaps pills */}
          {missing_skills_covered && missing_skills_covered.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>RESOLVED SKILL GAPS</h5>
              <div className="skills-pill-container">
                {missing_skills_covered.map(gap => (
                  <span key={gap} className="skill-pill selected" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderColor: 'var(--color-success)', color: 'var(--color-success)' }}>
                    <CheckCircle size={10} /> {gap}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full syllabus tags */}
          <div style={{ marginBottom: '1rem' }}>
            <h5 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>FULL COURSE SYLLABUS SKILLS</h5>
            <div className="skills-pill-container">
              {course.skills_taught.map(skill => (
                <span key={skill} className="skill-pill" style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Course Credentials */}
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
            <div style={{ marginBottom: '0.25rem' }}>🎓 Institution: <strong>{course.university}</strong></div>
            <div style={{ marginBottom: '0.25rem' }}>🛡️ Certificate Availability: <strong>{course.certificate ? "Official Academic Certificate" : "Audit Only"}</strong></div>
            <div>📊 Total Core Study Time: <strong>{course.duration_weeks * course.weekly_hours} hours</strong></div>
          </div>
        </div>
      )}

      {/* Toggle expandable button */}
      <button 
        onClick={() => setExpanded(!expanded)} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--text-secondary)', 
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.25rem',
          fontSize: '0.8rem',
          margin: '0 auto 1rem auto',
          fontWeight: '500'
        }}
      >
        {expanded ? (
          <>Hide Syllabus Specs <ChevronUp size={14} /></>
        ) : (
          <>View Full Syllabus Specs <ChevronDown size={14} /></>
        )}
      </button>

      {/* Action triggers */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', flexWrap: 'wrap' }}>
        <button 
          onClick={() => onAddToCompare(course)} 
          className="btn btn-secondary"
          style={{ flex: '1 1 30%', padding: '0.6rem 0.8rem', fontSize: '0.85rem', justifyContent: 'center' }}
        >
          {isCompared ? <Check size={14} style={{ color: 'var(--color-accent)' }} /> : <Plus size={14} />} 
          {isCompared ? "Added" : "Compare"}
        </button>
        
        <button
          onClick={() => onEnrollCourse(course)}
          className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
          style={{ flex: '1 1 50%', padding: '0.6rem 1rem', fontSize: '0.85rem', justifyContent: 'center' }}
          disabled={isEnrolled}
        >
          {isEnrolled ? (
            <><Check size={14} style={{ color: 'var(--color-success)', marginRight: '0.2rem' }} /> Tracked</>
          ) : (
            'Enroll & Track'
          )}
        </button>

        <a 
          href={course.url || "https://online.stanford.edu"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ padding: '0.6rem 0.85rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          title="Go to official course material"
        >
          <ExternalLink size={14} />
        </a>
      </div>
    </div>
  )
}
