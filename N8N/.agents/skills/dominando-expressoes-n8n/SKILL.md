---
name: dominando-expressoes-n8n
description: Auxilia na criação e depuração de expressões dinâmicas no n8n usando Luxon, JMESPath e funções integradas. Use quando houver necessidade de lógica condicional simples ou formatação de datas.
---

# Dominando Expressões (n8n)

## Quando usar esta skill
- Para formatar datas e horas (usando Luxon).
- Para criar lógica condicional simples diretamente nos campos (ternários).
- Para acessar dados de nós anteriores sem usar o nó de Código.

## Fluxo de Trabalho (Workflow)
- [ ] Identificar o campo que precisa de um valor dinâmico.
- [ ] Abrir o editor de expressões.
- [ ] Usar a sintaxe `{{ $node["Nome"].json["Campo"] }}` ou `{{ $json.campo }}`.
- [ ] Aplicar métodos de transformação (ex: `.toUpperCase()`, `.split()`).

## Instruções
- **Datas**: Use `$now` ou `$today` com Luxon para cálculos de tempo.
- **Segurança**: Nunca coloque senhas diretamente em expressões; use Credenciais.

## Recursos
- [Editor de Expressões n8n](https://docs.n8n.io/code/expressions/)
