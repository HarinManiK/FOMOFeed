// src/pages/Settings.jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { savePreferences, getPreferences } from '../services/userDataService'
import { CATEGORIES } from '../services/newsService'
import toast from 'react-hot-toast'
import styles from './Settings.module.css'

export default function Settings() {
  const { user } = useAuth()
  const [prefs, setPrefs] = useState({ digestTime: '08:00', categories: ['all'] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!user) return
    getPreferences(user.uid).then(p => {
      setPrefs(p)
      setLoading(false)
    })
  }, [user])

  const toggleCategory = (id) => {
    setPrefs(prev => {
      const has = prev.categories.includes(id)
      if (has && prev.categories.length === 1) return prev // at least one
      return {
        ...prev,
        categories: has
          ? prev.categories.filter(c => c !== id)
          : [...prev.categories, id]
      }
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await savePreferences(user.uid, prefs)
      toast.success('Preferences saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className={styles.page}>
      <p className={styles.loadingText}>loading preferences...</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Settings</h1>
        <p className={styles.sub}>Customize your FOMOFeed experience</p>
      </div>

      {/* Profile */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Account</h2>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Name</span>
          <span className={styles.infoVal}>{user?.displayName || '—'}</span>
        </div>
        <div className={styles.infoRow}>
          <span className={styles.infoLabel}>Email</span>
          <span className={styles.infoVal}>{user?.email}</span>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Preferred Topics</h2>
        <p className={styles.sectionDesc}>Choose which tech topics you want in your feed.</p>
        <div className={styles.catGrid}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catBtn} ${prefs.categories.includes(cat.id) ? styles.catActive : ''}`}
              onClick={() => toggleCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              {prefs.categories.includes(cat.id) && <span className={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Digest Time */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Digest Time</h2>
        <p className={styles.sectionDesc}>
          Set your preferred time to check the daily digest.
        </p>
        <div className={styles.timeRow}>
          <label className={styles.infoLabel}>Time</label>
          <input
            type="time"
            className={styles.timeInput}
            value={prefs.digestTime}
            onChange={e => setPrefs(p => ({ ...p, digestTime: e.target.value }))}
          />
        </div>
      </section>

      <button
        className={styles.saveBtn}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save preferences →'}
      </button>
    </div>
  )
}
