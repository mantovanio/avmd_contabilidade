@echo off
title Dashboard AVMD Contabil
color 0A
echo.
echo  Iniciando Dashboard AVMD Contabil...
echo.

powershell -NoExit -Command "Set-Location 'g:\Meu Drive\DOC\CERTIFICA\u00c7\u00c3O Digital\GESTAO AR (SISTEMA)\ANTIGRAVITY\agente_ia_contabilidade\web-app'; Write-Host 'Servidor iniciando...' -ForegroundColor Green; Start-Sleep 2; Start-Process 'http://localhost:5173'; npm run dev"
