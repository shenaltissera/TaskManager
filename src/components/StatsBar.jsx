import { motion } from 'framer-motion'
import { Flame, Trophy, CheckSquare } from 'lucide-react'

export default function StatsBar({ streak, longestStreak, completedToday }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard
        icon={<Flame size={20} className="text-[var(--danger)]" />}
        label="Streak"
        value={`${streak}d`}
        color="var(--danger)"
      />
      <StatCard
        icon={<Trophy size={20} className="text-[var(--gold)]" />}
        label="Best"
        value={`${longestStreak}d`}
        color="var(--gold)"
      />
      <StatCard
        icon={<CheckSquare size={20} className="text-[var(--neon-green)]" />}
        label="Today"
        value={completedToday}
        color="var(--neon-green)"
      />
    </div>
  )
}

function StatCard({ icon, label, value, color }) {
  return (
    <div
      className="glass-card p-4 text-center transition-all duration-300"
      style={{ borderColor: `${color}40` }}
    >
      <div className="flex justify-center mb-2">{icon}</div>
      <div
        className="font-display text-2xl leading-none"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mt-1.5">
        {label}
      </div>
    </div>
  )
}