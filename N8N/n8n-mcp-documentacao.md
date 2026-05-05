# Documentação MCP para n8n

## Visão Geral

O Model Context Protocol (MCP) para n8n permite que agentes de IA (como Claude, GPT e outros) interajam diretamente com a plataforma n8n, automatizando a criação, edição e execução de fluxos de trabalho. Esta ferramenta serve como uma ponte entre os agentes de IA e a plataforma n8n, possibilitando uma automação mais inteligente e contextualizada.

## Configuração

### Pré-requisitos

1. Uma instância do n8n em execução
2. Acesso para importar fluxos de trabalho no n8n
3. Um cliente MCP configurado (Claude Desktop, Claude Code, Cursor, Windsurf ou Antigravity)

### Passos para Instalação

1. Importe o arquivo `n8n-mcp-workflow.json` para sua instância n8n
2. Ative o fluxo de trabalho
3. Configure o MCP no cliente de IA apontando para o URL do webhook criado
4. Teste a conexão

## Estrutura da Ferramenta MCP

O MCP para n8n expõe várias ações que permitem interagir com diferentes aspectos da plataforma:

### Ações Disponíveis

| Ação | Descrição |
|------|-----------|
| `search_nodes` | Busca nós do n8n por palavras-chave |
| `get_node` | Obtém informações detalhadas sobre um nó específico |
| `validate_node` | Valida uma configuração de nó específica |
| `validate_workflow` | Valida um fluxo de trabalho completo |
| `search_templates` | Pesquisa templates de fluxos de trabalho |
| `get_template` | Obtém um template específico |
| `create_workflow` | Cria um novo fluxo de trabalho |
| `update_workflow` | Atualiza um fluxo de trabalho existente |
| `execute_workflow` | Executa um fluxo de trabalho |

## Como Usar

### 1. Buscar Nós (`search_nodes`)

Permite buscar nós do n8n por palavras-chave, facilitando a descoberta de nós adequados para uma tarefa específica.

**Parâmetros:**
- `query`: Termo de busca para filtrar os nós
- `includeExamples`: Booleano para incluir exemplos reais de configuração

**Exemplo de Uso:**
```json
{
  "action": "search_nodes",
  "query": "webhook",
  "includeExamples": true
}
```

### 2. Obter Informações de Nó (`get_node`)

Recupera informações detalhadas sobre um nó específico, incluindo propriedades e documentação.

**Parâmetros:**
- `nodeType`: Tipo do nó (ex: n8n-nodes-base.httpRequest)
- `detail`: Nível de detalhes ('minimal', 'standard', 'full')
- `includeExamples`: Booleano para incluir exemplos reais
- `mode`: Modo de recuperação ('docs', 'search_properties', etc.)

**Exemplo de Uso:**
```json
{
  "action": "get_node",
  "nodeType": "n8n-nodes-base.httpRequest",
  "detail": "standard",
  "includeExamples": true
}
```

### 3. Validar Nó (`validate_node`)

Valida uma configuração de nó, verificando se todos os campos obrigatórios estão presentes e se os valores são válidos.

**Parâmetros:**
- `nodeType`: Tipo do nó a ser validado
- `config`: Configuração do nó para validação
- `mode`: Modo de validação ('minimal', 'full')
- `profile`: Perfil de validação ('runtime', 'ai-friendly', 'strict')

**Exemplo de Uso:**
```json
{
  "action": "validate_node",
  "nodeType": "n8n-nodes-base.httpRequest",
  "config": {
    "url": "https://api.example.com/data",
    "method": "GET",
    "authentication": "none"
  },
  "mode": "full",
  "profile": "runtime"
}
```

### 4. Pesquisar Templates (`search_templates`)

Busca por templates de fluxos de trabalho com base em diferentes critérios.

**Parâmetros:**
- `searchMode`: Modo de busca ('keyword', 'by_nodes', 'by_task', 'by_metadata')
- `query`: Termo de busca para o modo 'keyword'
- `nodeTypes`: Lista de tipos de nós para o modo 'by_nodes'
- `task`: Tipo de tarefa para o modo 'by_task'
- Diversos parâmetros para filtrar por metadados

