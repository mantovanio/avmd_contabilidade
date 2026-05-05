import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : 1- Laura | Ápice Contábil
// Nodes   : 53  |  Connections: 38
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// Setarinfo                          set
// SplitOut                           splitOut
// Code                               code
// LoopOverItems                      splitInBatches
// QuebrarMensagem                    agent                      [AI]
// Setarmsgagent                      set
// StickyNote9                        stickyNote
// StickyNote11                       stickyNote
// OpenaiChatModel2                   lmChatOpenAi               [creds] [ai_languageModel]
// StickyNote3                        stickyNote
// StickyNote6                        stickyNote
// Memoria                            memoryPostgresChat         [creds] [ai_memory]
// Setarimg1                          set
// Setaraudio                         set
// Transcreveraudio                   openAi                     [creds]
// Baixaraudio                        httpRequest
// Merge2                             merge
// MsgErro1                           stopAndError
// Wait                               wait                       [alwaysOutput]
// Push                               redis                      [creds] [alwaysOutput]
// Get                                redis                      [creds]
// DeleteBuffer                       redis                      [creds]
// Concatenamsg                       set
// If_                                if
// NoOperationDoNothing               noOp
// Setartexto1                        set
// StickyNote21                       stickyNote
// StickyNote22                       stickyNote
// Switch3                            switch
// Switch1                            switch
// StickyNote19                       stickyNote
// Webhook3                           webhook
// Respostachatwoot                   httpRequest                [creds]
// _2Segundos                         wait
// StickyNote8                        stickyNote
// Agendar                            toolWorkflow               [ai_tool]
// ProximosDias                       code
// EditFields                         set
// DeletarHistorico                   postgres                   [creds]
// StickyNote                         stickyNote
// StickyNote1                        stickyNote
// DeletarLinhaCrm                    supabase                   [creds]
// SetarInformacoes                   set                        [alwaysOutput]
// StickyNote2                        stickyNote
// FazerNada                          noOp
// SetarMensagem                      set
// AnalisarImagem                     openAi                     [creds]
// Aggregate                          aggregate
// Call3CrmApiceContabil              executeWorkflow
// Sobreempresa                       toolWorkflow               [ai_tool]
// Laura                              agent                      [AI]
// If1                                if
// _41Mini                            lmChatOpenAi               [creds] [ai_languageModel]
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook3
//    → If1
//      → Switch1
//        → FazerNada
//       .out(1) → FazerNada (↩ loop)
//       .out(2) → SetarInformacoes
//          → Switch3
//            → Baixaraudio
//              → Transcreveraudio
//                → Setaraudio
//                  → Merge2
//                    → SetarMensagem
//                      → Push
//                        → Wait
//                          → Get
//                            → If_
//                              → Concatenamsg
//                                → DeleteBuffer
//                                  → ProximosDias
//                                    → Setarinfo
//                                      → Laura
//                                        → Setarmsgagent
//                                          → QuebrarMensagem
//                                            → Code
//                                              → SplitOut
//                                                → LoopOverItems
//                                                  → Aggregate
//                                                    → Call3CrmApiceContabil
//                                                 .out(1) → Respostachatwoot
//                                                    → _2Segundos
//                                                      → LoopOverItems (↩ loop)
//                             .out(1) → NoOperationDoNothing
//           .out(1) → EditFields
//              → AnalisarImagem
//                → Setarimg1
//                  → Merge2.in(1) (↩ loop)
//           .out(2) → Setartexto1
//              → Merge2.in(2) (↩ loop)
//           .out(3) → MsgErro1
//
// AI CONNECTIONS
// QuebrarMensagem.uses({ ai_languageModel: OpenaiChatModel2 })
// Laura.uses({ ai_memory: Memoria, ai_tool: [Agendar, Sobreempresa], ai_languageModel: _41Mini })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: '8ymJIc35yT9pzLQD',
    name: '1- Laura | Ápice Contábil',
    active: true,
    isArchived: false,
    projectId: 'nzSTjCiRVBxzTpeN',
    settings: {
        executionOrder: 'v1',
        binaryMode: 'separate',
        timeSavedMode: 'fixed',
        callerPolicy: 'workflowsFromSameOwner',
        availableInMCP: false,
    },
})
export class _1LauraApiceContabilWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: 'c5c784ac-dad4-4d4a-85ce-b766d0b83206',
        name: 'setarInfo',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-384, 592],
    })
    Setarinfo = {
        assignments: {
            assignments: [
                {
                    id: '8ec52fa2-9612-4ea2-8a10-7c740bfac64a',
                    name: 'mensagem_lead',
                    value: "={{ $('ConcatenaMsg').item.json.todas_as_mensagens }}",
                    type: 'string',
                },
                {
                    id: '5dee01f6-4b9d-4757-9af3-c6473638bad3',
                    name: 'proximosDias',
                    value: '={{ $json.resultado }}',
                    type: 'string',
                },
                {
                    id: '393f631b-c48d-4818-a797-1044397b8f4f',
                    name: 'whatsapp_lead',
                    value: "={{ $('setar_mensagem').item.json.whatsapp_lead }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '65207619-619e-40d7-b21f-2c73b041585f',
        name: 'Split Out',
        type: 'n8n-nodes-base.splitOut',
        version: 1,
        position: [1872, 624],
    })
    SplitOut = {
        fieldToSplitOut: 'output',
        options: {},
    };

    @node({
        id: 'fb3cd921-0c73-4cfc-8872-85ac0953d85e',
        name: 'Code',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [1584, 624],
    })
    Code = {
        jsCode: `// Pegando a mensagem original do primeiro item do input
const mensagensTexto = $input.first().json.output || "";

// Verifica se há conteúdo válido e corrige \\n escapados
if (typeof mensagensTexto !== "string" || !mensagensTexto.trim()) {
    return []; // Retorna um array vazio se não houver mensagens
}

// Substitui "\\\\n" por um "\\n" real caso esteja escapado
const textoCorrigido = mensagensTexto.replace(/\\\\n/g, "\\n");

// Divide a mensagem corretamente e remove espaços extras
const mensagensArray = textoCorrigido
    .split(/\\n/) // Quebra corretamente onde houver "\\n"
    .map(line => line.trim()) // Remove espaços antes e depois
    .filter(line => line.length > 0); // Remove qualquer linha vazia

// Agora, ao invés de retornar um único item, retorna um array de itens separados no fluxo
return mensagensArray.map(msg => ({ json: { output: msg } }));
`,
    };

    @node({
        id: 'f29d2bab-d10e-457b-98dc-8d46ae45d3d0',
        name: 'Loop Over Items',
        type: 'n8n-nodes-base.splitInBatches',
        version: 3,
        position: [2112, 624],
    })
    LoopOverItems = {
        options: {},
    };

    @node({
        id: '206c748e-9b2d-4615-a061-214d6008babc',
        name: 'quebrar_mensagem',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.7,
        position: [1184, 624],
    })
    QuebrarMensagem = {
        promptType: 'define',
        text: `=Quebre a mensagem abaixo com base e regras das suas informações de sistema e tire toda a formatação markdown. Jamais faça comentários adicionais.

A mensagem:

{{ $json.mensagem_agenteIA }}`,
        options: {
            systemMessage: `=## Quem é você
Você é responsável em formatar mensagens dentro da automação do N8N. Você deve quebrar as mensagens longas em partes menores, sem alterar o conteúdo original e sem mudar nenhuma palavra sequer. Além disso, você deve remover qualquer formatação em Markdown, deixando o texto completamente limpo e sem estilos.

## Sua função
Sua única função é dividir textos longos em blocos menores sem alterar nenhuma palavra. Remova toda formatação em Markdown, deixando apenas texto puro.

## Regras
- Nunca mude palavras, não reescreva, não interprete.
- Sempre finalize a frase antes de quebrar.
- Máx. 80 caracteres por trecho.
- Use \\n para separar os blocos (duas quebras de linha).
- Se o texto for curto (≤ 80 caracteres), não quebre.
- Em listas, cada item fica em linha separada.
- Nunca corte após vírgula.
- Saída limpa, sem Markdown, negrito, itálico ou títulos.
- Não adicione comentários ou explicações.

## Exemplos
### Exemplo 1:
🔹 Input:
O curso preparatório da Tropa do Arcanjo para a ESPCEX é totalmente online e conta com videoaulas detalhadas, materiais de apoio em PDF e simulados atualizados. Nossos professores são especialistas em concursos militares e oferecem suporte direto aos alunos. Além disso, você terá acesso a um grupo VIP exclusivo para tirar dúvidas e interagir com outros candidatos. O curso tem duração de 12 meses, mas você pode estudar no seu próprio ritmo e reassistir às aulas quantas vezes quiser.

🔹 Output:
O curso preparatório da Tropa do Arcanjo para a ESPCEX é totalmente online e conta com videoaulas detalhadas, materiais de apoio em PDF e simulados atualizados.\\nNossos professores são especialistas em concursos militares e oferecem suporte direto aos alunos.\\nAlém disso, você terá acesso a um grupo VIP exclusivo para tirar dúvidas e interagir com outros candidatos.\\nO curso tem duração de 12 meses, mas você pode estudar no seu próprio ritmo e reassistir às aulas quantas vezes quiser.

### Exemplo 2:
🔹 Input:
Nosso curso preparatório da Tropa do Arcanjo oferece uma metodologia completa para você ser aprovado no concurso militar dos seus sonhos. Confira alguns dos benefícios que você terá ao se inscrever:

- *Aulas 100% online*, permitindo que você estude de qualquer lugar e no seu próprio ritmo.  
- *Professores especializados* em concursos militares, com experiência na aprovação de centenas de alunos.  
- *Simulados atualizados* com questões no formato das provas reais.  
- *Materiais em PDF*, mapas mentais e resumos para facilitar o seu aprendizado.  
- *Grupo VIP no WhatsApp* para tirar dúvidas diretamente com os professores e interagir com outros alunos.  
- *Plano de estudos estruturado*, guiando você passo a passo até a aprovação.  
- *Acesso por 12 meses*, para que você possa revisar todo o conteúdo sempre que precisar.  

Além disso, oferecemos suporte personalizado para garantir que você aproveite ao máximo sua preparação. Não perca tempo e comece a estudar hoje mesmo!

🔹 Output:
Nosso curso preparatório da Tropa do Arcanjo oferece uma metodologia completa para você ser aprovado no concurso militar dos seus sonhos.\\nConfira alguns dos benefícios que você terá ao se inscrever:\\n
- *Aulas 100% online*, permitindo que você estude de qualquer lugar e no seu próprio ritmo.\\n
- *Professores especializados* em concursos militares, com experiência na aprovação de centenas de alunos.\\n
- *Simulados atualizados* com questões no formato das provas reais.\\n
- *Materiais em PDF*, mapas mentais e resumos para facilitar o seu aprendizado.\\n
- *Grupo VIP no WhatsApp* para tirar dúvidas diretamente com os professores e interagir com outros alunos.\\n
- *Plano de estudos estruturado*, guiando você passo a passo até a aprovação.\\n
- *Acesso por 12 meses*, para que você possa revisar todo o conteúdo sempre que precisar.\\n
Além disso, oferecemos suporte personalizado para garantir que você aproveite ao máximo sua preparação. Não perca tempo e comece a estudar hoje mesmo!`,
        },
    };

    @node({
        id: 'f5325545-a0d0-4d1e-8171-1a6f3d95b984',
        name: 'setarMsgAgent',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [944, 624],
    })
    Setarmsgagent = {
        assignments: {
            assignments: [
                {
                    id: '4499d032-0660-4ad4-ac0f-186022972178',
                    name: 'mensagem_agenteIA',
                    value: '={{ $json.output }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'cf30378f-f2b6-425a-92d8-fd46156edf9d',
        name: 'Sticky Note9',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [880, 432],
    })
    StickyNote9 = {
        content: '# Quebra a resposta em várias mensagens e tira a formatação markdown',
        height: 560,
        width: 860,
        color: 7,
    };

    @node({
        id: '9a516a0e-2e24-4037-9657-5af4ae0b6398',
        name: 'Sticky Note11',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [1776, 432],
    })
    StickyNote11 = {
        content: '# Envia uma mensagem por vez para o usuário',
        height: 560,
        width: 1268,
        color: 5,
    };

    @node({
        id: 'f7bbf2fa-19d9-49fa-87e0-cfbad7d1ae9f',
        name: 'OpenAI Chat Model2',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [1120, 832],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    OpenaiChatModel2 = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4o-mini',
        },
        options: {},
    };

    @node({
        id: 'd3d1c0a2-98df-4923-91a0-a1bdc87134a2',
        name: 'Sticky Note3',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-208, 352],
    })
    StickyNote3 = {
        content: '# SECRETARIA',
        height: 880,
        width: 1060,
        color: 4,
    };

    @node({
        id: 'a4793953-4234-43b3-95eb-d43077f16637',
        name: 'Sticky Note6',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [368, 896],
    })
    StickyNote6 = {
        content: '## TOOLS:',
        height: 280,
        width: 400,
    };

    @node({
        id: '41eec9cc-7391-46bf-9be1-3ab75c1fdfcd',
        name: 'memoria',
        type: '@n8n/n8n-nodes-langchain.memoryPostgresChat',
        version: 1.3,
        position: [192, 800],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    Memoria = {
        sessionIdType: 'customKey',
        sessionKey: '={{ $json.whatsapp_lead }}',
        contextWindowLength: 40,
    };

    @node({
        id: '916a3711-91ad-41a1-96a2-0f5b4b0004e5',
        name: 'setarImg1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-2448, 704],
    })
    Setarimg1 = {
        assignments: {
            assignments: [
                {
                    id: '17d5e2bb-8f9c-4ae7-beb3-8ef4a7f3c5a0',
                    name: 'msg',
                    value: '={{ $json.output }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'cfd309aa-81fd-4e83-9246-e114ea1c0f78',
        name: 'setarAudio',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-2496, 416],
    })
    Setaraudio = {
        assignments: {
            assignments: [
                {
                    id: '17d5e2bb-8f9c-4ae7-beb3-8ef4a7f3c5a0',
                    name: 'msg',
                    value: "={{ $('transcreverAudio').item.json.text }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '16bd9ef3-6148-4018-bb56-42405ef0a82c',
        name: 'transcreverAudio',
        type: '@n8n/n8n-nodes-langchain.openAi',
        version: 1.8,
        position: [-2736, 416],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    Transcreveraudio = {
        resource: 'audio',
        operation: 'transcribe',
        options: {},
    };

    @node({
        id: '65dbcad2-9f66-4956-addd-145fad837c41',
        name: 'baixarAudio',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [-2928, 416],
    })
    Baixaraudio = {
        url: "={{ $('setar_informacoes').item.json.msg.urlMedia }}",
        options: {},
    };

    @node({
        id: '47b77f07-1f05-4162-89d0-1082b11db77e',
        name: 'Merge2',
        type: 'n8n-nodes-base.merge',
        version: 3,
        position: [-2144, 688],
    })
    Merge2 = {
        numberInputs: 3,
    };

    @node({
        id: '6fb59ea0-b394-4652-b523-d23b259571cc',
        name: 'msg_erro1',
        type: 'n8n-nodes-base.stopAndError',
        version: 1,
        position: [-2992, 1184],
    })
    MsgErro1 = {
        errorMessage: 'Temos um erro aqui',
    };

    @node({
        id: '827f44cb-ad3f-48fc-abd7-261b363450f4',
        webhookId: '2681d2aa-7001-4a33-a5ae-d459c44fe4e2',
        name: 'Wait',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [-1376, 480],
        alwaysOutputData: true,
    })
    Wait = {
        amount: 1,
    };

    @node({
        id: '02b009f4-0f18-4b59-92bb-494d213f02de',
        name: 'Push',
        type: 'n8n-nodes-base.redis',
        version: 1,
        position: [-1584, 480],
        credentials: { redis: { id: 'zdL4aNuCOfZ6ighv', name: 'Redis | AVMD' } },
        alwaysOutputData: true,
    })
    Push = {
        operation: 'push',
        list: '={{ $json.whatsapp_lead }}',
        messageData: '={{ $json.msg.conversa }}',
        tail: true,
    };

    @node({
        id: '9a1b92cb-53c8-4ffc-8f04-550617e6e715',
        name: 'Get',
        type: 'n8n-nodes-base.redis',
        version: 1,
        position: [-1584, 800],
        credentials: { redis: { id: 'zdL4aNuCOfZ6ighv', name: 'Redis | AVMD' } },
    })
    Get = {
        operation: 'get',
        propertyName: 'message',
        key: "={{ $('setar_mensagem').item.json.whatsapp_lead }}",
        keyType: 'list',
        options: {},
    };

    @node({
        id: '86c932b1-158f-4298-9c92-08a658449cc0',
        name: 'Delete Buffer',
        type: 'n8n-nodes-base.redis',
        version: 1,
        position: [-848, 720],
        credentials: { redis: { id: 'zdL4aNuCOfZ6ighv', name: 'Redis | AVMD' } },
    })
    DeleteBuffer = {
        operation: 'delete',
        key: "={{ $('setar_mensagem').item.json.whatsapp_lead }}",
    };

    @node({
        id: '8f679555-0e5f-4db4-bfd6-b43d41659e26',
        name: 'ConcatenaMsg',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-1056, 720],
    })
    Concatenamsg = {
        assignments: {
            assignments: [
                {
                    id: '5148f5a0-1759-4726-a7cb-9d8556f4b7dd',
                    name: 'todas_as_mensagens',
                    value: "={{ $('Get').item.json.message.join('\\n') }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '26fe04ab-91b3-420d-b394-d1f5ce6eb571',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [-1360, 800],
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
                    id: '512bac58-e060-4a8c-bae8-657cac02a1aa',
                    leftValue: '={{ $json.message.last() }}',
                    rightValue: "={{ $('Wait').item.json.msg.conversa }}",
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '94d935fc-762d-4e78-9e8e-f0f7de29763d',
        name: 'No Operation, do nothing',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [-1088, 992],
    })
    NoOperationDoNothing = {};

    @node({
        id: '99c77d67-59b0-4398-8a7b-99c3f930ba43',
        name: 'setarTexto1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-2736, 1008],
    })
    Setartexto1 = {
        assignments: {
            assignments: [
                {
                    id: '17d5e2bb-8f9c-4ae7-beb3-8ef4a7f3c5a0',
                    name: 'msg',
                    value: "={{ $('setar_informacoes').first().json.msg.conversa }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd3acbe84-d794-48df-8031-aa7a419a7b6d',
        name: 'Sticky Note21',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-3248, 256],
    })
    StickyNote21 = {
        content: '# Tratamento da Mensagem Vinda por Texto, Imagem ou Áudio',
        height: 1096,
        width: 1472,
        color: 4,
    };

    @node({
        id: 'bfb92918-442d-4107-94e5-d96c96d86a34',
        name: 'Sticky Note22',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-1744, 352],
    })
    StickyNote22 = {
        content: '# ESPERA DE MENSAGENS',
        height: 840,
        width: 1140,
    };

    @node({
        id: '51d6458d-caaa-4963-8481-d9256f080c9f',
        name: 'Switch3',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-3200, 688],
        alwaysOutputData: false,
    })
    Switch3 = {
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
                                id: 'a2afd618-af95-4bf4-b065-94ef38183d50',
                                leftValue: "={{ $('setar_informacoes').first().json.msg.media }}",
                                rightValue: '=audio',
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
                    outputKey: 'audioTranscrito',
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
                                id: '1873e517-3369-4cdd-8e15-2443a7dfa617',
                                leftValue: "={{ $('setar_informacoes').first().json.msg.media }}",
                                rightValue: 'image',
                                operator: {
                                    type: 'string',
                                    operation: 'equals',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'imagem',
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
                                id: 'dd779138-5925-4f04-94cc-5306646c85da',
                                leftValue: "={{ $('setar_informacoes').first().json.msg.conversa }}",
                                rightValue: 'extendedTextMessage',
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
                    outputKey: 'texto',
                },
            ],
        },
        options: {
            fallbackOutput: 'extra',
        },
    };

    @node({
        id: '0e8a5fd8-122e-4f82-b933-127d3069a6d3',
        name: 'Switch1',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-4224, 768],
    })
    Switch1 = {
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
                                id: '129a0e9c-af81-4fcf-ab13-164b15b2aaeb',
                                leftValue: "={{ $('Webhook3').item.json.body.message_type }}",
                                rightValue: 'outgoing',
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
                    outputKey: 'chatwoot',
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
                                id: '10172a93-4585-4cba-87f2-a06f4d20e760',
                                leftValue: "={{ $('Webhook3').item.json.body.conversation.labels }}",
                                rightValue: 'humano',
                                operator: {
                                    type: 'array',
                                    operation: 'contains',
                                    rightType: 'any',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Etiqueta humano',
                },
            ],
        },
        options: {
            fallbackOutput: 'extra',
        },
    };

    @node({
        id: 'aa5ebe6a-d871-498f-b0ee-9173deccd7e6',
        name: 'Sticky Note19',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-4352, 368],
    })
    StickyNote19 = {
        content: '# Filtrar se é atendimento Humano',
        height: 840,
        width: 556,
    };

    @node({
        id: '569866bd-5adf-477e-8a94-d2349a9bb1c6',
        webhookId: '5710f3e9-a637-40d3-a758-8b8acf8bc67c',
        name: 'Webhook3',
        type: 'n8n-nodes-base.webhook',
        version: 2,
        position: [-4800, 800],
    })
    Webhook3 = {
        httpMethod: 'POST',
        path: 'contabilidade',
        options: {},
    };

    @node({
        id: 'ee07a860-8232-4341-bd53-260ab10e325e',
        name: 'respostaChatwoot',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [2400, 752],
        credentials: { httpHeaderAuth: { id: 'vFHIRVhHLdinPZ9u', name: 'Chatwoot-contabilidade' } },
    })
    Respostachatwoot = {
        method: 'POST',
        url: "={{ $('setar_informacoes').item.json.url_chatwoot }}api/v1/accounts/{{ $('setar_informacoes').first().json.msg.id_conta_chatwoot }}/conversations/{{ $('setar_informacoes').first().json.msg.id_conversa_chatwoot }}/messages",
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
        id: '695aa45e-c5f3-4661-bbca-6bb7736ad95b',
        webhookId: '38b25403-3ab5-47b0-9d97-299017be8346',
        name: '2 segundos',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [2656, 752],
    })
    _2Segundos = {
        amount: 3,
    };

    @node({
        id: '9de545b1-fb4e-48d8-ace2-9ec02e596434',
        name: 'Sticky Note8',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-576, 368],
    })
    StickyNote8 = {
        content: '# Setar proximos dias e msg',
        height: 460,
        width: 340,
        color: 5,
    };

    @node({
        id: 'ac2f7c0d-b0d8-48a2-8753-a3c6b84439d1',
        name: 'Agendar',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.1,
        position: [640, 1024],
    })
    Agendar = {
        name: 'Agendar',
        description: `=**Quando usar:**
- Sempre que o lead aceitar **seguir com o agendamento**.  
- Para buscar horários disponíveis e apresentar opções ao lead.  
- For necessário confirmar, reagendar ou cancelar um agendamento`,
        workflowId: {
            __rl: true,
            value: 'k9ETM34Klf1UfDry',
            mode: 'id',
            cachedResultUrl: '/workflow/k9ETM34Klf1UfDry',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                duvida: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('duvida', `Coloque aqui a intenção que o paciente deseja (ver horários, marcar, cancelar ou reagendar). Seja explicativo e se possível sempre coloque o nome do paciente. Caso o paciente seja Unimed e tenha já falado o numero da carteirinha, sempre inclua aqui.`, 'string') }}",
                Assunto:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Assunto', `Coloque aqui o tipo de assunto/serviço que o lead está buscando. Sempre tente ser o mais detalhista possível.`, 'string') }}",
                Tipo_de_consulta:
                    '={{ /*n8n-auto-generated-fromAI-override*/ $fromAI(\'Tipo_de_consulta\', `Coloque aqui o tipo de consulta. A resposta será "presencial" ou "online" - somente uma dessas.`, \'string\') }}',
                whatsapp_lead: '={{ $json.whatsapp_lead }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'duvida',
                    displayName: 'duvida',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
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
                    id: 'Assunto',
                    displayName: 'Assunto',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'Tipo_de_consulta',
                    displayName: 'Tipo_de_consulta',
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
        id: 'e1860609-8796-441b-8324-b3eb9fa02634',
        name: 'proximos_dias',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-544, 592],
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
        id: '4f8bf5f8-a275-4087-b327-17c335d19df5',
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-2896, 704],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: 'e8326e9f-dcde-4e0b-a6f0-6a64b1b6a077',
                    name: 'URL',
                    value: "={{ $('setar_informacoes').item.json.msg.urlMedia }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2e542984-4708-4447-885b-5183172c30d0',
        name: 'DELETAR HISTORICO',
        type: 'n8n-nodes-base.postgres',
        version: 2.6,
        position: [64, 112],
        credentials: { postgres: { id: 'QAO3hNOlPdUH5mVF', name: 'Postgres_ Contabilidade' } },
    })
    DeletarHistorico = {
        operation: 'deleteTable',
        schema: {
            __rl: true,
            mode: 'list',
            value: 'public',
        },
        table: {
            __rl: true,
            value: 'n8n_chat_histories',
            mode: 'list',
            cachedResultName: 'n8n_chat_histories',
        },
        deleteCommand: 'delete',
        where: {
            values: [
                {
                    column: 'session_id',
                    value: '5511999859108',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'd4245599-d3a7-4579-81b1-db23881c58f2',
        name: 'Sticky Note',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [3072, 432],
    })
    StickyNote = {
        content: '# Atualizar CRM',
        height: 560,
        width: 352,
    };

    @node({
        id: '53bb783f-81d2-4a73-ac49-2815661b5b3e',
        name: 'Sticky Note1',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [0, 0],
    })
    StickyNote1 = {
        content: '# ADM - o0bGHnsgIMHvolST',
        height: 288,
        width: 512,
        color: '#098B30',
    };

    @node({
        id: '94edd0cc-73af-4036-a144-966f7f736e61',
        name: 'deletar_linha_CRM',
        type: 'n8n-nodes-base.supabase',
        version: 1,
        position: [304, 112],
        credentials: { supabaseApi: { id: 'uI6kDBFJB0y88kX6', name: 'ADM_AVMD' } },
    })
    DeletarLinhaCrm = {
        operation: 'delete',
        tableId: 'leads_contabilidade',
        filters: {
            conditions: [
                {
                    keyName: 'whatsapp_lead',
                    condition: 'eq',
                    keyValue: '5511999859108',
                },
            ],
        },
    };

    @node({
        id: 'ef490100-c4db-4ca6-98d6-f32c6afa6170',
        name: 'setar_informacoes',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-3568, 816],
        alwaysOutputData: true,
    })
    SetarInformacoes = {
        assignments: {
            assignments: [
                {
                    id: 'd0da81cd-f320-46b5-beb6-58f719f0c613',
                    name: 'msg.conversa',
                    value: "={{ $('Webhook3').item.json.body.conversation.messages[0].content }}",
                    type: 'string',
                },
                {
                    id: 'bd9d0ddd-0d43-4af3-b915-4ce61d8f20ae',
                    name: 'msg.id_conta_chatwoot',
                    value: "={{ $('Webhook3').item.json.body.account.id }}",
                    type: 'string',
                },
                {
                    id: '51a05f3c-4695-48c0-8b73-fd1217955488',
                    name: 'msg.id_conversa_chatwoot',
                    value: "={{ $('Webhook3').item.json.body.conversation.id.toString() }}",
                    type: 'string',
                },
                {
                    id: '5574557a-9a39-426b-8c10-bc272747bc75',
                    name: 'msg.id_Lead_chatwoot',
                    value: "={{ $('Webhook3').item.json.body.conversation.messages[0].sender.id.toString() }}",
                    type: 'string',
                },
                {
                    id: 'debefdb1-4424-4138-b02a-3ae952501cf5',
                    name: 'msg.inbox_id_chatwoot',
                    value: "={{ $('Webhook3').item.json.body.conversation.inbox_id }}",
                    type: 'string',
                },
                {
                    id: '2445f58a-ffdb-493c-b5b4-b0252342acc0',
                    name: 'msg.whatsapp_lead',
                    value: "={{ $('Webhook3').item.json.body.conversation.messages[0].sender.phone_number.replace('+', '') }}",
                    type: 'string',
                },
                {
                    id: '645e79d5-a3b1-4588-a348-325681207e07',
                    name: 'msg.media',
                    value: "={{ $('Webhook3').item.json.body.conversation.messages[0].attachments[0].file_type }}",
                    type: 'string',
                },
                {
                    id: 'e30d7e50-3249-4dda-99ad-0dab3c84601f',
                    name: 'msg.urlMedia',
                    value: "={{ $('Webhook3').item.json.body.conversation.messages[0].attachments[0].data_url }}",
                    type: 'string',
                },
                {
                    id: 'f1c38212-f12f-4afd-aa0f-23e19f367ffa',
                    name: 'msg.timestamp',
                    value: '={{ $json.body.conversation.timestamp }}',
                    type: 'number',
                },
                {
                    id: '559fd93f-88e7-4f1a-b512-a8249ea88478',
                    name: 'url_chatwoot',
                    value: 'https://chat.mantovan.com.br/',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '2c0c3c55-cf2c-4589-8154-1da3670dda86',
        name: 'Sticky Note2',
        type: 'n8n-nodes-base.stickyNote',
        version: 1,
        position: [-3760, 368],
    })
    StickyNote2 = {
        content: `# Seta as informações importantes
## Importante: (abra esse node e coloque a URL do chatwoot no ultimo campo.)`,
        height: 848,
        width: 480,
        color: 3,
    };

    @node({
        id: 'c20029f1-08a0-4830-89f9-1ede44752a93',
        name: 'fazer_nada',
        type: 'n8n-nodes-base.noOp',
        version: 1,
        position: [-4000, 496],
    })
    FazerNada = {};

    @node({
        id: '14fc1d83-b2bc-4c94-8f82-e44643d4c766',
        name: 'setar_mensagem',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-1920, 704],
    })
    SetarMensagem = {
        assignments: {
            assignments: [
                {
                    id: 'd0da81cd-f320-46b5-beb6-58f719f0c613',
                    name: 'msg.conversa',
                    value: "={{ $('Merge2').item.json.msg }}",
                    type: 'string',
                },
                {
                    id: '712cba19-ff98-4a85-a154-04090156103c',
                    name: 'whatsapp_lead',
                    value: "={{ $('setar_informacoes').item.json.msg.whatsapp_lead }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '92d70ab5-74ef-40b0-a6c0-ead4a9f8c8a0',
        name: 'analisar imagem',
        type: '@n8n/n8n-nodes-langchain.openAi',
        version: 2.1,
        position: [-2688, 704],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    AnalisarImagem = {
        resource: 'image',
        operation: 'analyze',
        modelId: {
            __rl: true,
            value: 'gpt-4o-mini',
            mode: 'list',
            cachedResultName: 'GPT-4O-MINI',
        },
        text: 'Descreva qual imagem é essa. Sempre comece com: "Usuário enviou uma imagem...."',
        imageUrls: '={{ $json.URL }}',
        options: {},
    };

    @node({
        id: 'b288eace-70cf-4117-bda8-3b93e79bbb7e',
        name: 'Aggregate',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [2864, 608],
    })
    Aggregate = {
        fieldsToAggregate: {
            fieldToAggregate: [
                {
                    fieldToAggregate: 'content',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'ea9bfd77-2f12-4061-a77f-d266762219b6',
        name: "Call '3- CRM | Ápice Contábil'",
        type: 'n8n-nodes-base.executeWorkflow',
        version: 1.3,
        position: [3216, 608],
    })
    Call3CrmApiceContabil = {
        workflowId: {
            __rl: true,
            value: 'uEOqK0jOSIWCDmCB',
            mode: 'id',
            cachedResultUrl: '/workflow/uEOqK0jOSIWCDmCB',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                mensagem_lead: "={{ $json.content.join('\\n') }}",
                whatsapp_lead: "={{ $('setar_informacoes').item.json.msg.whatsapp_lead }}",
                id_conta_chatwoot: "={{ $('setar_informacoes').item.json.msg.id_conta_chatwoot }}",
                id_conversa_chatwoot: "={{ $('setar_informacoes').item.json.msg.id_conversa_chatwoot }}",
                id_Lead_chatwoot: "={{ $('setar_informacoes').item.json.msg.id_Lead_chatwoot }}",
                inbox_id_chatwoot: "={{ $('setar_informacoes').item.json.msg.inbox_id_chatwoot }}",
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'mensagem_lead',
                    displayName: 'mensagem_lead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
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
                    id: 'id_conta_chatwoot',
                    displayName: 'id_conta_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'id_conversa_chatwoot',
                    displayName: 'id_conversa_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'id_Lead_chatwoot',
                    displayName: 'id_Lead_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
                {
                    id: 'inbox_id_chatwoot',
                    displayName: 'inbox_id_chatwoot',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                },
            ],
            attemptToConvertTypes: false,
            convertFieldsToString: true,
        },
        options: {},
    };

    @node({
        id: 'b4592bbc-b3d1-4506-b269-d9b0b66b9815',
        name: 'sobreEmpresa',
        type: '@n8n/n8n-nodes-langchain.toolWorkflow',
        version: 2.2,
        position: [512, 1024],
    })
    Sobreempresa = {
        description: `=**Quando chamar:**
- Sempre que o cliente **mencionar qualquer serviço** (não importa o tipo ou a quantidade de vezes durante a conversa).  
- Quando pedir **informações sobre o escritório** (endereço, horários de funcionamento, valores, formas de pagamento, parcelamento).  
- Para **quebrar qualquer objeção** antes de marcar a consulta.`,
        workflowId: {
            __rl: true,
            value: '92XPllCS3lvtsPcg',
            mode: 'id',
            cachedResultUrl: '/workflow/92XPllCS3lvtsPcg',
        },
        workflowInputs: {
            mappingMode: 'defineBelow',
            value: {
                NomeLead:
                    "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('NomeLead', `Coloque aqui o nome do lead que esta perguntando.`, 'string') }}",
                Duvida: "={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('Duvida', `Coloque aqui de forma detalhada a \"query\" que é a duvida do usuário. Se for sobre procedimentos, sempre inclua o nome do serviço que ele deseja auxilio.`, 'string') }}",
                whatsaapp_lead: '={{ $json.whatsapp_lead }}',
            },
            matchingColumns: [],
            schema: [
                {
                    id: 'NomeLead',
                    displayName: 'NomeLead',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'Duvida',
                    displayName: 'Duvida',
                    required: false,
                    defaultMatch: false,
                    display: true,
                    canBeUsedToMatch: true,
                    type: 'string',
                    removed: false,
                },
                {
                    id: 'whatsaapp_lead',
                    displayName: 'whatsaapp_lead',
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
        id: '2108edac-da0f-4b14-8de2-e2a2758027ee',
        name: 'Laura',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 1.8,
        position: [208, 544],
    })
    Laura = {
        promptType: 'define',
        text: '={{ $json.mensagem_lead }}',
        options: {
            systemMessage: `=# IDENTIDADE
-  Você é a **Laura**, secretária da **Ápice Contábil**, escritório de contabilidade localizado na Av. Paulista, 1374 — Conjunto 41, Bela Vista, São Paulo/SP.
-  Você é a primeira pessoa com quem o cliente tem contato e representa a imagem do escritório em cada mensagem.
-  Você é uma secretária humana. Nunca se apresente como assistente virtual, robô ou IA.

# SUA FUNÇÃO
- Atender todos os contatos que chegam pelo WhatsApp do escritório.
- Entender o perfil e a necessidade de cada um
- A presentar os serviços da Ápice Contábil quando necessário e conduzir o lead ao agendamento de uma reunião com um de nossos especialistas.
- Você **não** é contadora. Você é a ponte entre o lead e o escritório.

# TOM DE VOZ
- Acolhedor e humano, transmitindo empatia em situações delicadas.
- Frases curtas e diretas — estamos no WhatsApp, não em um e-mail
- Seguro e profissional, passando confiança ao cliente.
- Uso moderado de emojis apenas para reforçar acolhimento.
- Nunca use jargões contábeis sem explicar
- Um emoji ocasional é permitido para humanizar, mas com moderação
- Nunca soe robótica, formal demais ou com respostas engessadas
- **Nunca repita o nome do cliente durante a conversa.** Após coletar o nome, trate a pessoa de forma próxima, mas sem precisar citar o nome novamente.

# FLUXO DE ATENDIMENTO

## Etapa 1 — Apresentação

-   Dê as boas vinda, apresente-se como **Laura**, secretária do escritório Ápice Contábil e já pergunte o nome do lead.
    -   Se o nome já tiver sido informado, siga para a próxima etapa.

## Etapa 2 — Entendimento da necessidade
- Pergunte como pode ajudar o cliente.
- Informe que, se preferir, pode enviar um **áudio** para facilitar a explicação.
- Se o cliente já mencionou o que precisa, vá direto para a próxima etapa.

**Exemplo de msg:**
- “Agora me conta: como posso te ajudar hoje? Se for mais fácil, pode me mandar um áudio, tá bom?”

## Etapa 3 - Verificação de atuação
-  Assim que o lead explicar o que busca, acione a tool **sobreEmpresa** com o contexto completo para verificar se o escritório atua nessa área.
-  Se **sim** → informe que a Ápice pode ajudá-lo e já faça a primeira pergunta de qualificação da Etapa 4.
-  Se **não** → informe com gentileza que o escritório não atua nessa área e encerre o atendimento de forma cordial.

## Etapa 4 - Qualificação
-   Faça até **2 perguntas**, sempre **uma por vez** (pergunta → aguarda resposta → segue).
-   As perguntas devem se adaptar ao que o lead já contou, nunca soe como um formulário.
-  O objetivo é coletar o suficiente para que o especialista chegue na reunião já com contexto.
-  Use os guias abaixo conforme a situação identificada:
    -   Quer abrir empresa → tipo de negócio, sócio ou solo, tem CNPJ, urgência
    -   Tem empresa sem contador → área de atuação, há quanto tempo sem contador
    -   Quer trocar de contador → motivo da insatisfação, tempo com o atual
    -   Problema com Receita/pendência → tipo de problema, prazo, tem contador
    -   IR pessoa física → assalariado ou autônomo, tem investimentos ou imóveis
    -   Autônomo sem CNPJ → área de atuação, considera abrir MEI ou empresa

## Passo 5 — Apresentação

-  Após a qualificação, informe que a **reunião online é essencial** para o especialista analisar o caso com estratégia e indicar o melhor caminho.
- Destaque que o atendimento será feito por um **especialista da área** no assunto informado (aqui você add a área que o lead tem interesse). 
- Reforce que a reunião é feita por **videoconferência** e é **gratuita**.
- Finalize perguntando qual dia e horário ele prefere.
    - Exemplo de msg: "Agora me fala: qual dia e horário funcionam melhor pra você?"

## Etapa 6 - Verificação de horário
- Acione a tool **Agendar** para **verificar a disponibilidade** do dia e horário informados pelo lead.
  - Exemplo: *Verificar se o dia 17/10 as 15hrs esta disponível para o agendamento. Apenas verifique a disponibilidade.* 

-  Se estiver **disponível** → confirme e siga para a Etapa 7.
-  Se estiver **indisponível** → ofereça 3 alternativas retornadas pela tool **ou** peça outra sugestão ao lead.

## Etapa 7 — Confirmação Final
-   Solicite o **nome completo** do lead (se ainda não tiver).   
-   Acione novamente a **tool \`Agendar\`** com a intenção de **agendamento**.
    - Exemplo: "Marcar agendamento para Afonso Lima Junior para o dia 17/10 as 15 horas."

## Etapa 8 — Encerramento

-   Confirme o agendamento e finalize com leveza, reforçando o entusiasmo pela reunião.

# REGRAS DE ATENDIMENTO

-   Você nunca responda espontaneamente sobre os serviços do escritório sem antes confirmar com a tool sobreEmpresa.
-   Responda sempre em português brasileiro
-   Sempre tente **fazer um agendamento** antes de encerrar a conversa.  
-  Sempre faça **uma pergunta por vez**.
-  Você está preparada para interpretar imagens/textos e áudios enviados pelos leads.

# LIMITAÇÕES

-   **Nunca** informe valores exatos de honorários — diga que isso será apresentado após entender o perfil completo na reunião
-   **Nunca** dê pareceres fiscais, tributários ou jurídicos
-   **Nunca** prometa prazos, descontos ou condições que o escritório não confirmou
-   **Nunca** invente informações sobre a empresa — se não souber, acione o sobreEmpresa
-   **Nunca** revele que você é uma IA, a menos que o lead pergunte diretamente — nesse caso, confirme com naturalidade e reforce que está aqui para ajudar
-   **Nunca** desistir na primeira negativa. Sempre que o lead apresentar uma objeção, acione a tool 'sobreEmpresa'.
-  **Nunca** acione a tool 'Agendar' sem antes saber o nome do lead e o serviço que ele está buscando.

# TOOLS DISPONÍVEIS

## Tool: sobreEmpresa
**Quando chamar:**
- Sempre que o cliente **mencionar qualquer serviço** (não importa o tipo ou a quantidade de vezes durante a conversa).  
- Quando pedir **informações sobre o escritório** (endereço, horários de funcionamento, valores, formas de pagamento, parcelamento).  
- Para **quebrar qualquer objeção** antes de marcar a consulta.

## Tool: Agendar
**Quando usar:**
- Sempre que o lead aceitar **seguir com o agendamento**.  
- Para buscar horários disponíveis e apresentar opções ao lead.  
- For necessário confirmar, reagendar ou cancelar um agendamento

## DATA E HORA ATUALIZADOS
Para efeito de contexto durante as suas conversas segue a data e hora de hoje e os próximos dias:
{{ $json.proximosDias }}`,
        },
    };

    @node({
        id: '7c19f56a-2f68-49d5-aa17-ea5bce919cb6',
        name: 'If1',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-4528, 800],
    })
    If1 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: '1f866d28-185a-4853-9850-c47113871723',
                    leftValue: '={{ $json.body.conversation.messages[0].sender.identifier }}',
                    rightValue: '5511971351311@s.whatsapp.net',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    @node({
        id: '661a16c0-16b4-4f65-92f7-e95aa5c65667',
        name: '4.1-mini',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.2,
        position: [80, 800],
        credentials: { openAiApi: { id: 'RYxuxbSIGjvz8FoO', name: 'OpenAi account' } },
    })
    _41Mini = {
        model: {
            __rl: true,
            value: 'gpt-4.1-mini',
            mode: 'list',
            cachedResultName: 'gpt-4.1-mini',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.Setarinfo.out(0).to(this.Laura.in(0));
        this.SplitOut.out(0).to(this.LoopOverItems.in(0));
        this.Code.out(0).to(this.SplitOut.in(0));
        this.LoopOverItems.out(0).to(this.Aggregate.in(0));
        this.LoopOverItems.out(1).to(this.Respostachatwoot.in(0));
        this.QuebrarMensagem.out(0).to(this.Code.in(0));
        this.Setarmsgagent.out(0).to(this.QuebrarMensagem.in(0));
        this.Setarimg1.out(0).to(this.Merge2.in(1));
        this.Setaraudio.out(0).to(this.Merge2.in(0));
        this.Transcreveraudio.out(0).to(this.Setaraudio.in(0));
        this.Baixaraudio.out(0).to(this.Transcreveraudio.in(0));
        this.Merge2.out(0).to(this.SetarMensagem.in(0));
        this.Wait.out(0).to(this.Get.in(0));
        this.Push.out(0).to(this.Wait.in(0));
        this.Get.out(0).to(this.If_.in(0));
        this.DeleteBuffer.out(0).to(this.ProximosDias.in(0));
        this.Concatenamsg.out(0).to(this.DeleteBuffer.in(0));
        this.If_.out(0).to(this.Concatenamsg.in(0));
        this.If_.out(1).to(this.NoOperationDoNothing.in(0));
        this.Setartexto1.out(0).to(this.Merge2.in(2));
        this.Switch3.out(0).to(this.Baixaraudio.in(0));
        this.Switch3.out(1).to(this.EditFields.in(0));
        this.Switch3.out(2).to(this.Setartexto1.in(0));
        this.Switch3.out(3).to(this.MsgErro1.in(0));
        this.Switch1.out(0).to(this.FazerNada.in(0));
        this.Switch1.out(1).to(this.FazerNada.in(0));
        this.Switch1.out(2).to(this.SetarInformacoes.in(0));
        this.Webhook3.out(0).to(this.If1.in(0));
        this.Respostachatwoot.out(0).to(this._2Segundos.in(0));
        this._2Segundos.out(0).to(this.LoopOverItems.in(0));
        this.ProximosDias.out(0).to(this.Setarinfo.in(0));
        this.EditFields.out(0).to(this.AnalisarImagem.in(0));
        this.SetarInformacoes.out(0).to(this.Switch3.in(0));
        this.SetarMensagem.out(0).to(this.Push.in(0));
        this.AnalisarImagem.out(0).to(this.Setarimg1.in(0));
        this.Aggregate.out(0).to(this.Call3CrmApiceContabil.in(0));
        this.Laura.out(0).to(this.Setarmsgagent.in(0));
        this.If1.out(0).to(this.Switch1.in(0));

        this.QuebrarMensagem.uses({
            ai_languageModel: this.OpenaiChatModel2.output,
        });
        this.Laura.uses({
            ai_languageModel: this._41Mini.output,
            ai_memory: this.Memoria.output,
            ai_tool: [this.Agendar.output, this.Sobreempresa.output],
        });
    }
}
