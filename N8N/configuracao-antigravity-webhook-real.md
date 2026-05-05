# Configuração do Antigravity com o Webhook Real do MCP n8n

Este guia contém instruções específicas para configurar o Antigravity com o webhook real do MCP n8n que você possui.

## Webhook Oficial

**URL do webhook**: `https://webhook.mantovan.com.br/webhook/`

## Configuração no Antigravity

### Passo 1: Carregar a Skill MCP-tools-expert

Inicie uma conversa com o Antigravity e carregue a skill dedicada para ferramentas MCP:

```
/carregar-skill mcp-tools-expert
```

### Passo 2: Configurar a Ferramenta MCP com o Webhook Real

Copie e cole exatamente o texto abaixo no chat com o Antigravity:

```
Quero configurar uma nova ferramenta MCP para n8n com os seguintes parâmetros:
- URL: https://webhook.mantovan.com.br/webhook/
- Método: POST
- Autenticação: Basic Auth
- Usuário: mcp_user
- Senha: [SUBSTITUIR_PELA_SUA_SENHA]
- Nome da ferramenta: n8n Workflow Creator
```

**Nota importante**: Substitua `[SUBSTITUIR_PELA_SUA_SENHA]` pela senha que você configurou para autenticação básica no webhook. Se você não configurou autenticação básica, remova as linhas relacionadas à autenticação.

### Passo 3: Registrar o Schema JSON

Em seguida, envie a mensagem abaixo seguida do conteúdo do arquivo `n8n-mcp-tool-schema.json`:

```
Por favor, registre este schema JSON para a ferramenta MCP n8n Workflow Creator:

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "title": "n8n Workflow Creator",
  "description": "Cria e gerencia fluxos de trabalho no n8n através do protocolo MCP",
  "additionalProperties": false,
  "required": ["action"],
  "properties": {
    "action": {
      "type": "string",
      "description": "Ação a ser executada no n8n",
      "enum": [
        "search_nodes",
        "get_node",
        "validate_node",
        "validate_workflow",
        "search_templates",
        "get_template",
        "create_workflow",
        "update_workflow",
        "execute_workflow"
      ]
    },
    "nodeType": {
      "type": "string",
      "description": "Tipo de nó do n8n (ex: n8n-nodes-base.httpRequest, n8n-nodes-base.webhook)",
      "examples": [
        "n8n-nodes-base.httpRequest",
        "n8n-nodes-base.webhook",
        "n8n-nodes-base.set",
        "n8n-nodes-base.code"
      ]
    },
    "detail": {
      "type": "string",
      "description": "Nível de detalhes a serem retornados",
      "enum": ["minimal", "standard", "full"],
      "default": "standard"
    },
    "mode": {
      "type": "string",
      "description": "Modo de operação para a ação selecionada",
      "enum": ["docs", "search_properties", "versions", "compare", "breaking", "migrations", "minimal", "full"]
    },
    "includeExamples": {
      "type": "boolean",
      "description": "Incluir exemplos reais de configurações do nó",
      "default": true
    },
    "query": {
      "type": "string",
      "description": "Consulta para pesquisa de nós ou templates"
    },
    "config": {
      "type": "object",
      "description": "Configuração do nó a ser validada",
      "additionalProperties": true
    },
    "profile": {
      "type": "string",
      "description": "Perfil de validação",
      "enum": ["minimal", "runtime", "ai-friendly", "strict"],
      "default": "runtime"
    },
    "workflow": {
      "type": "object",
      "description": "Objeto JSON completo do fluxo de trabalho n8n",
      "additionalProperties": true
    },
    "searchMode": {
      "type": "string",
      "description": "Modo de pesquisa de templates",
      "enum": ["keyword", "by_nodes", "by_task", "by_metadata"],
      "default": "keyword"
    },
    "nodeTypes": {
      "type": "array",
      "description": "Lista de tipos de nós para pesquisa de templates",
      "items": {
        "type": "string"
      }
    },
    "task": {
      "type": "string",
      "description": "Tipo de tarefa para pesquisa de templates",
      "examples": ["webhook_processing", "data_transformation", "ai_agent"]
    },
    "complexity": {
      "type": "string",
      "description": "Nível de complexidade para filtrar templates",
      "enum": ["simple", "medium", "complex"]
    },
    "requiredService": {
      "type": "string",
      "description": "Serviço requerido para filtrar templates",
      "examples": ["openai", "googlesheets", "slack"]
    },
    "targetAudience": {
      "type": "string",
      "description": "Público-alvo para filtrar templates",
      "enum": ["developers", "marketers", "analysts"]
    },
    "maxSetupMinutes": {
      "type": "integer",
      "description": "Tempo máximo de configuração em minutos para filtrar templates",
      "minimum": 1
    },
    "templateId": {
      "type": "string",
      "description": "ID do template a ser obtido"
    },
    "workflowId": {
      "type": "string",
      "description": "ID do fluxo de trabalho para operações de execução"
    },
    "operations": {
      "type": "array",
      "description": "Operações a serem realizadas em um fluxo de trabalho existente",
      "items": {
        "type": "object",
        "required": ["type"],
        "additionalProperties": true,
        "properties": {
          "type": {
            "type": "string",
            "description": "Tipo de operação",
            "enum": ["addNode", "updateNode", "removeNode", "addConnection", "removeConnection", "cleanStaleConnections"]
          }
        }
      }
    }
  }
}
```

### Passo 4: Teste da Conexão

Para confirmar que tudo está configurado corretamente, envie o seguinte comando de teste:

```
Teste a conexão com a ferramenta MCP n8n Workflow Creator usando a ação search_nodes com a query 'webhook'
```

O Antigravity deve usar a ferramenta MCP para buscar nós relacionados a webhook no n8n e exibir os resultados.

## Verificação do Webhook

### Verificar se o Workflow Associado ao Webhook está Ativo

1. Acesse sua instância n8n em: [https://auto.mantovan.com.br/](https://auto.mantovan.com.br/)
2. Navegue até o workflow que contém o webhook configurado
3. Certifique-se de que o workflow está **ativado** (status "Active")
4. Se não estiver ativo, clique no botão "Activate" para ativá-lo

### Verificar a Configuração do Webhook no Workflow

1. Dentro do workflow, clique no nó "Webhook"
2. Verifique se o caminho configurado corresponde ao final da URL do seu webhook
3. Certifique-se de que a autenticação está configurada corretamente (se aplicável)
4. Confirme que o método HTTP está definido como POST

## Exemplos de Uso

Após a configuração, você pode começar a usar o MCP n8n com comandos como:

```
Crie um workflow no n8n para monitorar novos emails no Gmail com anexos e salvar os anexos no Google Drive.
```

ou

```
Busque nós do n8n relacionados a processamento de imagens e me mostre exemplos de configuração.
```

## Solução de Problemas

Se encontrar problemas ao configurar:

1. **Erro de conexão:** Verifique se o workflow com o webhook está ativo no n8n
2. **Erro de autenticação:** Confirme se as credenciais estão corretas
3. **Webhook não encontrado:** Verifique se o URL está correto e o workflow correspondente está configurado

Para resolver problemas de conexão, você também pode testar o webhook manualmente usando uma ferramenta como Postman ou Insomnia enviando uma requisição POST para `https://webhook.mantovan.com.br/webhook/` com um corpo JSON simples:

```json
{
  "action": "search_nodes",
  "query": "webhook"
}
```

Se tiver configurado autenticação básica, inclua os cabeçalhos apropriados.