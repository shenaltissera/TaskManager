import { motion } from 'framer-motion'

export default function XPBar({ xp, level, progress, xpToNext }) {
  return (
    <div className="glass-card p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <span className="font-display text-xs text-[var(--text-muted)] tracking-widest uppercase">Level</span>
          <div className="font-display text-3xl text-[var(--neon-green)] text-glow-green leading-none mt-1">
            {level}
          </div>
        </div>
        <div className="text-right">
          <span className="font-display text-xs text-[var(--text-muted)] tracking-widest uppercase">Total XP</span>
          <div className="font-display text-2xl text-[var(--gold)] leading-none mt-1">{xp} XP</div>
        </div>
      </div>

      <div className="h-3 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border)]">
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--neon-green), var(--cyan))' }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-between mt-2">
        <span className="text-xs text-[var(--text-muted)]">{Math.round(progress)}% to next level</span>
        <span className="text-xs text-[var(--text-muted)]">{xpToNext} XP → Level {level + 1}</span>
      </div>
    </div>
  )
}