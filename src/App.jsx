// src/App.jsx
import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { BookmarksProvider } from './context/BookmarksContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Loader from './components/Loader'

// Lazy-loaded pages for code splitting
const Feed = lazy(() => import('./pages/Feed'))
const Auth = lazy(() => import('./pages/Auth'))
const Bookmarks = lazy(() => import('./pages/Bookmarks'))
const Settings = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <AuthProvider>
      <BookmarksProvider>
        <Navbar />
        <Suspense fallback={<Loader fullscreen />}>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Feed />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bookmarks"
              element={
                <ProtectedRoute>
                  <Bookmarks />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BookmarksProvider>
    </AuthProvider>
  )
}
