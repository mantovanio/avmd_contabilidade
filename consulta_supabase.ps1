$headers = @{
    "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZnJoZmlhcHJkdHd4eHBsbmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYzODc4NywiZXhwIjoyMDkwMjE0Nzg3fQ.4vem_8CmJ9adeLm05Y9bY9Ef20cna7RXThagNgX_gj4"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2ZnJoZmlhcHJkdHd4eHBsbmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDYzODc4NywiZXhwIjoyMDkwMjE0Nzg3fQ.4vem_8CmJ9adeLm05Y9bY9Ef20cna7RXThagNgX_gj4"
}

$tables = @("Horarios_comercial", "LEADS_CONSTABILIDADE", "N8N_CHAT_HOSTORIES", "SERVICOS_APICE", "avmd_crm_studo")

foreach ($table in $tables) {
    Write-Host "=== $table ===" -ForegroundColor Cyan
    try {
        $result = Invoke-RestMethod -Uri "https://gikcraaqjwyfucqgwzfx.supabase.co/rest/v1/$table?select=*&limit=2" -Headers $headers
        if ($result) {
            $result | ConvertTo-Json -Depth 5
        } else {
            Write-Host "Tabela vazia ou não encontrada"
        }
    } catch {
        Write-Host "Erro: $($_.Exception.Message)" -ForegroundColor Red
    }
    Write-Host ""
}