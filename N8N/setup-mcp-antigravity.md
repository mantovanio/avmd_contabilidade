# Configuração do MCP n8n com Antigravity

Este guia mostra como configurar e usar o MCP n8n especificamente com o Antigravity, permitindo que você crie e gerencie fluxos de trabalho no n8n diretamente através do agente de IA.

## Pré-requisitos

1. Workflow MCP instalado e ativo no seu n8n (https://auto.mantovan.com.br/)
2. URL do webhook MCP obtido após a instalação
3. Credenciais de autenticação do webhook (se configuradas)
4. Acesso ao Antigravity com a skill `mcp-tools-expert` disponível

## Configuração no Antigravity

### 1. Verificar Disponibilidade da Skill MCP-tools-expert

O Antigravity já possui a skill `mcp-tools-expert` disponível no seu ambiente, como podemos ver nos arquivos do projeto:

```
C:\projetos\N8N\.agents\skills\mcp-tools-expert\SKILL.md
```

Esta skill já está preparada para trabalhar com ferramentas MCP, facilitando nossa configuração.

### 2. Integrar o MCP n8n com a Skill

1. No Antigravity, inicie uma nova conversa
2. Digite o comando: `/carregar-skill mcp-tools-expert`
3. Após a skill ser carregada, você verá uma confirmação

### 3. Configurar a Conexão com o Webhook

Para configurar a conexão com o webhook do n8n, envie a seguinte mensagem ao Antigravity:

```
Quero configurar uma nova ferramenta MCP para n8n com os seguintes parâmetros:

- URL: https://auto.mantovan.com.br/webhook/mcp-tool
- Método: POST
- Autenticação: Basic Auth
- Usuário: mcp_user
- Senha: [SUBSTITUIR_PELA_SENHA_CONFIGURADA]
- Nome da ferramenta: n8n Workflow Creator
```

Se você não configurou autenticação básica no webhook, omita as informações de autenticação.

### 4. Registrar o Schema JSON

Em seguida, envie o schema JSON da ferramenta MCP para o Antigravity:

```
Por favor, registre este schema JSON para a ferramenta MCP n8n Workflow Creator:

```

Em seguida, copie e cole o conteúdo do arquivo `n8n-mcp-tool-schema.json`.

### 5. Testar a Conexão

Para verificar se a conexão foi estabelecida corretamente, solicite ao Antigravity:

```
Por favor, teste a conexão com a ferramenta MCP n8n Workflow Creator usando a ação search_nodes com a query "webhook".
```

## Uso do MCP n8n com Antigravity

### Comandos Básicos

Aqui estão os principais comandos que você pode usar para trabalhar com o n8n através do Antigravity:

1. **Buscar Nós**

```
Busque nós do n8n relacionados a [termo de busca].

Exemplo: Busque nós do n8n relacionados a email.
```

2. **Obter Detalhes de um Nó**

```
Mostre detalhes do nó [tipo de nó] do n8n.

Exemplo: Mostre detalhes do nó n8n-nodes-base.gmail do n8n.
```

3. **Criar um Fluxo de Trabalho**

```
Crie um fluxo de trabalho no n8n que [descrição da tarefa].

Exemplo: Crie um fluxo de trabalho no n8n que monitore novos emails no Gmail e envie uma notificação no Slack quando receber emails com a palavra "urgente" no assunto.
```

4. **Buscar Templates**

```
Busque templates de fluxos de trabalho no n8n para [descrição da tarefa].

Exemplo: Busque templates de fluxos de trabalho no n8n para integração com Slack.
```

5. **Validar Configuração**

```
Valide esta configuração para o nó [tipo de nó] no n8n:
[configuração em JSON]

Exemplo: Valide esta configuração para o nó n8n-nodes-base.httpRequest no n8n:
{
  "url": "https://api.exemplo.com/dados",
  "method": "GET",
  "authentication": "none"
}
```

### Exemplo de Workflow Completo

Para criar um workflow completo, você pode seguir esta sequência de instruções:

```
1. Primeiro, vamos criar um fluxo de trabalho para monitorar um feed RSS e enviar novas entradas para o Telegram.

2. Por favor, busque nós do n8n relacionados a RSS e Telegram.

3. Agora, mostre detalhes completos do nó RSS e do nó Telegram para entender suas configurações.

4. Crie um workflow no n8n que conecte esses nós para monitorar um feed RSS e enviar novos itens para um chat do Telegram.

5. Valide o workflow criado para garantir que está configurado corretamente.
```

### Instruções Avançadas

Para obter resultados ainda melhores, você pode dar instruções mais detalhadas para o Antigravity:

```
Crie um fluxo de trabalho no n8n para automatizar o seguinte processo:

1. Monitorar novos e-mails no Gmail com anexos
2. Quando um email com anexo PDF chegar, extrair o texto do PDF
3. Resumir o conteúdo do PDF usando a API da OpenAI
4. Enviar um resumo para um canal específico do Slack
5. Salvar o PDF em uma pasta do Google Drive

Detalhes importantes:
- Use o nó Gmail trigger para monitorar apenas emails não lidos
- Use filtros para identificar apenas emails com anexos PDF
- Adicione tratamento de erros em cada etapa
- Configure explicitamente todos os parâmetros necessários
- Adicione notas explicativas no workflow
```

## Solução de Problemas

### Erro de Conexão

Se o Antigravity não conseguir se conectar ao webhook:

1. Verifique se o workflow MCP está ativo no n8n
2. Confirme se a URL está correta e acessível publicamente
3. Verifique se não há firewalls ou proxies bloqueando a conexão

### Erro de Autenticação

Se houver problemas com a autenticação:

1. Verifique se as credenciais estão corretas
2. Confirme o formato da autenticação (Basic Auth)
3. Se necessário, desative temporariamente a autenticação para testes

### Erros em Ações Específicas

Se uma ação específica falhar:

1. Verifique a sintaxe dos parâmetros enviados
2. Consulte a documentação para confirmar os parâmetros necessários
3. Tente uma versão simplificada da ação para isolar o problema

## Dicas para Resultados Melhores

1. **Seja específico em suas solicitações**
   - Forneça detalhes claros sobre o que deseja que o workflow faça
   - Especifique nós particulares se souber quais deseja usar

2. **Construa workflows passo a passo**
   - Comece com partes simples e vá aumentando a complexidade
   - Valide cada parte antes de adicionar mais funcionalidades

3. **Use templates como ponto de partida**
   - Peça para buscar templates relacionados à sua necessidade
   - Use-os como base e faça adaptações conforme necessário

4. **Valide sempre as configurações**
   - Peça para validar configurações de nós específicos
   - Solicite validação do workflow completo antes de implementar

5. **Documente seus workflows**
   - Peça para adicionar nós de notas com explicações
   - Solicite documentação sobre como o workflow funciona

## Exemplos de Comandos para Casos de Uso Específicos

### Integração com APIs Externas

```
Crie um workflow no n8n que:
1. Faça uma requisição HTTP para a API de previsão do tempo OpenWeatherMap
2. Filtre os dados para obter apenas temperatura e condições climáticas
3. Formate os dados em uma mensagem clara
4. Envie a mensagem para um webhook do Discord diariamente às 8h
```

### Automação de Marketing

```
Preciso de um workflow no n8n para:
1. Monitorar menções a nossa marca no Twitter
2. Salvar essas menções em uma planilha Google
3. Categorizar o sentimento (positivo, negativo ou neutro)
4. Alertar a equipe no Slack quando houver menções negativas
5. Gerar um relatório semanal com estatísticas
```

### Processamento de Dados

```
Desenvolva um workflow no n8n que:
1. Leia dados de uma planilha Google
2. Limpe e transforme os dados (remova duplicatas, normalize valores)
3. Enriqueça os dados com informações adicionais de uma API
4. Atualize um banco de dados MySQL com os resultados
5. Envie um email com estatísticas do processamento
```

Lembre-se que o Antigravity, com a skill `mcp-tools-expert` e o MCP n8n configurado, pode ajudar em todas estas tarefas, proporcionando automações poderosas e personalizadas para sua organização.