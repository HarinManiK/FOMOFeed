// src/services/userDataService.js
import {
  doc, setDoc, deleteDoc, getDoc,
  collection, getDocs, query, orderBy, serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'

// ─── Bookmarks ───────────────────────────────────────────────

export async function addBookmark(userId, article) {
  const id = btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
  const ref = doc(db, 'users', userId, 'bookmarks', id)
  await setDoc(ref, {
    ...article,
    savedAt: serverTimestamp(),
  })
  return id
}

export async function removeBookmark(userId, articleUrl) {
  const id = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
  const ref = doc(db, 'users', userId, 'bookmarks', id)
  await deleteDoc(ref)
}

export async function getBookmarks(userId) {
  const ref = collection(db, 'users', userId, 'bookmarks')
  const q = query(ref, orderBy('savedAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function isBookmarked(userId, articleUrl) {
  const id = btoa(articleUrl).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
  const ref = doc(db, 'users', userId, 'bookmarks', id)
  const snap = await getDoc(ref)
  return snap.exists()
}

// ─── Read History ─────────────────────────────────────────────

export async function markAsRead(userId, article) {
  const id = btoa(article.url).replace(/[^a-zA-Z0-9]/g, '').slice(0, 40)
  const ref = doc(db, 'users', userId, 'readHistory', id)
  await setDoc(ref, {
    title: article.title,
    url: article.url,
    readAt: serverTimestamp(),
  }, { merge: true })
}

export async function getReadHistory(userId) {
  const ref = collection(db, 'users', userId, 'readHistory')
  const q = query(ref, orderBy('readAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.id)
}

// ─── User Preferences ────────────────────────────────────────

export async function savePreferences(userId, prefs) {
  const ref = doc(db, 'users', userId, 'meta', 'preferences')
  await setDoc(ref, prefs, { merge: true })
}

export async function getPreferences(userId) {
  const ref = doc(db, 'users', userId, 'meta', 'preferences')
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : { digestTime: '08:00', categories: ['all'] }
}
