// src/components/DigestBanner.jsx
import { useMemo } from 'react'
import styles from './DigestBanner.module.css'

export default function DigestBanner({ articles, lastFetched, onRefresh, loading }) {
  const stats = useMemo(() => {
    if (!articles.length) return null
    const sources = new Set(articles.map(a => a.source?.name).filter(Boolean))
    const now = new Date()
    const recent = articles.filter(a => {
      const diff = now - new Date(a.publishedAt)
      return diff < 3 * 60 * 60 * 1000 // last 3 hours
    })
    return {
      total: articles.length,
      sources: sources.size,
      recent: recent.length,
    }
  }, [articles])

  const timeStr = lastFetched
    ? lastFetched.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className={styles.banner}>
      <div className={styles.left}>
        <div className={styles.badge}>
          <span className={styles.dot} />
          LIVE · Last 24 Hours
        </div>
        <h1 className={styles.heading}>
          Your tech digest,<br />
          <span className={styles.accent}>no scroll required.</span>
        </h1>
        <p className={styles.sub}>
          Stay updated without the doom. Everything that matters in tech — curated fresh.
        </p>
      </div>

      {stats && (
        <div className={styles.right}>
          <div className={styles.statGrid}>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.total}</span>
              <span className={styles.statLabel}>stories</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.sources}</span>
              <span className={styles.statLabel}>sources</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNum}>{stats.recent}</span>
              <span className={styles.statLabel}>last 3h</span>
            </div>
          </div>

          <div className={styles.refreshRow}>
            {timeStr && (
              <span className={styles.fetchedAt}>updated {timeStr}</span>
            )}
            <button
              className={styles.refreshBtn}
              onClick={onRefresh}
              disabled={loading}
            >
              {loading ? '↻ refreshing...' : '↻ refresh'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
