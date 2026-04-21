// src/components/Navbar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/auth')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        <span className={styles.logoIcon}>⚡</span>
        <span className={styles.logoText}>FOMO<span className={styles.logoAccent}>Feed</span></span>
      </Link>

      <div className={styles.links}>
        {user && (
          <>
            <Link to="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
              Feed
            </Link>
            <Link to="/bookmarks" className={`${styles.link} ${isActive('/bookmarks') ? styles.active : ''}`}>
              Saved
            </Link>
            <Link to="/settings" className={`${styles.link} ${isActive('/settings') ? styles.active : ''}`}>
              Settings
            </Link>
          </>
        )}
      </div>

      <div className={styles.right}>
        {user ? (
          <div className={styles.userArea}>
            <span className={styles.userName}>
              {user.displayName || user.email.split('@')[0]}
            </span>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              logout
            </button>
          </div>
        ) : (
          <Link to="/auth" className={styles.authBtn}>Sign in</Link>
        )}
      </div>
    </nav>
  )
}
