# Estrutura V2 - Clientes, Produtos, Relacoes e Documentos

Este documento descreve a proposta de evolucao do modelo de dados do CertiID
para suportar melhor a correlacao entre clientes, empresas, produtos,
responsaveis operacionais, pontos de atendimento e anexos financeiros.

## Objetivos

- Permitir que um cliente tenha um ou mais produtos.
- Permitir que um produto esteja no nome da pessoa ou vinculado a uma empresa.
- Garantir vinculo obrigatorio com vendedor e agente de registro.
- Permitir vinculo opcional com contador.
- Permitir correlacao entre pontos de atendimento e agentes de registro.
- Suportar cadastro hibrido de cliente para emissao de NF de e-CPF e e-CNPJ.
- Separar corretamente comprador/faturamento, empresa e titular do certificado.
- Garantir o fluxo correto: cadastro do cliente -> venda -> agendamento -> protocolo/API.
- Permitir numero de pedido e numero de protocolo em momentos diferentes da operacao.
- Permitir comissao para vendedor/parceiro e para agente de registro.
- Permitir edicao e exclusao controlada de renovacoes.
- Permitir anexos sensiveis e fiscais com estrutura preparada para bucket privado.
- Manter flexibilidade para mudancas futuras sem quebrar o banco.
- Permitir extrato de comissoes mensal e parcial por usuario logado.
- Permitir extrato de pagamentos mensais de agentes de registro.
- Permitir relatorio de certificados emitidos e revogados.
- Permitir relatorio de clientes e fornecedores.
- Permitir cadastros financeiros mestres: bancos, contas bancarias, plano de contas e centros de custos.
- Permitir configuracao de emissao de NFS-e.
- Permitir realizar pagamentos a agentes direto pela plataforma via integracao API com parceiro financeiro.
- Permitir disponibilidade de formas de pagamento por tipo de parceiro/canal.

## Problemas do modelo atual

- `renovacoes` guarda `vendedor`, `contador` e `agr` como texto solto.
- Nao existe uma entidade central para representar a venda operacional do certificado.
- Nao existe modelagem para pontos de atendimento.
- Nao existe modelagem nativa para anexos financeiros.
- Algumas relacoes importantes dependem de texto, e isso dificulta filtro,
  historico, auditoria e automacoes.
- O fluxo real de negocio ainda nao diferencia claramente:
  - cliente cadastrado
  - venda realizada
  - agendamento com agente
  - pedido/protocolo vindo de API externa

## Proposta de modelagem

### 1. Cadastro base de faturamento

Tabela central para quem compra e para quem a nota fiscal sera emitida.
Pode ser pessoa fisica ou juridica.

Campos principais:

- `id`
- `tipo_cliente`
- `tipo_cadastro`
- `cpf_cnpj`
- `nome`
- `nome_fantasia`
- `email`
- `telefone`
- `cidade`
- `logradouro`
- `numero`
- `complemento`
- `bairro`
- `uf`
- `cep`
- `inscricao_municipal`
- `inscricao_estadual`
- `iss_retido`
- `status`
- `metadata jsonb`
- `created_at`
- `updated_at`

Observacao:
- Esta tabela pode conviver com `clientes_comerciais` durante a migracao.
- `tipo_cadastro` deve permitir pelo menos:
  - `cliente`
  - `fornecedor`
  - `cliente_fornecedor`

### 2. Empresas vinculadas

Tabela para empresas relacionadas ao cadastro base quando existir estrutura
empresa + titular. Em muitos casos o cadastro base e a propria empresa, mas
essa separacao deixa o modelo mutavel e seguro.

Uso recomendado:

- Para e-CNPJ: normalmente existe empresa + titular.
- Para e-CPF: normalmente nao existe empresa vinculada.

Campos principais:

- `id`
- `cadastro_base_id`
- `cnpj`
- `razao_social`
- `nome_fantasia`
- `email`
- `telefone`
- `cidade`
- `status`
- `metadata jsonb`
- `created_at`
- `updated_at`

Relacao:
- 1 cadastro base pode ter 0, 1 ou muitas empresas.

