# Comandos Rápidos: MCP n8n + Antigravity

Este documento contém comandos rápidos para usar o MCP n8n com o Antigravity. Utilize estes comandos para agilizar a criação e gerenciamento de workflows no n8n.

## Comandos Iniciais

### Carregar a Skill MCP
```
/carregar-skill mcp-tools-expert
```

### Configurar Ferramenta MCP
```
Quero configurar uma nova ferramenta MCP para n8n com os seguintes parâmetros:
- URL: https://auto.mantovan.com.br/webhook/mcp-tool
- Método: POST
- Autenticação: Basic Auth
- Usuário: mcp_user
- Senha: [SENHA_CONFIGURADA]
- Nome da ferramenta: n8n Workflow Creator
```

## Busca de Nós e Informações

### Buscar Nós
```
Busque nós do n8n relacionados a email.
```

### Buscar Nós com Exemplos
```
Busque nós do n8n relacionados a webhook e inclua exemplos de configuração.
```

### Obter Detalhes de um Nó
```
Mostre detalhes completos do nó n8n-nodes-base.httpRequest.
```

### Obter Documentação de um Nó
```
Mostre a documentação do nó n8n-nodes-base.gmail.
```

### Buscar Propriedades Específicas
```
Busque propriedades relacionadas a autenticação no nó n8n-nodes-base.slack.
```

## Templates e Workflows

### Buscar Templates por Palavra-chave
```
Busque templates de fluxos de trabalho no n8n relacionados a "notificação slack".
```

### Buscar Templates por Tarefa
```
Busque templates no n8n para a tarefa de processamento de webhook.
```

### Buscar Templates por Nós
```
Busque templates no n8n que usam os nós Gmail e Slack.
```

### Buscar Templates Simples
```
Busque templates simples no n8n que possam ser configurados em menos de 15 minutos.
```

### Obter Template Específico
```
Obtenha o template completo com ID [ID_DO_TEMPLATE].
```

## Validação e Testes

### Validar Configuração de Nó (Básico)
```
Valide esta configuração para o nó n8n-nodes-base.httpRequest:
{
  "url": "https://api.exemplo.com/dados",
  "method": "GET",
  "authentication": "none"
}
```

### Validar Configuração de Nó (Completo)
```
Faça uma validação completa desta configuração para o nó n8n-nodes-base.webhook:
{
  "httpMethod": "POST",
  "path": "incoming-data",
  "options": {
    "responseMode": "lastNode"
  }
}
```

### Validar Workflow Completo
```
Valide este workflow completo para garantir que está configurado corretamente:
[COLE_JSON_DO_WORKFLOW]
```

## Criação de Workflows

### Workflow Simples
```
Crie um workflow no n8n que monitore novos emails no Gmail e envie uma notificação no Telegram.
```

### Workflow com Detalhes Específicos
```
Crie um workflow no n8n para:
1. Monitorar tweets com a hashtag #n8n
2. Salvar os tweets em uma planilha Google
3. Enviar um resumo diário por email
```

### Workflow com Tratamento de Erros
```
Crie um workflow no n8n para processar pagamentos, com ênfase em tratamento de erros e notificações em caso de falha.
```

### Workflow Baseado em Template
```
Adapte o template de monitoramento de email para incluir também integração com Microsoft Teams além do Slack.
```

## Casos de Uso Específicos

### Integração de API
```
Crie um workflow no n8n que integre a API do GitHub para monitorar novos issues e enviar alertas no Discord.
```

### Automação de Dados
```
Crie um workflow no n8n para sincronizar contatos entre HubSpot e Mailchimp diariamente.
```

### Monitoramento e Alertas
```
Crie um workflow no n8n para monitorar o tempo de resposta de um website e alertar via SMS se ultrapassar 2 segundos.
```

### Processamento de Documentos
```
Crie um workflow no n8n que monitore uma pasta do Google Drive, extraia texto de novos PDFs e gere resumos usando IA.
```

## Modificações e Atualizações

### Adicionar Tratamento de Erros
```
Adicione tratamento de erros ao workflow atual para que envie um email em caso de falha.
```

### Otimizar Performance
```
Otimize o workflow atual para processar dados em lotes e reduzir o número de requisições API.
```

### Adicionar Nó
```
Adicione um nó Telegram depois do nó HTTP Request para enviar os resultados da API.
```

### Adicionar Condicionais
```
Adicione uma condição ao workflow para processar apenas emails com anexos.
```

## Dicas Avançadas

### Copie estes exemplos e adapte-os às suas necessidades específicas
### Para melhores resultados, forneça detalhes claros sobre os requisitos do workflow
### Peça sempre validação dos nós e do workflow completo
### Solicite exemplos práticos quando não estiver seguro sobre uma configuração