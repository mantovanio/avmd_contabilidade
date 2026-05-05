---
name: codificando-javascript-n8n
description: Fornece diretrizes avançadas para escrever código JavaScript eficiente dentro dos nós de código do n8n. Use quando o usuário precisar de manipulação complexa de dados ou lógica personalizada em JS.
---

# Codificando em JavaScript (n8n)

## Quando usar esta skill
- Quando for necessário manipular arrays de objetos no n8n.
- Quando houver necessidade de usar bibliotecas externas no nó de Código.
- Para transformar dados JSON complexos antes de enviá-los para outra API.

## Fluxo de Trabalho (Workflow)
- [ ] Analisar a estrutura de entrada (JSON) do nó anterior.
- [ ] Definir se a lógica deve ser aplicada item por item ou no array completo.
- [ ] Implementar blocos `try/catch` para evitar falhas no workflow.
- [ ] Validar a saída para garantir compatibilidade com o próximo nó.

## Instruções
- **Estrutura**: Lembre-se que o n8n espera um array de objetos: `[{ json: { ... } }]`.
- **Modern JS**: Use `map()`, `filter()` e `reduce()` para manipulação de arrays.
- **Performance**: Evite loops pesados que possam travar a instância do n8n.

## Recursos
- [Documentação Oficial do Nó de Código](https://docs.n8n.io/code/javascript/)