### 3. Titulares

Tabela da pessoa fisica titular do certificado.

Campos principais:

- `id`
- `nome`
- `cpf`
- `data_nascimento`
- `email`
- `telefone`
- `metadata jsonb`
- `created_at`
- `updated_at`

Regra de negocio:

- Em e-CPF, o titular pode ser a mesma pessoa do cadastro base.
- Em e-CNPJ, o titular normalmente e uma pessoa vinculada a uma empresa.

### 4. Pontos de atendimento

Tabela para os locais de operacao.

Campos principais:

- `id`
- `nome`
- `codigo`
- `endereco`
- `cidade`
- `uf`
- `status`
- `metadata jsonb`
- `created_at`
- `updated_at`

### 5. Relacao ponto x agente

Tabela de associacao entre ponto de atendimento e agente de registro.

Campos principais:

- `id`
- `ponto_atendimento_id`
- `agente_id`
- `principal`
- `created_at`

Relacao:
- Um ponto pode ter varios agentes.
- Um agente pode atuar em varios pontos.

### 6. Vendas de certificados

Esta passa a ser a tabela operacional mais importante.
Cada linha representa uma venda de certificado ainda em andamento ou concluida.

Ela deve nascer logo apos o cadastro do cliente, antes do agendamento.

Campos principais:

- `id`
- `cadastro_base_id`
- `empresa_id` nullable
- `titular_id`
  - `certificado_id` nullable
- `tipo_produto`
- `tipo_venda`
- `tipo_emissao`
- `tabela_preco`
- `forma_pagamento`
- `valor_venda`
- `valor_custo`
- `vendedor_id`
- `contador_id` nullable
- `ponto_atendimento_id`
- `agente_registro_id` nullable
- `pedido_numero` nullable
- `pedido_status`
- `protocolo_numero` nullable
- `protocolo_status`
- `certificadora`
- `api_payload_pedido jsonb`
- `api_payload_protocolo jsonb`
- `comissao_vendedor_tipo`
- `comissao_vendedor_valor`
- `comissao_agente_tipo`
- `comissao_agente_valor`
- `status_venda`
- `observacoes`
- `metadata jsonb`
- `created_at`
- `updated_at`

Regra de negocio:

- No cadastro da venda, `vendedor_id` e `ponto_atendimento_id` sao obrigatorios.
- `agente_registro_id` ainda pode estar nulo nessa fase.
- O contador continua opcional.
- `titular_id` deve existir sempre.
- `empresa_id` pode ser nulo em e-CPF.
- `pedido_numero` pode nascer manualmente ou ficar nulo ate a integracao/API preencher.
- `protocolo_numero` so aparece depois, em outra tela ou via API da certificadora.
- Os dados de faturamento devem vir do `cadastro_base`, evitando duplicacao solta.

### 7. Agendamentos de validacao

O agente de registro deve ser definido aqui, e nao na venda inicial.

Campos principais:

- `id`
- `venda_certificado_id`
- `cadastro_base_id`
- `empresa_id` nullable
- `titular_id`
- `contador_id` nullable
- `agente_registro_id`
- `ponto_atendimento_id`
- `data_agendada`
- `tipo_atendimento`
- `status_agendamento`
- `observacoes`
- `metadata jsonb`
- `created_at`
- `updated_at`

Regra de negocio:

- O agendamento aponta para uma venda existente.
- O agente de registro passa a ser obrigatorio no agendamento.
- O ponto de atendimento pode ser herdado da venda e ajustado aqui se necessario.

### 8. Certificados emitidos

Se quiser separar o historico da venda do ativo final emitido, podemos manter uma
tabela derivada para o produto efetivamente emitido.

Campos principais:

