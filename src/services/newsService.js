// src/services/newsService.js

// In production (Vercel), requests go through our serverless proxy — no CORS
// In development (localhost), requests go directly to GNews — works fine
const IS_DEV = import.meta.env.DEV
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY
const PROXY_URL = '/api/news'

export const CATEGORIES = [
  { id: 'all',      label: 'All Tech', icon: '⚡' },
  { id: 'ai',       label: 'AI',       icon: '🤖' },
  { id: 'startups', label: 'Startups', icon: '🚀' },
  { id: 'products', label: 'Products', icon: '📦' },
  { id: 'security', label: 'Security', icon: '🔐' },
  { id: 'science',  label: 'Science',  icon: '🔬' },
]

const QUERY_MAP = {
  all:      'technology',
  ai:       'artificial intelligence OR OpenAI OR LLM',
  startups: 'startup funding OR tech startup',
  products: 'product launch OR app release OR software update',
  security: 'cybersecurity OR data breach OR hacking',
  science:  'science discovery OR research breakthrough',
}

async function gnewsFetch(params) {
  let url

  if (IS_DEV) {
    // Direct call in development — localhost is whitelisted by GNews
    const base = params.q
      ? 'https://gnews.io/api/v4/search'
      : 'https://gnews.io/api/v4/top-headlines'
    const query = new URLSearchParams({ ...params, token: GNEWS_API_KEY })
    url = `${base}?${query}`
  } else {
    // Go through our Vercel proxy in production — avoids CORS
    const query = new URLSearchParams(params)
    url = `${PROXY_URL}?${query}`
  }

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Request failed (${res.status})`)
  const data = await res.json()
  if (data.error) throw new Error(data.error)
  return data
}

export async function fetchTechNews(category = 'all', max = 10) {
  const q = QUERY_MAP[category] || 'technology'
  const data = await gnewsFetch({ q, lang: 'en', max, sortby: 'publishedAt' })
  return data.articles || []
}

export async function fetchTopHeadlines(max = 10) {
  const data = await gnewsFetch({ category: 'technology', lang: 'en', max })
  return data.articles || []
}

export function timeAgo(dateString) {
  const now = new Date()
  const then = new Date(dateString)
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return `${diff}s ago`
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}
