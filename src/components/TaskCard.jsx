import { motion } from 'framer-motion'
import { CheckCircle2, Trash2, Zap, Crown } from 'lucide-react'

const DIFFICULTY_COLORS = {
  easy: 'var(--neon-green)',
  medium: 'var(--cyan)',
  hard: 'var(--danger)',
}

const XP_VALUES = {
  easy: 10,
  medium: 25,
  hard: 50,
}

const TAG_LABELS = {
  quick: '⚡ Quick Win',
  deep: '🧠 Deep Work',
  urgent: '🔥 Urgent',
  growth: '🌱 Growth',
}

export default function TaskCard({ task, onComplete, onDelete, onSetBoss }) {
  const color = DIFFICULTY_COLORS[task.difficulty]
  const xpReward = XP_VALUES[task.difficulty] * (task.isBoss ? 2 : 1)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: task.completed ? 0.45 : 1, y: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.25 }}
      className="glass-card p-4 relative overflow-hidden transition-all duration-300"
      style={task.isBoss ? {
        borderColor: 'rgba(251, 191, 36, 0.5)',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 4px 24px rgba(0,0,0,0.5), 0 0 20px rgba(251,191,36,0.15), inset 0 1px 0 rgba(251,191,36,0.1)'
      } : {}}
    >
      {/* Boss accent line */}
      {task.isBoss && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: 'linear-gradient(90deg, transparent, var(--gold), transparent)' }}
        />
      )}

      <div className="flex items-start gap-3">
        {/* Complete button */}
        <button
          onClick={() => !task.completed && onComplete(task.id)}
          disabled={task.completed}
          className="mt-0.5 shrink-0 transition-colors disabled:cursor-not-allowed"
          style={{ color: task.completed ? 'var(--neon-green)' : 'var(--text-muted)' }}
        >
          <CheckCircle2 size={20} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {task.isBoss && <Crown size={13} style={{ color: 'var(--gold)' }} />}
            <span
              className="font-medium text-sm leading-snug"
              style={task.completed ? {
                textDecoration: 'line-through',
                color: 'var(--text-muted)'
              } : {}}
            >
              {task.title}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-display tracking-wider uppercase"
              style={{
                color,
                border: `1px solid ${color}`,
                background: `${color}15`
              }}
            >
              {task.difficulty}
            </span>

            {task.tag && (
              <span className="text-xs text-[var(--text-muted)]">
                {TAG_LABELS[task.tag]}
              </span>
            )}

            <span
              className="text-xs flex items-center gap-1"
              style={{ color: 'var(--gold)' }}
            >
              <Zap size={10} fill="var(--gold)" />
              {xpReward} XP
            </span>

            <span className="text-xs text-[var(--text-muted)]">
              Priority: <span style={{ color: 'var(--cyan)' }}>{task.priorityScore}/100</span>
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {!task.completed && (
          <div className="flex gap-1 shrink-0">
            <button
              onClick={() => onSetBoss(task.id)}
              title="Set as Boss Task"
              className="p-1.5 rounded transition-colors"
              style={{ color: task.isBoss ? 'var(--gold)' : 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.color = task.isBoss ? 'var(--gold)' : 'var(--text-muted)'}
            >
              <Crown size={15} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--danger)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <Trash2 size={15} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}