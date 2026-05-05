# Diretriz: Criar Nova Skill

Esta diretriz define o procedimento operacional para o agente criar novas "Skills" no sistema, integrando as regras do Google Antigravity com o DOE Framework.

## Objetivo
Gerar uma nova skill completa e funcional seguindo os padrões de alta qualidade.

## Entradas (Inputs)
- Nome da skill (deve ser transformado para gerúndio e hifens).
- Descrição da funcionalidade.
- Requisitos específicos do usuário.

## Ferramentas de Execução
- `execution/gerador_skill.py`

## Protocolo de Execução
1.  **Validar Nome**: Garantir que o nome está em minúsculas e usa hifens.
2.  **Preparar Conteúdo**: Redigir o `SKILL.md` seguindo o template do Antigravity.
3.  **Executar Script**: Rodar o script de execução para criar as pastas e arquivos.
4.  **Confirmar**: Mostrar ao usuário o link para a nova skill.

## Casos Extremos (Edge Cases)
- Se a skill já existir: Perguntar se deve sobrescrever ou atualizar.
- Se o nome for inválido: Sugerir uma versão corrigida.

## Aprendizados
- 2026-04-23: Implementação inicial baseada nas instruções do "Criador de Skills".
