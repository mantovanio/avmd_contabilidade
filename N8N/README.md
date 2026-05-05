# MCP n8n - Protocolo de Contexto de Modelo para n8n

Este projeto implementa um servidor MCP (Model Context Protocol) para integração do n8n com agentes de IA como Claude, GPT e outros. Através desta ferramenta, os agentes de IA podem interagir diretamente com a plataforma n8n para criar, editar e executar fluxos de trabalho de automação.

## Conteúdo do Projeto

- **n8n-mcp-tool-schema.json**: Esquema JSON da ferramenta MCP que define a interface para agentes de IA
- **n8n-mcp-workflow.json**: Fluxo de trabalho do n8n que implementa o servidor MCP
- **n8n-mcp-documentacao.md**: Documentação completa da ferramenta MCP para n8n

## Instalação Rápida

1. Importe o arquivo `n8n-mcp-workflow.json` para sua instância n8n
2. Ative o fluxo de trabalho
3. Configure seu cliente MCP (Claude, Antigravity, etc.) com o URL do webhook criado
4. Use o esquema do arquivo `n8n-mcp-tool-schema.json`

## Funcionalidades Principais

- **Busca de Nós**: Encontre nós do n8n por palavras-chave
- **Informações de Nós**: Obtenha detalhes sobre propriedades e configurações de nós específicos
- **Validação de Configuração**: Verifique se as configurações dos nós são válidas
- **Busca de Templates**: Encontre templates de fluxos de trabalho prontos para uso
- **Criação e Atualização**: Gerencie fluxos de trabalho no n8n via API
- **Execução Remota**: Inicie fluxos de trabalho diretamente através do MCP

## Exemplo de Uso com Claude

```
Você: Ajude-me a criar um fluxo de trabalho no n8n que recebe dados via webhook e envia uma notificação para o Slack.

Claude: Vou ajudá-lo a criar esse fluxo de trabalho. Primeiro, vou buscar nós relevantes para essa tarefa.

[Claude usa o MCP para buscar nós de webhook e Slack]

Claude: Encontrei os nós necessários. Vamos começar configurando o nó Webhook para receber dados...

[Claude continua usando o MCP para criar e configurar o fluxo de trabalho]
```

## Segurança e Boas Práticas

- **Ambiente de Desenvolvimento**: Nunca edite fluxos de trabalho de produção diretamente com IA
- **Backups**: Sempre exporte seus fluxos de trabalho importantes antes de modificá-los
- **Validação**: Use a funcionalidade de validação antes de implantar fluxos de trabalho
- **Revisão**: Sempre revise os fluxos de trabalho gerados por IA antes de usá-los em produção

## Recursos Adicionais

- Para documentação detalhada, consulte o arquivo `n8n-mcp-documentacao.md`
- [Repositório GitHub n8n-mcp](https://github.com/czlonkowski/n8n-mcp)
- [Documentação Oficial do n8n](https://docs.n8n.io/)

## Baseado no Projeto n8n-mcp

Este projeto foi inspirado e adaptado do repositório [n8n-mcp](https://github.com/czlonkowski/n8n-mcp) criado por czlonkowski.