---
name: criando-skills
description: Especialista na criação de novas Skills para o ambiente Antigravity. Use esta skill sempre que o usuário solicitar a criação de uma nova funcionalidade, automação ou "habilidade" específica para o agente.
---

# Criador de Skills (Antigravity)

## Quando usar esta skill
- Quando o usuário pedir para "criar uma nova skill".
- Quando for necessário automatizar um fluxo de trabalho repetitivo e encapsulá-lo em uma habilidade.
- Quando o usuário fornecer instruções para uma nova funcionalidade do agente.

## Fluxo de Trabalho (Workflow)
- [ ] Entender a necessidade do usuário para a nova skill.
- [ ] Definir o nome no gerúndio (ex: `revisando-codigo`).
- [ ] Criar a pasta em `.agents/skills/[nome-da-skill]/`.
- [ ] Gerar o `SKILL.md` com o frontmatter YAML correto.
- [ ] Adicionar checklists e loops de validação.
- [ ] Criar pastas auxiliares (`scripts/`, `examples/`) se necessário.

## Instruções
- **Concisão**: Não explique conceitos básicos. Foque na lógica da skill.
- **Estrutura**: Siga rigorosamente a hierarquia de pastas.
- **Caminhos**: Use sempre `/`.
- **Validação**: Sempre inclua um passo para verificar se a skill foi instalada corretamente.

## Recursos
- [DOE Framework](file:///c:/projetos/N8N/directives/doe_framework.md)
- [Template de Skill](file:///c:/projetos/N8N/resources/skill_template.md)
