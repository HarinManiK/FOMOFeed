// src/pages/Bookmarks.jsx
import { useEffect } from 'react'
import { useBookmarks } from '../context/BookmarksContext'
import ArticleCard from '../components/ArticleCard'
import Loader from '../components/Loader'
import styles from './Bookmarks.module.css'

export default function Bookmarks() {
  const { bookmarks, loadingBookmarks, refresh } = useBookmarks()

  useEffect(() => { refresh() }, [refresh])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Saved Articles</h1>
          <p className={styles.sub}>
            {bookmarks.length} article{bookmarks.length !== 1 ? 's' : ''} saved
          </p>
        </div>
      </div>

      {loadingBookmarks ? (
        <div className={styles.center}>
          <Loader />
        </div>
      ) : bookmarks.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>☆</span>
          <p className={styles.emptyTitle}>No saved articles yet</p>
          <p className={styles.emptySub}>
            Tap the ☆ on any article in your feed to save it here.
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {bookmarks.map((article, i) => (
            <ArticleCard key={article.url || article.id} article={article} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
