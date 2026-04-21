// src/context/BookmarksContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import {
  addBookmark, removeBookmark, getBookmarks,
  markAsRead, getReadHistory
} from '../services/userDataService'

const BookmarksContext = createContext(null)

export function BookmarksProvider({ children }) {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState([])
  const [readIds, setReadIds] = useState(new Set())
  const [loadingBookmarks, setLoadingBookmarks] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) { setBookmarks([]); setReadIds(new Set()); return }
    setLoadingBookmarks(true)
    try {
      const [bks, rh] = await Promise.all([
        getBookmarks(user.uid),
        getReadHistory(user.uid),
      ])
      setBookmarks(bks)
      setReadIds(new Set(rh))
    } finally {
      setLoadingBookmarks(false)
    }
  }, [user])

  useEffect(() => { refresh() }, [refresh])

  const bookmark = useCallback(async (article) => {
    if (!user) return
    await addBookmark(user.uid, article)
    setBookmarks(prev => [{ ...article }, ...prev])
  }, [user])

  const unbookmark = useCallback(async (articleUrl) => {
    if (!user) return
    await removeBookmark(user.uid, articleUrl)
    setBookmarks(prev => prev.filter(b => b.url !== articleUrl))
  }, [user])

  const isBookmarkedFn = useCallback((url) =>
    bookmarks.some(b => b.url === url), [bookmarks])

  const markRead = useCallback(async (article) => {
    if (!user) return
    const id = btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
    setReadIds(prev => new Set([...prev, id]))
    await markAsRead(user.uid, article)
  }, [user])

  const isRead = useCallback((url) => {
    const id = btoa(url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
    return readIds.has(id)
  }, [readIds])

  return (
    <BookmarksContext.Provider value={{
      bookmarks, loadingBookmarks, refresh,
      bookmark, unbookmark, isBookmarked: isBookmarkedFn,
      markRead, isRead
    }}>
      {children}
    </BookmarksContext.Provider>
  )
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext)
  if (!ctx) throw new Error('useBookmarks must be used within BookmarksProvider')
  return ctx
}
