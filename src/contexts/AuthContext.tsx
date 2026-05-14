import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from '@/types'

export interface SignUpData {
  nome: string
  email: string
  password: string
}

interface AuthContextValue {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (data: SignUpData) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: string | null }>
  updatePassword: (password: string) => Promise<{ error: string | null }>
  isPasswordRecovery: boolean
  finishPasswordRecovery: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)

  function hasRecoveryUrl() {
    const params = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    return params.get('reset_password') === '1' || params.get('type') === 'recovery' || hashParams.get('type') === 'recovery'
  }

  function clearRecoveryUrl() {
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  async function loadProfile(userId: string) {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
    setProfile(data ?? null)
    setLoading(false)
  }

  async function refreshProfile() {
    if (user) await loadProfile(user.id)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user && hasRecoveryUrl()) setIsPasswordRecovery(true)
      if (session?.user) void loadProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY' || (session?.user && hasRecoveryUrl())) setIsPasswordRecovery(true)
      if (session?.user) void loadProfile(session.user.id)
      else {
        setProfile(null)
        setIsPasswordRecovery(false)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signUp({ nome, email, password }: SignUpData) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome } },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    setIsPasswordRecovery(false)
    clearRecoveryUrl()
    await supabase.auth.signOut()
  }

  async function resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/?reset_password=1`,
    })
    return { error: error?.message ?? null }
  }

  async function updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password })
    return { error: error?.message ?? null }
  }

  function finishPasswordRecovery() {
    setIsPasswordRecovery(false)
    clearRecoveryUrl()
  }

  return (
    <AuthContext.Provider value={{ user, profile, session, loading, signIn, signUp, signOut, resetPassword, updatePassword, isPasswordRecovery, finishPasswordRecovery, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
