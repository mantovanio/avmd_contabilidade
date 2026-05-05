---
name: resolvendo-problemas-n8n
description: Guia a identificação e correção de erros comuns em workflows do n8n, como falhas de memória, erros de rede e problemas de tipo de dados. Use quando um workflow falhar inesperadamente.
---

# Resolvendo Problemas (n8n)

## Quando usar esta skill
- Quando um nó apresentar uma mensagem de erro vermelha.
- Para depurar problemas de autenticação (401/403).
- Para otimizar workflows que estão lentos ou travando.

## Fluxo de Trabalho (Workflow)
- [ ] Verificar a aba "Execution" para ver os dados exatos do erro.
- [ ] Analisar o JSON de entrada no momento da falha.
- [ ] Isolar o nó problemático e testar individualmente.
- [ ] Verificar logs do servidor se for uma instalação auto-hospedada.

## Instruções
- **Logs**: Ative os logs detalhados se o erro for intermitente.
- **Memória**: Verifique se o objeto retornado não é grande demais para a RAM disponível.

## Recursos
- [Guia de Troubleshooting](https://docs.n8n.io/hosting/troubleshooting/)