**Exemplo de Uso:**
```json
{
  "action": "search_templates",
  "searchMode": "by_task",
  "task": "webhook_processing"
}
```

### 5. Obter Template (`get_template`)

Recupera um template específico de fluxo de trabalho.

**Parâmetros:**
- `templateId`: ID do template a ser recuperado

**Exemplo de Uso:**
```json
{
  "action": "get_template",
  "templateId": "template-123"
}
```

### 6. Criar Fluxo de Trabalho (`create_workflow`)

Cria um novo fluxo de trabalho no n8n.

**Parâmetros:**
- `workflow`: Objeto JSON completo do fluxo de trabalho

**Exemplo de Uso:**
```json
{
  "action": "create_workflow",
  "workflow": {
    "name": "Meu Fluxo de Trabalho",
    "nodes": [...],
    "connections": {...}
  }
}
```

## Integração com Agentes de IA

### Claude Code / Claude Desktop

1. Configure um novo projeto MCP
2. Adicione a URL do webhook n8n como endpoint da ferramenta
3. Use o schema da ferramenta do arquivo `n8n-mcp-tool-schema.json`
4. Teste a ferramenta usando as instruções do sistema recomendadas

### Antigravity

1. Adicione a skill de MCP-tools-expert
2. Configure a ferramenta apontando para o webhook n8n
3. Use as diretrizes de configuração fornecidas na skill

## Boas Práticas

1. **Teste em ambiente de desenvolvimento**: Nunca edite fluxos de trabalho de produção diretamente com IA
2. **Faça backup**: Sempre exporte seus fluxos de trabalho importantes antes de modificá-los
3. **Validação completa**: Use a ação `validate_workflow` antes de implantar fluxos de trabalho em produção
4. **Verificação de erros**: Sempre verifique os erros retornados pelas ações MCP e corrija-os antes de prosseguir
5. **Parâmetros explícitos**: Configure explicitamente todos os parâmetros importantes, não confie nos valores padrão

## Solução de Problemas

### Erros Comuns

| Erro | Possível Solução |
|------|------------------|
| "Tipo de nó não encontrado" | Verifique o nome do tipo de nó, incluindo o prefixo correto (n8n-nodes-base) |
| "Campo obrigatório não encontrado" | Adicione todos os campos obrigatórios na configuração do nó |
| "Ação não implementada" | Verifique se está usando uma das ações suportadas listadas acima |
| "URL contém expressões não resolvidas" | Substitua expressões dinâmicas por valores reais ou use o perfil de validação apropriado |

### Depuração

Para depurar problemas com o MCP n8n:

1. Verifique os logs de execução do fluxo de trabalho no n8n
2. Valide o formato JSON das solicitações MCP
3. Use o modo de validação "full" para obter informações detalhadas sobre problemas de configuração
4. Consulte a documentação do n8n para entender as propriedades específicas de cada nó

## Exemplos de Uso

### Cenário 1: Criar um Fluxo de Trabalho para Notificações Slack

```json
{
  "action": "search_templates",
  "query": "slack notification"
}
```

Seguido por:

```json
{
  "action": "get_template",
  "templateId": "[ID do template encontrado]"
}
```

### Cenário 2: Validar uma Configuração de Webhook

```json
{
  "action": "validate_node",
  "nodeType": "n8n-nodes-base.webhook",
  "config": {
    "httpMethod": "POST",
    "path": "incoming-data",
    "options": {
      "responseMode": "lastNode"
    }
  },
  "mode": "full"
}
```

## Recursos Adicionais

- [Repositório GitHub n8n-mcp](https://github.com/czlonkowski/n8n-mcp)
- [Documentação Oficial do n8n](https://docs.n8n.io/)
- [Guia de Expressões n8n](https://docs.n8n.io/code-examples/expressions/)
- [Modelos de Fluxos de Trabalho n8n](https://n8n.io/workflows)