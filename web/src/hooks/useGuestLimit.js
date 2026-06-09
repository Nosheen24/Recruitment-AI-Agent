import { useAuth } from '../context/AuthContext'

const FREE_LIMIT = 3
const KEY = 'recruitment_ai_guest_uses'

export function useGuestLimit() {
  const { user } = useAuth()

  const getCount = () => parseInt(localStorage.getItem(KEY) || '0', 10)

  const isLimited = !user && getCount() >= FREE_LIMIT
  const usesLeft  = user ? null : Math.max(0, FREE_LIMIT - getCount())

  const recordUse = () => {
    if (!user) localStorage.setItem(KEY, String(getCount() + 1))
  }

  return { isLimited, usesLeft, recordUse }
}
