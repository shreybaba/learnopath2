import React, { useState } from 'react'
import { Sparkles, Brain, Lock, User, UserPlus, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react'

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)
    const payload = { username: username.trim(), password: password.trim() }

    try {
      if (isRegister) {
        // REGISTER FLOW
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        if (response.ok) {
          setSuccessMsg('Account created successfully! Switching to Login...')
          setTimeout(() => {
            setIsRegister(false)
            setPassword('')
            setError('')
            setSuccessMsg('')
          }, 1500)
        } else {
          throw new Error(data.detail || 'Registration failed')
        }
      } else {
        // LOGIN FLOW
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        const data = await response.json()
        if (response.ok) {
          onLoginSuccess(data.username, data.profile)
        } else {
          throw new Error(data.detail || 'Login failed')
        }
      }
    } catch (err) {
      console.warn("Backend authentication API is offline or returned an error. Using offline localStorage fallback:", err.message)
      
      // OFFLINE LOCALSTORAGE FALLBACK
      const storedUsers = JSON.parse(localStorage.getItem('globalcourse_users') || '[]')
      
      if (isRegister) {
        const exists = storedUsers.some(u => u.username.toLowerCase() === username.trim().toLowerCase())
        if (exists) {
          setError('Username already exists in offline storage.')
        } else {
          storedUsers.push({ username: username.trim(), password: password.trim(), profile: null })
          localStorage.setItem('globalcourse_users', JSON.stringify(storedUsers))
          setSuccessMsg('Account created successfully (Offline Sandbox)! Switching to Login...')
          setTimeout(() => {
            setIsRegister(false)
            setPassword('')
            setError('')
            setSuccessMsg('')
          }, 1500)
        }
      } else {
        const matchedUser = storedUsers.find(
          u => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password.trim()
        )
        if (matchedUser) {
          onLoginSuccess(matchedUser.username, matchedUser.profile)
        } else if (username.trim().toLowerCase() === 'guest') {
          // Allow simple 'guest' login with no password for convenience
          onLoginSuccess('guest', null)
        } else {
          setError('Invalid username or password (Offline Sandbox).')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleGuestLogin = () => {
    onLoginSuccess('GuestSession', null)
  }

  return (
    <div className="login-wrap">
      <div className="glass-panel glow-purple login-card" style={{ padding: '2.5rem 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="flex-row-center" style={{ gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ background: 'rgba(159, 122, 234, 0.15)', padding: '0.5rem', borderRadius: '10px', color: 'var(--color-primary)' }}>
              <Brain size={28} />
            </div>
            <h2 className="text-gradient-purple-cyan" style={{ fontSize: '1.8rem', fontWeight: '800' }}>LearnoPath</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {isRegister ? 'Create your elite academic account' : 'Log in to access your custom learning pathways'}
          </p>
        </div>

        {error && (
          <div className="alert-box" style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', color: '#fee2e2', marginBottom: '1.25rem', padding: '0.75rem 1rem' }}>
            <span style={{ fontSize: '0.8rem' }}>⚠️ {error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-box" style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', color: '#d1fae5', marginBottom: '1.25rem', padding: '0.75rem 1rem' }}>
            <span style={{ fontSize: '0.8rem' }}>🟢 {successMsg}</span>
          </div>
        )}

        <div className="login-tabs">
          <button 
            type="button" 
            className={`login-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(false); setError(''); setSuccessMsg(''); }}
          >
            Log In
          </button>
          <button 
            type="button" 
            className={`login-tab ${isRegister ? 'active' : ''}`}
            onClick={() => { setIsRegister(true); setError(''); setSuccessMsg(''); }}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              <User size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> 
              Username
            </label>
            <input 
              type="text" 
              id="username" 
              className="form-input" 
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">
              <Lock size={14} style={{ verticalAlign: 'middle', marginRight: '0.35rem' }} /> 
              Password
            </label>
            <input 
              type="password" 
              id="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}
            disabled={loading}
          >
            {loading ? (
              'Authenticating...'
            ) : isRegister ? (
              <>Create Account <UserPlus size={16} /></>
            ) : (
              <>Sign In <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '1.5rem 0 0.5rem 0' }}>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', flexGrow: 1 }} />
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0.75rem' }}>OR</span>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', flexGrow: 1 }} />
        </div>

        <button 
          onClick={handleGuestLogin} 
          className="btn btn-secondary" 
          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.75rem' }}
          disabled={loading}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  )
}
