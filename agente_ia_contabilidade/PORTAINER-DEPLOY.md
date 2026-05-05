# Implantação AVMD Contábil com Portainer

Este guia explica como implantar a aplicação AVMD Contábil utilizando o Portainer.

## Pré-requisitos

1. Portainer instalado e em execução em seu servidor
2. Acesso administrativo ao Portainer
3. Imagem Docker criada e disponível (localmente ou em um registro)

## Opções de Implantação

Existem duas maneiras de implantar a aplicação via Portainer:

### Opção 1: Usando o Docker Compose

1. **Acesse o Portainer** (normalmente em https://seu-servidor:9000 ou https://seu-servidor:9443)
2. **Faça login** com suas credenciais
3. **Selecione o ambiente** (geralmente "local")
4. No menu lateral esquerdo, clique em **Stacks**
5. Clique no botão **+ Add stack**
6. Preencha os seguintes campos:
   - **Name**: `avmd-contabil`
   - **Build method**: escolha "Upload" ou "Repository Git", dependendo de onde está seu código
   - Se escolher "Upload", faça upload do arquivo `docker-compose.yml` do seu projeto
   - Se escolher "Repository Git", forneça a URL do repositório Git e o caminho para o arquivo docker-compose.yml
7. Em **Environment variables**, adicione as seguintes variáveis:
   - `SUPABASE_URL`: URL da sua instância Supabase
   - `SUPABASE_KEY`: Chave anônima do Supabase
   - `OPENROUTER_KEY`: Chave da API OpenRouter
8. Clique em **Deploy the stack**

### Opção 2: Usando Containers Individuais

1. **Acesse o Portainer** e faça login
2. **Selecione o ambiente**
3. No menu lateral, clique em **Containers**
4. Clique no botão **+ Add container**
5. Preencha os seguintes campos:
   - **Name**: `avmd-contabil-app`
   - **Image**: `seu-usuario/avmd-contabil-app:latest` (ou o caminho da sua imagem)
   - **Port mapping**: `8080:80` (isso mapeia a porta 8080 do host para a porta 80 do container)
6. Na seção **Advanced container settings**:
   - **Network**: crie ou escolha uma rede existente
   - **Env**: adicione as variáveis de ambiente necessárias (SUPABASE_URL, SUPABASE_KEY, OPENROUTER_KEY)
   - **Restart policy**: Unless stopped
7. Clique em **Deploy the container**

## Verificação da Implantação

Após a implantação, você pode acessar a aplicação em:

```
http://seu-servidor:8080
```

## Solução de Problemas

Se encontrar problemas durante a implantação, verifique:

1. **Logs do Container**: Acesse os logs do container no Portainer para ver erros específicos
2. **Conectividade de Rede**: Certifique-se de que o container pode se comunicar com o Supabase
3. **Variáveis de Ambiente**: Verifique se todas as variáveis de ambiente necessárias estão definidas corretamente

## Atualização da Aplicação

Para atualizar a aplicação:

1. Construa uma nova versão da imagem usando o script `build-and-push.sh`
2. No Portainer, acesse o container ou stack
3. Para um container individual, clique em **Recreate**
4. Para um stack, clique em **Update the stack** e então em **Pull and redeploy**

## Backup dos Dados

Os dados da aplicação são armazenados em:
- Banco de dados Supabase (dados principais)
- Volume Docker `app_data` (dados locais, se houver)

Para fazer backup do volume Docker:
1. No Portainer, vá para **Volumes**
2. Localize o volume `app_data`
3. Use a opção de backup para criar uma cópia dos dados