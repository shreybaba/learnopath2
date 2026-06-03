import React from 'react'
import { GitCompare, Trash2, ExternalLink, HelpCircle } from 'lucide-react'

export default function CourseComparison({ comparedCourses, onRemoveCourse }) {
  if (!comparedCourses || comparedCourses.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <GitCompare size={48} style={{ color: 'var(--color-primary)', marginBottom: '1rem', animation: 'logo-spin 15s linear infinite' }} />
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#ffffff' }}>Course Comparison Studio</h3>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem' }}>
          Select courses from the <strong>Personalized Recommendations</strong> list using the "Compare" button to analyze their tuition cost, time commitments, and career value side-by-side.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-accent)' }}>
            <GitCompare size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Side-by-Side Course Matrix</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Contrast prestige, time investments, total cost, and career impact before enrolling.</p>
          </div>
        </div>

        {comparedCourses.length > 0 && (
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Comparing {comparedCourses.length} course(s)
          </span>
        )}
      </div>

      <div className="comparison-table-container glass-panel animate-fade-in" style={{ padding: '0', overflowX: 'auto' }}>
        <table className="comparison-table">
          <thead>
            <tr>
              <th style={{ width: '200px' }}>Attribute</th>
              {comparedCourses.map(course => (
                <th key={course.id} style={{ minWidth: '220px' }}>
                  <div className="flex-between" style={{ alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: '700' }}>
                        {course.university}
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '0.15rem', color: '#ffffff' }}>
                        {course.title}
                      </div>
                    </div>
                    <button 
                      onClick={() => onRemoveCourse(course.id)}
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: 'none', 
                        borderRadius: '4px', 
                        color: '#ef4444', 
                        padding: '0.3rem', 
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)'
                      }}
                      title="Remove from comparison"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Instructor</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>{course.instructor}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Tuition / Cost</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>
                  <span 
                    style={{ 
                      fontWeight: '700', 
                      color: course.cost === 0 ? 'var(--color-success)' : '#ffffff' 
                    }}
                  >
                    {course.cost === 0 ? "FREE (Open Access)" : `$${course.cost}`}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Course Duration</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id} style={{ color: 'var(--text-primary)' }}>
                  {course.duration_weeks} Weeks
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Commitment (h/wk)</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>{course.weekly_hours} Hours/Week</td>
              ))}
            </tr>
            <tr>
              <td><strong>Total Study Time</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id} style={{ fontWeight: '600' }}>
                  {course.duration_weeks * course.weekly_hours} Hours Total
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Difficulty Level</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>
                  <span 
                    style={{ 
                      fontWeight: '700', 
                      fontSize: '0.8rem',
                      color: 
                        course.difficulty === 'Beginner' ? 'var(--color-success)' : 
                        course.difficulty === 'Intermediate' ? 'var(--color-accent)' : 
                        course.difficulty === 'Advanced' ? 'var(--color-accent-gold)' : '#ef4444'
                    }}
                  >
                    {course.difficulty}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Verified Certificate</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>
                  {course.certificate ? "✅ Available upon completion" : "❌ Audit only (No certificate)"}
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Prestige Category</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>{course.category}</td>
              ))}
            </tr>
            <tr>
              <td><strong>Core Skills Taught</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>
                  <div className="skills-pill-container" style={{ margin: '0' }}>
                    {course.skills_taught.map(skill => (
                      <span key={skill} className="skill-pill" style={{ fontSize: '0.7rem', padding: '0.2rem 0.45rem' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td><strong>Action</strong></td>
              {comparedCourses.map(course => (
                <td key={course.id}>
                  <a 
                    href={course.url || "https://online.stanford.edu"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    Register Now <ExternalLink size={12} />
                  </a>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
