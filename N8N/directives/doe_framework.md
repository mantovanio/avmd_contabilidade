# DOE Framework - Protocolo Operacional Central do Agente

Este arquivo serve como o conjunto central de instruções ("DOE Framework") para o agente Antigravity, garantindo uma execução consistente e confiável.

Você opera dentro de uma arquitetura de 3 camadas que separa as responsabilidades para maximizar a confiabilidade.

## A Arquitetura de 3 Camadas (DOE Framework)

### Camada 1: D - Directive (O que fazer)
- Essencialmente POPs (Procedimentos Operacionais Padrão) escritos em Markdown, ficam na pasta `directives/`.
- Definem os objetivos, entradas (inputs), ferramentas/scripts a serem usados, saídas (outputs) e casos extremos (edge cases).
- Instruções em linguagem natural.

### Camada 2: O - Orchestration (Tomada de decisão)
- Este é você (o Agente). Seu trabalho: roteamento inteligente.
- Ler diretrizes, chamar ferramentas de execução na ordem correta, lidar com erros, pedir esclarecimentos, atualizar diretrizes com os aprendizados.

### Camada 3: E - Execution (Fazendo o trabalho)
- Scripts Python (ou JS/TS/Bash) determinísticos na pasta `execution/`.
- Variáveis de ambiente, tokens de API, etc., são armazenados no arquivo `.env`.
- Lidam com chamadas de API, processamento de dados, operações de arquivos e interações com banco de dados.

---

## Protocolo de Início de Sessão
Ao iniciar uma tarefa, faça isto antes de tocar em qualquer coisa:
1. Leia a diretriz (directive) relevante na pasta `directives/`.
2. Liste os scripts na pasta `execution/` para ver o que já existe.
3. Verifique a pasta `.tmp/` por estados residuais da última execução.
4. Esclareça o escopo com o usuário antes de criar ou modificar quaisquer arquivos.

---

## Princípios Operacionais

1. **Procure ferramentas primeiro**: Só crie novos scripts se nenhum existir na pasta `execution/`.
2. **Auto-correção (Self-anneal)**: Se quebrar, corrija o script e atualize a diretriz com o aprendizado.
3. **Atualize as diretrizes conforme aprende**: Diretrizes são documentos vivos. Adicione restrições de API e erros comuns.

---

## Quando Perguntar vs Prosseguir

**Prossiga sem perguntar:**
- Ler arquivos, executar scripts de leitura (read-only).
- Corrigir bugs em scripts existentes.
- Gravar arquivos em `.tmp/`.

**Pergunte primeiro:**
- Criar novas diretrizes.
- Deletar arquivos fora da pasta `.tmp/`.
- Chamadas de API externas com efeitos colaterais.

**Sempre pergunte:**
- Modificar diretrizes existentes.
- Ações em produção, faturamento ou contas externas.

---

## Organização de Arquivos
- **.tmp/**: Arquivos intermediários (dossiês, scraping, exportações). Nunca commite.
- **execution/**: Scripts Python (ferramentas determinísticas).
- **directives/**: POPs em Markdown (instruções).
- **.env**: Variáveis de ambiente e chaves de API.

---

## Aprendizados (Learnings)
*Esta seção deve ser atualizada ao final de cada sessão.*

### 2026-04-23
- Framework inicial criado com sucesso.
- Estrutura de 3 camadas estabelecida em `c:\projetos\N8N`.
