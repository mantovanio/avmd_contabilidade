---
name: mcp-tools-expert
description: Especialista na integração e uso de ferramentas do Protocolo de Contexto de Modelo (MCP) com n8n. Use para conectar o agente a ferramentas externas complexas via n8n.
---

# Especialista em Ferramentas MCP (n8n)

## Quando usar esta skill
- Para conectar o Antigravity a workflows do n8n que funcionam como ferramentas.
- Quando precisar que o agente execute ações complexas via API gerenciada pelo n8n.

## Fluxo de Trabalho (Workflow)
- [ ] Definir o schema da ferramenta (JSON Schema).
- [ ] Configurar o webhook de entrada no n8n para receber a chamada do MCP.
- [ ] Mapear os parâmetros da ferramenta para os campos do workflow.
- [ ] Retornar a resposta final para o agente.

## Instruções
- **Autenticação**: Garanta que as chaves de API estejam no `.env` e sejam validadas no n8n.
- **Timeout**: Workflows longos podem causar timeout no agente; use execuções assíncronas se necessário.

## Recursos
- [Documentação MCP](https://modelcontextprotocol.io)
