import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const serviceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY as string

if (!serviceRoleKey) {
  throw new Error('VITE_SUPABASE_SERVICE_ROLE_KEY não definida no .env')
}

// ATENÇÃO: este cliente bypassa o RLS — use somente em operações administrativas
// que não podem ser feitas pelo cliente anon. Nunca exponha chamadas deste cliente
// em rotas acessíveis ao usuário final sem validação de perfil admin no servidor.
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})
