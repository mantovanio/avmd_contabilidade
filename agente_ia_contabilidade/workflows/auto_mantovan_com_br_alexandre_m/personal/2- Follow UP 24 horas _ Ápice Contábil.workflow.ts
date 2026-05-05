import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 2- Follow UP 24 horas | Ápice Contábil
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
// Filter                             filter
// If_                                if
// StickyNote9                        stickyNote
// StickyNote3                        stickyNote
// StickyNote                         stickyNote
// StickyNote4                        stickyNote
// StickyNote5                        stickyNote
// StickyNote58                       stickyNote
// Memorialead1                       memoryPostgresChat         [creds] [ai_memory]
// Followup2                          supabase                   [creds]
// FollowUp2                          agent                      [AI]
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
//                  → FollowUp2
//                    → Enviarmsglead
//                      → Followup2
//                        → Wait
//                          → Loop (↩ loop)
//           .out(1) → NaoFazerNada
//
// AI CONNECTIONS
// ChatMemoryManager.uses({ ai_memory: Memorialead })
// FollowUp2.uses({ ai_languageModel: OpenaiChatModel3, ai_memory: Memorialead1 })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '4WlMdMHG9g0YeNB9',
    name: '2- Follow UP 24 horas | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class _2FollowUp24HorasApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'b9a43110-4d0f-4746-89fe-b4572bc970ca',
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
        id: 'e5e5873a-ad51-46a5-b7d0-2fbb3ff6352f',
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
        id: '8b6f1fb2-ff5f-442f-b3ff-bede69bfd753',
        name: 'Chat Memory Manager',
        type: '@n8n/n8n-nodes-langchain.memoryManager',
        version: 1.1,
        position: [784, 448],
    })
    ChatMemoryManager = {
        options: {},
    };

    @node({
        id: '5de8301f-065e-432d-a4fb-6e58055979ea',
        name: 'Loop',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [480, 432],
    })
    Loop = {
        options: {},
    };

    @node({
        id: '56aa54c8-6e26-4ba6-9b8f-a79b8e2d31a3',
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
        id: 'a54d3eaa-c473-42b2-b11b-718a0a346ab9',
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
        id: '8655eda9-dac2-4195-bc83-5bbda4d6479b',
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
        id: 'ff83ee98-2b37-480f-8a7e-93c9bec76b77',
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
        id: '29b3363a-3859-4146-993a-cfab9d81ee42',
        name: 'não fazer nada',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [-272, 560],
    })
    NaoFazerNada = {};

    @node({
        id: '7429aaaf-f7cc-4182-b93c-23a7d7ef4c1a',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-2240, 240],
    })
    StickyNote2 = {
        content: '# Aciona a cada 10 minutos',
        height: 480,
        width: 276,
        color: 5,
    };

    @node({
        id: '3c9b18f5-b0fb-49d2-8934-4e36b70ece6c',
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
                    value: 'hhttps://chat.mantovan.com.br/',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6794ee28-04b1-4880-9f92-b67ff348d7e1',
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
                    keyValue: '1440',
                },
            ],
        },
    };

    @node({
        id: 'e21fa045-d566-4e16-8b40-25324bcc63a9',
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
        id: 'dd96cfb4-6377-47f0-a598-53db0df0afd7',
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
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
                {
                    id: '25fe1eeb-ed84-4dcf-9b65-073478d066e4',
                    leftValue: '={{ $json.follow_up_2 }}',
                    rightValue: '',
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
        id: 'd1c58e6a-8729-4baf-bf71-96b47957c225',
        name: 'Sticky Note9',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1952, 240],
    })
    StickyNote9 = {
        content: '# Puxa os leads da planilha com mais de 1440 minutos sem resposta',
        height: 480,
        width: 476,
        color: 7,
    };

    @node({
        id: 'd62965b1-7641-4049-91a2-fd2a07a2a9cc',
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
        id: '90304bdb-3375-4c5b-8e34-189024e4df78',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1040, 240],
    })
    StickyNote = {
        content: '# Verifica se o "Follow UP 2" não foi realizado',
        height: 480,
        width: 400,
        color: 7,
    };

    @node({
        id: 'b005a9cc-9bd3-4796-9da9-c6b3eb6db36e',
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
        id: 'be73b271-c00b-48d8-abf2-5a0ffe6b60cb',
        name: 'Sticky Note5',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-16, 240],
    })
    StickyNote5 = {
        content: '# Setar informações',
        height: 480,
        width: 352,
        color: 4,
    };

    @node({
        id: '33eb84b1-73b9-4b85-8483-75f7542aa663',
        name: 'Sticky Note58',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [384, 240],
    })
    StickyNote58 = {
        content: '# FOLLOW UP DE 24 Horas',
        height: 592,
        width: 1876,
        color: 4,
    };

    @node({
        id: '79619f45-4cad-4a33-96a3-fb8a35dbd60d',
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
        id: '9c255610-8d62-47fa-ae42-8da44fd88021',
        name: 'FollowUP_2',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [1824, 448],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
        alwaysOutputData: false,
    })
    Followup2 = {
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
                    fieldId: 'follow_up_2',
                    fieldValue: '={{ $now }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: 'perdido',
                },
            ],
        },
    };

    @node({
        id: '9d455138-4645-453d-82e8-bcc6044c4763',
        name: 'Follow UP 2',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [1184, 448],
    })
    FollowUp2 = {
        promptType: 'define',
        text: '=Histórico de conversa: {{ JSON.stringify($json.messages, null, 2) }}',
        options: {
            systemMessage: `=# IDENTIDADE

Você é **Laura**, secretária do escritório de contabilidade **Ápice Contábil**.
Você é especialista em follow-up natural e leve para retomar conversas 
no WhatsApp.

# FUNÇÃO

- Ler as últimas mensagens trocadas entre você e o lead.
- Entender em que ponto a conversa parou.
- Criar **uma única mensagem**, um pouco mais direta que o contato anterior,
  reforçando o valor da reunião e despertando interesse para resposta.
- Estimular a resposta de forma suave, sem pressionar.

# REGRAS DE MENSAGEM

- Nunca se apresente, nunca peça nome ou dados já informados
- Seja breve, como uma conversa normal no WhatsApp
- Use o nome do lead, se estiver disponível
- Não pressione, não cobre retorno e não mencione tempo de ausência
- Nunca repita a última pergunta ou informação enviada
- Se a sua última mensagem tinha link, instrução ou orientação contábil, 
  não repita
- Seja um pouco mais direta que o follow-up anterior — reforce o valor 
  da reunião e desperte curiosidade ou senso de oportunidade
- Emojis só se fizer sentido e sempre de maneira moderada
- Passe segurança e disponibilidade para ajudar
- Data e hora de agora: {{ $now }}

# EXEMPLOS DE MENSAGENS

- "Oi [nome]! Ainda tem interesse em regularizar a situação da sua empresa? Posso verificar um horário agora 😊"
- "Oi [nome]! Muita gente deixa pra depois e acaba pagando mais imposto do que precisa. Posso te ajudar a evitar isso."
- "Oi! A reunião com nosso especialista é rápida e gratuita — vale muito a pena. Ainda consigo um horário pra você essa semana."
- "Oi [nome]! Resolver isso agora pode evitar dor de cabeça lá na frente. Posso verificar um horário pra você?"
- "Oi! Nosso especialista consegue te orientar em poucos minutos. Ainda tem interesse em conversar?"
- "Oi [nome]! Só queria reforçar que a reunião é sem compromisso e pode fazer bastante diferença pro seu negócio 😊"`,
        },
    };

    @node({
        id: '8dfaf7e4-72f9-4652-933c-8e63f137e7f2',
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
        this.ChatMemoryManager.out(0).to(this.FollowUp2.in(0));
        this.Loop.out(1).to(this.ChatMemoryManager.in(0));
        this.Enviarmsglead.out(0).to(this.Followup2.in(0));
        this.Wait.out(0).to(this.Loop.in(0));
        this.Verificarchatwoot.out(0).to(this.Setarinformacoes.in(0));
        this.Verificarchatwoot.out(1).to(this.NaoFazerNada.in(0));
        this.Setarinformacoes.out(0).to(this.Loop.in(0));
        this.Puxardadoslead.out(0).to(this.Filter.in(0));
        this.Filter.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.Verificarchatwoot.in(0));
        this.Followup2.out(0).to(this.Wait.in(0));
        this.FollowUp2.out(0).to(this.Enviarmsglead.in(0));

        this.ChatMemoryManager.uses({
            ai_memory: this.Memorialead.output,
        });
        this.FollowUp2.uses({
            ai_languageModel: this.OpenaiChatModel3.output,
            ai_memory: this.Memorialead1.output,
        });
    }
}
