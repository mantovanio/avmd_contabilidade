---
name: padronizando-workflows-n8n
description: Define padrões de design de workflow (error handling, split-in-batches, wait nodes) para automações escaláveis e resilientes. Use ao planejar a arquitetura de um novo fluxo.
---

# Padronizando Workflows (n8n)

## Quando usar esta skill
- Ao iniciar a construção de um workflow complexo.
- Para implementar sistemas de retry (tentar novamente) em caso de erro.
- Para gerenciar grandes volumes de dados usando lotes (batches).

## Fluxo de Trabalho (Workflow)
- [ ] Implementar um nó de Error Trigger global.
- [ ] Usar nomes claros e descritivos para cada nó.
- [ ] Documentar a lógica usando Notas (Sticky Notes) dentro do editor.
- [ ] Separar fluxos de leitura de fluxos de escrita.

## Instruções
- **Batching**: Sempre use `Split in Batches` para processar mais de 100 itens por vez.
- **Resiliência**: Configure "On Error -> Continue" apenas se houver um fluxo de tratamento.

## Recursos
- [Padrões de Workflow](https://docs.n8n.io/workflows/design-patterns/)
