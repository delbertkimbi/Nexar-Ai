import { create } from 'zustand'

interface AppState {
  xp: number
  level: number
  addXP: (amount: number) => void
}

export const useStore = create<AppState>((set) => ({
  xp: 0,
  level: 1,
  addXP: (amount) => set((state) => ({ 
    xp: state.xp + amount,
    level: Math.floor(Math.sqrt(state.xp + amount) / 10) + 1
  })),
})) 