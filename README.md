# ⚡ FOMOFeed

> **Your daily tech digest. No doomscroll required.**

FOMOFeed is a production-grade React app that solves a real problem: people want to delete social media to escape doomscrolling, but they're afraid of missing out on important updates. FOMOFeed delivers the last 24 hours of tech news in a clean, focused digest — so you can stay informed without the noise.

---

## 🎯 Problem Statement

Millions of people spend hours doomscrolling Instagram, YouTube, and Twitter — not because they enjoy it, but because they're afraid of missing something. The only friction stopping them from deleting these apps is FOMO.

**FOMOFeed eliminates that friction.** It gives you the last 24 hours of what actually mattered in tech: AI breakthroughs, startup funding, product launches, security news — curated fresh, no algorithm, no ads, no infinite scroll.

---

## ✨ Features

- **📰 Live 24-hour digest** — Top tech news from the last 24 hours, auto-fetched
- **🏷️ Category filters** — AI, Startups, Products, Security, Science
- **🔍 Search** — Filter articles by keyword in real-time
- **★ Bookmarks** — Save articles to read later, persisted in Firestore
- **✅ Read tracking** — Articles you've opened are visually dimmed
- **⚙️ Settings** — Save preferred categories and digest time preference
- **🔐 Auth** — Email/password login with Firebase Auth
- **📱 Responsive** — Works great on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18 (Vite) |
| Routing | React Router v6 |
| State | useState, useContext, custom hooks |
| Backend | Firebase (Auth + Firestore) |
| News API | GNews API |
| Styling | CSS Modules |
| Notifications | react-hot-toast |
| Deploy | Vercel / Netlify |

---

## ⚛️ React Concepts Used

- **Functional Components** — entire app
- **useState** — local UI state (category, search, loading)
- **useEffect** — data fetching, preferences load
- **useContext** — AuthContext, BookmarksContext (global state)
- **useCallback** — memoized event handlers in ArticleCard
- **useMemo** — filtered article list, digest stats
- **useRef** — form inputs in Auth page
- **Custom Hooks** — `useNews()` with caching logic
- **Lifting State Up** — BookmarksContext shared across Feed + Bookmarks
- **Controlled Components** — search input
- **React Router** — protected routes, navigation
- **Lazy Loading** — `React.lazy` + `Suspense` for all pages and ArticleCard
- **Context API** — AuthContext, BookmarksContext

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/fomofeed.git
cd fomofeed
npm install
```

### 2. Get your API keys

**GNews API** (free, 100 req/day):
1. Go to [https://gnews.io](https://gnews.io)
2. Sign up and get your API key

**Firebase**:
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password
4. Create a **Firestore Database** (start in test mode)
5. Go to Project Settings → Your Apps → Add Web App
6. Copy the config object

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` and fill in your keys:

```env
VITE_GNEWS_API_KEY=your_key_here
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### 5. Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all your `.env` variables in the Vercel dashboard under Project → Settings → Environment Variables.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ArticleCard.jsx       # News article card with bookmark
│   ├── CategoryFilter.jsx    # Horizontal category pill filter
│   ├── DigestBanner.jsx      # Hero banner with stats
│   ├── Loader.jsx            # Loading spinner
│   ├── Navbar.jsx            # Top navigation bar
│   └── ProtectedRoute.jsx    # Auth guard wrapper
├── context/
│   ├── AuthContext.jsx       # Firebase auth state (global)
│   └── BookmarksContext.jsx  # Bookmarks + read history (global)
├── hooks/
│   └── useNews.js            # News fetching with cache
├── pages/
│   ├── Auth.jsx              # Login / Signup
│   ├── Bookmarks.jsx         # Saved articles
│   ├── Feed.jsx              # Main digest feed
│   └── Settings.jsx          # User preferences
├── services/
│   ├── firebase.js           # Firebase init
│   ├── newsService.js        # GNews API + utilities
│   └── userDataService.js    # Firestore CRUD operations
├── App.jsx                   # Routes + providers
├── main.jsx                  # Entry point
└── index.css                 # Global styles + CSS variables
```

---

## 🔐 Firestore Rules (Recommended)

In Firebase Console → Firestore → Rules, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 📸 Screenshots

_Add screenshots here after running the app_

---

## 🧑‍💻 Author

Built as an end-term project for the *Building Web Applications with React* course, Batch 2029.

---

## 📄 License

MIT