- `id`
- `venda_certificado_id`
- `cadastro_base_id`
- `empresa_id` nullable
- `titular_id`
- `certificado_id`
- `pedido_numero`
- `protocolo_numero`
- `numero_serie`
- `descricao_produto`
- `descricao_produto_midia`
- `validade`
- `data_emissao`
- `data_validade`
- `status_certificado`
- `data_revogacao`
- `revogado_por`
- `codigo_revogacao`
- `descricao_revogacao`
- `aci_data`
- `aci_data_limite`
- `inicio_videoconferencia`
- `inicio_gravacao`
- `fim_gravacao`
- `latitude_emissao`
- `longitude_emissao`
- `latitude_local`
- `longitude_local`
- `nome_equipamento`
- `dna_equipamento`
- `verificacao`
- `endereco_validacao_externa`
- `tipo_emissao_realizada`
- `tipo_emissao_solicitada`
- `periodo_uso`
- `modelo`
- `grupo`
- `status`
- `metadata jsonb`
- `created_at`
- `updated_at`

Observacao:
- Esta tabela pode ser criada ja na v2 ou numa fase seguinte, dependendo do quanto
  voce quer separar o "processo de venda" do "ativo emitido".

### 9. Renovacoes

A tabela `renovacoes` deve passar a referenciar o produto do cliente.

Novo desenho recomendado:

- `produto_emitido_id` ou `venda_certificado_id`
- `cadastro_base_id`
- `empresa_id` nullable
- `titular_id`
- `vendedor_id`
- `agente_registro_id`
- `contador_id` nullable
- `snapshot_json`
- `deleted_at` nullable
- `deleted_by` nullable
- `motivo_exclusao` nullable

Motivo:
- manter rastreabilidade
- permitir edicao
- permitir exclusao logica
- preservar historico mesmo quando os dados principais mudarem

### 10. Documentos financeiros e sensiveis

Tabela para indexar anexos sem expor caminho solto no sistema.

Campos principais:

- `id`
- `lancamento_financeiro_id` nullable
- `cadastro_base_id` nullable
- `empresa_id` nullable
- `titular_id` nullable
- `venda_certificado_id` nullable
- `produto_emitido_id` nullable
- `tipo_documento`
- `bucket`
- `storage_path`
- `nome_original`
- `mime_type`
- `tamanho_bytes`
- `hash_arquivo`
- `sensivel`
- `metadata jsonb`
- `created_by`
- `created_at`
- `deleted_at` nullable

Tipos esperados:

- `nota_fiscal`
- `comprovante_pagamento`
- `contrato`
- `documento_pessoal`
- `documento_empresa`
- `outro`

### 11. Bancos

Cadastro mestre de bancos.

Campos principais:

- `id`
- `codigo`
- `nome`
- `ispb`
- `ativo`
- `origem`
- `metadata jsonb`
- `created_at`
- `updated_at`

Boa pratica:
- carregar seed inicial de rede bancaria brasileira
- manter rotina de sincronizacao manual ou automatica

### 12. Contas bancarias

Campos principais:

- `id`
- `banco_id`
- `tipo_conta`
- `agencia`
- `conta`
- `digito`
- `titular_cadastro_base_id`
- `cnpj_cpf_titular`
- `nome_titular`
- `data_abertura`
- `saldo_inicial`
- `ativa`
- `gateway`
- `metadata jsonb`
- `created_at`
- `updated_at`

### 12.1 Formas de pagamento por parceiro/canal

As formas de pagamento nao devem ser apenas um cadastro global.
Elas precisam poder ser habilitadas ou bloqueadas conforme o tipo de parceiro
ou canal operacional.

#### Cadastro mestre de formas de pagamento

Campos principais:

- `id`
- `nome`
- `codigo`
- `tipo`
- `gateway`
- `ativo`
- `metadata jsonb`
- `created_at`
- `updated_at`

#### Disponibilidade por tipo de parceiro

Campos principais:

- `id`
- `forma_pagamento_id`
- `tipo_parceiro`
- `permitido`
- `ordem`
- `metadata jsonb`
- `created_at`
- `updated_at`

Exemplos de `tipo_parceiro`:

- `ar`
- `pa_controle_total`
- `pa_emissor`
- `contador`
- `vendedor`
- `gestor`
- `ecommerce`

Uso:

- controlar o que aparece na tela de venda
- limitar recebimentos conforme o parceiro
- permitir configuracao mutavel sem alterar codigo

