import React, { useState } from 'react'
import { 
  BookOpen, Award, Compass, DollarSign, Clock, Check, ChevronRight, ChevronLeft, 
  Brain, Cpu, Shield, PanelsTopLeft, Activity, Heart, Globe, Building, Scale, 
  FileSignature, Users, HeartHandshake, BrainCircuit, Stethoscope, GraduationCap 
} from 'lucide-react'

const FIELD_SUGGESTED_SKILLS = {
  "Engineering & Tech": [
    "Python", "JavaScript", "HTML/CSS", "SQL", "Java", "C++", "C", "Figma", 
    "Git", "Data Analysis", "Basic Math", "Project Management", "UI Design", "Public Speaking"
  ],
  "Medicine & Health Sciences": [
    "Clinical Informatics", "Health Info Systems", "EHR Systems", "Epidemiology", 
    "Biostatistics", "Patient Care", "Bioethics", "Anatomy & Physiology", 
    "Clinical Research", "Data Science", "Outbreak Investigation", "Healthcare Administration", "Health Policy"
  ],
  "Law & Legal Studies": [
    "Constitutional Law", "Intellectual Property", "Copyright Law", "Patent Law", 
    "Corporate Governance", "Compliance Risk", "Legal Writing", "Contract Drafting", 
    "Legal Tech", "Smart Contracts", "Contract Analysis", "E-Discovery", "Dispute Resolution"
  ],
  "Psychology & Behavioral Sciences": [
    "General Psychology", "Behavioral Analysis", "Cognitive Psychology", "Counseling Techniques", 
    "Cognitive Behavioral Therapy", "Social Psychology", "Neuroscience", 
    "Mental Health Assessment", "Research Methods", "Group Dynamics", "Persuasion", "Cognition"
  ]
}

