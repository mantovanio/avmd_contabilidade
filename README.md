# CRM CertiID

CRM para certificacao digital com vendas, atendimento, automacoes, integracoes externas e painel administrativo.

## Links rapidos

- [Manual de atualizacao passo a passo](./MANUAL-ATUALIZACAO.txt)
- [Guia de deploy e infraestrutura](./DEPLOY.txt)
- [Documentacao tecnica para desenvolvedores](./DEVELOPER.md)
- [Guia para iniciar novo chat de desenvolvimento](./NOVO-CHAT.txt)
- [GitHub Actions do projeto](https://github.com/mantovanio/certiid/actions)
- [Site em producao](https://certiid.mantovan.com.br)

## Arquivos principais

- [Aplicacao React](./src)
- [Configuracao do app](./src/App.tsx)
- [Contexto de autenticacao](./src/contexts/AuthContext.tsx)
- [Tela de login](./src/pages/Login.tsx)
- [Tela de configuracoes](./src/pages/Configuracoes.tsx)
- [Dockerfile](./Dockerfile)
- [Docker Compose da stack](./docker-compose.yml)
- [Script de deploy na VPS](./deploy.sh)
- [Configuracao Nginx](./nginx.conf)

## Banco de dados e migrations

- [Schema de autenticacao](./sql/auth_schema.sql)
- [Migration de aprovacao de usuarios](./sql/user_approval_migration.sql)
- [Schema comercial](./sql/commercial_schema.sql)
- [Schema de clientes comerciais](./sql/clientes_comerciais_schema.sql)
- [Schema do chat Kanban](./sql/chat_kanban_schema.sql)
- [Schema de integracoes](./sql/integrations_schema.sql)
- [Migration de links de produtos](./sql/links_produtos_migration.sql)
- [Migration de renovacoes](./sql/renovacoes_migration.sql)

## Rotina recomendada para atualizar

1. Leia o [Manual de atualizacao](./MANUAL-ATUALIZACAO.txt).
2. Rode `npm run build` antes de publicar.
3. Faca commit e push na branch `main`.
4. Acompanhe o deploy em [GitHub Actions](https://github.com/mantovanio/certiid/actions).
5. Se houver arquivo SQL novo ou alterado, execute a migration no Supabase SQL Editor.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase: Auth, Postgres, Realtime e Edge Functions
- Chatwoot para WhatsApp e fila de comunicacao
- Docker Swarm + Traefik para deploy na VPS

## Funcionalidades

- Autenticacao com perfis e controle de acesso
- Cadastro publico com aprovacao manual de usuarios
- Comercial com clientes, vendas, certificados e pagamentos
- Chat ao vivo com Kanban e historico de conversa
- Configuracoes com integracoes, automacoes e usuarios
- Comunicacao assincrona via Supabase + Chatwoot

## Desenvolvimento local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

