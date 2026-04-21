// api/news.js — Vercel serverless function
// This runs on the SERVER, not the browser — no CORS issues ever

export default async function handler(req, res) {
  // Allow requests from your own site only
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET')

  const { q, category, max = 10 } = req.query
  const apiKey = process.env.VITE_GNEWS_API_KEY

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  try {
    let gnewsUrl

    if (q) {
      // Search endpoint
      gnewsUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(q)}&lang=en&max=${max}&sortby=publishedAt&token=${apiKey}`
    } else {
      // Top headlines endpoint
      gnewsUrl = `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&max=${max}&token=${apiKey}`
    }

    const response = await fetch(gnewsUrl)
    const data = await response.json()

    // Cache the response on Vercel's edge for 30 minutes
    res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate')
    return res.status(200).json(data)

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
