# Configuração do MCP n8n com Claude

Este guia mostra como configurar o MCP n8n para ser usado com o Claude (Claude Desktop, Claude Code ou Claude Web).

## Pré-requisitos

1. Workflow MCP instalado e ativo no seu n8n
2. URL do webhook MCP obtido (exemplo: `https://auto.mantovan.com.br/webhook/mcp-tool`)
3. Credenciais de autenticação do webhook (se configuradas)
4. Acesso ao Claude Desktop, Claude Code ou Claude Web

## Configuração com Claude Desktop/Claude Code

### 1. Criar um Novo Projeto

1. Abra o Claude Desktop ou Claude Code
2. Crie um novo projeto ou use um projeto existente
3. Vá para as configurações do projeto

### 2. Adicionar Ferramenta MCP

1. Na seção "Tools" (Ferramentas) ou "MCP Tools", clique em "Add Tool" (Adicionar Ferramenta)
2. Preencha as informações:
   - **Name**: n8n Workflow Creator
   - **Description**: Cria e gerencia fluxos de trabalho no n8n
   - **Endpoint URL**: Cole a URL completa do webhook (ex: `https://auto.mantovan.com.br/webhook/mcp-tool`)
   - **Authentication**: Se configurou autenticação básica, selecione "Basic Auth" e forneça o usuário e senha

### 3. Adicionar Schema JSON

1. Ainda na configuração da ferramenta, procure a opção para adicionar um schema JSON
2. Cole o conteúdo do arquivo `n8n-mcp-tool-schema.json` ou carregue o arquivo
3. Salve a configuração da ferramenta

### 4. Testar a Ferramenta

1. Depois de salvar a configuração, teste a ferramenta com uma pergunta simples
2. Exemplo: "Busque nós relacionados a webhook no n8n"
3. Claude deve usar a ferramenta para fazer a busca e retornar os resultados

## Configuração com Claude Web (Anthropic Console)

### 1. Acessar o Console da Anthropic

1. Acesse [console.anthropic.com](https://console.anthropic.com) e faça login
2. Crie um novo projeto ou use um projeto existente

### 2. Configurar Ferramenta MCP

1. Nas configurações do projeto, procure por "Tools" ou "MCP Configuration"
2. Adicione uma nova ferramenta com as informações:
   - **Name**: n8n Workflow Creator
   - **Description**: Cria e gerencia fluxos de trabalho no n8n
   - **Schema**: Cole o conteúdo do arquivo `n8n-mcp-tool-schema.json`
   - **Endpoint URL**: Cole a URL completa do webhook
   - **Authentication**: Configure a autenticação básica se necessário

### 3. Instruções do Sistema

Para obter melhores resultados, adicione estas instruções do sistema ao seu prompt:

```
Você é um especialista em automação usando n8n com acesso à ferramenta MCP n8n. Use as ferramentas MCP para ajudar o usuário a criar, modificar e depurar fluxos de trabalho no n8n. Siga sempre estas práticas:

1. Sempre busque nós adequados usando search_nodes antes de sugerir configurações
2. Valide todas as configurações de nó com validate_node antes de finalizar
3. Busque templates existentes com search_templates antes de criar do zero
4. Configure explicitamente todos os parâmetros importantes nos nós
5. Adicione tratamento de erros nos fluxos de trabalho
6. Nunca confie em valores padrão; sempre defina explicitamente

Execute as ferramentas de forma silenciosa e responda apenas após completar todas as operações necessárias.
```

## Configuração com Antigravity

### 1. Configurar a Skill MCP-tools-expert

1. Verifique se a skill `mcp-tools-expert` está ativada no seu ambiente Antigravity
2. Abra a configuração da skill

### 2. Adicionar Configuração do MCP n8n

1. Na configuração da skill, adicione as informações do seu MCP n8n:
   - URL do webhook
   - Credenciais de autenticação (se necessário)
   - Copie o schema da ferramenta do arquivo `n8n-mcp-tool-schema.json`

### 3. Testar a Integração

1. Faça uma pergunta relacionada a automação n8n
2. Verifique se o Antigravity aciona corretamente a skill e se conecta ao seu webhook MCP

## Solução de Problemas

### Erro de Conexão

Se Claude não conseguir se conectar ao webhook:

1. Verifique se o workflow está ativo no n8n
2. Confirme se a URL está correta e acessível publicamente
3. Teste o webhook diretamente com ferramentas como Postman ou cURL

### Erro de Autenticação

Se houver problemas com a autenticação:

1. Verifique se as credenciais estão corretas
2. Confirme o formato da autenticação (Basic Auth)
3. Certifique-se de que o cabeçalho de autenticação está sendo enviado corretamente

### Erros de Schema

Se Claude relatar problemas com o schema da ferramenta:

1. Verifique se o schema JSON está válido (sem erros de sintaxe)
2. Confirme se todos os campos obrigatórios estão presentes
3. Compare com a versão mais recente do schema no repositório n8n-mcp

## Exemplo de Uso

Após configurar corretamente, você pode pedir ao Claude:

```
Crie um fluxo de trabalho no n8n que monitore novos e-mails no Gmail e envie uma notificação no Slack quando um e-mail importante chegar.
```

Claude deve usar o MCP para:
1. Buscar os nós relevantes (Gmail, Slack)
2. Obter configurações e exemplos
3. Validar as configurações antes de apresentar a solução final