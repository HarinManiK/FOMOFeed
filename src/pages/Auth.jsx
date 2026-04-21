// src/pages/Auth.jsx
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Auth.module.css'

export default function Auth() {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [loading, setLoading] = useState(false)
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const nameRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const email = emailRef.current.value.trim()
    const password = passwordRef.current.value

    if (!email || !password) {
      toast.error('Please fill in all fields')
      return
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      if (mode === 'signup') {
        const name = nameRef.current?.value.trim() || ''
        if (!name) { toast.error('Name is required'); setLoading(false); return }
        await signup(email, password, name)
        toast.success('Account created! Welcome to FOMOFeed 🎉')
      } else {
        await login(email, password)
        toast.success('Welcome back!')
      }
      navigate('/')
    } catch (err) {
      const msg = {
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/email-already-in-use': 'Email already in use — try logging in',
        'auth/invalid-email': 'Invalid email address',
        'auth/too-many-requests': 'Too many attempts. Try again later.',
        'auth/invalid-credential': 'Invalid email or password',
      }[err.code] || err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.top}>
          <div className={styles.logo}>⚡ FOMOFeed</div>
          <p className={styles.tagline}>
            {mode === 'login'
              ? 'Your daily tech digest, no doom scroll required.'
              : 'Join and stop doomscrolling. For real this time.'}
          </p>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${mode === 'login' ? styles.activeTab : ''}`}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            className={`${styles.tab} ${mode === 'signup' ? styles.activeTab : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input
                ref={nameRef}
                type="text"
                className={styles.input}
                placeholder="Your name"
                autoComplete="name"
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>Email</label>
            <input
              ref={emailRef}
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              ref={passwordRef}
              type="password"
              className={styles.input}
              placeholder="••••••••"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            />
          </div>

          <button className={styles.submit} type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login' ? 'Log in →' : 'Create account →'}
          </button>
        </form>

        <p className={styles.switchText}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button
            className={styles.switchBtn}
            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          >
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <span>⚡</span>
          <span>24-hour tech digest, updated live</span>
        </div>
        <div className={styles.feature}>
          <span>★</span>
          <span>Save articles to read later</span>
        </div>
        <div className={styles.feature}>
          <span>🎯</span>
          <span>Filter by AI, startups, security & more</span>
        </div>
      </div>
    </div>
  )
}
