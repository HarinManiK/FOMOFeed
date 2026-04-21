// src/components/ArticleCard.jsx
import { useState, useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useBookmarks } from '../context/BookmarksContext'
import { timeAgo } from '../services/newsService'
import toast from 'react-hot-toast'
import styles from './ArticleCard.module.css'

export default function ArticleCard({ article, index = 0 }) {
  const { user } = useAuth()
  const { bookmark, unbookmark, isBookmarked, markRead, isRead } = useBookmarks()
  const [imgError, setImgError] = useState(false)
  const [bookmarking, setBookmarking] = useState(false)

  const saved = isBookmarked(article.url)
  const read = isRead(article.url)

  const handleOpen = useCallback(() => {
    if (user) markRead(article)
    window.open(article.url, '_blank', 'noopener,noreferrer')
  }, [article, user, markRead])

  const handleBookmark = useCallback(async (e) => {
    e.stopPropagation()
    if (!user) { toast.error('Sign in to save articles'); return }
    setBookmarking(true)
    try {
      if (saved) {
        await unbookmark(article.url)
        toast('Removed from saved', { icon: '🗑️' })
      } else {
        await bookmark(article)
        toast.success('Saved!')
      }
    } finally {
      setBookmarking(false)
    }
  }, [user, saved, article, bookmark, unbookmark])

  const domain = (() => {
    try { return new URL(article.url).hostname.replace('www.', '') }
    catch { return '' }
  })()

  return (
    <article
      className={`${styles.card} ${read ? styles.read : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {article.image && !imgError && (
        <div className={styles.imageWrap}>
          <img
            src={article.image}
            alt={article.title}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.source}>{article.source?.name || domain}</span>
          <span className={styles.dot}>·</span>
          <span className={styles.time}>{timeAgo(article.publishedAt)}</span>
          {read && <span className={styles.readBadge}>read</span>}
        </div>

        <h2 className={styles.title} onClick={handleOpen}>
          {article.title}
        </h2>

        {article.description && (
          <p className={styles.desc}>{article.description}</p>
        )}

        <div className={styles.footer}>
          <button className={styles.readBtn} onClick={handleOpen}>
            Read article →
          </button>
          <button
            className={`${styles.bookmarkBtn} ${saved ? styles.bookmarked : ''}`}
            onClick={handleBookmark}
            disabled={bookmarking}
            aria-label={saved ? 'Remove bookmark' : 'Save article'}
          >
            {saved ? '★' : '☆'}
          </button>
        </div>
      </div>
    </article>
  )
}
