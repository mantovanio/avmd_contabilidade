import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 5- Eventos Agenda | Ápice Contábil
// Nodes   : 37  |  Connections: 30
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Response1                          set
// StickyNote1                        stickyNote
// Disponibilidade                    googleCalendar             [creds]
// Marca                              googleCalendar             [creds]
// JaTemUmEvento                      googleCalendar             [creds] [alwaysOutput]
// GoogleCalendar1                    googleCalendar             [creds]
// GoogleCalendar3                    googleCalendar             [creds]
// VerificaEvento                     googleCalendar             [creds]
// VerificaEvento1                    googleCalendar             [creds]
// If6                                if
// Disponibilidade1                   googleCalendar             [creds]
// EditFields6                        set
// If5                                if
// EditFields7                        set
// EditFields9                        set
// Switch4                            switch
// If_                                if
// Setarinformacoes                   set
// EditFields2                        set
// DefinirAgenda                      set
// BuscarEventosJaReistrados          googleCalendar             [creds] [alwaysOutput]
// JuntarEventos                      aggregate
// DefinirDisponibilidade             set
// StickyNote2                        stickyNote
// StickyNote3                        stickyNote
// StickyNote4                        stickyNote
// EditFields1                        set
// Code                               code
// Setarinfo                          set
// ExecWorkflow                       executeWorkflowTrigger
// StickyNote7                        stickyNote
// StickyNote6                        stickyNote
// StatusAgendado                     supabase                   [creds]
// EtiquetaReuniaoMarcada             httpRequest                [creds]
// AtualizarData                      supabase                   [creds]
// TirarDataAgendamento               supabase                   [creds]
// StickyNote                         stickyNote
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// ExecWorkflow
//    → Setarinformacoes
//      → Switch4
//        → JaTemUmEvento
//          → If5
//            → EditFields6
//           .out(1) → Disponibilidade
//              → If_
//                → Marca
//                  → Setarinfo
//                    → StatusAgendado
//                      → EtiquetaReuniaoMarcada
//                        → Response1
//               .out(1) → EditFields9
//       .out(1) → VerificaEvento
//          → GoogleCalendar1
//            → TirarDataAgendamento
//              → EditFields7
//       .out(2) → Disponibilidade1
//          → If6
//            → VerificaEvento1
//              → GoogleCalendar3
//                → AtualizarData
//                  → EditFields2
//           .out(1) → EditFields9 (↩ loop)
//       .out(3) → DefinirAgenda
//          → BuscarEventosJaReistrados
//            → JuntarEventos
//              → DefinirDisponibilidade
//                → Code
//                  → EditFields1
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'bicftP0mF9gEsdvs',
    name: '5- Eventos Agenda | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class _5EventosAgendaApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '7a3b045f-85b2-461f-8bd8-b7913ba71010',
        name: 'response1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [3360, 320],
    })
    Response1 = {
        assignments: {
            assignments: [
                {
                    id: '86ff282a-3ede-4417-98c1-0d10858bc5dc',
                    name: 'response',
                    value: "=Agendamento concluído para o dia: {{ $('setarInfo').item.json.data_formatada }}. Link do Google Meet: {{ $('setarInfo').item.json.link_meet }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '1384adbb-037f-4325-a2d8-76ec95dc6459',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote1 = {
        content: '# Agendamento',
        height: 1484,
        width: 3596,
        color: 6,
    };

    @node({
        id: '6395c430-b0ef-4a67-86da-31ba0544c743',
        name: 'Disponibilidade',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [1408, 320],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    Disponibilidade = {
        resource: 'calendar',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        timeMin: "={{ $('setarInformacoes').item.json.inicio_reuniao }}",
        timeMax: "={{ $('setarInformacoes').item.json.final_reuniao }}",
        options: {},
    };

    @node({
        id: 'b1ff501b-587d-4d06-8cc2-05d44217f859',
        name: 'Marca',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [1936, 320],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    Marca = {
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        start: "={{ $('setarInformacoes').item.json.inicio_reuniao }}",
        end: "={{ $('setarInformacoes').item.json.final_reuniao }}",
        additionalFields: {
            attendees: [],
            conferenceDataUi: {
                conferenceDataValues: {
                    conferenceSolution: 'hangoutsMeet',
                },
            },
            description: `=Nome do cliente: {{ $('setarInformacoes').item.json.nome_lead }}
Whatsapp: {{ $('setarInformacoes').item.json.whatsapp_lead }}
Assunto: {{ $('setarInformacoes').item.json.assunto }}
Tipo de consulta: {{ $('setarInformacoes').item.json.tipo_consulta }}
`,
            summary:
                "={{ $('setarInformacoes').item.json.nome_lead }} | {{ $('setarInformacoes').item.json.tipo_consulta }}",
        },
    };

    @node({
        id: '1aeca828-e264-42a5-80cd-fe717a5513f1',
        name: 'Já tem um evento',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [976, 272],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
        alwaysOutputData: true,
    })
    JaTemUmEvento = {
        operation: 'getAll',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        limit: 1,
        options: {},
    };

    @node({
        id: 'ee47f504-513f-4a0c-aa3a-a8ad54328952',
        name: 'Google Calendar1',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [1200, 640],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    GoogleCalendar1 = {
        operation: 'delete',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        eventId: "={{ $('Verifica evento').item.json.id }}",
        options: {},
    };

    @node({
        id: '0388783b-fb4b-467f-ab01-0c189afedb9d',
        name: 'Google Calendar3',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [1856, 880],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    GoogleCalendar3 = {
        operation: 'update',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        eventId: "={{ $('setarInformacoes').item.json.id_agendamento }}",
        useDefaultReminders: false,
        updateFields: {
            end: "={{ $('setarInformacoes').item.json.final_reuniao }}",
            sendUpdates: 'all',
            start: "={{ $('setarInformacoes').item.json.inicio_reuniao }}",
        },
    };

    @node({
        id: '6f1f8438-0745-48f4-bb1d-39308854c229',
        name: 'Verifica evento',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [976, 640],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    VerificaEvento = {
        operation: 'getAll',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        returnAll: true,
        options: {
            query: "={{ $('setarInformacoes').item.json.id_agendamento }}",
        },
    };

    @node({
        id: 'c87d082f-02f2-4991-ba4c-b5dbd80ef3f1',
        name: 'Verifica evento1',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [1632, 880],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    VerificaEvento1 = {
        operation: 'getAll',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        returnAll: true,
        options: {
            query: "={{ $('setarInformacoes').item.json.whatsapp_lead }}",
        },
    };

    @node({
        id: '368ba1e1-9e26-43a0-ad5a-bf73aff23ac6',
        name: 'If6',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1280, 880],
    })
    If6 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: 'be5649a9-7624-4621-bd2d-84c25577c0ce',
                    leftValue: '={{ $json.available }}',
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '1ae82018-a37a-4599-81d8-181ed383aa41',
        name: 'Disponibilidade1',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.1,
        position: [992, 880],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
    })
    Disponibilidade1 = {
        resource: 'calendar',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        timeMin: '={{ $json.inicio_reuniao }}',
        timeMax: '={{ $json.final_reuniao }}',
        options: {},
    };

    @node({
        id: 'd0cdca31-20db-4af8-853d-4b0db7d9d4da',
        name: 'Edit Fields6',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1408, 32],
    })
    EditFields6 = {
        assignments: {
            assignments: [
                {
                    id: '86ff282a-3ede-4417-98c1-0d10858bc5dc',
                    name: 'response',
                    value: `=Você já tem uma reunião agendada para o dia: {{(() => { 
    const data = new Date($json.start.dateTime);
    const opcoes = { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' };
    return \`dia \${data.toLocaleDateString('pt-BR', opcoes).replace(' ', ' de ').replace(',', ' às')}\`;
})()}} gostaria de reagendar? `,
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'decd7f32-b32e-4adc-adf9-05a4bf4e4df1',
        name: 'If5',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1168, 272],
    })
    If5 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 2,
            },
            conditions: [
                {
                    id: '8d192ed0-aebd-404e-8339-daab0d29651f',
                    leftValue: '={{ $item("0").$node["Já tem um evento"].json["attendees"]["0"]["email"] }}',
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
        options: {},
    };

    @node({
        id: '14745e5a-a620-448b-93e4-ba2286f0eed5',
        name: 'Edit Fields7',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1632, 640],
    })
    EditFields7 = {
        assignments: {
            assignments: [
                {
                    id: '7f842ffa-cd8f-40ab-a0a7-40dc173357a7',
                    name: 'response',
                    value: 'Informe o usuário que o agendamento foi cancelado e que estará sempre à disposição para um novo agendamento.',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2815603e-91b0-4fd1-ad83-6afee1f76dde',
        name: 'Edit Fields9',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1936, 640],
    })
    EditFields9 = {
        assignments: {
            assignments: [
                {
                    id: '04c6ca35-7572-4699-bcb7-bbf2f2a6e6a4',
                    name: 'response',
                    value: 'horário não disponível, peça outro horário',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd2653c32-e344-4a04-8a02-2f137a408644',
        name: 'Switch4',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [688, 624],
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
                                leftValue: '={{ $json.evento }}',
                                rightValue: 'agendamento',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                                id: 'f5b06620-94a8-41c3-b06c-64a1c9306317',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'agendamento',
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
                                id: '7a57e8e8-5227-4cde-8d58-7b447cd55a17',
                                leftValue: '={{ $json.evento }}',
                                rightValue: 'cancelamento',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'cancelamento',
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
                                id: 'd788021f-29ab-41f2-b355-2b18963d30f2',
                                leftValue: '={{ $json.evento }}',
                                rightValue: 'reagendamento',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'reagendamento',
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
                                id: '9fe78f3c-e37e-4408-b520-19e0f14e8824',
                                leftValue: '={{ $json.evento }}',
                                rightValue: 'VerHorarios',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                    name: 'filter.operator.equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Ver Horarios',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '3b884ebd-5d01-4187-8e13-7169cdc04974',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [1664, 320],
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
                    id: 'be5649a9-7624-4621-bd2d-84c25577c0ce',
                    leftValue: '={{ $json.available }}',
                    rightValue: '',
                    operator: {
                        type: 'boolean',
                        operation: 'true',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '8ae929d1-e433-4c4d-953f-99fcb69d0671',
        name: 'setarInformacoes',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [448, 656],
    })
    Setarinformacoes = {
        assignments: {
            assignments: [
                {
                    id: '80f81b7f-a588-4135-bbeb-c6a5f9cd2231',
                    name: 'whatsapp_lead',
                    value: '={{ $json.whatsapp_lead }}',
                    type: 'string',
                },
                {
                    id: '1fdd5696-40e0-4e48-96a0-51e6740a8688',
                    name: 'evento',
                    value: '={{ $json.evento }}',
                    type: 'string',
                },
                {
                    id: '155a68cc-7838-4753-b1a2-96841890c149',
                    name: 'inicio_reuniao',
                    value: '={{ $json.inicio_reuniao }}',
                    type: 'string',
                },
                {
                    id: '88453109-556e-4682-8dd6-a007faef0f85',
                    name: 'final_reuniao',
                    value: '={{ $json.final_reuniao }}',
                    type: 'string',
                },
                {
                    id: '3b3e2717-3de9-4731-94c2-2a4e617d75a2',
                    name: 'tipo_consulta',
                    value: '={{ $json.tipo_consulta }}',
                    type: 'string',
                },
                {
                    id: 'c9886780-4afa-4bab-9b9b-0420ae8e9c5c',
                    name: 'assunto',
                    value: '={{ $json.assunto }}',
                    type: 'string',
                },
                {
                    id: '940d0d3c-0858-422e-be65-b81d69f9373e',
                    name: 'id_agendamento',
                    value: '={{ $json.id_agendamento }}',
                    type: 'string',
                },
                {
                    id: 'a1047306-4df1-4dd7-967b-0889af97095b',
                    name: 'nome_lead',
                    value: '={{ $json.nome_lead }}',
                    type: 'string',
                },
                {
                    id: '49a3f631-bf1c-4004-ada4-be8d6a03b73c',
                    name: 'url_chatwoot',
                    value: '={{ $json.url_chatwoot }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a4acc42f-7082-420e-940e-72f1df42ac2e',
        name: 'Edit Fields2',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2320, 880],
    })
    EditFields2 = {
        assignments: {
            assignments: [
                {
                    id: '7f842ffa-cd8f-40ab-a0a7-40dc173357a7',
                    name: 'response',
                    value: '=Reunião foi reagendada com sucesso!',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'eb6cb688-1f66-4424-9346-55919554cf61',
        name: 'definir agenda',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [864, 1232],
    })
    DefinirAgenda = {
        mode: 'raw',
        jsonOutput: `{
  "timezone": "America/Sao_Paulo",
  "timeBetweenMeetingsMinutes ": 30,
  "schedule": [
    {
      "day": "SEG",
      "available": true,
      "hours": { "after": "09:00", "before": "17:30" }
    },
    {
      "day": "TER",
      "available": true,
      "hours": { "after": "09:00", "before": "17:30" }
    },
    {
      "day": "QUA",
      "available": true,
      "hours": { "after": "09:00", "before": "17:30" }
    },
    {
      "day": "QUI",
      "available": true,
      "hours": { "after": "09:00", "before": "17:30" }
    },
    {
      "day": "SEX",
      "available": true,
      "hours": { "after": "09:00", "before": "17:30" }
    },
    {
      "day": "SAB",
      "available": false,
      "hours": { "after": "09:00", "before": "13:00" }
    },
    {
      "day": "DOM",
      "available": false,
      "hours": { "after": "", "before": "" }
    }
  ]
}
`,
        options: {},
    };

    @node({
        id: 'e9aa302e-81d0-45ee-a736-8d84c298edfc',
        name: 'buscar eventos já reistrados',
        type: 'n8n-nodes-base.googleCalendar',
        version: 1.3,
        position: [1200, 1232],
        credentials: { googleCalendarOAuth2Api: { id: 'C50PktvC0Py1dl9D', name: 'Google Calendar' } },
        alwaysOutputData: true,
    })
    BuscarEventosJaReistrados = {
        operation: 'getAll',
        calendar: {
            __rl: true,
            value: '74e9ffc92053d6d405a1e5e4527003b4abda4305d2efc7f854389dcdc03a12e9@group.calendar.google.com',
            mode: 'list',
            cachedResultName: 'Contabilidade',
        },
        returnAll: true,
        timeMax: '={{ $now.plus({ week: 3 }) }}',
        options: {},
    };

    @node({
        id: '24d57dad-8282-4add-a98e-6a926cc7b569',
        name: 'juntar eventos',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [1408, 1232],
    })
    JuntarEventos = {
        aggregate: 'aggregateAllItemData',
        options: {},
    };

    @node({
        id: '14687644-16b4-4840-8f42-6d80ee79b230',
        name: 'definir disponibilidade',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1680, 1232],
    })
    DefinirDisponibilidade = {
        assignments: {
            assignments: [
                {
                    id: 'a366af35-ca99-40ab-bd55-e9304e117f80',
                    name: 'data',
                    value: `={{ 

(() => {
  const eventosAgendados = $json.data;
  const disponibilidadeSemanal = $('definir agenda').first().json;

  const intervaloSemanas = 12;
  const intervaloMinutos = $('definir agenda').first().json['timeBetweenMeetingsMinutes ']; // Cuidado com o espaço no final!

  const dayMap = {
    0: "DOM", 1: "SEG", 2: "TER", 3: "QUA", 4: "QUI", 5: "SEX", 6: "SAB"
  };

  function getDateWithTime(date, timeStr) {
    if (!timeStr) return null;
    const [hour, minute] = timeStr.split(":").map(Number);
    const newDate = new Date(date);
    newDate.setHours(hour, minute, 0, 0);
    return newDate;
  }

  function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return \`\${hours}:\${minutes}\`;
  }

  function saoMesmoDia(data1, data2) {
    return (
      data1.getFullYear() === data2.getFullYear() &&
      data1.getMonth() === data2.getMonth() &&
      data1.getDate() === data2.getDate()
    );
  }

  function gerarHorariosDisponiveis() {
    const horariosDisponiveis = [];
    const hoje = new Date();

    // Verifica se existem eventos válidos
    const eventosValidos = Array.isArray(eventosAgendados)
      ? eventosAgendados.filter(e => e?.start?.dateTime && e?.end?.dateTime)
      : [];

    for (let i = 0; i < intervaloSemanas * 7; i++) {
      const dataAtual = new Date(hoje);
      dataAtual.setDate(hoje.getDate() + i);
      dataAtual.setHours(0, 0, 0, 0);

      const diaSemana = dayMap[dataAtual.getDay()];
      const configDia = disponibilidadeSemanal.schedule.find(d => d.day === diaSemana);

      if (!configDia || !configDia.available) continue;

      const inicioJanela = getDateWithTime(dataAtual, configDia.hours.after);
      const fimJanela = getDateWithTime(dataAtual, configDia.hours.before);
      if (!inicioJanela || !fimJanela) continue;

      const eventosDoDia = eventosValidos.filter(evento => {
        const inicioEvento = new Date(evento.start.dateTime);
        return saoMesmoDia(inicioEvento, dataAtual);
      });

      for (let slotInicio = new Date(inicioJanela); slotInicio < fimJanela; ) {
        const slotFim = new Date(slotInicio.getTime() + intervaloMinutos * 60000);
        if (slotFim > fimJanela) break;

        let conflita = false;
        if (eventosValidos.length > 0) {
          conflita = eventosDoDia.some(evento => {
            const inicioEvento = new Date(evento.start.dateTime);
            const fimEvento = new Date(evento.end.dateTime);
            return (slotInicio < fimEvento && slotFim > inicioEvento);
          });
        }

        if (!conflita) {
          horariosDisponiveis.push({
            data: slotInicio.toISOString().split("T")[0],
            start: formatTime(slotInicio),
            end: formatTime(slotFim)
          });
        }

        slotInicio = new Date(slotFim);
      }
    }

    return horariosDisponiveis;
  }

  try {
    const resultado = gerarHorariosDisponiveis();
    return JSON.stringify(resultado);
  } catch (error) {
    return JSON.stringify({ error: error.message, stack: error.stack });
  }

})()

}}
`,
                    type: 'array',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '3bdd3362-759e-4960-83d2-fad2068b3aff',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1152, 1072],
    })
    StickyNote2 = {
        content: '# Buscar Eventos já registrados',
        height: 360,
        width: 400,
    };

    @node({
        id: 'a4711682-e60b-47b1-8331-9b793dd68034',
        name: 'Sticky Note3',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1584, 1072],
    })
    StickyNote3 = {
        content: '# Verifica os horarios disponíveis',
        height: 360,
        width: 340,
    };

    @node({
        id: 'ce89adbe-5c57-421f-abe3-ed2c4b1061b6',
        name: 'Sticky Note4',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1968, 1072],
    })
    StickyNote4 = {
        content: '## Seleciona dias/horários e retorna tudo em uma string formatada',
        height: 360,
        width: 360,
    };

    @node({
        id: '680fcb17-b559-4662-b476-ca0b6a432388',
        name: 'Edit Fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2384, 1232],
    })
    EditFields1 = {
        assignments: {
            assignments: [
                {
                    id: 'ae0721c6-ba73-46a9-aefd-a131a3051254',
                    name: 'response',
                    value: '={{ $json.disponibilidade }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'bf21d0bf-0679-401b-aff7-cf3345d60d37',
        name: 'Code',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [2080, 1232],
    })
    Code = {
        jsCode: `// Entrada: items[0].json.data = [{ data: "YYYY-MM-DD", start: "HH:MM" }, ...]
const inputData = items[0].json.data;

// 1) Agrupar horários por dia
const agrupadoPorDia = {};
for (const slot of inputData) {
  if (!agrupadoPorDia[slot.data]) {
    agrupadoPorDia[slot.data] = [];
  }
  agrupadoPorDia[slot.data].push(slot.start);
}

// 2) Ordenar dias (YYYY-MM-DD já ordena corretamente como string)
let diasOrdenados = Object.keys(agrupadoPorDia).sort();

// 2.1) Excluir a data de hoje
const hoje = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
diasOrdenados = diasOrdenados.filter(d => d !== hoje);

// 3) Selecionar até 10 dias
const selecionados = [];

// Função auxiliar para parse de HH:MM
const parseHM = (h) => {
  const [hh, mm] = h.split(":").map(n => parseInt(n, 10));
  return { hh, mm };
};

for (const dia of diasOrdenados.slice(0, 10)) {
  // Ordena todos os horários do dia (lexicográfico funciona para HH:MM)
  const horariosOrdenados = agrupadoPorDia[dia].sort();

  // 5) Selecionar horários por período
  //    - Manhã: TODOS até meio-dia (inclui 12:00, mas NÃO 12:01+)
  //    - Tarde: a partir das 13:00 (pega até 10 horários)
  const manha = horariosOrdenados.filter(h => {
    const { hh, mm } = parseHM(h);
    return hh < 12 || (hh === 12 && mm === 0);
  });

  const tarde = horariosOrdenados
    .filter(h => {
      const { hh } = parseHM(h);
      return hh >= 13;
    })
    .slice(0, 10); // até 10 horários da tarde

  // Formata dd/mm às HH:MM
  const escolhidosFormatados = [...manha, ...tarde].map(h => {
    const [year, month, day] = dia.split("-");
    return \`\${day}/\${month} às \${h}\`;
  });

  selecionados.push(...escolhidosFormatados);
}

// 4) Juntar tudo em uma única string (ex.: "15/09 às 09:00, 15/09 às 10:00, ...")
const resultado = selecionados.join(", ");

// 5) Retorno no formato do n8n
return [
  {
    json: {
      disponibilidade: resultado
    }
  }
];
`,
    };

    @node({
        id: '438cb4ba-12f8-4a3f-86ba-efe75e3f8af6',
        name: 'setarInfo',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [2144, 320],
    })
    Setarinfo = {
        assignments: {
            assignments: [
                {
                    id: '46b6b089-568c-4915-83fc-a18c8e581d96',
                    name: 'data_agendada',
                    value: '={{ $json.start.dateTime }}',
                    type: 'string',
                },
                {
                    id: '2bd0543a-fe5d-441c-b907-174439207bb7',
                    name: 'id_agendamento',
                    value: '={{ $json.id }}',
                    type: 'string',
                },
                {
                    id: 'e3ec8276-2871-4d23-91b5-e0cdc9b77e0c',
                    name: 'link_meet',
                    value: '={{ $json.hangoutLink }}',
                    type: 'string',
                },
                {
                    id: 'ebd02732-7230-404f-a422-a21a2a875fbb',
                    name: 'data_formatada',
                    value: '={{ DateTime.fromISO($json.start.dateTime).toFormat("dd/MM \'às\' HH:mm") }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'f6d452e4-a907-4783-96a5-356871ca6551',
        name: 'exec workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [256, 656],
    })
    ExecWorkflow = {
        workflowInputs: {
            values: [
                {
                    name: 'whatsapp_lead',
                },
                {
                    name: 'evento',
                },
                {
                    name: 'inicio_reuniao',
                },
                {
                    name: 'final_reuniao',
                },
                {
                    name: 'tipo_consulta',
                },
                {
                    name: 'assunto',
                },
                {
                    name: 'id_agendamento',
                },
                {
                    name: 'nome_lead',
                },
                {
                    name: 'url_chatwoot',
                },
            ],
        },
    };

    @node({
        id: '07fb784f-86c7-4c12-bbcd-84cc50a83a2c',
        name: 'Sticky Note7',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2800, 160],
    })
    StickyNote7 = {
        content: '# Etiquetar a conversa como "marcou_reunião',
        height: 336,
        width: 464,
    };

    @node({
        id: 'dc1fc21d-426b-4a74-97f3-92cc827ce531',
        name: 'Sticky Note6',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [2304, 160],
    })
    StickyNote6 = {
        content: `# Marcar data da consulta no banco de dados
`,
        height: 336,
        width: 432,
        color: 2,
    };

    @node({
        id: '10a61925-df0b-467f-a555-0c7836626ef1',
        name: 'status_agendado',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [2448, 320],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    StatusAgendado = {
        operation: 'update',
        tableId: 'leads_contabilidade',
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
                    fieldId: 'status',
                    fieldValue: 'agendado',
                },
                {
                    fieldId: 'data_agendamento',
                    fieldValue: '={{ $json.data_agendada }}',
                },
                {
                    fieldId: 'id_agendamento',
                    fieldValue: '={{ $json.id_agendamento }}',
                },
            ],
        },
    };

    @node({
        id: 'b273b27b-7bbb-4acd-8e25-f3e1f42a8927',
        name: 'etiqueta_reuniao_marcada',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [2976, 320],
        credentials: { httpHeaderAuth: { id: 'vFHIRVhHLdinPZ9u', name: 'Chatwoot-contabilidade' } },
    })
    EtiquetaReuniaoMarcada = {
        method: 'POST',
        url: "={{ $('setarInformacoes').item.json.url_chatwoot }}api/v1/accounts/{{ $json['id_conta_chatwoot'] }}/conversations/{{ $json['id_conversa_chatwoot'] }}/labels",
        authentication: 'genericCredentialType',
        genericAuthType: 'httpHeaderAuth',
        sendHeaders: true,
        headerParameters: {
            parameters: [{}],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `{
  "labels": [
    "marcou_reuniao"
  ]
}`,
        options: {},
    };

    @node({
        id: '82b0cc6b-1ad6-4ea4-a4d8-68c4a8b02736',
        name: 'atualizar_data',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [2080, 880],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    AtualizarData = {
        operation: 'update',
        tableId: 'leads_contabilidade',
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
                    fieldId: 'data_agendamento',
                    fieldValue: '={{ $json.start.dateTime }}',
                },
            ],
        },
    };

    @node({
        id: '38ac2206-d87a-470a-a570-459c3537de25',
        name: 'tirar_data_agendamento',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [1408, 640],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    TirarDataAgendamento = {
        operation: 'update',
        tableId: 'leads_contabilidade',
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
                    fieldId: 'data_agendamento',
                    fieldValue: '={{ null }}',
                },
                {
                    fieldId: 'id_agendamento',
                    fieldValue: '={{ null }}',
                },
                {
                    fieldId: 'status',
                    fieldValue: 'cancelou_agendamento',
                },
            ],
        },
    };

    @node({
        id: '89c0b7f6-c50f-4fce-a6c5-a8c73452f0d4',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [512, 1072],
    })
    StickyNote = {
        content: `# Definir agenda
## Esse node você precisa verificar se agenda esta correta`,
        height: 352,
        width: 608,
        color: 3,
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Disponibilidade.out(0).to(this.If_.in(0));
        this.Marca.out(0).to(this.Setarinfo.in(0));
        this.JaTemUmEvento.out(0).to(this.If5.in(0));
        this.GoogleCalendar1.out(0).to(this.TirarDataAgendamento.in(0));
        this.GoogleCalendar3.out(0).to(this.AtualizarData.in(0));
        this.VerificaEvento.out(0).to(this.GoogleCalendar1.in(0));
        this.VerificaEvento1.out(0).to(this.GoogleCalendar3.in(0));
        this.If6.out(0).to(this.VerificaEvento1.in(0));
        this.If6.out(1).to(this.EditFields9.in(0));
        this.Disponibilidade1.out(0).to(this.If6.in(0));
        this.If5.out(0).to(this.EditFields6.in(0));
        this.If5.out(1).to(this.Disponibilidade.in(0));
        this.Switch4.out(0).to(this.JaTemUmEvento.in(0));
        this.Switch4.out(1).to(this.VerificaEvento.in(0));
        this.Switch4.out(2).to(this.Disponibilidade1.in(0));
        this.Switch4.out(3).to(this.DefinirAgenda.in(0));
        this.If_.out(0).to(this.Marca.in(0));
        this.If_.out(1).to(this.EditFields9.in(0));
        this.Setarinformacoes.out(0).to(this.Switch4.in(0));
        this.DefinirAgenda.out(0).to(this.BuscarEventosJaReistrados.in(0));
        this.BuscarEventosJaReistrados.out(0).to(this.JuntarEventos.in(0));
        this.JuntarEventos.out(0).to(this.DefinirDisponibilidade.in(0));
        this.DefinirDisponibilidade.out(0).to(this.Code.in(0));
        this.Code.out(0).to(this.EditFields1.in(0));
        this.Setarinfo.out(0).to(this.StatusAgendado.in(0));
        this.ExecWorkflow.out(0).to(this.Setarinformacoes.in(0));
        this.StatusAgendado.out(0).to(this.EtiquetaReuniaoMarcada.in(0));
        this.EtiquetaReuniaoMarcada.out(0).to(this.Response1.in(0));
        this.AtualizarData.out(0).to(this.EditFields2.in(0));
        this.TirarDataAgendamento.out(0).to(this.EditFields7.in(0));
    }
}
