// src/pages/Feed.jsx
import { useState, useMemo, lazy, Suspense } from 'react'
import { useNews } from '../hooks/useNews'
import CategoryFilter from '../components/CategoryFilter'
import DigestBanner from '../components/DigestBanner'
import Loader from '../components/Loader'
import styles from './Feed.module.css'

// Lazy load ArticleCard for code splitting demo
const ArticleCard = lazy(() => import('../components/ArticleCard'))

export default function Feed() {
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const { articles, loading, error, lastFetched, refresh } = useNews(category)

  const filtered = useMemo(() => {
    if (!search.trim()) return articles
    const q = search.toLowerCase()
    return articles.filter(
      a =>
        a.title?.toLowerCase().includes(q) ||
        a.description?.toLowerCase().includes(q) ||
        a.source?.name?.toLowerCase().includes(q)
    )
  }, [articles, search])

  return (
    <div className={styles.page}>
      <DigestBanner
        articles={articles}
        lastFetched={lastFetched}
        onRefresh={refresh}
        loading={loading}
      />

      <div className={styles.controls}>
        <CategoryFilter active={category} onChange={setCategory} />

        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.search}
            type="text"
            placeholder="search stories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className={styles.clearBtn} onClick={() => setSearch('')}>×</button>
          )}
        </div>
      </div>

      {loading && (
        <div className={styles.loaderWrap}>
          <Loader />
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span>⚠</span>
          <div>
            <p className={styles.errorTitle}>Failed to load news</p>
            <p className={styles.errorMsg}>{error}</p>
            <p className={styles.errorHint}>
              Make sure your <code>VITE_GNEWS_API_KEY</code> is set in <code>.env</code>
            </p>
          </div>
          <button className={styles.retryBtn} onClick={refresh}>Retry</button>
        </div>
      )}

      {!loading && !error && (
        <>
          {search && (
            <p className={styles.resultCount}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
            </p>
          )}

          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <p>No stories found.</p>
              {search && <button onClick={() => setSearch('')}>Clear search</button>}
            </div>
          ) : (
            <div className={styles.grid}>
              <Suspense fallback={<Loader />}>
                {filtered.map((article, i) => (
                  <ArticleCard key={article.url} article={article} index={i} />
                ))}
              </Suspense>
            </div>
          )}
        </>
      )}
    </div>
  )
}
