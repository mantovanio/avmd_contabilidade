# Instruções Finais: MCP n8n com Antigravity

## Webhook Confirmado

✅ **URL do webhook**: `https://webhook.mantovan.com.br/webhook/mcp-tools`

O webhook está **protegido com autenticação**, o que confirma que ele está configurado corretamente para segurança.

## Configuração no Antigravity

### 1. Carregar a Skill MCP

```
/carregar-skill mcp-tools-expert
```

### 2. Configurar a Ferramenta MCP

```
Quero configurar uma nova ferramenta MCP para n8n com os seguintes parâmetros:
- URL: https://webhook.mantovan.com.br/webhook/mcp-tools
- Método: POST
- Autenticação: Basic Auth
- Usuário: mcp_user
- Senha: [SUA_SENHA_AQUI]
- Nome da ferramenta: n8n Workflow Creator
```

**IMPORTANTE**: Substitua `[SUA_SENHA_AQUI]` pela senha correta que você configurou no webhook.

### 3. Registrar o Schema JSON

```
Por favor, registre este schema JSON para a ferramenta MCP n8n Workflow Creator:
```

Em seguida, copie e cole o conteúdo do arquivo `n8n-mcp-tool-schema.json`.

### 4. Testar a Conexão

```
Teste a conexão com a ferramenta MCP n8n Workflow Creator usando a ação search_nodes com a query 'webhook'
```

## Exemplos Práticos para Uso Imediato

### Explorar Nós do n8n

```
Busque nós do n8n relacionados a automação de emails e me mostre os 3 mais relevantes com exemplos de configuração.
```

### Criar Workflow Simples

```
Crie um workflow no n8n para monitorar novos emails no Gmail e enviar notificações no Slack quando receber mensagens importantes.
```

### Buscar e Adaptar Templates

```
Busque templates de workflows no n8n para processamento de documentos e adapte o mais relevante para trabalhar com PDFs do Google Drive.
```

## Solução de Problemas de Autenticação

Se encontrar problemas com a autenticação:

1. **Verifique as credenciais**:
   - Confirme o nome de usuário e senha configurados no webhook
   - Certifique-se de que está usando as mesmas credenciais na configuração do Antigravity

2. **Teste a autenticação manualmente**:
   - Use uma ferramenta como Postman com autenticação básica
   - Usuário: `mcp_user`
   - Senha: Sua senha configurada

3. **Verifique o tipo de autenticação**:
   - Confirme que o webhook está configurado com autenticação básica (Basic Auth)
   - Se estiver usando outro tipo de autenticação, ajuste a configuração do Antigravity

## Arquivos de Referência

Todos os arquivos necessários foram criados e estão disponíveis em:

1. `n8n-mcp-config-final.json` - Configuração atualizada com o webhook correto
2. `n8n-mcp-tool-schema.json` - Schema da ferramenta MCP para n8n
3. `instrucoes-antigravity-final.md` - Guia detalhado para usar o Antigravity
4. `INSTRUCOES_FINAIS_ANTIGRAVITY_MCP.md` - Este arquivo com instruções finais

## Próximos Passos

1. **Configure o Antigravity** seguindo as instruções acima
2. **Teste com comandos simples** para verificar a conexão
3. **Crie seus primeiros workflows** usando linguagem natural
4. **Explore recursos avançados** como tratamento de erros e otimização

---

Aproveite seu MCP n8n com Antigravity! Esta integração permitirá que você crie e gerencie workflows de automação usando linguagem natural, tornando o processo muito mais rápido e intuitivo.