import { useState } from 'react'
import { Shield, Eye, EyeOff, ArrowLeft, CheckCircle, Loader2, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

type View = 'login' | 'register' | 'forgot'

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials'))   return 'Email ou senha incorretos.'
  if (msg.includes('Email not confirmed'))          return 'Confirme seu email antes de acessar o sistema.'
  if (msg.includes('User already registered'))      return 'Este email já está cadastrado.'
  if (msg.includes('Password should be at least')) return 'A senha deve ter pelo menos 6 caracteres.'
  if (msg.includes('signup is disabled'))           return 'Novos cadastros estão desabilitados. Contate o administrador.'
  if (msg.includes('rate limit'))                   return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
  return msg
}

function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  autoFocus,
  required = true,
}: {
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  autoFocus?: boolean
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        required={required}
        className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 text-sm
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
      />
    </div>
  )
}

function PasswordInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? '••••••••'}
          required
          className="w-full border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 pr-10 text-sm
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400">
      <span className="shrink-0 mt-0.5">⚠</span>
      <span>{msg}</span>
    </div>
  )
}

function SubmitButton({ loading, label, loadingLabel }: { loading: boolean; label: string; loadingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60
        text-white font-semibold rounded-xl py-3 text-sm transition-colors
        flex items-center justify-center gap-2"
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </>
      ) : label}
    </button>
  )
}

export default function Login() {
  const { signIn, signUp, resetPassword } = useAuth()
  const [view, setView] = useState<View>('login')

  // login
  const [loginEmail,    setLoginEmail]    = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginLoading,  setLoginLoading]  = useState(false)
  const [loginError,    setLoginError]    = useState<string | null>(null)

  // register
  const [regNome,    setRegNome]    = useState('')
  const [regEmail,   setRegEmail]   = useState('')
  const [regPass,    setRegPass]    = useState('')
  const [regConfirm, setRegConfirm] = useState('')
  const [regLoading, setRegLoading] = useState(false)
  const [regError,   setRegError]   = useState<string | null>(null)
  const [regOk,      setRegOk]      = useState(false)

  // forgot
  const [forgotEmail,   setForgotEmail]   = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError,   setForgotError]   = useState<string | null>(null)
  const [forgotOk,      setForgotOk]      = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginError(null)
    setLoginLoading(true)
    const { error } = await signIn(loginEmail, loginPassword)
    if (error) setLoginError(translateError(error))
    setLoginLoading(false)
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setRegError(null)
    if (regPass !== regConfirm) { setRegError('As senhas não coincidem.'); return }
    if (regPass.length < 6)     { setRegError('A senha deve ter pelo menos 6 caracteres.'); return }
    setRegLoading(true)
    const { error } = await signUp({ nome: regNome, email: regEmail, password: regPass })
    if (error) setRegError(translateError(error))
    else setRegOk(true)
    setRegLoading(false)
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setForgotError(null)
    setForgotLoading(true)
    const { error } = await resetPassword(forgotEmail)
    if (error) setForgotError(translateError(error))
    else setForgotOk(true)
    setForgotLoading(false)
  }

  function goLogin() {
    setLoginError(null)
    setRegError(null); setRegOk(false)
    setForgotError(null); setForgotOk(false)
    setView('login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/40">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AR CERTI ID</h1>
          <p className="text-blue-300/80 text-sm mt-1">Agência de Certificação Digital</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">

          {/* ── LOGIN ── */}
          {view === 'login' && (
            <div className="p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Bem-vindo!</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Entre com sua conta para acessar o sistema
              </p>

              <form onSubmit={handleLogin} className="space-y-4">
                <InputField label="Email" type="email" value={loginEmail} onChange={setLoginEmail}
                  placeholder="seu@email.com" autoFocus />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Senha</span>
                    <button type="button" onClick={() => { setLoginError(null); setView('forgot') }}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                  <PasswordInput label="" value={loginPassword} onChange={setLoginPassword} />
                </div>

                {loginError && <ErrorBox msg={loginError} />}

                <SubmitButton loading={loginLoading} label="Entrar" loadingLabel="Entrando..." />
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Não tem conta?{' '}
                  <button type="button" onClick={() => { setLoginError(null); setView('register') }}
                    className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                    Criar conta
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* ── CRIAR CONTA ── */}
          {view === 'register' && (
            <div className="p-8">
              <button type="button" onClick={goLogin}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 -ml-1 transition-colors">
                <ArrowLeft size={15} /> Voltar ao login
              </button>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Criar conta</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Preencha os dados para solicitar acesso ao sistema
              </p>

              {regOk ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                    <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">Conta criada!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Enviamos um email de confirmação para <strong>{regEmail}</strong>.<br />
                      Depois da confirmação, o administrador precisa liberar seu primeiro acesso.
                    </p>
                  </div>
                  <button type="button" onClick={goLogin}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Voltar ao login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <InputField label="Nome completo" value={regNome} onChange={setRegNome} placeholder="Seu nome completo" />
                  <InputField label="Email" type="email" value={regEmail} onChange={setRegEmail} placeholder="seu@email.com" />

                  <div className="grid grid-cols-2 gap-3">
                    <PasswordInput label="Senha" value={regPass} onChange={setRegPass} placeholder="Mín. 6 caracteres" />
                    <PasswordInput label="Confirmar senha" value={regConfirm} onChange={setRegConfirm} />
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                    O tipo de acesso será definido pelo administrador em Configurações.
                  </p>

                  {regError && <ErrorBox msg={regError} />}

                  <SubmitButton loading={regLoading} label="Criar conta" loadingLabel="Criando..." />
                </form>
              )}
            </div>
          )}

          {/* ── RECUPERAR SENHA ── */}
          {view === 'forgot' && (
            <div className="p-8">
              <button type="button" onClick={goLogin}
                className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 -ml-1 transition-colors">
                <ArrowLeft size={15} /> Voltar ao login
              </button>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Recuperar senha</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Informe seu email e enviaremos um link para redefinir sua senha.
              </p>

              {forgotOk ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto">
                    <Mail size={28} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">Email enviado!</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Verifique a caixa de entrada de <strong>{forgotEmail}</strong>.<br />
                      O link expira em 1 hora.
                    </p>
                  </div>
                  <button type="button" onClick={goLogin}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    Voltar ao login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <InputField label="Email cadastrado" type="email" value={forgotEmail} onChange={setForgotEmail}
                    placeholder="seu@email.com" autoFocus />

                  {forgotError && <ErrorBox msg={forgotError} />}

                  <SubmitButton loading={forgotLoading} label="Enviar link de recuperação" loadingLabel="Enviando..." />
                </form>
              )}
            </div>
          )}
        </div>

        <p className="text-center text-blue-400/50 text-xs mt-6">
          © 2025 AVMD Contabilidade — CRM v1.0
        </p>
      </div>
    </div>
  )
}
