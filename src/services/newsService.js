// src/services/newsService.js
// Uses GNews API (free tier: 100 req/day) — get your key at https://gnews.io

const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const BASE_URL = 'https://gnews.io/api/v4'

export const CATEGORIES = [
  { id: 'all', label: 'All Tech', icon: '⚡' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'startups', label: 'Startups', icon: '🚀' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'science', label: 'Science', icon: '🔬' },
]

const QUERY_MAP = {
  all: 'technology',
  ai: 'artificial intelligence OR OpenAI OR LLM OR ChatGPT',
  startups: 'startup funding OR tech startup',
  products: 'product launch OR app release OR software update',
  security: 'cybersecurity OR data breach OR hacking',
  science: 'science discovery OR research breakthrough',
}

/**
 * Fetch top tech headlines from the last 24 hours
 * @param {string} category - category key from CATEGORIES
 * @param {number} max - number of articles (max 10 on free tier)
 */
export async function fetchTechNews(category = 'all', max = 10) {
  const query = QUERY_MAP[category] || 'technology'
  const from = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const url = `${BASE_URL}/search?q=${encodeURIComponent(query)}&lang=en&from=${from}&max=${max}&sortby=publishedAt&token=${GNEWS_API_KEY}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.errors?.[0] || `Failed to fetch news (${res.status})`)
  }

  const data = await res.json()
  return data.articles || []
}

/**
 * Get top headlines (no time filter — fallback for when 24h window is empty)
 */
export async function fetchTopHeadlines(max = 10) {
  const url = `${BASE_URL}/top-headlines?category=technology&lang=en&max=${max}&token=${GNEWS_API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch headlines (${res.status})`)
  const data = await res.json()
  return data.articles || []
}

/**
 * Format publishedAt string into relative time
 */
export function timeAgo(dateString) {
  const now = new Date()
  const then = new Date(dateString)
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
