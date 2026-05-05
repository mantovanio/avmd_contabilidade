---
name: codificando-python-n8n
description: Guia o desenvolvimento de scripts Python dentro do ecossistema n8n. Utilize quando for necessária análise de dados científica ou integrações que se beneficiam das bibliotecas Python.
---

# Codificando em Python (n8n)

## Quando usar esta skill
- Para tarefas de Ciência de Dados ou cálculos matemáticos complexos.
- Quando bibliotecas específicas do Python forem necessárias.
- Para automações que já possuem lógica existente em Python.

## Fluxo de Trabalho (Workflow)
- [ ] Verificar se o ambiente n8n possui o Python instalado e habilitado.
- [ ] Mapear as variáveis de entrada usando o objeto `_input`.
- [ ] Escrever o código principal garantindo o retorno no formato `{'json': {...}}`.
- [ ] Testar com volumes pequenos de dados primeiro.

## Instruções
- **Formato**: O retorno deve ser sempre uma lista de dicionários com a chave `json`.
- **Limitações**: Algumas bibliotecas de sistema podem não estar disponíveis dependendo do Docker/instalação.

## Recursos
- [Guia Python no n8n](https://docs.n8n.io/code/python/)
