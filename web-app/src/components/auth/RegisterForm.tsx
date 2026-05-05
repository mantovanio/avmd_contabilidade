import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, Loader2 } from 'lucide-react';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
          <Loader2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 dark:text-white">Conta criada com sucesso!</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Redirecionando para a página de login...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          E-mail
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:border-transparent sm:text-sm transition-all"
            placeholder="seu@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Senha
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1e293b] focus:border-transparent sm:text-sm transition-all"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-slate-200 dark:shadow-none text-sm font-semibold text-white bg-[#1e293b] hover:bg-[#334155] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1e293b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <Loader2 className="animate-spin h-5 w-5" />
        ) : (
          <div className="flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Criar minha conta
          </div>
        )}
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Já tem uma conta?{' '}
          <Link to="/login" className="font-semibold text-[#1e293b] dark:text-slate-300 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  );
}
