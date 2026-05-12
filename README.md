# CRM CertiID

CRM para certificação digital com vendas, atendimento, automações, integrações externas e painel administrativo.

## Stack

- React + TypeScript + Vite
- Tailwind CSS
- Supabase: Auth, Postgres, Realtime e Edge Functions
- Chatwoot para WhatsApp e fila de comunicação
- Docker + Traefik para deploy na VPS

## Funcionalidades

- Autenticação com perfis e controle de acesso
- Comercial com clientes, vendas, certificados e pagamentos
- Chat ao vivo com Kanban e histórico de conversa
- Configurações com integrações, automações e usuários
- Comunicação assíncrona via Supabase + Chatwoot

## Estrutura principal

- `src/` — aplicação React
- `sql/` — schemas e migrations manuais
- `supabase/` — Edge Functions e rotinas do backend
- `docker-compose.yml` — ambiente de produção com Traefik

## Pré-requisitos

- Node.js 18+
- npm
- Conta Supabase
- VPS com Docker e Docker Compose

## Desenvolvimento

```bash
npm install
npm run dev
```