const FIELD_PRESET_CAREERS = {
  "Engineering & Tech": [
    {
      title: "Generative AI & MLOps Architect",
      skills: ["Python", "Deep Learning", "Transformers", "Generative AI", "Large Language Models", "Prompt Engineering", "MLOps", "PyTorch", "Search Algorithms"],
      icon: "Cpu",
      interests: "Machine Learning, Artificial Intelligence, Neural Networks, Generative AI models, training LLMs"
    },
    {
      title: "Full-Stack Software & Cloud Engineer",
      skills: ["JavaScript", "React", "Next.js", "Python", "SQL", "PostgreSQL", "RESTful APIs", "Docker", "AWS Services", "Google Cloud Platform"],
      icon: "PanelsTopLeft",
      interests: "Web application development, database design, API engineering, cloud servers, containerized apps"
    },
    {
      title: "Enterprise Cybersecurity Architect",
      skills: ["Cybersecurity", "Network Security", "Cryptography", "Penetration Testing", "Ethical Hacking", "Vulnerability Assessment", "Firewall Settings", "SSL/TLS"],
      icon: "Shield",
      interests: "Security operations, network defense protocols, finding security vulnerabilities, ethical hacking, cryptographic methods"
    },
    {
      title: "AI Product Manager & Startup Lead",
      skills: ["Product Management", "AI Lifecycle", "User Research", "Agile Roadmap", "Design Thinking", "Tech Entrepreneurship", "ML Ethics", "Figma"],
      icon: "Brain",
      interests: "Managing tech teams, market fit validation, UI/UX prototyping, scaling software startups, product lifecycle management"
    }
  ],
  "Medicine & Health Sciences": [
    {
      title: "Health Informatics Specialist",
      skills: ["Clinical Informatics", "EHR Systems", "Health Information Systems", "Biostatistics", "Digital Health", "Clinical Data Analysis"],
      icon: "Activity",
      interests: "Integrating clinical workflows with databases, Electronic Health Records (EHR) administration, biostatistics dashboards"
    },
    {
      title: "Clinical Research Coordinator",
      skills: ["Clinical Research", "Biostatistics", "Epidemiology", "Data Collection", "Clinical Trials", "AI in Healthcare", "Bioethics"],
      icon: "Heart",
      interests: "Managing clinical trials, research data management, biomedical ethics review, public health statistics"
    },
    {
      title: "Public Health Officer",
      skills: ["Public Health", "Epidemiology", "Outbreak Investigation", "Healthcare Administration", "Health Policy"],
      icon: "Globe",
      interests: "Public health campaign design, epidemiological surveillance, infectious outbreak containment, health policies"
    }
  ],
  "Law & Legal Studies": [
    {
      title: "Corporate Compliance & Risk Officer",
      skills: ["Corporate Compliance", "Governance Standards", "Risk Management", "Financial Regulations", "Business Ethics", "Legal Writing"],
      icon: "Building",
      interests: "Corporate risk evaluation, audit reports, regulatory compliance, legal liability protection"
    },
    {
      title: "Legal Technology Architect",
      skills: ["Legal Tech", "Smart Contracts", "Contract Analysis", "Automated Document Review", "E-Discovery"],
      icon: "Scale",
      interests: "Automated legal drafting, contract intelligence modeling, document extraction pipelines, e-discovery platforms"
    },
    {
      title: "Intellectual Property Specialist",
      skills: ["Intellectual Property", "Patent Law", "Copyright Law", "Trademark Protections", "Legal Tech"],
      icon: "FileSignature",
      interests: "Copyright filings, patent searches, licensing agreement reviews, trademark disputes"
    }
  ],
  "Psychology & Behavioral Sciences": [
    {
      title: "Clinical Psychotherapist & Counselor",
      skills: ["Clinical Psychology", "Psychiatric Diagnoses", "Counseling Techniques", "Cognitive Behavioral Therapy", "Mental Health Assessment", "General Psychology"],
      icon: "HeartHandshake",
      interests: "Behavioral health assessments, cognitive counseling, trauma-informed therapy, psychotherapeutic interventions"
    },
    {
      title: "Cognitive Neuroscientist",
      skills: ["Cognitive Psychology", "Behavioral Neuroscience", "Brain Anatomy", "Attention & Memory", "Problem-Solving", "Neuroscience"],
      icon: "BrainCircuit",
      interests: "Brain mapping experiments, cognitive research studies, functional MRI diagnostics, sensory circuit modeling"
    },
    {
      title: "Industrial & Organizational Psychologist",
      skills: ["Social Psychology", "Group Dynamics", "Persuasion", "Human Interaction", "Interpersonal Relationships", "Behavioral Analysis"],
      icon: "Users",
      interests: "Workplace dynamics optimization, user focus groups, consumer behavior analysis, communication persuasion strategies"
    }
  ]
}

const IconMap = {
  Cpu, PanelsTopLeft, Shield, Brain, Activity, Heart, Globe, Building, Scale, FileSignature, HeartHandshake, BrainCircuit, Users, Stethoscope
}

