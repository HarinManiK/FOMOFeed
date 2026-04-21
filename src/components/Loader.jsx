// src/components/Loader.jsx
import styles from './Loader.module.css'

export default function Loader({ fullscreen = false, size = 'md' }) {
  const el = (
    <div className={`${styles.wrapper} ${styles[size]}`}>
      <div className={styles.spinner} />
      <span className={styles.text}>loading feed...</span>
    </div>
  )
  if (fullscreen) return <div className={styles.fullscreen}>{el}</div>
  return el
}
