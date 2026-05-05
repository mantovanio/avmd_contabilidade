// Arquivo para carregamento de configurações
window.AppConfig = {
    loadEnvVariables: function() {
        // Variáveis de ambiente que podem ser definidas via Docker
        if (window._env_ && window._env_.SUPABASE_URL) {
            localStorage.setItem('avmd_supabase_url', window._env_.SUPABASE_URL);
        }
        
        if (window._env_ && window._env_.SUPABASE_KEY) {
            localStorage.setItem('avmd_supabase_key', window._env_.SUPABASE_KEY);
        }
        
        if (window._env_ && window._env_.OPENROUTER_KEY) {
            localStorage.setItem('avmd_api_key', window._env_.OPENROUTER_KEY);
        }
        
        console.log('Configurações carregadas');
    }
};

// Carregar variáveis ao iniciar
document.addEventListener('DOMContentLoaded', function() {
    window.AppConfig.loadEnvVariables();
});