import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 1- Follow UP 20min | Ápice Contábil
// Nodes   : 24  |  Connections: 13
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// OpenaiChatModel3                   lmChatOpenAi               [creds] [ai_languageModel]
// ScheduleTrigger1                   scheduleTrigger
// ChatMemoryManager                  memoryManager              [AI]
// Loop                               splitInBatches
// Enviarmsglead                      httpRequest                [creds]
// Wait                               wait
// Memorialead                        memoryPostgresChat         [creds] [ai_memory]
// Verificarchatwoot                  switch
// NaoFazerNada                       noOp
// StickyNote2                        stickyNote
// Setarinformacoes                   set
// Puxardadoslead                     supabase                   [creds]
// Followup1                          supabase                   [creds]
// FollowUp1                          agent                      [AI]
// Filter                             filter
// If_                                if
// StickyNote9                        stickyNote
// StickyNote3                        stickyNote
// StickyNote                         stickyNote
// StickyNote4                        stickyNote
// StickyNote5                        stickyNote
// StickyNote58                       stickyNote
// Memorialead1                       memoryPostgresChat         [creds]
// StickyNote1                        stickyNote
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ScheduleTrigger1
//    → Puxardadoslead
//      → Filter
//        → If_
//          → Verificarchatwoot
//            → Setarinformacoes
//              → Loop
//               .out(1) → ChatMemoryManager
//                  → FollowUp1
//                    → Enviarmsglead
//                      → Followup1
//                        → Wait
//                          → Loop (↩ loop)
//           .out(1) → NaoFazerNada
//
// AI CONNECTIONS
// ChatMemoryManager.uses({ ai_memory: Memorialead })
// FollowUp1.uses({ ai_languageModel: OpenaiChatModel3 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'D8WCBnUup5XVZIwc',
    name: '1- Follow UP 20min | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class _1FollowUp20minApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'eb6e1709-c43e-43a1-8207-98a2c8de26f7',
        name: 'OpenAI Chat Model3',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1,
        position: [1152, 688],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    OpenaiChatModel3 = {
        model: 'gpt-4o-mini',
        options: {},
    };

    @node({
        id: '2778f488-c68d-4534-b45d-f74c2f4a6330',
        name: 'Schedule Trigger1',
        type: 'n8n-nodes-base.scheduleTrigger',
        version: 1.2,
        position: [-2160, 464],
    })
    ScheduleTrigger1 = {
        rule: {
            interval: [
                {
                    field: 'cronExpression',
                    expression: '0 */10 8-21 * * *',
                },
            ],
        },
    };

    @node({
        id: 'f5afdc51-a86d-493b-8f83-85b3644da3db',
        name: 'Chat Memory Manager',
        type: '@n8n/n8n-nodes-langchain.memoryManager',
        version: 1.1,
        position: [784, 448],
    })
    ChatMemoryManager = {
        options: {},
    };

    @node({
        id: 'ed480fb4-ab48-4ad2-8c08-283b4cd390a8',
        name: 'Loop',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [480, 432],
    })
    Loop = {
        options: {},
    };

    @node({
        id: 'a6a68999-1ecf-47a2-ab90-443c69468089',
        name: 'enviarMsgLead',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1552, 448],
        credentials: { httpHeaderAuth: { id: 'vFHIRVhHLdinPZ9u', name: 'Chatwoot-contabilidade' } },
    })
    Enviarmsglead = {
        method: 'POST',
        url: "={{ $('setarInformacoes').item.json.url_chatwoot }}api/v1/accounts/{{ $('setarInformacoes').item.json.IDContaChatWoot }}/conversations/{{ $('setarInformacoes').item.json.IdConversaChatWoot }}/messages",
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendBody: true,
        bodyParameters: {
            parameters: [
                {
                    name: 'content',
                    value: '={{ $json.output }}',
                },
                {
                    name: 'message_type',
                    value: 'outgoing',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '0f2d03e5-dc93-4e1a-8146-9e6c9fa053b4',
        webhookId: 'b6f37c6e-976c-467d-be46-f84c38c324fa',
        name: 'Wait',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [2064, 448],
    })
    Wait = {
        amount: 10,
    };

    @node({
        id: '60748916-a2b9-4232-8c30-abcb09bb6768',
        name: 'memoriaLead',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [800, 688],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    Memorialead = {
        sessionIdType: 'customKey',
        sessionKey: "={{ $('setarInformacoes').item.json.whatsapp_lead }}",
        contextWindowLength: 20,
    };

    @node({
        id: 'e281676c-e64d-4627-a9fd-6cabdb88fc82',
        name: 'verificarChatWoot',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-544, 400],
    })
    Verificarchatwoot = {
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
                                id: 'd57e2c51-88bf-4a96-a7dd-f2e0ef7fee4c',
                                leftValue: '={{ $json.id_conta_chatwoot }}',
                                rightValue: 'null',
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
                    outputKey: 'PROSSEGUIR',
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
                                leftValue: '={{ $json.id_conta_chatwoot }}',
                                rightValue: 'null',
                                operator: {
                                    type: 'string',
                                    operation: 'empty',
                                    singleValue: true,
                                },
                                id: '3bc09cc4-2b65-4bb4-88a9-032b121cf0a3',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'não prosseguir',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '8c6da53f-e9ab-4d35-b8ca-250f6c0bae9e',
        name: 'não fazer nada',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [-272, 560],
    })
    NaoFazerNada = {};

    @node({
        id: '2804813c-49f6-4c41-b716-c8d1f5c28533',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-2240, 240],
    })
    StickyNote2 = {
        content: '# Aciona a cada 10 minutos',
        height: 480,
        width: 308,
        color: 5,
    };

    @node({
        id: '950a4cc3-5f2d-45d6-88c8-93ce98167fe6',
        name: 'setarInformacoes',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [112, 496],
    })
    Setarinformacoes = {
        assignments: {
            assignments: [
                {
                    id: '99f23408-3488-4b8d-811f-c5d2c0734591',
                    name: 'whatsapp_lead',
                    value: "={{ $('PuxarDadosLead').item.json.whatsapp_lead }}",
                    type: 'string',
                },
                {
                    id: '9d7b9cd7-ab8e-4959-bc1d-fbacb9db870e',
                    name: 'IDContaChatWoot',
                    value: '={{ $json.id_conta_chatwoot }}',
                    type: 'string',
                },
                {
                    id: 'bb450359-5e52-4041-9307-68ca0a8e9de7',
                    name: 'IdConversaChatWoot',
                    value: '={{ $json.id_conversa_chatwoot }}',
                    type: 'string',
                },
                {
                    id: 'bf9d30c9-e9c6-4e64-ab4b-53de229dcaee',
                    name: 'idLeadChatWoot',
                    value: '={{ $json.id_lead_chatwoot }}',
                    type: 'string',
                },
                {
                    id: 'ca04c0d1-c42b-40a4-a7ae-35a28dc3990a',
                    name: 'InboxIdChatWoot',
                    value: '={{ $json.inbox_id_chatwoot }}',
                    type: 'string',
                },
                {
                    id: '53dec4be-fa20-4e2b-80eb-827925dab32c',
                    name: 'url_chatwoot',
                    value: 'https://chat.mantovan.com.br/',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '21f7bd51-76a4-40bf-a2d4-759f5b78ffe6',
        name: 'PuxarDadosLead',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [-1776, 464],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
        alwaysOutputData: false,
    })
    Puxardadoslead = {
        operation: 'getAll',
        tableId: 'leads_contabilidade',
        returnAll: true,
        filters: {
            conditions: [
                {
                    keyName: 'minutos_ultima_mensagem_base',
                    condition: 'gte',
                    keyValue: '20',
                },
            ],
        },
    };

    @node({
        id: '1b31fa88-d09b-4129-92d8-c0b7e007e2ac',
        name: 'FollowUP_1',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [1824, 464],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
        alwaysOutputData: false,
    })
    Followup1 = {
        operation: 'update',
        tableId: 'leads_contabilidade',
        matchType: 'allFilters',
        filters: {
            conditions: [
                {
                    keyName: 'whatsapp_lead',
                    condition: 'eq',
                    keyValue: "={{ $('setarInformacoes').item.json.whatsapp_lead }}",
                },
            ],
        },
        fieldsUi: {
            fieldValues: [
                {
                    fieldId: 'follow_up_1',
                    fieldValue: '={{ $now }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: 'follow_up',
                },
            ],
        },
    };

    @node({
        id: '746db574-6918-4766-ad15-ba8d9f26e991',
        name: 'Follow UP 1',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [1184, 448],
    })
    FollowUp1 = {
        promptType: 'define',
        text: '=Histórico de conversa: {{ JSON.stringify($json.messages, null, 2) }}',
        options: {
            systemMessage: `=# IDENTIDADE

-  Você é **Laura**, secretária do escritório de contabilidade **Ápice Contábil**.
-  Você é especialista em follow-up natural e leve para retomar conversas no WhatsApp.

# FUNÇÃO

-   Ler as últimas mensagens trocadas entre você e o cliente.
-   Entender em que ponto a conversa parou.
-   Criar **uma única mensagem**, simples, natural e humanizada, para retomar o contato.
-   Estimular a resposta de forma suave, mostrando que está disponível para ajudar.

# REGRAS DE MENSAGEM

-   Nunca se apresente, nunca peça nome ou dados já informados
-   Seja breve, como uma conversa normal no WhatsApp
-   Use o nome do lead, se estiver disponível
-   Não pressione, não cobre retorno e não mencione tempo de ausência
-   Nunca repita a última pergunta ou informação enviada.
-   Se a sua última mensagem tinha link, instrução ou orientação contábil, não repita
-   Retome o assunto de forma simpática e profissional, com naturalidade.
-   Emojis só se fizer sentido e sempre de maneira moderada.
-   Passe segurança e disponibilidade para ajudar.
-   Data e hora de agora: {{ $now }}

## EXEMPLOS DE MENSAGENS
Exemplo 1:
"Você conseguiu ver a última mensagem que te mandei?"

Exemplo 2:
"Posso te ajudar com alguma dúvida sobre a consulta?"

Exemplo 3:
"Oi! Você chegou a ver minha última mensagem?"

Exemplo 4:
"Olá, ainda está por aí?"

Exemplo 5:
"Chegou a dar uma olhadinha no que te enviei?"

Exemplo 6:
"Olá, chegou a ver o que te mandei?"

Exemplo 7:
"Oi! Ficou alguma dúvida no que conversamos?"`,
        },
    };

    @node({
        id: '1ea6cb28-2289-42e9-a491-3f78853063d5',
        name: 'Filter',
        type: 'n8n-nodes-base.filter',
        version: 2.2,
        position: [-1312, 528],
    })
    Filter = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '8d68f79e-5b79-4cb3-b19d-0accbd6cd8ad',
                    leftValue: '={{ $json.data_agendamento }}',
                    rightValue: 'Feito',
                    operator: {
                        type: 'string',
                        operation: 'empty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'c21cdf8d-f78a-4c99-919e-03852b7e13f2',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-912, 528],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '8d308b9b-1224-42c2-87b0-89b46e273350',
                    leftValue: '={{ $json.follow_up_1 }}',
                    rightValue: 'Feito',
                    operator: {
                        type: 'string',
                        operation: 'empty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: 'da56ac3a-ec2a-4053-9c21-b18d8567dca5',
        name: 'Sticky Note9',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1904, 240],
    })
    StickyNote9 = {
        content: '# Puxa os leads da planilha com mais de 20 minutos sem resposta',
        height: 480,
        width: 428,
        color: 7,
    };

    @node({
        id: '294c1137-9a27-49d7-b6f7-fcb32fe7fe72',
        name: 'Sticky Note3',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1440, 240],
    })
    StickyNote3 = {
        content: '# Verifica se a coluna "data_agendamento" está vazia. Se tiver, segue.',
        height: 480,
        width: 368,
        color: '#565448',
    };

    @node({
        id: 'a9654576-9d8a-4043-b570-cd5d2752a7f8',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1040, 240],
    })
    StickyNote = {
        content: '# Verifica se o "Follow UP 1" não foi realizado',
        height: 480,
        width: 400,
        color: 7,
    };

    @node({
        id: 'a71bc1c2-a32a-4ead-ade2-ba971844e884',
        name: 'Sticky Note4',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-608, 240],
    })
    StickyNote4 = {
        content: '# Verifica se o ID da conversa existe para enviar pelo Chatwoot',
        height: 480,
        width: 564,
    };

    @node({
        id: 'cde77a26-a99d-43f1-8205-cf3237ecc18e',
        name: 'Sticky Note5',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-16, 240],
    })
    StickyNote5 = {
        content: `# Setar informações
## Importante: abra esse node e coloque a URL do chatwoot`,
        height: 480,
        width: 352,
        color: 4,
    };

    @node({
        id: 'eb3b7d71-2631-417f-90b6-626d6806cd23',
        name: 'Sticky Note58',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [384, 240],
    })
    StickyNote58 = {
        content: '# FOLLOW UP DE 20 MINUTOS',
        height: 592,
        width: 1876,
        color: 4,
    };

    @node({
        id: '61ae5249-bb58-41e5-af0e-e36d5f4f0b7b',
        name: 'memoriaLead1',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [1360, 688],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    Memorialead1 = {
        sessionIdType: 'customKey',
        sessionKey: "={{ $('setarInformacoes').item.json.whatsapp_lead }}",
        contextWindowLength: 20,
    };

    @node({
        id: '0f48d38f-f74e-4502-aea9-69fd398db21c',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote1 = {
        content: '# Importante: abra esse node e coloque a URL do chatwoot',
        height: 240,
        width: 320,
        color: 3,
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.ScheduleTrigger1.out(0).to(this.Puxardadoslead.in(0));
        this.ChatMemoryManager.out(0).to(this.FollowUp1.in(0));
        this.Loop.out(1).to(this.ChatMemoryManager.in(0));
        this.Enviarmsglead.out(0).to(this.Followup1.in(0));
        this.Wait.out(0).to(this.Loop.in(0));
        this.Verificarchatwoot.out(0).to(this.Setarinformacoes.in(0));
        this.Verificarchatwoot.out(1).to(this.NaoFazerNada.in(0));
        this.Setarinformacoes.out(0).to(this.Loop.in(0));
        this.Puxardadoslead.out(0).to(this.Filter.in(0));
        this.Followup1.out(0).to(this.Wait.in(0));
        this.FollowUp1.out(0).to(this.Enviarmsglead.in(0));
        this.Filter.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.Verificarchatwoot.in(0));

        this.ChatMemoryManager.uses({
            ai_memory: this.Memorialead.output,
        });
        this.FollowUp1.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
        });
    }
}
