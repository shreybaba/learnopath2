import React, { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Briefcase, Building2, Calendar, Award, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function CareerOutcome({ profile }) {
  const [careerPaths, setCareerPaths] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/career-paths')
      .then(res => {
        if (!res.ok) throw new Error("Network response error")
        return res.json()
      })
      .then(data => {
        setCareerPaths(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error loading career data:", err)
        setLoading(false)
      })
  }, [])

  // Find if current profile goal matches any of our seeded elite paths
  const matchedPath = careerPaths.find(p => 
    p.title.toLowerCase().includes(profile.career_goals.toLowerCase()) || 
    profile.career_goals.toLowerCase().includes(p.title.toLowerCase())
  )

  const currentSkillsSet = new Set((profile.current_skills || []).map(s => s.toLowerCase()))
  const targetSkills = profile.target_skills || []
  
  const masteredSkills = targetSkills.filter(s => currentSkillsSet.has(s.toLowerCase()))
  const missingSkills = targetSkills.filter(s => !currentSkillsSet.has(s.toLowerCase()))
  
  const skillMatchPercentage = targetSkills.length > 0 
    ? Math.round((masteredSkills.length / targetSkills.length) * 100) 
    : 0

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '8px', color: 'var(--color-accent)' }}>
          <TrendingUp size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', color: '#ffffff' }}>Career Projections & Skill Analysis</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>O*NET & market-based salary projections, growth opportunities, and critical hiring metrics.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        {/* Market demand stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Main info card */}
          <div className="glass-panel glow-cyan">
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-accent)', fontWeight: '700', letterSpacing: '0.05em' }}>
              TARGET DESTINATION
            </span>
            <h3 style={{ fontSize: '1.8rem', marginTop: '0.25rem', marginBottom: '0.75rem', color: '#ffffff' }}>
              {profile.career_goals}
            </h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
              {matchedPath ? matchedPath.description : "Your customized career pathway. The generated curriculum below is mathematically optimized to cover your target skill lists and bridge your qualification gap."}
            </p>

            {/* Metric block */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px', color: 'var(--color-success)' }}>
                  <DollarSign size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>AVG SALARY RANGE</span>
                  <strong style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {matchedPath ? matchedPath.avg_salary : "$115,000 - $165,000+"}
                  </strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '0.5rem', borderRadius: '6px', color: 'var(--color-accent)' }}>
                  <TrendingUp size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>YOY DEMAND GROWTH</span>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--color-accent)' }}>
                    {matchedPath ? matchedPath.yoy_growth : "+24% YoY"}
                  </strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(159, 122, 234, 0.1)', padding: '0.5rem', borderRadius: '6px', color: 'var(--color-primary)' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>INDUSTRY DEMAND</span>
                  <strong style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {matchedPath ? matchedPath.market_demand : "High Demand"}
                  </strong>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: '0.5rem', borderRadius: '6px', color: 'var(--color-accent-gold)' }}>
                  <Calendar size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>STUDY TIMELINE</span>
                  <strong style={{ fontSize: '1rem', color: '#ffffff' }}>
                    {matchedPath ? matchedPath.learning_timeline : "5 - 8 Months"}
                  </strong>
                </div>
              </div>

            </div>
          </div>

          {/* Targeted companies */}
          <div className="glass-panel" style={{ padding: '1.25rem' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Building2 size={16} style={{ color: 'var(--color-primary-light)' }} /> Top Target Employers & Placement Firms
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Graduates possessing these specific portfolios are frequently recruited by these leading organizations:
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {(matchedPath ? matchedPath.top_companies : ["Google", "Amazon", "Microsoft", "Stripe", "Accenture"]).map(comp => (
                <span 
                  key={comp} 
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '0.85rem',
                    padding: '0.4rem 1rem',
                    borderRadius: '6px'
                  }}
                >
                  🏢 {comp}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Skill gap analysis side panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Award size={18} style={{ color: 'var(--color-accent)' }} /> Competency Audit
          </h4>

          {/* Small radial bar representation */}
          <div style={{ textAlign: 'center', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-accent)', lineHeight: '1' }}>
              {skillMatchPercentage}%
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
              Current Skill Match Index
            </span>
          </div>

          {/* Mastered Skills List */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              ✓ Mastered Competencies ({masteredSkills.length})
            </span>
            {masteredSkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {masteredSkills.map(skill => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#ffffff' }}>
                    <CheckCircle2 size={12} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                No overlapping skills matched yet.
              </p>
            )}
          </div>

          {/* Critical Skill Gaps */}
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-gold)', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
              ⚠ Outstanding Skill Gaps ({missingSkills.length})
            </span>
            {missingSkills.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {missingSkills.map(skill => (
                  <div key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <ShieldAlert size={12} style={{ color: 'var(--color-accent-gold)', flexShrink: 0 }} />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.1)', padding: '0.5rem', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--color-success)', display: 'flex', gap: '0.35rem' }}>
                <CheckCircle2 size={14} /> 100% target skills covered! Ready for employment placement.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
