#!/bin/sh

# Gera o arquivo de configuração JavaScript com as variáveis de ambiente
cat << EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  SUPABASE_URL: "${SUPABASE_URL}",
  SUPABASE_KEY: "${SUPABASE_KEY}",
  OPENROUTER_KEY: "${OPENROUTER_KEY}"
};
EOF

# Executa o comando original
exec "$@"