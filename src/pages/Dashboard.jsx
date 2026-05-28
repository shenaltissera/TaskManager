import { AnimatePresence, motion } from 'framer-motion'
import { useGameState } from '../hooks/useGameState'
import XPBar from '../components/XPBar'
import TaskCard from '../components/TaskCard'
import AddTaskForm from '../components/AddTaskForm'
import StatsBar from '../components/StatsBar'
import { Crown, Zap, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const game = useGameState()
  const [xpPop, setXpPop] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bossTask = game.tasks.find(t => t.isBoss && !t.completed)
  const activeTasks = game.tasks.filter(t => !t.completed && !t.isBoss)
  const doneTasks = game.tasks.filter(t => t.completed)

  function handleComplete(id) {
    const result = game.completeTask(id)
    if (result) {
      setXpPop(`+${result.earned} XP`)
      setTimeout(() => setXpPop(null), 1500)
    }
  }

  useEffect(() => {
    if (game.leveledUp) {
      const t = setTimeout(game.clearLevelUp, 3000)
      return () => clearTimeout(t)
    }
  }, [game.leveledUp])

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative" style={{ background: 'var(--bg-main)' }}>

      {/* Mobile top bar */}
      <header
        className="md:hidden flex items-center justify-between px-4 py-3 sticky top-0 z-40"
        style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}
      >
        <h1 className="font-display text-lg text-glow-green" style={{ color: 'var(--neon-green)' }}>
          FOCUSFORGE
        </h1>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          style={{ color: 'var(--text-muted)' }}
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="md:hidden fixed inset-0 z-40"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="md:hidden fixed inset-y-0 left-0 w-72 z-50 p-6 flex flex-col gap-5 overflow-y-auto"
              style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
            >
              <SidebarContent game={game} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-64 shrink-0 p-6 gap-5 sticky top-0 h-screen overflow-y-auto"
        style={{ background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)' }}
      >
        <SidebarContent game={game} />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Desktop header */}
          <div className="hidden md:block mb-6">
            <h1 className="font-display text-4xl text-glow-green" style={{ color: 'var(--neon-green)' }}>
              FOCUSFORGE
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              Forge your focus. Level up your life.
            </p>
          </div>

          <XPBar
            xp={game.xp}
            level={game.level}
            progress={game.xpProgress}
            xpToNext={game.xpToNext}
          />

          <StatsBar
            streak={game.streak}
            longestStreak={game.longestStreak}
            completedToday={game.completedToday}
          />

          {/* Boss Task */}
          {bossTask && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown size={13} style={{ color: 'var(--gold)' }} />
                <span
                  className="font-display text-xs uppercase tracking-widest"
                  style={{ color: 'var(--gold)' }}
                >
                  Boss Task
                </span>
              </div>
              <TaskCard
                task={bossTask}
                onComplete={handleComplete}
                onDelete={game.deleteTask}
                onSetBoss={game.setBossTask}
              />
            </div>
          )}

          <AddTaskForm onAdd={game.addTask} />

          {/* Active tasks */}
          {activeTasks.length > 0 && (
            <div>
              <h2
                className="font-display text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Active Missions ({activeTasks.length})
              </h2>
              <AnimatePresence mode="popLayout">
                <div className="space-y-2">
                  {activeTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleComplete}
                      onDelete={game.deleteTask}
                      onSetBoss={game.setBossTask}
                    />
                  ))}
                </div>
              </AnimatePresence>
            </div>
          )}

          {/* Completed tasks */}
          {doneTasks.length > 0 && (
            <div>
              <h2
                className="font-display text-xs uppercase tracking-widest mb-2"
                style={{ color: 'var(--text-muted)' }}
              >
                Completed ({doneTasks.length})
              </h2>
              <div className="space-y-2">
                {doneTasks.slice(0, 5).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleComplete}
                    onDelete={game.deleteTask}
                    onSetBoss={game.setBossTask}
                  />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* XP pop */}
      <AnimatePresence>
        {xpPop && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.8 }}
            animate={{ opacity: 1, y: -60, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            className="fixed bottom-8 right-8 font-display text-2xl pointer-events-none z-50 flex items-center gap-2"
            style={{ color: 'var(--gold)', textShadow: '0 0 20px rgba(251,191,36,0.8)' }}
          >
            <Zap size={24} fill="var(--gold)" />
            {xpPop}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level up overlay */}
      <AnimatePresence>
        {game.leveledUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none px-4"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >
            <div className="glass-card p-10 text-center glow-green" style={{ borderColor: 'var(--neon-green)' }}>
              <div
                className="font-display text-5xl text-glow-green mb-3"
                style={{ color: 'var(--neon-green)' }}
              >
                LEVEL UP
              </div>
              <div className="font-display text-2xl" style={{ color: 'var(--gold)' }}>
                Level {game.leveledUp}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SidebarContent({ game, onClose }) {
  const totalTasks = game.tasks.length
  const completedTasks = game.tasks.filter(t => t.completed).length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg text-glow-green" style={{ color: 'var(--neon-green)' }}>
            FOCUSFORGE
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Forge your focus.</p>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Player card */}
      <div className="glass-card p-4">
        <div className="text-xs font-display uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          Commander
        </div>
        <div className="font-display text-2xl" style={{ color: 'var(--neon-green)' }}>
          LVL {game.level}
        </div>
        <div className="text-sm mt-0.5" style={{ color: 'var(--text-muted)' }}>
          {game.xp} total XP
        </div>
      </div>

      {/* Stats list */}
      <div className="space-y-0">
        {[
          { label: '🔥 Current Streak', value: `${game.streak} days` },
          { label: '🏆 Longest Streak', value: `${game.longestStreak} days` },
          { label: '✅ Done Today', value: game.completedToday },
          { label: '📋 Total Tasks', value: totalTasks },
          { label: '📈 Completion', value: `${completionRate}%` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex justify-between items-center py-2.5"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{label}</span>
            <span className="font-display text-sm" style={{ color: 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* All-time progress bar */}
      <div>
        <div
          className="text-xs font-display uppercase tracking-widest mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          All-time progress
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--bg-main)', border: '1px solid var(--border)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--neon-green), var(--cyan))' }}
            initial={{ width: 0 }}
            animate={{ width: `${completionRate}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <div className="text-xs mt-1 text-right" style={{ color: 'var(--text-muted)' }}>
          {completedTasks}/{totalTasks} tasks
        </div>
      </div>
    </>
  )
}