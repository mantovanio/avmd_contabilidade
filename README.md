## 🔄 Passo a Passo para Atualizar o Sistema (Manual)

Sempre que houver alterações no código enviadas para o GitHub, siga os 4 passos abaixo para aplicar a atualização na produção:

### Passo 1: Acessar a pasta na VPS
Abra o terminal da sua VPS e entre na pasta onde o projeto está localizado:
```bash
cd /root/gest-o-ar-certiid/
```

### Passo 2: Puxar o código novo do GitHub
Execute o comando para baixar as últimas atualizações do repositório:
```bash
git pull
```

### Passo 3: Compilar a Imagem Docker (Tratamento de Erros)
Para evitar os erros de conflito de pacotes do Vite/React (`ERRESOLVE`) e garantir a versão correta do Node.js, rode este comando combinado que limpa o ambiente, injeta as flags necessárias e gera o build estável:
```bash
sed -i 's/RUN npm install/RUN npm install --legacy-peer-deps/g' Dockerfile && docker build -t certiid-local:latest .
```
> *Nota: O processo de compilação leva de 1 a 3 minutos. Aguarde até que o terminal seja liberado.*

### Passo 4: Reiniciar o Container no Portainer
1. Acesse o painel do seu **Portainer** no navegador.
2. No menu lateral, vá em **Stacks** e clique na stack `certiid`.
3. Clique na aba **Editor**.
4. Sem precisar alterar o código, role até o final da página e clique no botão azul **Update the stack**.
5. Confirme a operação. O Docker Swarm reiniciará o container com a nova versão em segundos.

---

## 🛠️ Configuração da Stack no Portainer (Referência)

Caso precise recriar a Stack do zero no Portainer Web Editor, o código `docker-compose.yml` homologado para o Swarm é:

```yaml
version: '3.8'

services:
  certiid-app:
    image: certiid-local:latest
    networks:
      - minha_rede
    deploy:
      replicas: 1
      restart_policy:
        condition: on-failure
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.certiid.rule=Host(`mantovan.com.br`)"
        - "traefik.http.routers.certiid.entrypoints=websecure"
        - "traefik.http.routers.certiid.tls=true"
        - "traefik.http.routers.certiid.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.certiid.loadbalancer.server.port=80"

networks:
  minha_rede:
    external: true
    name: minha_rede
```


# CRM CertiID

<p align="center">
  <img src="https://img.shields.io/badge/stack-React%20%7C%20TypeScript%20%7C%20Supabase-blue" alt="Stack" />
  <img src="https://img.shields.io/badge/deploy-Docker%20%7C%20Traefik%20%7C%20Portainer-success" alt="Deploy" />
  <img src="https://img.shields.io/badge/status-em%20desenvolvimento-orange" alt="Status" />
  <img src="https://img.shields.io/badge/license-private-lightgrey" alt="License" />
</p>

<p align="center">
  <b>Plataforma de CRM para certificação digital</b><br>
  Gestão comercial, atendimento em tempo real, automações, integrações externas e deploy em VPS.
</p>

---

## Visão geral

O **CRM CertiID** foi criado para organizar a operação comercial e de atendimento em um único ambiente.

Ele permite:

- gerenciar clientes, empresas e oportunidades
- acompanhar vendas, certificados e renovações
- operar atendimento em Kanban com histórico de conversa
- integrar WhatsApp via Chatwoot
- automatizar eventos por webhooks
- controlar acesso por perfis de usuário
- fazer deploy em VPS com Docker e Traefik

---

## Principais recursos

### Comercial
- Cadastro e gestão de clientes e empresas
- Lançamento de vendas
- Controle de certificados, pagamentos e renovações
- Relação entre cliente, produto e tipo de venda

### Atendimento
- Kanban de atendimento
- Histórico de conversas
- Mensagens em tempo real
- Ações rápidas por card
- Organização por etapas e retorno

### Autenticação e acesso
- Login seguro
- Perfis com permissões diferentes
- Proteção de rotas
- Menu dinâmico por perfil

### Configurações
- Gestão de usuários
- Integrações externas
- Automações
- Webhooks
- Conexões com serviços de terceiros

### Comunicação
- Integração com Chatwoot
- Fila de envio para mensagens e eventos
- Histórico de conversa
- Resposta de clientes refletida no sistema

### Deploy
- Preparado para Docker
- Proxy reverso com Traefik
- Suporte a Portainer
- Deploy automatizado com GitHub Actions

---

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Chatwoot
- Docker
- Traefik
- Portainer
- GitHub Actions

---

## Estrutura do projeto

