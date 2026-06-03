import React, { useState } from 'react'
import { CheckSquare, Square, Clock, BookOpen, Save, Trash2, Calendar, Award } from 'lucide-react'

export default function CourseTracker({ trackedCourses, onUpdateProgress, onRemoveTracked }) {
  const [localNotes, setLocalNotes] = useState({})

  const handleToggleWeek = (courseId, weekNum, currentProgress) => {
    const { status, completed_weeks, hours_studied, notes } = currentProgress
    let newWeeks = [...completed_weeks]
    if (newWeeks.includes(weekNum)) {
      newWeeks = newWeeks.filter(w => w !== weekNum)
    } else {
      newWeeks.push(weekNum)
    }
    
    // Automatically set status to completed if all weeks are checked, or vice versa
    const duration = currentProgress.course.duration_weeks
    let newStatus = status
    if (newWeeks.length === duration && status !== 'Completed') {
      newStatus = 'Completed'
    } else if (newWeeks.length < duration && status === 'Completed') {
      newStatus = 'In Progress'
    }

    onUpdateProgress(courseId, newStatus, newWeeks, hours_studied, notes)
  }

  const handleStatusChange = (courseId, newStatus, currentProgress) => {
    const { completed_weeks, hours_studied, notes } = currentProgress
    onUpdateProgress(courseId, newStatus, completed_weeks, hours_studied, notes)
  }

  const handleHoursChange = (courseId, delta, currentProgress) => {
    const { status, completed_weeks, hours_studied, notes } = currentProgress
    const newHours = Math.max(0, hours_studied + delta)
    onUpdateProgress(courseId, status, completed_weeks, newHours, notes)
  }

  const handleNotesChange = (courseId, text) => {
    setLocalNotes({
      ...localNotes,
      [courseId]: text
    })
  }

  const handleSaveNotes = (courseId, currentProgress) => {
    const { status, completed_weeks, hours_studied } = currentProgress
    const noteText = localNotes[courseId] !== undefined ? localNotes[courseId] : currentProgress.notes
    onUpdateProgress(courseId, status, completed_weeks, hours_studied, noteText)
    alert("Study notes updated and saved successfully!")
  }

  const getCategoryClass = (category) => {
    const cat = category.toLowerCase()
    if (cat.includes('ai') || cat.includes('software') || cat.includes('tech') || cat.includes('cloud')) return 'category-tech'
    if (cat.includes('medical') || cat.includes('health') || cat.includes('bio')) return 'category-medical'
    if (cat.includes('law') || cat.includes('legal')) return 'category-law'
    if (cat.includes('psychology') || cat.includes('behavioral')) return 'category-psychology'
    return 'category-tech'
  }

  if (!trackedCourses || trackedCourses.length === 0) {
    return (
      <div className="glass-panel" style={{ textAlign: 'center', padding: '3.5rem 2rem', marginTop: '1rem' }}>
        <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1.25rem' }} />
        <h3 style={{ fontSize: '1.4rem', color: '#ffffff', marginBottom: '0.5rem' }}>No Tracked Courses Yet</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.9rem', lineHeight: '1.5' }}>
          Start building your learning pathway! Browse the "Course Recommendations" or the "Structured Roadmap" tabs and click "Enroll / Track Course" to begin monitoring your progress.
        </p>
      </div>
    )
  }

  return (
    <div className="tracker-section">
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Active Course Progress Logs</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Manage your course completions, study logs, and custom summaries strictly from your active study sessions.
        </p>
      </div>

      {trackedCourses.map((progress) => {
        const { course, status, completed_weeks, hours_studied, notes } = progress
        const pct = Math.round((completed_weeks.length / course.duration_weeks) * 100)
        
        // Status color configurations
        let statusClass = 'in-progress'
        if (status === 'Completed') statusClass = 'completed'
        if (status === 'On Hold') statusClass = 'on-hold'

        // Notes textarea local value binding
        const noteVal = localNotes[course.id] !== undefined ? localNotes[course.id] : notes

        return (
          <div key={course.id} className="tracker-card shimmer">
            <div className="tracker-header">
              <div className="tracker-title-area">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className={`category-badge ${getCategoryClass(course.category)}`}>
                    {course.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{course.university}</span>
                </div>
                <h3 style={{ marginTop: '0.5rem' }}>{course.title}</h3>
                <p>Lead Instructor: {course.instructor}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <select 
                  className="form-select" 
                  style={{ width: '135px', padding: '0.35rem 0.5rem', fontSize: '0.8rem', height: '32px' }}
                  value={status}
                  onChange={(e) => handleStatusChange(course.id, e.target.value, progress)}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="On Hold">On Hold</option>
                </select>

                <button 
                  onClick={() => onRemoveTracked(course.id)}
                  title="Remove from tracking"
                  style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    border: '1px solid rgba(239, 68, 68, 0.25)', 
                    color: '#f87171',
                    padding: '0.4rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* Dynamic Progress Section */}
            <div className="tracker-progress-wrap">
              <div className="tracker-progress-header">
                <span>Course Completion Status</span>
                <strong style={{ 
                  color: status === 'Completed' ? 'var(--color-success)' : 'var(--color-accent)'
                }}>
                  {pct}% Completed ({completed_weeks.length} / {course.duration_weeks} Weeks)
                </strong>
              </div>
              <div className="tracker-bar-bg">
                <div 
                  className={`tracker-bar-fill ${statusClass}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Expandable Details Grid */}
            <div className="tracker-details-grid">
              {/* Checklist column */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} style={{ color: 'var(--color-accent)' }} /> 
                  Weekly Curriculum Checkpoints
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {Array.from({ length: course.duration_weeks }).map((_, idx) => {
                    const weekNum = idx + 1
                    const isChecked = completed_weeks.includes(weekNum)
                    return (
                      <div 
                        key={weekNum}
                        className={`week-check-row ${isChecked ? 'checked' : ''}`}
                        onClick={() => handleToggleWeek(course.id, weekNum, progress)}
                      >
                        {isChecked ? (
                          <CheckSquare size={16} style={{ color: 'var(--color-success)', fill: 'rgba(16, 185, 129, 0.1)' }} />
                        ) : (
                          <Square size={16} style={{ color: 'var(--text-muted)' }} />
                        )}
                        <span style={{ textDecoration: isChecked ? 'line-through' : 'none' }}>
                          Week 0{weekNum}: Study module curriculum and assignments
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Study Time Logger & Notes column */}
              <div className="notes-input-area">
                <div className="hours-tracker-row">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Clock size={15} style={{ color: 'var(--color-accent-gold)' }} />
                    <span>Time Invested: <strong style={{ color: '#ffffff' }}>{hours_studied} hrs</strong></span>
                  </div>
                  <div className="hours-counter">
                    <button 
                      className="btn-counter" 
                      onClick={() => handleHoursChange(course.id, -1, progress)}
                      disabled={hours_studied <= 0}
                    >
                      -1h
                    </button>
                    <button 
                      className="btn-counter" 
                      onClick={() => handleHoursChange(course.id, 1, progress)}
                    >
                      +1h
                    </button>
                    <button 
                      className="btn-counter" 
                      onClick={() => handleHoursChange(course.id, 5, progress)}
                    >
                      +5h
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Personal Study Summaries & Notes</label>
                  <textarea 
                    className="notes-textarea" 
                    rows="3" 
                    placeholder="Log important insights, equations, or key legal cases from this week's studies..."
                    value={noteVal}
                    onChange={(e) => handleNotesChange(course.id, e.target.value)}
                  />
                  <button 
                    onClick={() => handleSaveNotes(course.id, progress)}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem', alignSelf: 'flex-end', display: 'flex', gap: '0.35rem' }}
                  >
                    <Save size={12} /> Save Study Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
