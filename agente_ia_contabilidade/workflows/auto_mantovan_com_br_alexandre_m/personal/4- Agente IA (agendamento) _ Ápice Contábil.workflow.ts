import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 4- Agente IA (agendamento) | Ápice Contábil
// Nodes   : 15  |  Connections: 5
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// EditFields                         set
// PostgresChatMemory                 memoryPostgresChat         [creds] [ai_memory]
// OpenaiChatModel2                   lmChatOpenAi               [creds] [ai_languageModel]
// StickyNote5                        stickyNote
// StickyNote12                       stickyNote
// Setarinfo3                         set
// Agendar                            agent                      [AI]
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// ProximosDias                       code
// CriarReuniao                       toolWorkflow               [ai_tool]
// Verhorarios                        toolWorkflow               [ai_tool]
// ReagendarReuniao                   toolWorkflow               [ai_tool]
// CancelarReuniao                    toolWorkflow               [ai_tool]
// PuxarLead                          supabase                   [creds]
// StickyNote                         stickyNote
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → PuxarLead
//      → ProximosDias
//        → Setarinfo3
//          → Agendar
//            → EditFields
//
// AI CONNECTIONS
// Agendar.uses({ ai_memory: PostgresChatMemory, ai_languageModel: OpenaiChatModel2, ai_tool: [CriarReuniao, Verhorarios, ReagendarReuniao, CancelarReuniao] })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'k9ETM34Klf1UfDry',
    name: '4- Agente IA (agendamento) | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class _4AgenteIaAgendamentoApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '44cd4465-ebbc-4fe7-8bda-e618004c6f43',
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1360, 96],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: '51bd4896-17e9-484b-b08a-b6854225ccb3',
                    name: 'response',
                    value: '={{ $json.output }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '9522b46e-f0fd-46be-b93f-d55232016e4f',
        name: 'Postgres Chat Memory',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [720, 416],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    PostgresChatMemory = {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.whatsapp_lead }}',
        contextWindowLength: 40,
    };

    @node({
        id: '69a673d5-3b04-43b2-8787-0e1c90ac2feb',
        name: 'OpenAI Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [464, 416],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    OpenaiChatModel2 = {
        model: {
            __rl: true,
            value: 'gpt-4.1-mini',
            mode: 'list',
            cachedResultName: 'gpt-4.1-mini',
        },
        options: {},
    };

    @node({
        id: '7a2609a9-5482-44c6-a41d-b9e0e4bc8720',
        name: 'Sticky Note5',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote5 = {
        content: '',
        height: 648,
        width: 1820,
        color: 6,
    };

    @node({
        id: '29130d1f-d30d-4145-bc57-22780b4ceb58',
        name: 'Sticky Note12',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1024, 368],
    })
    StickyNote12 = {
        content: '## Agenda',
        height: 400,
        width: 768,
    };

    @node({
        id: '3792d546-7f5a-46dd-8881-f012cd7000d6',
        name: 'setarInfo3',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [704, 96],
    })
    Setarinfo3 = {
        assignments: {
            assignments: [
                {
                    id: '3058e999-b1bf-43f3-b95c-bf1d71157c51',
                    name: 'Duvida',
                    value: "={{ $('When Executed by Another Workflow').item.json.duvida }}",
                    type: 'string',
                },
                {
                    id: 'c6e2e733-5bb4-4b3d-9a79-cf43a9e56458',
                    name: 'whatsapp_lead',
                    value: "={{ $('When Executed by Another Workflow').item.json.whatsapp_lead }}",
                    type: 'string',
                },
                {
                    id: '9181a250-f2ad-402e-8bed-2bc4ec9720e6',
                    name: 'servico',
                    value: "=Assunto: {{ $('When Executed by Another Workflow').item.json.Assunto }}",
                    type: 'string',
                },
                {
                    id: '2063178c-5134-49ce-9d86-c3a4d1f4f23d',
                    name: 'Tipo_de_consulta',
                    value: "={{ $('When Executed by Another Workflow').item.json.Tipo_de_consulta }}",
                    type: 'string',
                },
                {
                    id: '2986dc61-de65-440b-846c-d36b4d60d75b',
                    name: 'proximos_dias',
                    value: '={{ $json.resultado }}',
                    type: 'string',
                },
                {
                    id: '05f0efa3-390e-4ee4-bb1c-287d43d18324',
                    name: 'id_agendamento',
                    value: "={{ $('puxar_lead').item.json.id_agendamento }}",
                    type: 'string',
                },
                {
                    id: '6aec8106-e917-40de-a5d9-b17c7ca9db34',
                    name: 'nome_lead',
                    value: "={{ $('puxar_lead').item.json.nome_lead }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '9273a556-e2c8-4efb-b45c-4b46c008f5fe',
        name: 'Agendar',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [960, 96],
    })
    Agendar = {
        promptType: 'define',
        text: `={{ $json.Duvida }}

{{ $json.servico }}`,
        options: {
            systemMessage: `=# IDENTIDADE
-  Você é um **agente interno** responsável exclusivamente por gerenciar a agenda do escritório de contabilidade **Ápice Contábil**. 

# FUNÇÃO
-  Sua função é **consultar, reservar, remarcar ou cancelar horários de agendamentos** conforme solicitado pela **Laura**, garantindo disponibilidade correta e alinhada aos dias do escritório.

## REGRAS DE MARCAÇÃO DE CONSULTA

- Para acionar a tool \`criar_reuniao\` é obrigatório saber:
  - Nome completo do lead
  - Serviço solicitado
  - Data e hora do agendamento

- **Nunca acione** a tool \`criar_reuniao\` antes de saber esses dados.

# TOOLS DISPONÍVEIS
Durante o atendimento, você pode usar as seguintes tools internas.

## 1. Nome da tool: \`criar_reuniao\`

**Quando usar:**  
- Sempre que precisar **marcar um agendamento** na agenda.  
- Antes de chamar essa tool, é obrigatório ter:
  1. O **nome completo** do lead.
  2. A **data e hora** desejada.
  3. Serviço de interesse

**Quando não usar:**  
- Se ainda não tiver o nome completo do lead.  
- Se ainda não tiver a data e o horário desejado.
- Se ainda não tiver o serviço desejado.

**Regras para marcar o agendamento:**
-  Defina corretamente o **start** (início) e o **end** (fim) do agendamento
-  O tempo de cada reunião é de **30 minutos** (end = start + 30min)
-  Sempre calcule o horário final com base na duração correspondente

## 2. Nome da tool: \`reagendar_reuniao\`

**Quando usar:**  
-  Use quando o lead solicitar a **mudança de data ou horário** de um agendamento já marcado.
-  Consulte o histórico de conversa para puxar o nome e o agendamento anterior.

**Regras:**  
-  Você já tem acesso ao histórico, então **não precisa pedir novamente** o nome e o horário anterior.

**Quando não usar:**  
- Se o lead não tiver uma reunião previamente agendada.

## 3. Nome da tool: \`cancelar_reuniao\`

**Quando usar:**  
-  Quando o lead solicitar o **cancelamento** de uma reunião já agendada.

**Regras para uso:**  
-  Você já tem acesso ao histórico, então **não precisa pedir novamente** o nome ou o horário anterior.

**Quando não usar:**  
-  Se não houver nenhuma reunião agendada com o lead.
-  Se a solicitação for apenas uma dúvida sem intenção de cancelar.

## 4. Nome da tool: \`ver_horarios\`

**Função:**  
- Verificar se uma data/horário está disponível. **Nunca** confirmar ou iniciar agendamento.

**Regra crítica: nunca sugira, informe ou confirme horários sem antes acionar essa tool e aguardar o retorno dela. Os horários apresentados devem vir exclusivamente do que a tool retornar — nunca da sua suposição ou do contexto da conversa.**

**Política de resposta (obrigatória):**
-  Responda **somente** se o horário está **disponível** ou **indisponível**.
-  Não mencione pagamento, nome do lead, serviço nem convide para confirmar
-  Não faça perguntas adicionais
-  Se indisponível, ofereça até **3 opções alternativas**

**Formato de saída (use exatamente um destes modelos):**
- Disponível → \`"Dia [dd/mm], às [hh] está disponível."\`
- Indisponível → \`"Dia [dd/mm], às [hh] não está disponível. Posso sugerir [até 3 opções de dia/horário]?"\`

**Exemplos:**
- \`Segunda-feira, dia 15/09, às 10h está disponível.\`
- \`Segunda-feira, dia 15/09, às 10h não está disponível. Porem temos os horários livres no mesmo dia as 11h, 15h e 18h.\`

**Cláusula anti-agendamento:**
- Se a intenção do usuário for “confirmar/agendar”, **NÃO** responda aqui.
- Finalize a verificação e devolva apenas a disponibilidade no **formato acima**; a secretária decidirá a próxima etapa.  
- Use para buscar dias e horários disponíveis para agendamento.

# REGRAS GERAIS
-  Sempre que mencionar um agendamento, informe o **dia da semana** junto com a data e hora, neste formato: > "Terça-feira, dia 18/05 às 14h"
-  Nunca informe o **ano** — use apenas dia e mês
-  Se o lead quiser saber horários disponíveis, apresente no máximo **3 opções retornadas pela tool**
- **Nunca apresente horários que não vieram de uma tool**

## DATA E HORA ATUALIZADOS
Para efeito de contexto durante as suas conversas segue a data e hora de hoje e os próximos dias:
{{ $json.proximos_dias }}`,
        },
    };

    @node({
        id: 'a988b91e-2de9-4524-8a09-c2fb44f031d8',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [80, 96],
    })
    WhenExecutedByAnotherWorkflow = {
        workflowInputs: {
            values: [
                {
                    name: 'duvida',
                },
                {
                    name: 'whatsapp_lead',
                },
                {
                    name: 'Assunto',
                },
                {
                    name: 'Tipo_de_consulta',
                },
            ],
        },
    };

    @node({
        id: 'af65cb27-1338-4e23-9580-82c788d7f441',
        name: 'proximos_dias',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [464, 96],
    })
    ProximosDias = {
        jsCode: `const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const now = new Date();   // <-- ESTA LINHA ESTAVA FALTANDO
const pad = (n) => String(n).padStart(2, '0');

let result = '';

for (let i = 1; i <= 10; i++) {
  const future = new Date(now);
  future.setDate(now.getDate() + i);

  let label = '';

  if (i === 1) {
    label = \`Amanhã é \${days[future.getDay()]} \${pad(future.getDate())}/\${pad(future.getMonth() + 1)}/\${String(future.getFullYear()).slice(2)}\`;
  } else if (i === 2) {
    label = \`Depois de amanhã é \${days[future.getDay()]} \${pad(future.getDate())}/\${pad(future.getMonth() + 1)}/\${String(future.getFullYear()).slice(2)}\`;
  } else {
    label = \`\${days[future.getDay()]} será dia \${pad(future.getDate())}/\${pad(future.getMonth() + 1)}/\${String(future.getFullYear()).slice(2)}\`;
  }

  result += \`\${label}\\n\`;
}

return [
  {
    json: {
      resultado: result.trim()
    }
  }
];
`,
    };

    @node({
        id: 'cf3b6e92-3829-4e47-a153-7dd99ba7d63f',
        name: 'criar_reuniao',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.2,
        position: [1152, 608],
    })
    CriarReuniao = {
        description: `=**Quando usar:**  
- Sempre que precisar **marcar um agendamento** na agenda.  
- Antes de chamar essa tool, é obrigatório ter:
  1. O **nome completo** do lead.
  2. A **data e hora** desejada.
  3. Serviço de interesse

**Quando não usar:**  
- Se ainda não tiver o nome completo do lead.  
- Se ainda não tiver a data e o horário desejado.
- Se ainda não tiver o serviço desejado.

**Regras para marcar o agendamento:**
-  Defina corretamente o **start** (início) e o **end** (fim) do agendamento
-  O tempo de cada reunião é de **30 minutos** (end = start + 30min)
-  Sempre calcule o horário final com base na duração correspondente`,
        workflowId: {
            __rl: true,
            value: 'bicftP0mF9gEsdvs',
            mode: 'id',
            cachedResultUrl: '/workflow/bicftP0mF9gEsdvs',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                whatsapp_lead: '={{ $json.whatsapp_lead }}',
                evento: 'agendamento',
                inicio_reuniao:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('inicio_reuniao', `Coloque aqui o timestamp do inicio do agendamento`, 'string') }}",
                final_reuniao:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('final_reuniao', `Coloque aqui o timestamp do final do agendamento`, 'string') }}",
                tipo_consulta: '={{ $json.Tipo_de_consulta }}',
                assunto:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('assunto', `Descreva qual o assunto o lead deseja falar e o caso que ele deseja resolver. Seja o mais detalhista possível.`, 'string') }}",
                nome_lead: '={{ $json.nome_lead }}',
                url_chatwoot: 'https://chat.mantovan.com.br/',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'whatsapp_lead',
                    displayName: 'whatsapp_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'evento',
                    displayName: 'evento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'inicio_reuniao',
                    displayName: 'inicio_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'final_reuniao',
                    displayName: 'final_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'tipo_consulta',
                    displayName: 'tipo_consulta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'assunto',
                    displayName: 'assunto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'id_agendamento',
                    displayName: 'id_agendamento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'nome_lead',
                    displayName: 'nome_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'url_chatwoot',
                    displayName: 'url_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
    };

    @node({
        id: '2ab14657-0155-4266-babe-75c2d250b8e8',
        name: 'VerHorarios',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.2,
        position: [1360, 464],
    })
    Verhorarios = {
        description: `=**Função:**  
- Verificar se uma data/horário está disponível. **Nunca** confirmar ou iniciar agendamento.

**Regra crítica: nunca sugira, informe ou confirme horários sem antes acionar essa tool e aguardar o retorno dela. Os horários apresentados devem vir exclusivamente do que a tool retornar — nunca da sua suposição ou do contexto da conversa.**

**Política de resposta (obrigatória):**
-  Responda **somente** se o horário está **disponível** ou **indisponível**.
-  Não mencione pagamento, nome do lead, serviço nem convide para confirmar
-  Não faça perguntas adicionais
-  Se indisponível, ofereça até **3 opções alternativas**

**Formato de saída (use exatamente um destes modelos):**
- Disponível → \`"Dia [dd/mm], às [hh] está disponível."\`
- Indisponível → \`"Dia [dd/mm], às [hh] não está disponível. Posso sugerir [até 3 opções de dia/horário]?"\`

**Exemplos:**
- \`Segunda-feira, dia 15/09, às 10h está disponível.\`
- \`Segunda-feira, dia 15/09, às 10h não está disponível. Porem temos os horários livres no mesmo dia as 11h, 15h e 18h.\``,
        workflowId: {
            __rl: true,
            value: 'bicftP0mF9gEsdvs',
            mode: 'id',
            cachedResultUrl: '/workflow/bicftP0mF9gEsdvs',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {},
            matchingColumns: [],
            schema: [
                {
                    id: 'whatsapp_lead',
                    displayName: 'whatsapp_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'evento',
                    displayName: 'evento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'inicio_reuniao',
                    displayName: 'inicio_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'final_reuniao',
                    displayName: 'final_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'tipo_consulta',
                    displayName: 'tipo_consulta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'assunto',
                    displayName: 'assunto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'id_agendamento',
                    displayName: 'id_agendamento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'nome_lead',
                    displayName: 'nome_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'url_chatwoot',
                    displayName: 'url_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
    };

    @node({
        id: '8c65d0e2-9579-4b91-b07d-d2913fd99edc',
        name: 'reagendar_reuniao',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.2,
        position: [1504, 464],
    })
    ReagendarReuniao = {
        description: `=**Quando usar:**  
- Use quando o lead solicitar a **mudança de data ou horário** de um agendamento já marcado.
- Consulte seu **histórico de conversa com o lead** para puxar o nome e o agendamento anterior.

**Regras para uso:**  
- Você já tem acesso ao histórico de conversas e agendamentos anteriores, então **não precisa pedir novamente** o nome e o horário anterior.

**Quando não usar:**  
- Se o paciente não tiver um agendamento previamente agendado.`,
        workflowId: {
            __rl: true,
            value: 'bicftP0mF9gEsdvs',
            mode: 'id',
            cachedResultUrl: '/workflow/bicftP0mF9gEsdvs',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                whatsapp_lead: '={{ $json.whatsapp_lead }}',
                evento: 'reagendamento',
                inicio_reuniao:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('inicio_reuniao', `Coloque aqui o timestamp do inicio do agendamento`, 'string') }}",
                final_reuniao:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('final_reuniao', `Coloque aqui o timestamp do final do agendamento`, 'string') }}",
                tipo_consulta: '={{ $json.Tipo_de_consulta }}',
                assunto:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('assunto', `Descreva qual o assunto o lead deseja falar e o caso que ele deseja resolver. Seja o mais detalhista possível.`, 'string') }}",
                id_agendamento: '={{ $json.id_agendamento }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'whatsapp_lead',
                    displayName: 'whatsapp_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'evento',
                    displayName: 'evento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'inicio_reuniao',
                    displayName: 'inicio_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'final_reuniao',
                    displayName: 'final_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'tipo_consulta',
                    displayName: 'tipo_consulta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'assunto',
                    displayName: 'assunto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'id_agendamento',
                    displayName: 'id_agendamento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'url_chatwoot',
                    displayName: 'url_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
    };

    @node({
        id: '1bb6ce8a-aaec-4657-824d-9a3b5afa08cb',
        name: 'cancelar_reuniao',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.2,
        position: [1664, 464],
    })
    CancelarReuniao = {
        description: `=**Quando usar:**  
-  Quando o lead solicitar o **cancelamento** de uma reunião já agendada.

**Regras para uso:**  
-  Você já tem acesso ao histórico, então **não precisa pedir novamente** o nome ou o horário anterior.

**Quando não usar:**  
-  Se não houver nenhuma reunião agendada com o lead.
-  Se a solicitação for apenas uma dúvida sem intenção de cancelar.`,
        workflowId: {
            __rl: true,
            value: 'bicftP0mF9gEsdvs',
            mode: 'id',
            cachedResultUrl: '/workflow/bicftP0mF9gEsdvs',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                whatsapp_lead: '={{ $json.whatsapp_lead }}',
                evento: 'cancelamento',
                id_agendamento: '={{ $json.id_agendamento }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'whatsapp_lead',
                    displayName: 'whatsapp_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'evento',
                    displayName: 'evento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'inicio_reuniao',
                    displayName: 'inicio_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'final_reuniao',
                    displayName: 'final_reuniao',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'tipo_consulta',
                    displayName: 'tipo_consulta',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'assunto',
                    displayName: 'assunto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'id_agendamento',
                    displayName: 'id_agendamento',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'nome_lead',
                    displayName: 'nome_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
                {
                    id: 'url_chatwoot',
                    displayName: 'url_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: true,
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: false,
        },
    };

    @node({
        id: '7cacb898-d624-4f56-a0f7-e03eacccdae1',
        name: 'puxar_lead',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [272, 96],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    PuxarLead = {
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
        id: '51e0a283-a2b6-43b4-9e2f-c72d092dddee',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1040, 480],
    })
    StickyNote = {
        content: '### Colocar a URL do chatwoot no node "criar_reuniao"',
        height: 272,
        width: 288,
        color: 3,
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Setarinfo3.out(0).to(this.Agendar.in(0));
        this.Agendar.out(0).to(this.EditFields.in(0));
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.PuxarLead.in(0));
        this.ProximosDias.out(0).to(this.Setarinfo3.in(0));
        this.PuxarLead.out(0).to(this.ProximosDias.in(0));

        this.Agendar.uses({
            ai_languageModel: this.OpenaiChatModel2.output,
            ai_memory: this.PostgresChatMemory.output,
            ai_tool: [
                this.CriarReuniao.output,
                this.Verhorarios.output,
                this.ReagendarReuniao.output,
                this.CancelarReuniao.output,
            ],
        });
    }
}
