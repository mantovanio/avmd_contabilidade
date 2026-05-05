import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 3- CRM | Ápice Contábil
// Nodes   : 22  |  Connections: 10
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// ChatMemoryManager1                 memoryManager              [AI]
// StickyNote9                        stickyNote
// Atualizafollowup                   supabase                   [creds]
// StickyNote                         stickyNote
// StickyNote1                        stickyNote
// StickyNote2                        stickyNote
// StickyNote10                       stickyNote
// OpenaiChatModel3                   lmChatOpenAi               [creds] [ai_languageModel]
// StructuredOutputParser             outputParserStructured     [ai_outputParser]
// Atualizarcrm                       supabase                   [creds]
// Crm                                agent                      [AI]
// StickyNote23                       stickyNote
// Switch4                            switch
// Puxarnumerolead                    supabase                   [creds] [alwaysOutput]
// Memoria                            memoryPostgresChat         [creds] [ai_memory]
// SetarInformacoes                   set
// StickyNote3                        stickyNote
// CriarUsuario                       supabase                   [creds]
// Merge                              merge
// StickyNote24                       stickyNote
// StickyNote4                        stickyNote
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → SetarInformacoes
//      → Puxarnumerolead
//        → Switch4
//          → Atualizafollowup
//            → Merge
//              → ChatMemoryManager1
//                → Crm
//                  → Atualizarcrm
//         .out(1) → CriarUsuario
//            → Merge.in(1) (↩ loop)
//
// AI CONNECTIONS
// ChatMemoryManager1.uses({ ai_memory: Memoria })
// Crm.uses({ ai_languageModel: OpenaiChatModel3, ai_outputParser: StructuredOutputParser })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'uEOqK0jOSIWCDmCB',
    name: '3- CRM | Ápice Contábil',
    active: true,
    isArchived: false,
    settings: {
        executionOrder: 'v1',
        binaryMode: 'separate',
        timeSavedMode: 'fixed',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
    },
})
export class _3CrmApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '6e080335-1884-43ee-9238-884ca199c3b1',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [144, 208],
    })
    WhenExecutedByAnotherWorkflow = {
        workflowInputs: {
            values: [
                {
                    name: 'mensagem_lead',
                },
                {
                    name: 'whatsapp_lead',
                },
                {
                    name: 'id_conta_chatwoot',
                },
                {
                    name: 'id_conversa_chatwoot',
                },
                {
                    name: 'id_Lead_chatwoot',
                },
                {
                    name: 'inbox_id_chatwoot',
                },
            ],
        },
    };

    @node({
        id: 'caac3daf-0afe-47fc-9afb-e363628a1f00',
        name: 'Chat Memory Manager1',
        type: '@n8n/n8n-nodes-langchain.memoryManager',
        version: 1.1,
        position: [2976, 192],
    })
    ChatMemoryManager1 = {
        options: {},
    };

    @node({
        id: '03729989-12f8-407f-8251-9922f7b91847',
        name: 'Sticky Note9',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2816, 0],
    })
    StickyNote9 = {
        content: '# Puxar Histórico da conversa',
        height: 500,
        width: 460,
        color: 4,
    };

    @node({
        id: 'aa5c1a0b-f9b7-49a5-a778-1e791d7f4248',
        name: 'atualizaFollowUP',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [2160, 192],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    Atualizafollowup = {
        operation: 'update',
        tableId: 'leads_contabilidade',
        filters: {
            conditions: [
                {
                    keyName: 'whatsapp_lead',
                    condition: 'eq',
                    keyValue: "={{ $('setar_informacoes').item.json.whatsapp_lead }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'ultima_mensagem',
                    fieldValue: '={{ $now }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: 'conversando',
                },
                {
                    fieldId: 'follow_up_1',
                    fieldValue: '={{ null }}',
                },
                {
                    fieldId: 'follow_up_2',
                    fieldValue: '={{ null }}',
                },
                {
                    fieldId: 'follow_up_3',
                    fieldValue: '={{ null }}',
                },
            ],
        },
    };

    @node({
        id: '8497dd7a-2b86-482c-8296-70a33cef1c1d',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1952, 0],
    })
    StickyNote = {
        content: '# Zera os campos do Follow up e muda o Status para "conversando"',
        height: 500,
        width: 776,
        color: 2,
    };

    @node({
        id: '1b594cdf-1710-4c8f-bcf3-0aca8fe78466',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote1 = {
        content: '# Gatilho vem do SDR',
        height: 500,
        width: 360,
        color: 7,
    };

    @node({
        id: 'b6304f0c-003c-4956-a2d8-d5fff3480df8',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [384, 0],
    })
    StickyNote2 = {
        content: '# Setar ID e Whatsapp do lead',
        height: 500,
        width: 300,
        color: 3,
    };

    @node({
        id: '4faeca2d-e124-43fe-b0c0-cafe2502e9f1',
        name: 'Sticky Note10',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [3312, 0],
    })
    StickyNote10 = {
        content: '# Resumo da Conversa',
        height: 500,
        width: 596,
        color: 2,
    };

    @node({
        id: '7729f362-377c-40c3-b988-42ebd32d1ce3',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [3408, 352],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    OpenaiChatModel3 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-mini',
            mode: 'list',
            cachedResultName: 'gpt-4.1-mini',
        },
        options: {},
    };

    @node({
        id: '3888b909-8e0a-4d44-a238-07bbb4b9dcdd',
        name: 'Structured Output Parser',
        type: '@n8n/n8n-nodes-langchain.outputParserStructured',
        version: 1.2,
        position: [3712, 352],
    })
    StructuredOutputParser = {
        jsonSchemaExample: `{
  "nome": "Rafael Souza",
  "motivo_contato": "abertura_de_empresa",
  "resumo_conversa": "O lead Rafael Souza entrou em contato querendo abrir uma empresa para atuar como consultor de TI. Relatou que hoje trabalha como autônomo e emite notas pelo CPF, mas está perdendo contratos por não ter CNPJ. Disse que não sabe qual tipo de empresa abrir nem qual regime tributário é mais vantajoso para o seu faturamento. Demonstrou interesse em entender o processo e perguntou quanto tempo leva para a empresa ficar ativa."
}`,
    };

    @node({
        id: 'fd78145b-7340-4ced-9fca-59c177e51429',
        name: 'atualizarCRM',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [4192, 224],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    Atualizarcrm = {
        operation: 'update',
        tableId: 'leads_contabilidade',
        filters: {
            conditions: [
                {
                    keyName: 'whatsapp_lead',
                    condition: 'eq',
                    keyValue: "={{ $('setar_informacoes').item.json.whatsapp_lead }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'nome_lead',
                    fieldValue: '={{ $json.output.nome }}',
                },
                {
                    fieldId: 'resumo_conversa',
                    fieldValue: '={{ $json.output.resumo_conversa }}',
                },
                {
                    fieldId: 'motivo_contato',
                    fieldValue: '={{ $json.output.motivo_contato }}',
                },
            ],
        },
    };

    @node({
        id: 'db63545d-caf4-4e71-8715-04eacd30f5cd',
        name: 'CRM',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [3504, 112],
    })
    Crm = {
        promptType: 'define',
        text: "={{ $json.messages.map(m => `Usuário: ${m.human}\\nIA: ${m.ai}`).join('\\n\\n') }}",
        hasOutputParser: true,
        options: {
            systemMessage: `=Dia e hora atual: {{ $now }}

# IDENTIDADE

-  Você é um agente IA responsável por atualizar o CRM do escritório de contabilidade **Ápice Contábil**.

# FUNÇÃO

-  Sua função é ler toda a conversa entre a **secretária e o lead**, e gerar um resumo claro, objetivo e estratégico.
-  Esse resumo será utilizado para manter o histórico atualizado e facilitar o acompanhamento futuro do escritório.
-  Você nunca inventa informações. Só preenche com base no que foi de fato conversado entre a secretária e o lead.
-   Antes de preencher qualquer campo, **leia com atenção toda a conversa entre a secretária e o lead** para garantir que os dados estejam corretos e completos.

# CAMPOS OBRIGATÓRIOS

## nome

-   Registre **exatamente o nome informado pelo lead**.
-   Se ele passar nome completo, salve completo.
-   Se for apenas o primeiro nome, salve só o primeiro nome.
-   Nunca invente sobrenomes ou complete por conta própria.

## motivo_contato

-   Registre aqui **o motivo do contato do lead**.
-   Se o lead não deixar claro, deixe o campo em branco.
-   Não tente adivinhar o motivo do contato — só registre o que estiver explícito ou implícito de forma clara.

## resumo_conversa

-   Escreva um **resumo claro, direto e natural**, reunindo **apenas o que o lead contou ou perguntou** durante a conversa.
-   Inclua sempre **o nome do lead** (obrigatório).
-   Foque em pontos como:
    -   Tipo de caso.
    -   O que o lead quer resolver.
    -   Situação atual e detalhes importantes.
    -   Dúvidas, dores, contexto e o que ele já tentou fazer.
    -   Interesse em orientação, consulta ou agendamento.
-   Ignore falas da secretária — registre apenas o que o lead disse.
-   Não mencione valores.
-   Escreva sempre em **texto corrido**, sem listas ou quebras de linha.

## EXEMPLOS DE RESUMO DE CONVERSA

### Exemplo 1 – Abertura de empresa
Rafael Souza entrou em contato querendo abrir uma empresa para atuar como consultor de TI. Relatou que hoje trabalha como autônomo e emite notas pelo CPF, mas está perdendo contratos por não ter CNPJ. Disse que não sabe qual tipo de empresa abrir nem qual regime tributário é mais vantajoso para o seu faturamento. Demonstrou interesse em entender o processo e perguntou quanto tempo leva para a empresa ficar ativa.

###  Exemplo 2 – Troca de contador

Fernanda Lima buscou o escritório porque está insatisfeita com o contador atual. Relatou que as entregas estão sempre atrasadas e que nunca recebe orientação proativa sobre impostos. Disse que tem uma LTDA no ramo de estética há 3 anos e que o faturamento cresceu, mas nunca foi feito um planejamento tributário. Demonstrou interesse em migrar para um escritório mais próximo e perguntou como funciona o processo de transição.

### Exemplo 3 – Problema com a Receita Federal

Marcos Andrade entrou em contato relatando que recebeu uma notificação da Receita Federal com uma pendência no SIMPLES Nacional. Disse que não sabe o motivo e que o contador anterior sumiu sem dar explicações. Relatou que tem uma empresa de comércio há 5 anos e que nunca teve problemas fiscais antes. Perguntou se o escritório consegue resolver a situação e qual seria o prazo para regularização.

## Regras obrigatórias

-  Não escreva nada antes ou depois do JSON.
-  Não utilize markdown.
-  Não use crases.
-  Não adicione campos extras.
-  Todos os valores devem ser string.
-  Caso alguma informação não esteja disponível, preencha com "" (string vazia).`,
        },
    };

    @node({
        id: 'a7e971fc-1430-40fc-87b2-110be976fc46',
        name: 'Sticky Note23',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [720, 0],
    })
    StickyNote23 = {
        content: '# Verifica se o usuário existe no Banco de dados.',
        height: 680,
        width: 560,
        color: 5,
    };

    @node({
        id: 'e4416941-0cb2-44a0-ab5d-0763ff259832',
        name: 'Switch4',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [1120, 208],
    })
    Switch4 = {
        rules: {
            values: [
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                id: '32a5f010-2252-4057-acb7-a085648e3a14',
                                leftValue: '={{ $json.whatsapp_lead }}',
                                rightValue: '',
                                operator: {
                                    type: 'string',
                                    operation: 'notEmpty',
                                    singleValue: true,
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Existe',
                },
                {
                    conditions: {
                        options: {
                            caseSensitive: true,
                            leftValue: '',
                            typeValidation: 'strict',
                            version: 2,
                        },
                        conditions: [
                            {
                                leftValue: '={{ $json.whatsapp_lead }}',
                                rightValue: '',
                                operator: {
                                    type: 'string',
                                    operation: 'empty',
                                    singleValue: true,
                                },
                                id: 'c71b31fe-c16a-4e57-a5b5-7d115351d0ee',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Não existe',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6ecbe1f5-bf17-479c-aa63-d9dd0e2d03ed',
        name: 'PuxarNumeroLead',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [832, 208],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
        alwaysOutputData: true,
    })
    Puxarnumerolead = {
        operation: 'get',
        tableId: 'leads_contabilidade',
        filters: {
            conditions: [
                {
                    keyName: 'whatsapp_lead',
                    keyValue: '={{ $json.whatsapp_lead }}',
                },
            ],
        },
    };

    @node({
        id: 'edfefb10-83da-4508-a961-4989261732da',
        name: 'memoria',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [2864, 368],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    Memoria = {
        sessionIdType: 'customKey',
        sessionKey: "={{ $('setar_informacoes').item.json.whatsapp_lead }}",
        contextWindowLength: 30,
    };

    @node({
        id: '7d06daf5-ee22-45bc-be5a-edcd2bf33180',
        name: 'setar_informacoes',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [480, 208],
    })
    SetarInformacoes = {
        assignments: {
            assignments: [
                {
                    id: '81f77c84-480b-4cee-8b43-3036b3e09c92',
                    name: 'mensagem_lead',
                    value: '={{ $json.mensagem_lead }}',
                    type: 'string',
                },
                {
                    id: '057e52dc-d925-48b6-8aab-5a07fc3f2a1f',
                    name: 'whatsapp_lead',
                    value: '={{ $json.whatsapp_lead }}',
                    type: 'string',
                },
                {
                    id: 'bdcd7a15-0587-4d8c-9f95-a38fc8bfe158',
                    name: 'id_conta_chatwoot',
                    value: '={{ $json.id_conta_chatwoot }}',
                    type: 'string',
                },
                {
                    id: 'd3b7244f-fcbd-4000-8b5b-7bdabdcabb28',
                    name: 'id_conversa_chatwoot',
                    value: '={{ $json.id_conversa_chatwoot }}',
                    type: 'string',
                },
                {
                    id: 'd0d69d2a-ca24-4ddd-a095-5616cdc98909',
                    name: 'id_Lead_chatwoot',
                    value: '={{ $json.id_Lead_chatwoot }}',
                    type: 'string',
                },
                {
                    id: '10e779ea-1b65-48f0-a661-6b59c984c010',
                    name: 'inbox_id_chatwoot',
                    value: '={{ $json.inbox_id_chatwoot }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '4887e3fe-4656-4fd5-9331-637968ee7a5d',
        name: 'Sticky Note3',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [3936, 0],
    })
    StickyNote3 = {
        content: '# Atualiza tabela CRM',
        height: 496,
        width: 608,
        color: 6,
    };

    @node({
        id: '78a30700-0fd6-44f9-ba5f-d6faa08c7f00',
        name: 'criar_usuario',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [1568, 640],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    CriarUsuario = {
        tableId: 'leads_contabilidade',
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'whatsapp_lead',
                    fieldValue: "={{ $('setar_informacoes').item.json.whatsapp_lead }}",
                },
                {
                    fieldId: 'inicio_atendimento',
                    fieldValue: '={{ $now }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: 'iniciou_conversa',
                },
                {
                    fieldId: 'id_conta_chatwoot',
                    fieldValue: "={{ $('setar_informacoes').item.json.id_conta_chatwoot }}",
                },
                {
                    fieldId: 'id_conversa_chatwoot',
                    fieldValue: "={{ $('setar_informacoes').item.json.id_conversa_chatwoot }}",
                },
                {
                    fieldId: 'id_lead_chatwoot',
                    fieldValue: "={{ $('setar_informacoes').item.json.id_Lead_chatwoot }}",
                },
                {
                    fieldId: 'inbox_id_chatwoot',
                    fieldValue: "={{ $('setar_informacoes').item.json.inbox_id_chatwoot }}",
                },
            ],
        },
    };

    @node({
        id: 'eb3b4407-e36a-4b4b-acce-947801eb2ad4',
        name: 'Merge',
        type: 'n8n-nodes-base.merge',
        version: 3.2,
        position: [2544, 320],
    })
    Merge = {};

    @node({
        id: '9d982bee-a33f-4690-a66e-231da90ffd0a',
        name: 'Sticky Note24',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1376, 320],
    })
    StickyNote24 = {
        content: '# Cadastra ele no banco de dados e coloca o status como "iniciou_conversa"',
        height: 568,
        width: 512,
        color: 6,
    };

    @node({
        id: '800d642f-22b0-4dcb-a6a9-f5cee13610fb',
        name: 'Sticky Note4',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2160, 560],
    })
    StickyNote4 = {
        content: `## iniciou_conversa
## conversando
## agendado
## cliente
## follow_up
## cancelou_agendamento
## perdido`,
        height: 304,
        width: 352,
        color: '#2F692B',
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.SetarInformacoes.in(0));
        this.ChatMemoryManager1.out(0).to(this.Crm.in(0));
        this.Atualizafollowup.out(0).to(this.Merge.in(0));
        this.Crm.out(0).to(this.Atualizarcrm.in(0));
        this.Switch4.out(0).to(this.Atualizafollowup.in(0));
        this.Switch4.out(1).to(this.CriarUsuario.in(0));
        this.Puxarnumerolead.out(0).to(this.Switch4.in(0));
        this.SetarInformacoes.out(0).to(this.Puxarnumerolead.in(0));
        this.CriarUsuario.out(0).to(this.Merge.in(1));
        this.Merge.out(0).to(this.ChatMemoryManager1.in(0));

        this.ChatMemoryManager1.uses({
            ai_memory: this.Memoria.output,
        });
        this.Crm.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
            ai_outputParser: this.StructuredOutputParser.output,
        });
    }
}
