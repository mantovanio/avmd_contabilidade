# Verificação e Importação do Workflow MCP no n8n

## 1. Verificar Workflows Existentes

Para verificar se você já possui um workflow MCP em sua instância n8n:

1. Acesse sua instância n8n em: [https://auto.mantovan.com.br/](https://auto.mantovan.com.br/)
2. Faça login com suas credenciais
3. Na página inicial, você verá a lista de todos os seus workflows existentes
4. Verifique se já existe um workflow chamado "MCP n8n Tool" ou similar

## 2. Importar o Workflow MCP

Se você não encontrou o workflow MCP, siga os passos para importá-lo:

1. Na interface do n8n, clique no botão "Workflows" no menu lateral
2. Clique no botão "+ Workflow" ou "Create Workflow" (Criar Workflow)
3. No menu superior, clique em "Import from File" (Importar de Arquivo) ou no ícone de importação
4. Selecione o arquivo `n8n-mcp-workflow-atualizado.json` que criamos
5. Após importar, clique em "Save" (Salvar) para salvar o workflow
6. Ative o workflow clicando no botão "Active" ou "Activate" (Ativar)

## 3. Configurar Autenticação do Webhook (Opcional mas Recomendado)

Para proteger seu webhook MCP:

1. No workflow importado, clique no nó "Webhook"
2. Na seção "Authentication", selecione "Basic Auth" se ainda não estiver selecionado
3. Configure um nome de usuário e senha de sua escolha
   - Usuário sugerido: `mcp_user`
   - Gere uma senha forte para segurança
4. Anote essas credenciais para uso posterior na configuração do cliente MCP
5. Clique em "Save" (Salvar) para aplicar as alterações

## 4. Obter a URL do Webhook

Para obter a URL que será utilizada pelo cliente MCP:

1. No workflow importado, clique novamente no nó "Webhook"
2. Na parte inferior do painel de configuração, você verá o campo "Webhook URL"
3. A URL completa será algo como: `https://auto.mantovan.com.br/webhook/mcp-tool`
4. Copie esta URL para uso na configuração do cliente MCP

## 5. Atualizar Arquivo de Configuração

Após obter a URL do webhook e configurar autenticação:

1. Abra o arquivo `n8n-mcp-config.json`
2. Atualize o campo `webhook.path` com o caminho correto do webhook (geralmente a parte após a última barra `/`)
3. Se você configurou autenticação básica, atualize os campos `webhook.auth.username` e `webhook.auth.password` com os valores que você definiu
4. Salve o arquivo

## 6. Testar o Webhook

Para verificar se o webhook está funcionando corretamente:

1. Com o workflow ativo, envie uma requisição POST simples para a URL do webhook
2. Você pode usar ferramentas como Postman, Insomnia ou cURL para isso
3. Envie um corpo JSON simples como:
   ```json
   {
     "action": "search_nodes",
     "query": "webhook"
   }
   ```
4. Se configurou autenticação básica, inclua o cabeçalho de autenticação correspondente
5. Você deve receber uma resposta com resultados da busca de nós