### 13. Plano de contas

Campos principais:

- `id`
- `tipo_conta`
- `agrupador`
- `conta_lancamento`
- `codigo_reduzido`
- `ativa`
- `metadata jsonb`
- `created_at`
- `updated_at`

### 14. Centros de custos

Campos principais:

- `id`
- `nome`
- `codigo`
- `ativo`
- `metadata jsonb`
- `created_at`
- `updated_at`

### 15. Lancamentos financeiros v2

Cada lancamento deve poder referenciar:

- `conta_bancaria_id`
- `plano_conta_id`
- `centro_custo_id`
- `cadastro_base_id`
- `venda_certificado_id`
- `produto_emitido_id`
- `documento_fiscal_id` nullable

Assim voce consegue:

- conciliar financeiro com venda
- vincular nota e comprovante
- filtrar por centro de custo
- filtrar por plano de contas

### 16. Comissoes

Para suportar extrato parcial e mensal por usuario logado, o ideal e separar a
comissao em eventos e nao so em percentual gravado na venda.

#### 16.1 Regras de comissao

Campos principais:

- `id`
- `escopo`
- `perfil_destino`
- `tipo_calculo`
- `valor`
- `vigencia_inicio`
- `vigencia_fim`
- `ativo`
- `metadata jsonb`

#### 16.2 Lancamentos de comissao

Campos principais:

- `id`
- `venda_certificado_id`
- `produto_emitido_id` nullable
- `usuario_id`
- `papel`
- `base_valor`
- `percentual`
- `valor_comissao`
- `competencia`
- `status`
- `origem`
- `metadata jsonb`
- `created_at`
- `updated_at`

Uso:

- um registro para o vendedor/parceiro
- outro registro para o agente de registro
- depois relatorio por usuario logado, periodo, status e competencia

### 16.3 Fechamento mensal de agentes

Para suportar o extrato mensal e o pagamento direto ao agente, precisamos de uma
camada de fechamento, separada do lancamento individual de comissao.

#### Lotes de fechamento

Campos principais:

- `id`
- `competencia`
- `status_fechamento`
- `observacoes`
- `gerado_por`
- `created_at`
- `updated_at`

#### Itens de fechamento de agente

Campos principais:

- `id`
- `lote_fechamento_id`
- `agente_id`
- `cpf_agente`
- `nome_agente`
- `valor_bruto`
- `valor_fgts`
- `valor_inss`
- `valor_ir`
- `valor_outras_retencoes`
- `valor_liquido`
- `status_pagamento`
- `data_pagamento`
- `conta_bancaria_destino_id`
- `metadata jsonb`
- `created_at`
- `updated_at`

Uso:

- consolidar por mes/ano
- mostrar extrato individual de pagamento do agente
- permitir selecao de itens para pagamento
- registrar valor bruto, descontos e valor liquido

### 16.4 Integracao de pagamento externo

Para pagar direto da plataforma, recomendo separar a ordem de pagamento da
comissao em si.

#### Ordens de pagamento

Campos principais:

- `id`
- `fechamento_item_id`
- `provider`
- `conta_origem_id`
- `conta_destino_id` nullable
- `favorecido_nome`
- `favorecido_documento`
- `favorecido_chave_pix`
- `favorecido_banco`
- `favorecido_agencia`
- `favorecido_conta`
- `valor_pagamento`
- `status_integracao`
- `external_payment_id`
- `payload_envio jsonb`
- `payload_retorno jsonb`
- `erro_integracao`
- `solicitado_por`
- `processado_em`
- `created_at`
- `updated_at`

Boas praticas:

- pagamento nunca deve alterar o valor original da comissao
- a ordem de pagamento deve ser rastreavel
- a resposta da API externa deve ser salva
- deve existir conciliacao entre `comissao`, `fechamento` e `pagamento`

### 17. Configuracao de NFS-e

Configuracao corporativa para emissao de nota fiscal de servico.

Campos principais:

