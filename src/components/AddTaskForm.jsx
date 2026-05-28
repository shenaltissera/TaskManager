import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, ChevronDown } from 'lucide-react'

const difficulties = ['easy', 'medium', 'hard']

const DIFFICULTY_ACTIVE = {
  easy: { color: 'var(--bg-main)', bg: 'var(--neon-green)', border: 'var(--neon-green)' },
  medium: { color: 'var(--bg-main)', bg: 'var(--cyan)', border: 'var(--cyan)' },
  hard: { color: '#fff', bg: 'var(--danger)', border: 'var(--danger)' },
}

const tags = [
  { value: 'quick', label: '⚡ Quick Win' },
  { value: 'deep', label: '🧠 Deep Work' },
  { value: 'urgent', label: '🔥 Urgent' },
  { value: 'growth', label: '🌱 Growth' },
]

export default function AddTaskForm({ onAdd }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState('medium')
  const [tag, setTag] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onAdd({ title: title.trim(), difficulty, tag: tag || null })
    setTitle('')
    setDifficulty('medium')
    setTag('')
    setOpen(false)
  }

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full p-4 flex items-center gap-3 text-left transition-colors"
        style={{ background: open ? 'rgba(104,255,156,0.04)' : 'transparent' }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'var(--neon-green)' }}
        >
          <Plus size={18} style={{ color: 'var(--bg-main)' }} />
        </div>
        <span className="font-medium" style={{ color: 'var(--neon-green)' }}>
          Add New Task
        </span>
        <ChevronDown
          size={16}
          className={`ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-muted)' }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            style={{ borderTop: '1px solid var(--border)' }}
          >
            <div className="px-4 pb-4 pt-4 space-y-3">
              <input
                type="text"
                placeholder="What's your mission?"
                value={title}
                onChange={e => setTitle(e.target.value)}
                autoFocus
                className="w-full rounded-lg px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: 'var(--bg-main)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-primary)',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--neon-green)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />

              {/* Difficulty */}
              <div className="flex gap-2">
                {difficulties.map(d => {
                  const active = difficulty === d
                  const styles = DIFFICULTY_ACTIVE[d]
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDifficulty(d)}
                      className="text-xs px-3 py-1.5 rounded-full font-display uppercase tracking-wider transition-all"
                      style={active ? {
                        color: styles.color,
                        background: styles.bg,
                        border: `1px solid ${styles.border}`,
                      } : {
                        color: 'var(--text-muted)',
                        background: 'transparent',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>

              {/* Tags */}
              <div className="flex gap-2 flex-wrap">
                {tags.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTag(tag === t.value ? '' : t.value)}
                    className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={tag === t.value ? {
                      color: 'var(--cyan)',
                      border: '1px solid var(--cyan)',
                      background: 'rgba(0,209,255,0.08)',
                    } : {
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border)',
                      background: 'transparent',
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-display text-sm uppercase tracking-wider transition-opacity hover:opacity-90 glow-green"
                style={{
                  background: 'var(--neon-green)',
                  color: 'var(--bg-main)',
                }}
              >
                Deploy Mission
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}