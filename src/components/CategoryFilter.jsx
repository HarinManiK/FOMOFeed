// src/components/CategoryFilter.jsx
import { CATEGORIES } from '../services/newsService'
import styles from './CategoryFilter.module.css'

export default function CategoryFilter({ active, onChange }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.scroll}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            className={`${styles.pill} ${active === cat.id ? styles.active : ''}`}
            onClick={() => onChange(cat.id)}
          >
            <span className={styles.icon}>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
