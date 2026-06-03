import React, { useState } from 'react'
import { Calendar, CheckCircle2, ChevronDown, ChevronUp, ExternalLink, HelpCircle, Trophy, Check } from 'lucide-react'

export default function LearningRoadmap({ roadmap, onEnrollCourse, trackedCourses }) {
  const [activeStage, setActiveStage] = useState(null)

  if (!roadmap || roadmap.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <HelpCircle size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
        <p style={{ color: 'var(--text-secondary)' }}>No roadmap generated. Complete your onboarding profile first.</p>
      </div>
    )
  }

  const getDifficultyClass = (stage) => {
    switch (stage.toLowerCase()) {
      case 'beginner': return 'beginner'
      case 'intermediate': return 'intermediate'
      case 'advanced': return 'advanced'
      case 'expert': return 'expert'
      default: return ''
    }
  }

  const getLevelColor = (stage) => {
    switch (stage.toLowerCase()) {
      case 'beginner': return 'var(--color-primary)'
      case 'intermediate': return 'var(--color-accent)'
      case 'advanced': return 'var(--color-accent-gold)'
      case 'expert': return 'var(--color-success)'
      default: return '#ffffff'
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(159, 122, 234, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-primary)' }}>
          <Trophy size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Your Personalized AI Learning Roadmap</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>A multi-tiered progressive curriculum curated specifically to bridge your target career skills.</p>
        </div>
      </div>

      <div className="roadmap-timeline">
        {roadmap.map((node, index) => {
          const { stage, level_index, course, milestone } = node
          const isExpanded = activeStage === index
          const color = getLevelColor(stage)
          
          return (
            <div key={stage} className="roadmap-node">
              {/* Colored marker indicator */}
              <div className={`roadmap-dot ${getDifficultyClass(stage)}`} />
              
              <div className="roadmap-content">
                {/* Stage information */}
                <div className="roadmap-stage-label">
                  <span>STAGE 0{level_index}</span>
                  <span style={{ color: color, fontSize: '1.25rem', fontWeight: '800', marginTop: '0.15rem' }}>{stage}</span>
                  
                  {course && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                      <Calendar size={12} /> {course.duration_weeks} Weeks
                    </div>
                  )}
                </div>

                {/* Course specifics card */}
                {course ? (
                  <div 
                    className="glass-panel" 
                    style={{ 
                      padding: '1.25rem', 
                      borderColor: isExpanded ? color : 'var(--border-glass)',
                      boxShadow: isExpanded ? `0 0 15px ${color}1A` : 'var(--shadow-glass)'
                    }}
                  >
                    <div className="flex-between" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.1rem', color: '#ffffff' }}>{course.title}</h4>
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: '600', 
                          color: color, 
                          background: `${color}1A`, 
                          padding: '0.2rem 0.5rem', 
                          borderRadius: '4px',
                          border: `1px solid ${color}33`
                        }}
                      >
                        {course.university}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Instructor: <span style={{ color: '#ffffff' }}>{course.instructor}</span>
                    </p>

                    <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Milestone:</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: '600', background: 'rgba(255,255,255,0.03)', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>
                        🎯 {milestone}
                      </span>
                    </div>

                    {/* Expandable Syllabus Detail Drawer */}
                    {isExpanded && (
                      <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', animation: 'fadeInSlide 0.25s ease' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                          {course.description}
                        </p>
                        
                        <div style={{ marginBottom: '1rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>SKILLS TO ACQUIRE:</span>
                          <div className="skills-pill-container">
                            {course.skills_taught.map(skill => (
                              <span key={skill} className="skill-pill" style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}>
                                <CheckCircle2 size={10} style={{ color: color }} /> {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex-between" style={{ background: 'rgba(255,255,255,0.02)', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <span>Price: <strong style={{ color: course.cost === 0 ? 'var(--color-success)' : '#ffffff' }}>{course.cost === 0 ? 'Free' : `$${course.cost}`}</strong></span>
                          <span>Commitment: <strong>{course.weekly_hours} Hours/Week</strong></span>
                          
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button
                              onClick={() => onEnrollCourse(course)}
                              className="btn btn-primary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: '4px' }}
                              disabled={trackedCourses && trackedCourses.some(t => t.course.id === course.id)}
                            >
                              {trackedCourses && trackedCourses.some(t => t.course.id === course.id) ? (
                                <><Check size={12} style={{ color: 'var(--color-success)', marginRight: '0.2rem' }} /> Tracked</>
                              ) : (
                                'Track Course'
                              )}
                            </button>
                            
                            <a 
                              href={course.url || "https://online.stanford.edu"} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-gradient-purple-cyan" 
                              style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', textDecoration: 'none', fontWeight: '600' }}
                            >
                              Material <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.75rem' }}>
                      <button 
                        onClick={() => setActiveStage(isExpanded ? null : index)}
                        style={{ 
                          background: 'transparent', 
                          border: 'none', 
                          color: 'var(--text-secondary)', 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}
                      >
                        {isExpanded ? (
                          <>Hide Stage Syllabus <ChevronUp size={12} /></>
                        ) : (
                          <>Explore Stage Syllabus <ChevronDown size={12} /></>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel" style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                    No matching course found for this difficulty tier.
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
