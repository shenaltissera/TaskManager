import { useState, useEffect } from 'react'

const XP_PER_LEVEL = 100

const DIFFICULTY_XP = {
  easy: 10,
  medium: 25,
  hard: 50,
}

const INITIAL_STATE = {
  tasks: [],
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  achievements: [],
  completedToday: 0,
  leveledUp: null,
}

function calculateLevel(xp) {
  return Math.floor(xp / XP_PER_LEVEL) + 1
}

function xpProgress(xp, level) {
  const base = (level - 1) * XP_PER_LEVEL
  const next = level * XP_PER_LEVEL
  return Math.min(100, ((xp - base) / (next - base)) * 100)
}

export function useGameState() {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('focusforge')
      return saved ? { ...INITIAL_STATE, ...JSON.parse(saved) } : INITIAL_STATE
    } catch {
      return INITIAL_STATE
    }
  })

  useEffect(() => {
    localStorage.setItem('focusforge', JSON.stringify(state))
  }, [state])

  useEffect(() => {
    const today = new Date().toDateString()
    if (state.lastActiveDate && state.lastActiveDate !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = state.lastActiveDate === yesterday.toDateString()
      if (!wasYesterday) {
        setState(s => ({ ...s, streak: 0, completedToday: 0 }))
      } else {
        setState(s => ({ ...s, completedToday: 0 }))
      }
    }
  }, [])

  function addTask({ title, difficulty = 'medium', tag = null, isBoss = false }) {
    const newTask = {
      id: Date.now(),
      title,
      difficulty,
      tag,
      isBoss,
      completed: false,
      createdAt: new Date().toISOString(),
      priorityScore: calculatePriority(difficulty, isBoss),
    }
    setState(s => ({ ...s, tasks: [newTask, ...s.tasks] }))
  }

  function completeTask(id) {
    const task = state.tasks.find(t => t.id === id)
    if (!task || task.completed) return

    const earned = DIFFICULTY_XP[task.difficulty] * (task.isBoss ? 2 : 1)
    const newXP = state.xp + earned
    const newLevel = calculateLevel(newXP)
    const leveled = newLevel > state.level

    const today = new Date().toDateString()
    const newCompletedToday = state.completedToday + 1
    const newStreak = state.lastActiveDate === today
      ? state.streak
      : state.streak + 1

    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => t.id === id ? { ...t, completed: true } : t),
      xp: newXP,
      level: newLevel,
      streak: newStreak,
      longestStreak: Math.max(newStreak, s.longestStreak),
      lastActiveDate: today,
      completedToday: newCompletedToday,
      leveledUp: leveled ? newLevel : null,
    }))

    return { earned, leveled, newLevel }
  }

  function deleteTask(id) {
    setState(s => ({ ...s, tasks: s.tasks.filter(t => t.id !== id) }))
  }

  function setBossTask(id) {
    setState(s => ({
      ...s,
      tasks: s.tasks.map(t => ({ ...t, isBoss: t.id === id }))
    }))
  }

  function clearLevelUp() {
    setState(s => ({ ...s, leveledUp: null }))
  }

  return {
    ...state,
    addTask,
    completeTask,
    deleteTask,
    setBossTask,
    clearLevelUp,
    xpProgress: xpProgress(state.xp, state.level),
    xpToNext: state.level * XP_PER_LEVEL,
    DIFFICULTY_XP,
  }
}

function calculatePriority(difficulty, isBoss) {
  const base = { easy: 20, medium: 50, hard: 80 }[difficulty]
  return Math.min(100, base + (isBoss ? 20 : 0))
}