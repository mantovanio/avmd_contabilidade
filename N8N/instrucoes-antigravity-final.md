# Instruções Finais: Configuração do Antigravity com MCP n8n

Este guia contém instruções específicas para configurar e usar o Antigravity com o webhook MCP n8n.

## Webhook Oficial

**URL do webhook**: `https://webhook.mantovan.com.br/webhook/mcp-tools`

## Configuração Passo a Passo no Antigravity

### 1. Carregar a Skill MCP-tools-expert

Para começar, inicie uma conversa com o Antigravity e digite o seguinte comando para carregar a skill necessária:

```
/carregar-skill mcp-tools-expert
```

Aguarde a confirmação de que a skill foi carregada com sucesso.

### 2. Configurar a Ferramenta MCP com o URL Correto

Copie e cole o texto abaixo exatamente como está, substituindo apenas a senha se necessário:

```
Quero configurar uma nova ferramenta MCP para n8n com os seguintes parâmetros:
- URL: https://webhook.mantovan.com.br/webhook/mcp-tools
- Método: POST
- Autenticação: Basic Auth
- Usuário: mcp_user
- Senha: [SUBSTITUIR_PELA_SUA_SENHA]
- Nome da ferramenta: n8n Workflow Creator
```

**Nota**: Se você não configurou autenticação básica no webhook, remova as linhas de autenticação.

### 3. Registrar o Schema JSON da Ferramenta

Envie a seguinte mensagem para o Antigravity:

```
Por favor, registre este schema JSON para a ferramenta MCP n8n Workflow Creator:
```

Em seguida, copie e cole o conteúdo do arquivo `n8n-mcp-tool-schema.json`.

### 4. Testar a Conexão

Para confirmar que tudo está configurado corretamente, envie este comando de teste:

```
Teste a conexão com a ferramenta MCP n8n Workflow Creator usando a ação search_nodes com a query 'webhook'
```

## Exemplos de Uso

Depois de confirmar que a conexão está funcionando, você pode começar a usar comandos como:

### 1. Buscar Nós do n8n

```
Busque nós do n8n relacionados a automação de emails.
```

### 2. Obter Detalhes de um Nó

```
Mostre detalhes completos do nó n8n-nodes-base.gmail do n8n.
```

### 3. Criar um Workflow Simples

```
Crie um workflow no n8n que monitore novos emails no Gmail com a palavra "importante" no assunto e envie uma notificação para o Slack.
```

### 4. Buscar Templates de Workflow

```
Busque templates de workflows no n8n para integração com Google Sheets.
```

### 5. Validar Configuração de Nó

```
Valide esta configuração para o nó n8n-nodes-base.httpRequest:
{
  "url": "https://api.exemplo.com/dados",
  "method": "GET",
  "authentication": "none"
}
```

## Solicitações de Workflow Complexas

Para workflows mais complexos, use descrições detalhadas como:

```
Preciso criar um workflow no n8n que faça o seguinte:

1. Monitore um feed RSS de notícias a cada 30 minutos
2. Filtre apenas entradas que contenham as palavras "tecnologia" ou "inovação"
3. Para cada notícia filtrada, use a API do OpenAI para gerar um resumo de 3 parágrafos
4. Envie o resumo para um canal específico do Slack
5. Salve os detalhes (título, link, resumo e data) em uma planilha Google Sheets
6. Se o processo falhar em qualquer ponto, envie um email de notificação de erro

Detalhes importantes:
- O feed RSS é: https://example.com/feed.xml
- O canal do Slack é: #noticias-tech
- Cada resumo deve ter no máximo 300 palavras
- A planilha deve organizar os dados com cabeçalhos claros
```

## Solução de Problemas

### Se o Antigravity não conseguir se conectar:

1. Verifique se o workflow com o webhook está ativo no n8n
2. Confirme se a URL está correta: `https://webhook.mantovan.com.br/webhook/mcp-tools`
3. Verifique se as credenciais de autenticação (se configuradas) estão corretas
4. Teste o webhook manualmente com uma ferramenta como Postman ou Insomnia

### Se as respostas do Antigravity não forem úteis:

1. Seja mais específico em suas solicitações
2. Forneça exemplos claros do que você espera
3. Construa workflows gradualmente, começando com partes simples

## Comandos Avançados

### Explorar Nós por Categoria

```
Mostre-me os principais nós do n8n para:
1. Gatilhos (triggers)
2. Processamento de dados
3. Integrações com serviços de email
```

### Workflow com Tratamento de Erros

```
Crie um workflow robusto no n8n com tratamento de erros completo para integração entre Stripe e HubSpot.
```

### Otimização de Workflow

```
Analise este workflow e sugira otimizações para melhorar a performance e reduzir o uso de recursos:
[COLE_JSON_DO_WORKFLOW]
```

Lembre-se que o Antigravity com o MCP n8n pode ajudar a criar, gerenciar e otimizar seus workflows de automação, economizando tempo e reduzindo erros no processo de desenvolvimento.