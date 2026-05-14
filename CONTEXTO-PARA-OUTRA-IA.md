# Contexto Para Continuar Em Outra IA

## Objetivo deste arquivo

Este arquivo resume o que foi feito ate agora no projeto `CertiID_1.0.0`
para que outra IA possa continuar o trabalho sem perder contexto.

## Arquivos criados nesta etapa

- [ESTRUTURA-V2.md](C:/projetos/CertiID_1.0.0/ESTRUTURA-V2.md)
- [sql/estrutura_relacional_v2_draft.sql](C:/projetos/CertiID_1.0.0/sql/estrutura_relacional_v2_draft.sql)

## Status atual do git

Arquivos novos ainda nao commitados:

- `ESTRUTURA-V2.md`
- `sql/estrutura_relacional_v2_draft.sql`

Arquivos nao relacionados que tambem aparecem no `git status`:

- `.claude/`
- `.vscode/`

Esses dois nao fazem parte desta entrega funcional e devem ser ignorados
ao salvar esta etapa, a menos que o usuario queira inclui-los.

## O que ja foi modelado na fase 1

Foi desenhada uma proposta v2 de banco para suportar:

- cadastro base de faturamento
- empresas vinculadas
- titulares de certificado
- pontos de atendimento
- relacao ponto x agente de registro
- vendas de certificados
- agendamentos de validacao
- certificados emitidos
- renovacoes com referencias por ID e exclusao logica
- documentos financeiros e sensiveis
- bancos
- contas bancarias
- plano de contas
- centros de custos
- formas de pagamento por parceiro/canal
- regras e lancamentos de comissao
- fechamento mensal de agentes
- ordens de pagamento por API externa
- configuracao de NFS-e
- notas fiscais de servico emitidas

## Regras de negocio importantes capturadas

### Cliente / empresa / titular

- Nem sempre cliente, empresa e titular sao a mesma entidade.
- Para `e-CNPJ`, normalmente existe empresa + titular.
- Para `e-CPF`, o titular pode ser a mesma pessoa do cadastro base.
- O cadastro base deve conter os dados de faturamento para NFS-e.

### Fluxo operacional

Fluxo correto definido:

1. cadastrar cliente
2. registrar venda
3. definir vendedor e ponto na venda
4. definir agente de registro no agendamento
5. gerar pedido depois
6. gerar protocolo depois, em outra tela/API

### Comissoes

- ha comissao para vendedor/parceiro
- ha comissao para agente de registro
- foi modelado extrato parcial/mensal
- foi modelado fechamento mensal de agentes
- foi modelado pagamento a agente via API externa

### Financeiro

Foi incorporado:

- contas bancarias
- bancos
- plano de contas
- centros de custos
- anexos financeiros
- configuracao e emissao de NFS-e

### Formas de pagamento

- as formas de pagamento nao sao globais apenas
- devem poder ser habilitadas por tipo de parceiro/canal
- exemplos considerados:
  - `ar`
  - `pa_controle_total`
  - `pa_emissor`
  - `contador`
  - `vendedor`
  - `gestor`
  - `ecommerce`

## Fontes de negocio consideradas

Durante a conversa foram considerados:

- telas de venda, cadastro, protocolo, relatorios, financeiro, bancos, plano
  de contas, centros de custos, formas de pagamento e NFS-e
- uma amostragem de planilha real com colunas como:
  - protocolo
  - nome
  - documento
  - nome do titular
  - documento do titular
  - produto
  - validade
  - numero de serie
  - nome do AVP
  - nome do ACI
  - local de atendimento
  - NFe
  - nome do parceiro
  - contador parceiro
  - tipo de emissao
  - protocolo renovacao
  - catalogo
  - periodo de uso
  - videoconferencia
  - grupo

Essa amostragem foi usada para refinar a modelagem.

## Arquivo de desenho funcional

O arquivo [ESTRUTURA-V2.md](C:/projetos/CertiID_1.0.0/ESTRUTURA-V2.md)
descreve a proposta de forma funcional e em portugues claro.

Ele deve ser lido primeiro pela outra IA.

## Arquivo SQL draft

O arquivo [sql/estrutura_relacional_v2_draft.sql](C:/projetos/CertiID_1.0.0/sql/estrutura_relacional_v2_draft.sql)
e apenas um rascunho de migration.

Importante:

- ainda nao foi aplicado no banco
- precisa de revisao antes de virar migration oficial
- serve como base para a proxima IA consolidar a fase 1

## Proximo passo recomendado

A proxima IA deve fazer nesta ordem:

1. revisar `ESTRUTURA-V2.md` com o usuario
2. revisar o `sql/estrutura_relacional_v2_draft.sql`
3. quebrar a implementacao em etapas pequenas
4. criar a migration oficial v2
5. so depois adaptar telas e relatorios

## Observacao importante de seguranca

Durante a conversa foi identificado que existe uma `service_role key`
exposta em:

- [src/lib/supabaseAdmin.ts](C:/projetos/CertiID_1.0.0/src/lib/supabaseAdmin.ts)

Isso precisa ser corrigido antes da implementacao de documentos sensiveis,
embora ainda nao tenha sido tratado nesta etapa.

## Comando sugerido para salvar esta etapa

Se o usuario quiser salvar apenas este trabalho no git, usar:

```powershell
git add ESTRUTURA-V2.md sql/estrutura_relacional_v2_draft.sql CONTEXTO-PARA-OUTRA-IA.md
git commit -m "Documenta estrutura relacional v2 e contexto de continuidade"
```
