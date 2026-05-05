import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 2- sobreEmpresa | Ápice Contábil
// Nodes   : 9  |  Connections: 4
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// StickyNote24                       stickyNote
// Setarinfo5                         set
// WhenExecutedByAnotherWorkflow      executeWorkflowTrigger
// Memoria1                           memoryPostgresChat         [creds] [ai_memory]
// ProximosDias                       code
// _25Flash                           lmChatGoogleGemini         [creds] [ai_languageModel]
// Response                           set
// Contabilidade                      agent                      [AI]
// ServicosTool                       supabaseTool               [creds] [ai_tool]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// WhenExecutedByAnotherWorkflow
//    → ProximosDias
//      → Setarinfo5
//        → Contabilidade
//          → Response
//
// AI CONNECTIONS
// Contabilidade.uses({ ai_memory: Memoria1, ai_languageModel: _25Flash, ai_tool: [ServicosTool] })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '92XPllCS3lvtsPcg',
    name: '2- sobreEmpresa | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: { executionOrder: 'v1', binaryMode: 'separate' },
})
export class _2SobreempresaApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '86651cb3-5d09-4b66-9360-7781df47bdc5',
        name: 'Sticky Note24',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote24 = {
        content: `# SOBRE EMPRESA
`,
        height: 536,
        width: 1484,
        color: 6,
    };

    @node({
        id: '472d2ea2-3efb-4f08-a58e-0f48d4fb0ee2',
        name: 'setarInfo5',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [544, 160],
    })
    Setarinfo5 = {
        assignments: {
            assignments: [
                {
                    id: '67752c6a-09ad-430f-a14a-e800543efc8b',
                    name: 'NomeLead',
                    value: "=Nome do lead: {{ $('When Executed by Another Workflow').item.json.NomeLead }}",
                    type: 'string',
                },
                {
                    id: '3058e999-b1bf-43f3-b95c-bf1d71157c51',
                    name: 'msgLead',
                    value: "={{ $('When Executed by Another Workflow').item.json.Duvida }}",
                    type: 'string',
                },
                {
                    id: 'c6e2e733-5bb4-4b3d-9a79-cf43a9e56458',
                    name: 'whatsaapp_lead',
                    value: "={{ $('When Executed by Another Workflow').item.json.whatsaapp_lead }}",
                    type: 'string',
                },
                {
                    id: 'de41c67a-c3a9-4667-a1b1-29a90cf54fb0',
                    name: 'proximosDias',
                    value: '={{ $json.resultado }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '191cbe3e-665d-4523-946c-28ec797339e1',
        name: 'When Executed by Another Workflow',
        type: 'n8n-nodes-base.executeWorkflowTrigger',
        version: 1.1,
        position: [128, 160],
    })
    WhenExecutedByAnotherWorkflow = {
        workflowInputs: {
            values: [
                {
                    name: 'NomeLead',
                },
                {
                    name: 'Duvida',
                },
                {
                    name: 'whatsaapp_lead',
                },
            ],
        },
    };

    @node({
        id: 'bd84102e-cf89-4710-a0a7-71757c8755ed',
        name: 'Memoria 1',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [848, 368],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    Memoria1 = {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.whatsaapp_lead }}',
        contextWindowLength: 40,
    };

    @node({
        id: '9024f173-6a71-4716-86c3-8079373fcbdc',
        name: 'proximos_dias',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [336, 160],
    })
    ProximosDias = {
        jsCode: `const days = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');

let result = \`Hoje é \${days[now.getDay()]} \${pad(now.getDate())}/\${pad(now.getMonth()+1)}/\${String(now.getFullYear()).slice(2)} às \${pad(now.getHours())}:\${pad(now.getMinutes())}\\n\`;

for (let i = 1; i <= 6; i++) {
  const future = new Date(now);
  future.setDate(now.getDate() + i);

  let label = '';

  if (i === 1) {
    label = \`Amanhã é \${days[future.getDay()]} \${pad(future.getDate())}/\${pad(future.getMonth()+1)}/\${String(future.getFullYear()).slice(2)}\`;
  } else if (i === 2) {
    label = \`Depois de amanhã é \${days[future.getDay()]} \${pad(future.getDate())}/\${pad(future.getMonth()+1)}/\${String(future.getFullYear()).slice(2)}\`;
  } else {
    label = \`A próxima \${days[future.getDay()]} será dia \${pad(future.getDate())}/\${pad(future.getMonth()+1)}/\${String(future.getFullYear()).slice(2)}\`;
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
        id: 'de9ef40a-be47-4fd6-93bf-43d75ef3f648',
        name: '2.5 flash',
        type: '@n8n/n8n-nodes-langchain.lmChatGoogleGemini',
        version: 1,
        position: [672, 368],
        credentials: { googlePalmApi: { id: '7rUkZbcxwV0VVQ7S', name: 'Gemini(PaLM) Api' } },
    })
    _25Flash = {
        options: {},
    };

    @node({
        id: '7148f582-e139-4dbf-8cc1-7b777a47c128',
        name: 'response',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [1184, 160],
    })
    Response = {
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
        id: '20e047ac-d2d5-4d6f-9e5e-52eaeceed44d',
        name: 'Contabilidade',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [784, 160],
    })
    Contabilidade = {
        promptType: 'define',
        text: `={{ $json.msgLead }}

{{ $json.NomeLead }}`,
        options: {
            systemMessage: `=# IDENTIDADE
-  Você é um **agente de apoio interno** que atua exclusivamente nos bastidores do escritório de contabilidade **Ápice Contábil**.

# FUNÇÃO
-  Sua função é responder apenas com as informações solicitadas pela secretária **Laura**, sem saudações, sem perguntas extras e sem oferecer agendamento.
-  Seja sempre **direto e objetivo**, retornando somente o dado solicitado.

# SOBRE O ESCRITÓRIO
-  **Nome:** Ápice Contábil
-  **Endereço:** Av. Paulista, 1374 — Conjunto 41, Bela Vista, São Paulo/SP
   - Link Google Maps do endereço: https://maps.app.goo.gl/b1uTKuL1QbxZ8e2UA
-  **Horários de atendimento:**
   - Segunda a sexta (09h às 18h) - Sábado (09h às 13h)
-   **Instagram:** https://www.instagram.com/apicecontabil/
    > Enviar somente o link se solicitado.
-   **Formas de pagamento:** Cartão de crédito, PIX e transferência bancária

# REGRAS DE ATENDIMENTO
- Nunca inventar informações que não estejam neste documento.
- Responder **somente** o que for solicitado, sem acrescentar informações extras.
- Nunca trazer **saudações, despedidas ou mensagens de acolhimento**.
- Não fazer convites, não oferecer agendamento, horários ou reuniões (isso é função da Laura)
- **Nunca falar de valores de honorários** — os valores só são definidos após a reunião com o especialista
- Caso o lead pergunte especificamente sobre o valor da reunião inicial, informe que ela é **gratuita** — nunca ofereça essa informação de forma espontânea
- Para consultar os serviços prestados pelo escritório, consulte obrigatoriamente a tool \`servicos_tool\`

## SERVIÇOS DISPONÍVEIS
-  Sempre que o lead perguntar sobre quais serviços o escritório oferece ou detalhes de algum serviço, é obrigatório acionar a tool \`servicos_tool\`
-  Essa tool deve ser acionada **todas as vezes**, mesmo que a pergunta já tenha sido feita anteriormente
-  Nunca responda diretamente sobre serviços — consulte sempre a tool e retorne o que ela informar
-  Se a informação não estiver disponível na tool, responda apenas: **"Serviço não disponível pelo escritório."**

## QUEBRA DE OBJEÇÕES

-  Responder sempre de forma **calma, acolhedora e respeitosa**, nunca confrontando o lead
-  Mostrar que a situação do lead é compreensível e que a equipe contábil está preparada para orientar
-  Reforçar que a **reunião com o especialista** é o momento certo para esclarecer dúvidas, avaliar o caso e indicar a melhor solução
-  Transmitir segurança e autoridade, destacando a importância de resolver cedo para evitar complicações fiscais ou tributárias maiores
-  Manter tom **humano e persuasivo**, sempre redirecionando para o agendamento como passo natural
-  Nunca desistir na primeira resistência — ajuste a resposta e mantenha o diálogo leve até superar a objeção

## DATA E HORA ATUALIZADOS
Para efeito de contexto durante as suas conversas segue a data e hora de hoje e os próximos dias:
{{ $json.proximosDias }}`,
        },
    };

    @node({
        id: '7ea9eac3-0957-4beb-abc1-86b03684800d',
        name: 'servicos_tool',
        type: 'n8n-nodes-base.supabaseTool',
        version: 1,
        position: [1024, 368],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    ServicosTool = {
        operation: 'getAll',
        tableId: 'servicos_apice',
        returnAll: true,
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Setarinfo5.out(0).to(this.Contabilidade.in(0));
        this.WhenExecutedByAnotherWorkflow.out(0).to(this.ProximosDias.in(0));
        this.ProximosDias.out(0).to(this.Setarinfo5.in(0));
        this.Contabilidade.out(0).to(this.Response.in(0));

        this.Contabilidade.uses({
            ai_languageModel: this._25Flash.output,
            ai_memory: this.Memoria1.output,
            ai_tool: [this.ServicosTool.output],
        });
    }
}