- `src/` — aplicação React
- `sql/` — scripts de banco e migrations
- `supabase/` — Edge Functions e rotinas do backend
- `docker-compose.yml` — ambiente de produção
- `.github/workflows/` — automações de deploy

---

## Pré-requisitos

### Desenvolvimento
- Node.js 18+
- npm

### Produção
- VPS Linux
- Docker
- Docker Compose
- Portainer
- Conta Supabase
- Repositório GitHub configurado

---

## Execução local

```bash
npm install
npm run dev
Build
bash

npm run build
Variáveis de ambiente
Crie um arquivo .env na raiz do projeto.

Exemplo:

env

VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
Se houver integrações adicionais:

env

VITE_CHATWOOT_BASE_URL=https://chat.seudominio.com
VITE_CHATWOOT_ACCOUNT_ID=1
VITE_CHATWOOT_API_TOKEN=seu_token
Banco de dados
O projeto depende de schemas e políticas no Supabase.

Passos
Abra o SQL Editor do Supabase
Execute os arquivos da pasta sql/
Confirme se as tabelas foram criadas
Verifique se as políticas RLS estão ativas
Publique as Edge Functions necessárias
Integrações
O sistema pode trabalhar com:

Supabase Auth
Supabase Postgres
Supabase Realtime
Supabase Edge Functions
Chatwoot
Webhooks externos
Fila de comunicação
Automação de processos
Deploy na VPS com Portainer
1. Preparar a VPS
Instale Docker e Docker Compose na VPS.

Exemplo em Ubuntu:

bash

sudo apt update
sudo apt install -y ca-certificates curl gnupg
Depois instale o Docker conforme a documentação oficial da sua distribuição.

2. Instalar o Portainer
Crie o volume:

bash

docker volume create portainer_data
Suba o Portainer:

bash

docker run -d \
  -p 8000:8000 \
  -p 9443:9443 \
  --name portainer \
  --restart=always \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest
Acesse:

https://IP_DA_VPS:9443
3. Criar a rede do projeto
Se o ambiente usar Traefik:

bash

docker network create minha_rede
4. Clonar o repositório na VPS
bash

cd /opt
git clone https://github.com/mantovanio/certiid.git certiid
cd certiid
5. Criar o arquivo .env
bash

nano /opt/certiid/.env
Exemplo:

env

VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
Salve o arquivo.

6. Subir o stack no Portainer
No Portainer:

Vá em Stacks
Clique em Add stack
Dê um nome, por exemplo: certiid
Cole o conteúdo do docker-compose.yml
Ajuste variáveis de ambiente, se necessário
Clique em Deploy the stack
7. Validar os containers
No Portainer:

abra Containers
confirme se o serviço está rodando
verifique logs se algo não subir corretamente
8. Configurar domínio e HTTPS
Se usar Traefik:

aponte o domínio para o IP da VPS
confirme os labels no docker-compose.yml
valide as rotas
teste o HTTPS
Deploy automático com GitHub Actions
O projeto está preparado para deploy automatizado.

Secrets necessários
No GitHub, adicione:

VPS_HOST
VPS_USER
VPS_SSH_KEY
Fluxo
A cada push na branch principal:

o GitHub Actions conecta na VPS via SSH
executa git pull
reinicia os containers
atualiza o ambiente em produção
Segurança
Não versionar .env
Nunca expor service_role no frontend
Usar RLS no Supabase
Proteger a VPS com SSH e firewall
Revisar acessos e permissões periodicamente
Validar tokens e webhooks antes de liberar produção
Suporte e solução de problemas
Se algo falhar:

confira os logs do container
valide as variáveis de ambiente
confirme a conexão com Supabase
teste a comunicação com Chatwoot
revise rotas, webhooks e políticas RLS
verifique se a imagem do Docker foi atualizada corretamente
Contato
Projeto mantido por Mantovan.

Se você estiver avaliando este repositório, entre em contato pelos canais internos da empresa ou pela operação responsável pelo projeto.

Licença
Projeto privado.


# 🚀 Guia de Deploy e Atualização Manual - CertiID

Este manual contém as instruções exatas para compilar e atualizar o sistema CertiID na VPS (`root@mantovan`), considerando a infraestrutura baseada em **Docker Swarm** e proxy reverso **Traefik**.

## 📌 Informações Importantes do Ambiente
* **Pasta Real do Projeto na VPS:** `/root/gest-o-ar-certiid/`
* **Rede do Cluster (Swarm/Traefik):** `minha_rede`
* **Domínio Oficial:** `mantovan.com.br`
* **Variáveis Obrigatórias (.env):** `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY`