- `id`
- `cadastro_base_emitente_id`
- `cnpj_emitente`
- `inscricao_municipal`
- `inscricao_estadual`
- `cnae`
- `ambiente`
- `natureza_operacao`
- `simples_nacional`
- `regime_especial`
- `exigibilidade_iss`
- `incentivo_fiscal`
- `tipo_rps`
- `serie_rps`
- `numero_rps_atual`
- `codigo_servico_municipio`
- `codigo_tributacao_municipio`
- `codigo_cfps`
- `codigo_cst`
- `aliquota_iss`
- `aliquota_pis`
- `aliquota_cofins`
- `aliquota_inss`
- `aliquota_ir`
- `aliquota_csll`
- `usuario_prefeitura`
- `senha_prefeitura`
- `chave_autenticacao`
- `robo_ligado`
- `payload_reforma_tributaria jsonb`
- `updated_by`
- `updated_at`

Observacao:
- credenciais sensiveis devem ficar protegidas e nunca expostas no frontend

### 18. Notas fiscais de servico emitidas

Campos principais:

- `id`
- `lancamento_financeiro_id`
- `cadastro_base_tomador_id`
- `venda_certificado_id` nullable
- `numero_nf`
- `codigo_verificacao`
- `status_nf`
- `data_emissao`
- `valor_servico`
- `valor_iss`
- `xml_url`
- `pdf_url`
- `payload_envio jsonb`
- `payload_retorno jsonb`
- `metadata jsonb`
- `created_at`
- `updated_at`

### 19. Relatorios operacionais

Os relatorios pedidos por voce devem nascer preferencialmente como `views` ou
consultas materializadas sobre tabelas relacionais.

Relatorios prioritarios:

- certificados emitidos/revogados
- clientes e fornecedores
- extrato individual de comissoes
- extrato mensal de comissoes
- extrato mensal de pagamentos de agentes
- financeiro por conta, centro e plano de contas

## Melhores praticas adotadas

- Chaves estrangeiras em vez de texto solto.
- Campos `metadata jsonb` para mutabilidade controlada.
- `soft delete` em renovacoes e documentos.
- Separacao entre faturamento, empresa e titular.
- Tabela de associacao para ponto x agente.
- Tabela operacional central `vendas_certificados`.
- Separacao clara entre venda e agendamento.
- Preparacao para integracao de pedido e protocolo por API.
- Preparacao para bucket privado no Supabase Storage.
- Comissao modelada como lancamento financeiro operacional.
- Fechamento mensal separado do evento de comissao.
- Pagamento externo modelado como ordem de pagamento rastreavel.
- Relatorios baseados em views e tabelas normalizadas.
- Configuracao fiscal separada da operacao comercial.
- Formas de pagamento governadas por matriz de disponibilidade por parceiro/canal.

## Estrategia de migracao recomendada

### Fase 1 - Estrutura nova

- Criar tabelas novas.
- Nao desligar as tabelas antigas.
- Criar indices e FKs.

### Fase 2 - Compatibilidade

- Adicionar referencias novas nas tabelas existentes.
- Popular `venda_certificado_id` e/ou `produto_emitido_id` em `renovacoes`.
- Popular dados com scripts de migracao.

### Fase 3 - Interface

- Ajustar Comercial e Renovacoes para usar as relacoes novas.
- Adicionar edicao e exclusao logica em Renovacoes.
- Adicionar anexos financeiros.

### Fase 4 - Consolidacao

- Parar de depender dos campos texto legados.
- Transformar campos antigos em snapshot ou legado.

## Alternativa mutavel

A alternativa mais equilibrada para o seu caso e:

- manter relacoes fixas em colunas e FKs
- manter `metadata jsonb` para detalhes variaveis
- usar `snapshot_json` em renovacoes
- usar `documentos_financeiros` para indexacao de anexos
- manter payloads de API em jsonb para pedido e protocolo

Assim voce ganha:

- consistencia
- performance de consulta
- facilidade para relatorios
- flexibilidade para o que mudar no futuro

## Proximo passo recomendado

Criar a migration v2 com as tabelas novas e sem romper o que ja existe.
