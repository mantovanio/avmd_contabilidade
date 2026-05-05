@echo off
REM Script para preparar o deploy Docker no Windows

echo ======================================
echo    Preparacao do Deploy AVMD Contabil
echo ======================================
echo.

REM Verificar se o Docker Desktop está instalado
docker --version > nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Docker nao encontrado. Por favor, instale o Docker Desktop para Windows.
    echo Download: https://www.docker.com/products/docker-desktop/
    goto :eof
)

echo Docker detectado. Preparando para build da imagem...
echo.

REM Verificar se o arquivo .env existe
if not exist .env (
    echo AVISO: Arquivo .env nao encontrado. 
    echo Criando arquivo .env padrao...
    (
        echo # Configuracoes do Supabase
        echo SUPABASE_URL=https://seu-projeto.supabase.co
        echo SUPABASE_KEY=sua-chave-anonima-supabase
        echo.
        echo # Chave da API OpenRouter
        echo OPENROUTER_KEY=sua-chave-api-openrouter
    ) > .env
    echo Criado! Por favor, edite o arquivo .env com suas credenciais reais.
    echo.
)

REM Construir a imagem
echo Construindo imagem Docker...
set VERSION=%date:~6,4%%date:~3,2%%date:~0,2%
docker build -t avmd-contabil-app:%VERSION% -t avmd-contabil-app:latest .

if %errorlevel% neq 0 (
    echo ERRO: Falha ao construir a imagem Docker.
    goto :eof
)

echo.
echo Imagem construida com sucesso!
echo Tags: avmd-contabil-app:%VERSION%, avmd-contabil-app:latest
echo.

REM Perguntar se quer executar localmente
set /p RUN_LOCAL="Deseja executar a aplicacao localmente para teste? (s/n): "
if /i "%RUN_LOCAL%"=="s" (
    echo.
    echo Iniciando container em http://localhost:8080
    echo Pressione Ctrl+C para encerrar...
    docker run --rm -p 8080:80 --env-file .env avmd-contabil-app:latest
)

echo.
echo ======================================
echo Deploy concluido! Para subir ao registro Docker:
echo 1. Execute docker login
echo 2. Execute docker tag avmd-contabil-app:latest seu-usuario/avmd-contabil-app:latest
echo 3. Execute docker push seu-usuario/avmd-contabil-app:latest
echo ======================================