export default function ProfileWizard({ onSave }) {
  const [step, setStep] = useState(0)
  
  // Profile State
  const [selectedField, setSelectedField] = useState("Engineering & Tech")
  const [education, setEducation] = useState("Bachelor's Student")
  const [currentSkills, setCurrentSkills] = useState([])
  const [customSkillInput, setCustomSkillInput] = useState("")
  const [careerGoals, setCareerGoals] = useState("")
  const [targetSkills, setTargetSkills] = useState([])
  const [customTargetSkillInput, setCustomTargetSkillInput] = useState("")
  const [budget, setBudget] = useState(250)
  const [weeklyHours, setWeeklyHours] = useState(10)
  const [learningStyle, setLearningStyle] = useState("Self-Paced")
  const [interests, setInterests] = useState("")

  // Steps handling
  const nextStep = () => setStep(prev => Math.min(3, prev + 1))
  const prevStep = () => setStep(prev => Math.max(0, prev - 1))

  // Field change handler
  const handleFieldChange = (field) => {
    setSelectedField(field)
    setCurrentSkills([])
    setCareerGoals("")
    setTargetSkills([])
    setInterests("")
  }

  // Preset selection handler
  const selectPresetCareer = (preset) => {
    setCareerGoals(preset.title)
    setTargetSkills(preset.skills)
    setInterests(preset.interests)
  }

  // Toggle skills selections
  const toggleSkill = (skill, isTarget = false) => {
    const list = isTarget ? targetSkills : currentSkills
    const setList = isTarget ? setTargetSkills : setCurrentSkills
    
    if (list.includes(skill)) {
      setList(list.filter(s => s !== skill))
    } else {
      setList([...list, skill])
    }
  }

  // Custom skills additions
  const addCustomSkill = (isTarget = false) => {
    const input = isTarget ? customTargetSkillInput : customSkillInput
    const setInput = isTarget ? setCustomTargetSkillInput : setCustomSkillInput
    const list = isTarget ? targetSkills : currentSkills
    const setList = isTarget ? setTargetSkills : setCurrentSkills

    if (input.trim() && !list.includes(input.trim())) {
      setList([...list, input.trim()])
      setInput("")
    }
  }

  // Handle final submission
  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      selected_field: selectedField,
      educational_background: education,
      current_skills: currentSkills,
      career_goals: careerGoals,
      target_skills: targetSkills,
      budget: parseFloat(budget),
      weekly_hours: parseFloat(weeklyHours),
      learning_style: learningStyle,
      interests: interests || `Fulfill career goal as a ${careerGoals} in the field of ${selectedField}`
    })
  }

  const suggestedSkills = FIELD_SUGGESTED_SKILLS[selectedField] || FIELD_SUGGESTED_SKILLS["Engineering & Tech"]
  const presetCareers = FIELD_PRESET_CAREERS[selectedField] || FIELD_PRESET_CAREERS["Engineering & Tech"]

  return (
    <div className="wizard-container">
      {/* Step Progress Tracker */}
      <div className="wizard-progress">
        <div 
          className="wizard-progress-bar" 
          style={{ width: `${(step / 3) * 100}%` }}
        />
        <div className={`wizard-step-node ${step >= 0 ? 'completed' : ''} ${step === 0 ? 'active' : ''}`}>
          {step > 0 ? <Check size={18} /> : 0}
        </div>
        <div className={`wizard-step-node ${step >= 1 ? 'completed' : ''} ${step === 1 ? 'active' : ''}`}>
          {step > 1 ? <Check size={18} /> : 1}
        </div>
        <div className={`wizard-step-node ${step >= 2 ? 'completed' : ''} ${step === 2 ? 'active' : ''}`}>
          {step > 2 ? <Check size={18} /> : 2}
        </div>
        <div className={`wizard-step-node ${step === 3 ? 'completed' : ''} ${step === 3 ? 'active' : ''}`}>
          3
        </div>
      </div>

      <div className="glass-panel glow-purple wizard-card">
        {step === 0 && (
          <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Choose Your Core Discipline</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Select your primary professional domain to load relevant skills, career templates, and academic modules.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
              <div 
                className={`glass-panel glass-panel-hover ${selectedField === 'Engineering & Tech' ? 'glow-cyan' : ''}`}
                style={{ cursor: 'pointer', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                onClick={() => handleFieldChange('Engineering & Tech')}
              >
                <div style={{ color: selectedField === 'Engineering & Tech' ? 'var(--color-accent)' : 'var(--color-primary)' }}>
                  <Cpu size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>Engineering & Tech</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Software, artificial intelligence, cybersecurity, cloud architecture, and design.</p>
              </div>

              <div 
                className={`glass-panel glass-panel-hover ${selectedField === 'Medicine & Health Sciences' ? 'glow-cyan' : ''}`}
                style={{ cursor: 'pointer', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                onClick={() => handleFieldChange('Medicine & Health Sciences')}
              >
                <div style={{ color: selectedField === 'Medicine & Health Sciences' ? 'var(--color-accent)' : '#ec4899' }}>
                  <Stethoscope size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>Medicine & Health</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Clinical informatics, public health, bioinformatics, epidemiology, and bioethics.</p>
              </div>

              <div 
                className={`glass-panel glass-panel-hover ${selectedField === 'Law & Legal Studies' ? 'glow-cyan' : ''}`}
                style={{ cursor: 'pointer', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                onClick={() => handleFieldChange('Law & Legal Studies')}
              >
                <div style={{ color: selectedField === 'Law & Legal Studies' ? 'var(--color-accent)' : '#eab308' }}>
                  <Scale size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>Law & Legal Studies</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Constitutional law, intellectual property, compliance, contracts, and legal technology.</p>
              </div>

              <div 
                className={`glass-panel glass-panel-hover ${selectedField === 'Psychology & Behavioral Sciences' ? 'glow-cyan' : ''}`}
                style={{ cursor: 'pointer', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
                onClick={() => handleFieldChange('Psychology & Behavioral Sciences')}
              >
                <div style={{ color: selectedField === 'Psychology & Behavioral Sciences' ? 'var(--color-accent)' : '#a855f7' }}>
                  <BrainCircuit size={24} />
                </div>
                <h4 style={{ fontSize: '1.05rem', color: '#ffffff' }}>Psychology & Cognition</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cognitive processes, counseling, psychotherapy, behavioral analysis, and social psychology.</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={nextStep} className="btn btn-primary">
                Configure Framework <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Set Your Learning Framework</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Help us customize course duration, pricing models, and academic difficulty to match your life.</p>
            </div>

            <div className="form-group">
              <label className="form-label"><BookOpen size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Educational Background</label>
              <select className="form-select" value={education} onChange={(e) => setEducation(e.target.value)}>
                <option value="Self-Taught Professional">Self-Taught / Professional Transitioner</option>
                <option value="High School Graduate">High School Graduate / Pre-College</option>
                <option value="Bachelor's Student">Undergraduate / College Student</option>
                <option value="Master's / PhD Scholar">Graduate / Post-Graduate Scholar</option>
              </select>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem', color: 'var(--color-success)' }} /> 
                  Max Budget Limit: <span style={{ color: 'var(--color-success)', fontWeight: '700' }}>${budget === 0 ? "Free Only" : `$${budget}`}</span>
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="1500" 
                  step="25" 
                  value={budget} 
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-success)' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Slide to 0 to only match fully free university materials.</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem', color: 'var(--color-accent)' }} /> 
                  Study Commitment: <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>{weeklyHours}h/week</span>
                </label>
                <input 
                  type="range" 
                  min="2" 
                  max="40" 
                  step="1" 
                  value={weeklyHours} 
                  onChange={(e) => setWeeklyHours(e.target.value)}
                  style={{ width: '100%', accentColor: 'var(--color-accent)' }}
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Determines roadmap speed and course recommendation fit.</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label"><Award size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Preferred Learning Style</label>
              <select className="form-select" value={learningStyle} onChange={(e) => setLearningStyle(e.target.value)}>
                <option value="Self-Paced">Self-Paced / Open Enrollment (Flexible deadlines)</option>
                <option value="Instructor-Led">Instructor-Led (Rigorous syllabus, scheduled exams)</option>
                <option value="Professional Credentials">Verified Professional Certification focus</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
              <button onClick={prevStep} className="btn btn-secondary">
                <ChevronLeft size={18} /> Discipline Selection
              </button>
              <button onClick={nextStep} className="btn btn-primary">
                Configure Skills <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Map Your Existing Skills</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Select what you already know in <strong>{selectedField}</strong>. This constructs your Skill-Gap matching index.</p>
            </div>

            <div className="form-group">
              <label className="form-label">Suggested Skills for {selectedField}</label>
              <div className="skills-pill-container">
                {suggestedSkills.map(skill => (
                  <span 
                    key={skill} 
                    className={`skill-pill ${currentSkills.includes(skill) ? 'selected' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {currentSkills.includes(skill) && <Check size={12} />}
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '1.5rem' }}>
              <label className="form-label">Add Custom Skill</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Clinical data logging, psychological assessments, case analysis..." 
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(false)}
                />
                <button type="button" onClick={() => addCustomSkill(false)} className="btn btn-secondary">Add</button>
              </div>
              
              {currentSkills.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Selected Skills ({currentSkills.length}):</span>
                  <div className="skills-pill-container" style={{ marginTop: '0.5rem' }}>
                    {currentSkills.map(skill => (
                      <span key={skill} className="skill-pill selected" onClick={() => toggleSkill(skill)}>
                        <Check size={12} /> {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button onClick={prevStep} className="btn btn-secondary">
                <ChevronLeft size={18} /> Back
              </button>
              <button onClick={nextStep} className="btn btn-primary">
                Define Career Goal <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <h2 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Define Your Career Destination</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Select a pathway in <strong>{selectedField}</strong> to auto-populate target skills, or input a customized goal.</p>
            </div>

            <div className="form-group">
              <label className="form-label"><Compass size={16} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} /> Expert Career Presets</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', margin: '1rem 0' }}>
                {presetCareers.map(p => {
                  const PresetIcon = IconMap[p.icon] || Brain
                  const isSelected = careerGoals === p.title
                  return (
                    <div 
                      key={p.title} 
                      className={`glass-panel glass-panel-hover ${isSelected ? 'glow-cyan' : ''}`}
                      style={{ cursor: 'pointer', padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}
                      onClick={() => selectPresetCareer(p)}
                    >
                      <div style={{ 
                        background: isSelected ? 'rgba(56, 189, 248, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                        padding: '0.5rem', 
                        borderRadius: '8px', 
                        color: isSelected ? 'var(--color-accent)' : 'var(--color-primary)' 
                      }}>
                        <PresetIcon size={20} />
                      </div>
                      <div style={{ textAlign: 'left' }}>
                        <h4 style={{ fontSize: '0.9rem', color: isSelected ? 'var(--color-accent)' : '#ffffff' }}>{p.title}</h4>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{p.skills.length} core competencies</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Custom Target Career Role / Goal</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g., Clinical trial director, constitutional policy expert..." 
                value={careerGoals}
                onChange={(e) => setCareerGoals(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Skills to Master</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g., Clinical Informatics, IP Law, Psychotherapy..." 
                  value={customTargetSkillInput}
                  onChange={(e) => setCustomTargetSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomSkill(true)}
                />
                <button type="button" onClick={() => addCustomSkill(true)} className="btn btn-secondary">Add</button>
              </div>

              {targetSkills.length > 0 && (
                <div className="skills-pill-container">
                  {targetSkills.map(skill => (
                    <span key={skill} className="skill-pill selected" style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }} onClick={() => toggleSkill(skill, true)}>
                      <Check size={12} /> {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Describe your specific learning focus (Optional)</label>
              <textarea 
                className="form-textarea" 
                rows="3" 
                placeholder="Describe your goals: 'I want to build clinical health databases', 'Transitioning from civil litigation into digital IP law', 'Interested in cognitive counseling methods'..."
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2.5rem' }}>
              <button onClick={prevStep} className="btn btn-secondary">
                <ChevronLeft size={18} /> Back
              </button>
              <button 
                onClick={handleSubmit} 
                className="btn btn-accent"
                disabled={!careerGoals || targetSkills.length === 0}
              >
                Analyze & Generate Dashboard <Compass size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
