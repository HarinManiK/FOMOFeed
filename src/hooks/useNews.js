// src/hooks/useNews.js
import { useState, useEffect, useCallback } from 'react'
import { fetchTechNews, fetchTopHeadlines } from '../services/newsService'

// Cache lives outside the component — survives category switches and remounts
// Uses localStorage so it also survives page refreshes
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour — way fewer API calls

function getCached(cat) {
  try {
    const raw = localStorage.getItem(`fomofeed_cache_${cat}`)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < CACHE_DURATION) return { data, ts }
    return null
  } catch {
    return null
  }
}

function setCache(cat, data) {
  try {
    localStorage.setItem(`fomofeed_cache_${cat}`, JSON.stringify({
      data,
      ts: Date.now()
    }))
  } catch {
    // localStorage full or blocked — silently skip
  }
}

function clearCache(cat) {
  try {
    localStorage.removeItem(`fomofeed_cache_${cat}`)
  } catch { /* ignore */ }
}

export function useNews(category = 'all') {
  const [articles, setArticles] = useState(() => {
    // Instantly load from cache on first render — no loading flash
    const cached = getCached(category)
    return cached ? cached.data : []
  })
  const [loading, setLoading] = useState(() => !getCached(category))
  const [error, setError] = useState(null)
  const [lastFetched, setLastFetched] = useState(() => {
    const cached = getCached(category)
    return cached ? new Date(cached.ts) : null
  })

  const load = useCallback(async (cat, force = false) => {
    // Check cache first — if valid and not forced, use it
    if (!force) {
      const cached = getCached(cat)
      if (cached) {
        setArticles(cached.data)
        setLastFetched(new Date(cached.ts))
        setLoading(false)
        setError(null)
        return
      }
    }

    setLoading(true)
    setError(null)
    try {
      let data = await fetchTechNews(cat)
      if (data.length === 0) {
        data = await fetchTopHeadlines()
      }
      setCache(cat, data)
      setArticles(data)
      setLastFetched(new Date())
    } catch (e) {
      setError(e.message)
      // If fetch fails but we have stale cache, show it anyway
      const stale = localStorage.getItem(`fomofeed_cache_${cat}`)
      if (stale) {
        try {
          const { data } = JSON.parse(stale)
          setArticles(data)
          setError('Showing cached results — ' + e.message)
        } catch { /* ignore */ }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Load from cache instantly, only fetch if cache is empty/expired
    const cached = getCached(category)
    if (cached) {
      setArticles(cached.data)
      setLastFetched(new Date(cached.ts))
      setLoading(false)
      setError(null)
    } else {
      load(category)
    }
  }, [category, load])

  const refresh = useCallback(() => {
    clearCache(category)
    load(category, true)
  }, [category, load])

  return { articles, loading, error, lastFetched, refresh }
}