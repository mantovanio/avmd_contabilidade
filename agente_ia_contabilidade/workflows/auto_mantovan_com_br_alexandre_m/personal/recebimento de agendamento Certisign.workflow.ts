import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : recebimento de agendamento Certisign
// Nodes   : 26  |  Connections: 26
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// EmailTriggerImap                   emailReadImap              [creds]
// Switch_                            switch
// SendEmail                          emailSend                  [onError→regular] [creds]
// Evolution210EnviaMensagemCliente   httpRequest                [onError→regular]
// CancelamentoDeValidacao            code
// AgendamentoDeValidacao             code
// Wait                               wait
// Evolution210EnviaMensagemCliente2  httpRequest                [onError→regular]
// Wait1                              wait
// CriaPasta                          googleDrive                [creds] [retry]
// If_                                if                         [onError→regular] [retry]
// Evolution210EnviaMensagemEquipe2   httpRequest                [onError→regular]
// AvisaIngrid                        httpRequest
// AvisaIngrid1                       httpRequest
// Normalza1                          set
// EditFields1                        set
// Folderidfinal                      set
// MoveFile                           googleDrive                [creds]
// MoviParaZCancelados                googleDrive                [creds]
// BuscaPasta                         googleDrive                [onError→regular] [creds] [alwaysOutput] [retry]
// UpdateFile                         googleDrive                [creds]
// Switch1                            switch
// BuscaPasta1                        googleDrive                [onError→regular] [creds] [alwaysOutput] [retry]
// Aggregate                          aggregate
// Evolution210EnviaMensagemEquipe    httpRequest                [onError→regular]
// EditFields                         set
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// EmailTriggerImap
//    → Switch_
//      → AgendamentoDeValidacao
//        → BuscaPasta
//          → Switch1
//            → MoveFile
//              → UpdateFile
//                → Aggregate
//                  → Evolution210EnviaMensagemEquipe2
//                  → Evolution210EnviaMensagemEquipe
//                  → Wait1
//                    → Evolution210EnviaMensagemCliente
//                      → Wait
//                        → Evolution210EnviaMensagemCliente2
//                  → SendEmail
//           .out(1) → EditFields
//              → CriaPasta
//                → Folderidfinal
//                  → Aggregate (↩ loop)
//     .out(1) → CancelamentoDeValidacao
//        → Normalza1
//          → BuscaPasta1
//            → If_
//              → MoviParaZCancelados
//                → EditFields1
//            → AvisaIngrid
//              → AvisaIngrid1
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'jZ0Hxf6RZRuzoABm',
    name: 'recebimento de agendamento Certisign',
    active: true,
    isArchived: false,
    settings: {
        executionOrder: 'v1',
        callerPolicy: 'workflowsFromSameOwner',
        errorWorkflow: 'njgLDMiZUfzbxoI1',
        binaryMode: 'separate',
        timeSavedMode: 'fixed',
        availableInMCP: false,
    },
})
export class RecebimentoDeAgendamentoCertisignWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '2c876ae0-38f1-408f-aa33-9d7ab3d9cae6',
        name: 'Email Trigger (IMAP)',
        type: 'n8n-nodes-base.emailReadImap',
        version: 2,
        position: [-1440, -448],
        credentials: { imap: { id: 'H9oQXH9GI4DQmMlM', name: 'IMAP account' } },
    })
    EmailTriggerImap = {
        options: {
            forceReconnect: 5,
        },
    };

    @node({
        id: 'b5b12217-eef6-4a0e-93c1-a7805a640126',
        name: 'Switch',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-1184, -448],
    })
    Switch_ = {
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
                                leftValue: '={{ $json.subject }}',
                                rightValue: 'Novo pedido',
                                operator: {
                                    type: 'string',
                                    operation: 'contains',
                                },
                                id: '90344cb6-b371-4914-acd4-4a9f91eb563c',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Agendado',
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
                                id: 'd95e23c1-56fb-44a7-8a5e-12684df179c7',
                                leftValue: '={{ $json.subject }}',
                                rightValue: 'Cancelamento',
                                operator: {
                                    type: 'string',
                                    operation: 'contains',
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Cancelado',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '6a94d3b2-08e8-4607-9148-0788d27c5f8b',
        webhookId: 'a69b25ac-4bc8-407c-a997-461d8742961f',
        name: 'Send Email',
        type: 'n8n-nodes-base.emailSend',
        version: 2.1,
        position: [1056, -1072],
        credentials: { smtp: { id: '6e47pVwT4AGiQadz', name: 'SMTP account' } },
        onError: 'continueRegularOutput',
    })
    SendEmail = {
        fromEmail: 'contato@certifast.com.br',
        toEmail: "={{ $('Agendamento de Validação').item.json.email }}",
        subject: 'Recebemos o seu agendamento para o certificado digital',
        html: `=<p>Prezado cliente, {{ $('Agendamento de Validação').item.json.nomeCliente }} tudo bem?</p>

<p>Recebemos o seu agendamento para a validação do certificado digital! Abaixo estão os detalhes:</p>

<ul>
  <li><strong>Número do pedido:</strong> {{ $('Agendamento de Validação').item.json.pedido }}</li>
  <li><strong>Produto adquirido:</strong> {{ $('Agendamento de Validação').item.json.produto }}</li>
  <li><strong>Posto de atendimento:</strong> {{ $('Agendamento de Validação').item.json.posto }}</li>
  <li><strong>Data:</strong> {{ $('Agendamento de Validação').item.json.data }}</li>
  <li><strong>Horário:</strong> {{ $('Agendamento de Validação').item.json.hora }}</li>
</ul>

<p><strong>Atenção, por favor! ⚠️</strong></p>

<ol>
  <li><strong>Documentação necessária:</strong>
    <ul>
      <li>Seu documento pessoal (RG ou CNH).</li>
      <li>Os documentos da empresa (se for o caso)</li>
      <li>Enviar por e´mail ou por WhatsApp.</li>
</li>
    </ul>
  </li>
</ol>

<p><strong>Dicas importantes:</strong></p>
<ul>
  <li>Os documentos devem estar coloridos, completos e sem cortes nas bordas.</li>
  <li>Se possível, envie a versão digital do seu documento pessoal.</li>
</ul>

<p><strong>Link da reunião:</strong></p>
<ul>
  <li>No dia e horário agendados, você receberá um link por WhatsApp, mas se o numero não for compativel entregaremos o link por e-mail para a validação.</li>
  <li>O link tem validade de 10 minutos. Caso não consiga acessá-lo a tempo, entre em contato conosco.</li>
</ul>

<p>Se tiver qualquer dúvida, estou à disposição para ajudar e caso precise reagendar, nos comunique pelo nosso whatsapp 1132800484!</p>

<p>Agradecemos pela confiança e estamos à disposição para garantir que tudo corra bem!</p>

<p>Se precisar entrar em contato, envie uma mensagem para <strong>11 32800484 (WhatsApp)</strong></p>

<p>Equipe Certifast</p>`,
        options: {},
    };

    @node({
        id: '14f58eb0-6c9b-4437-a561-97f7ea21cedd',
        name: 'Evolution 2.1.0 - envia mensagem cliente',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1232, -464],
        onError: 'continueRegularOutput',
        alwaysOutputData: false,
    })
    Evolution210EnviaMensagemCliente = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "{{ $('Edit Fields').item.json.telefone }}",
  "text": "Prezado, {{ $('Agendamento de Validação').item.json.primeiroNome }}! Tudo bem? \\\\n\\\\nRecebemos o seu agendamento para a validação do certificado digital.\\\\n\\\\n📋 *Detalhes do Agendamento:*\\\\n- Nome: {{ $('Agendamento de Validação').item.json.nomeCliente }}\\\\n- Pedido: {{ $('Agendamento de Validação').item.json.pedido }}\\\\n- Produto: {{ $('Agendamento de Validação').item.json.produto }}\\\\n- Posto: {{ $('Agendamento de Validação').item.json.posto }}\\\\n- Data: {{ $('Agendamento de Validação').item.json.data }}\\\\n- Horário: {{ $('Agendamento de Validação').item.json.hora }}"
}`,
        options: {},
    };

    @node({
        id: 'd5179578-93c4-4736-874a-987be242179f',
        name: 'Cancelamento de Validação',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-736, -176],
    })
    CancelamentoDeValidacao = {
        jsCode: `const email = $input.item.json;
const corpoBruto = email.textHtml || email.textPlain || email.text || email.corpo || email.message || '';
const assunto = email.subject || '';

if (!corpoBruto && !assunto) {
  throw new Error('E-mail sem assunto e sem corpo para extracao.');
}

const htmlToText = (input) =>
  String(input || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&agrave;/gi, 'as')
    .replace(/&aacute;/gi, 'a')
    .replace(/&atilde;/gi, 'a')
    .replace(/&ccedil;/gi, 'c')
    .replace(/\\s+/g, ' ')
    .trim();

const textoCorpo = htmlToText(corpoBruto);

const extract = (regex) => {
  const match = textoCorpo.match(regex);
  return match ? match[1].trim() : null;
};

const pedido =
  (assunto.match(/cancelamento\\s+de\\s+valida(?:c|ç)[aã]o.*?pedido\\s*(\\d{5,})/i) || [])[1] ||
  (assunto.match(/pedido\\s*(\\d{5,})/i) || [])[1] ||
  extract(/Pedido:\\s*(\\d{5,})/i);

const data =
  extract(/agendada\\s+para\\s+o\\s+dia\\s*(\\d{2}\\/\\d{2}\\/\\d{4})/i) ||
  extract(/Data:\\s*(\\d{2}\\/\\d{2}\\/\\d{4})/i);

const hora =
  extract(/(?:as|às)\\s*(\\d{2}:\\d{2})h?/i) ||
  extract(/Hora:\\s*(\\d{2}:\\d{2})/i);

const cliente = extract(/Cliente:\\s*([\\s\\S]*?)(?=\\s*(CPF\\/CNPJ:|Telefone:|Email:|Pedido:|Produto:|Data:|Hora:|$))/i);
const telefoneBruto = extract(/Telefone:\\s*([\\d()\\-\\s]+)/i);
const emailCliente = extract(/Email:\\s*([^\\s]+@[^\\s]+\\.[^\\s]+)/i);
const produto = extract(/Produto:\\s*([\\s\\S]*?)(?=\\s*(Telefone:|Email:|Data:|Hora:|$))/i);

const telefoneNumeros = (telefoneBruto || '').replace(/\\D/g, '');
const telefone = telefoneNumeros
  ? telefoneNumeros.startsWith('55')
    ? telefoneNumeros
    : \`55\${telefoneNumeros}\`
  : null;

if (!pedido) {
  throw new Error('Nao foi possivel identificar o numero do pedido no e-mail de cancelamento.');
}

return [
  {
    json: {
      cliente,
      telefone,
      pedido,
      email: emailCliente,
      produto,
      data,
      hora,
    },
  },
];`,
    };

    @node({
        id: '0304a8b8-89a6-4568-b6eb-9045722009dc',
        name: 'Agendamento de Validação',
        type: 'n8n-nodes-base.code',
        version: 2,
        position: [-704, -560],
    })
    AgendamentoDeValidacao = {
        jsCode: `// Função para remover tags HTML e limpar espaços
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ')
             .replace(/&nbsp;/g, ' ')
             .replace(/\\s+/g, ' ')
             .trim();
}

// Função para extrair valor entre chave e próxima chave
function extractBetween(text, key, nextKey) {
  const start = text.indexOf(key);
  if (start === -1) return '';
  const valueStart = start + key.length;
  let valueEnd = text.length;

  if (nextKey) {
    const nextStart = text.indexOf(nextKey, valueStart);
    if (nextStart !== -1) {
      valueEnd = nextStart;
    }
  }

  return text.substring(valueStart, valueEnd).trim();
}

// Função para normalizar telefone para WhatsApp
function normalizarTelefone(telefone) {
  const numeros = telefone.replace(/\\D/g, '');
  return numeros.length === 11 ? \`55\${numeros}\` : numeros;
}

// Função para extrair primeiro nome
function primeiroNome(nome) {
  return nome.split(' ')[0];
}

// Função para limpar assunto
function limparAssunto(texto) {
  return texto.replace(/\\s+/g, ' ').trim();
}

// Captura e limpeza do corpo do e-mail
const rawHtml = items[0].json.textPlain || items[0].json.textHtml || '';
const emailBody = stripHtml(rawHtml);
const assunto = limparAssunto(items[0].json.subject || '');

// Extração precisa entre chaves
const cliente = extractBetween(emailBody, 'Cliente:', 'CPF/CNPJ:');
const cpfCnpj = extractBetween(emailBody, 'CPF/CNPJ:', 'Telefone:');
const telefoneRaw = extractBetween(emailBody, 'Telefone:', 'Telefone Celular:');
const email = extractBetween(emailBody, 'Email:', 'Pedido:');
const pedidoMatch = emailBody.match(/Pedido:\\s*(\\d{6,})/);
const pedido = pedidoMatch ? pedidoMatch[1] : '';
const produto = extractBetween(emailBody, 'Produto:', 'Posto:');
const posto = extractBetween(emailBody, 'Posto:', 'Data:');
const data = extractBetween(emailBody, 'Data:', 'Hora:');
const hora = extractBetween(emailBody, 'Hora:', null);

// Lógica condicional para CPF ou CNPJ
let cpf = '';
let cnpj = '';
if (produto.toLowerCase().includes('e-cpf')) {
  cpf = cpfCnpj;
} else if (produto.toLowerCase().includes('e-cnpj')) {
  cnpj = cpfCnpj;
}

// Monta o objeto final
const output = {
  assunto,
  nomeCliente: cliente,
  primeiroNome: primeiroNome(cliente),
  cpf,
  cnpj,
  telefone: normalizarTelefone(telefoneRaw),
  email,
  pedido,
  produto,
  posto,
  data,
  hora
};

return [{ json: output }];
`,
    };

    @node({
        id: 'bf152f78-5755-404c-81aa-5dd4ec6ea2b8',
        webhookId: 'fbf353aa-fae9-4fd6-84b5-8d3c16220366',
        name: 'Wait',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [1440, -464],
    })
    Wait = {};

    @node({
        id: '19cdba74-94ac-4d0e-aa50-cc8a9ee089cb',
        name: 'Evolution 2.1.0 - envia mensagem cliente2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1632, -464],
        onError: 'continueRegularOutput',
        alwaysOutputData: false,
    })
    Evolution210EnviaMensagemCliente2 = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "{{ $('Agendamento de Validação').item.json.telefone }}",
  "text": "*Atenção!*\\n\\n1. *Documentação necessária:*\\n   - Documento pessoal (RG ou CNH).\\n   - Documentos da empresa (se for o caso).\\n\\n💡 *Dicas importantes:*\\n   - Os documentos devem estar *coloridos, completos e sem cortes*.\\n   - Se possível, envie a versão *digital* dos documentos.\\n\\n🔗 *Link da reunião:*\\n   - No dia e horário agendados, você receberá um link por WhatsApp.\\n   - O link terá *validade de 10 minutos*. Caso não consiga acessá-lo a tempo, entre em contato conosco.\\n\\n *Precisa de ajuda?*\\n   - Estamos à disposição para esclarecer qualquer dúvida e caso precise reagendar envie aqui a sua mensagem que faremso o seu reagendamento! \\n\\nAgradecemos pela confiança em nossos serviços!\\n\\nEquipe Certifast"
}`,
        options: {},
    };

    @node({
        id: '2c4cf5d9-8e03-4327-975a-11179f6dd856',
        webhookId: 'fbf353aa-fae9-4fd6-84b5-8d3c16220366',
        name: 'Wait1',
        type: 'n8n-nodes-base.wait',
        version: 1.1,
        position: [1056, -464],
    })
    Wait1 = {
        amount: 3,
    };

    @node({
        id: 'b327c820-aaa2-4d59-a129-5f884d4f49bc',
        name: 'Cria pasta',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [224, -384],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
        executeOnce: false,
        retryOnFail: true,
    })
    CriaPasta = {
        resource: 'folder',
        name: '={{ $json.data }} {{ $json.hora }} pedido {{ $json.pedido }} {{ $json.nomeCliente  }} {{ $json.telefone }}',
        driveId: {
            __rl: true,
            mode: 'list',
            value: 'My Drive',
        },
        folderId: {
            __rl: true,
            value: '12a5jVGsdJjFzMk41dEs6NJbc1CVuTjGi',
            mode: 'list',
            cachedResultName: 'PEDIDOS',
            cachedResultUrl: 'https://drive.google.com/drive/folders/12a5jVGsdJjFzMk41dEs6NJbc1CVuTjGi',
        },
        options: {},
    };

    @node({
        id: '838fb975-83a4-494a-925b-44fd22f82b30',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.2,
        position: [16, -176],
        onError: 'continueRegularOutput',
        executeOnce: false,
        retryOnFail: true,
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
                    id: 'eb75619d-233f-4ac3-bc3b-6377d110dc62',
                    leftValue: '={{ $json.id }}',
                    rightValue: '={{ $json.name }}',
                    operator: {
                        type: 'string',
                        operation: 'notEmpty',
                        singleValue: true,
                    },
                },
            ],
            combinator: 'and',
        },
        options: {
            ignoreCase: false,
        },
    };

    @node({
        id: 'cada6a6e-1345-4455-bc29-3d0dc23c4675',
        name: 'Evolution 2.1.0 - envia mensagem Equipe2',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1056, -672],
        onError: 'continueRegularOutput',
        alwaysOutputData: false,
    })
    Evolution210EnviaMensagemEquipe2 = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "5511983500019",
  "text": "🚨 **NOVO AGENDAMENTO!** \\n\\nDetalhes do Agendamento:\\n- *Cliente:* {{ $('Agendamento de Validação').item.json.nomeCliente }}\\n- *CPF/CNPJ:* {{ $('Agendamento de Validação').item.json.cnpj }}{{ $('Agendamento de Validação').item.json.cpf }}\\n- *Telefone:* {{ $('Agendamento de Validação').item.json.telefone }} \\n- *E-mail:*{{ $('Agendamento de Validação').item.json.email }}\\n- *Pedido:* {{ $('Agendamento de Validação').item.json.pedido }}\\n- *Produto:* {{ $('Agendamento de Validação').item.json.produto }}\\n- *Posto:* {{ $('Agendamento de Validação').item.json.posto }}\\n- *Data:* {{ $('Agendamento de Validação').item.json.data }}\\n- *Horário:* {{ $('Agendamento de Validação').item.json.hora }}" 
}`,
        options: {},
    };

    @node({
        id: '02fbe7a6-cd3d-4413-baa4-ac28f1865133',
        name: 'avisa ingrid',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [32, 48],
        alwaysOutputData: false,
    })
    AvisaIngrid = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "5511990002583",
  "text": "🚨 *VALIDAÇÃO CANCELADA* 🚨\\n\\n*Cliente:* {{ $('Normalza1').item.json.Cliente }}\\n\\n*Pedido:* {{ $('Normalza1').item.json.Pedido }}\\n*Produto:* {{ $('Normalza1').item.json.Produto }}\\n*Data:* {{ $('Normalza1').item.json.Data }}"}`,
        options: {},
    };

    @node({
        id: 'fc99c11b-ab30-4b87-aa38-6d32243773e7',
        name: 'avisa ingrid1',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [304, 48],
        alwaysOutputData: false,
    })
    AvisaIngrid1 = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "5511983500019",
  "text": "🚨 *VALIDAÇÃO CANCELADA* 🚨\\n\\n*Cliente:* {{ $('Normalza1').item.json.Cliente }}\\n\\n*Pedido:* {{ $('Normalza1').item.json.Pedido }}\\nProduto:{{ $('Normalza1').item.json.Produto }}\\n*Data:*{{ $('Normalza1').item.json.Data }}"}`,
        options: {},
    };

    @node({
        id: '26dc0204-0b72-4517-9d74-31e265853ec1',
        name: 'Normalza1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-512, -176],
    })
    Normalza1 = {
        assignments: {
            assignments: [
                {
                    id: 'fb066a81-d78d-4416-a94f-244bfe5c5d84',
                    name: 'Cliente',
                    value: '={{ $json.cliente }}',
                    type: 'string',
                },
                {
                    id: '6ba9d249-f0c1-427d-a2fd-d350c6677b15',
                    name: 'Primeiro Nome',
                    value: '={{ $json.cliente }}',
                    type: 'string',
                },
                {
                    id: 'f688fbaa-42d9-4409-9cbd-d6abb23fc44d',
                    name: 'Telefone',
                    value: '={{ $json.telefone }}',
                    type: 'string',
                },
                {
                    id: '7399f3be-f126-461d-8b0d-d473dd8d3708',
                    name: 'e-mail',
                    value: '={{ $json.email }}',
                    type: 'string',
                },
                {
                    id: 'c070b96a-29a7-448a-8518-c0271cb88b13',
                    name: 'Pedido',
                    value: '={{ $json.pedido }}',
                    type: 'string',
                },
                {
                    id: 'f1f2e2ec-c631-412a-bedf-1e87c5ce431d',
                    name: 'Produto',
                    value: '={{ $json.produto }}',
                    type: 'string',
                },
                {
                    id: '57a85268-b1ca-4856-a4ed-ecb6daf6e6db',
                    name: 'Data',
                    value: '={{ $json.data }}',
                    type: 'string',
                },
                {
                    id: 'afd6a128-da44-4b58-8314-c5d736ed1092',
                    name: 'chavePedido',
                    value: '=Pedido {{ $json.pedido }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '3bb15137-c6bb-44e2-91f6-4d1155f18e5f',
        name: 'Edit Fields1',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [592, -192],
    })
    EditFields1 = {
        assignments: {
            assignments: [
                {
                    id: 'd9826744-be16-4fd2-abd5-5bbf076d0578',
                    name: 'folderIdFinal',
                    value: '={{ $json.id }}',
                    type: 'string',
                },
                {
                    id: '485c6042-7055-4192-a57f-4ff04fda4bc2',
                    name: 'nome da pasta',
                    value: '={{ $json.name }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '3a52754b-3659-41fe-bccd-34e9502761aa',
        name: 'folderIdFinal',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [512, -384],
    })
    Folderidfinal = {
        assignments: {
            assignments: [
                {
                    id: 'b54275d5-e836-4c4e-9f2e-b5a0ee6a59d4',
                    name: 'folderIdFinal',
                    value: '={{ $json.id }}',
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    @node({
        id: 'a5bc2040-f147-4513-b4c6-285737493f0f',
        name: 'Move file',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [64, -624],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
    })
    MoveFile = {
        operation: 'move',
        fileId: {
            __rl: true,
            value: '={{ $json.id }}',
            mode: 'id',
        },
        driveId: {
            __rl: true,
            mode: 'list',
            value: 'My Drive',
        },
        folderId: {
            __rl: true,
            value: '12a5jVGsdJjFzMk41dEs6NJbc1CVuTjGi',
            mode: 'list',
            cachedResultName: 'PEDIDOS',
            cachedResultUrl: 'https://drive.google.com/drive/folders/12a5jVGsdJjFzMk41dEs6NJbc1CVuTjGi',
        },
    };

    @node({
        id: 'e18d9dc6-e8ad-4656-a623-4f5db8544ed5',
        name: 'Movi para Z CANCELADOS',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [320, -192],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
    })
    MoviParaZCancelados = {
        operation: 'move',
        fileId: {
            __rl: true,
            value: '={{ $json.id }}',
            mode: 'id',
        },
        driveId: {
            __rl: true,
            mode: 'list',
            value: 'My Drive',
        },
        folderId: {
            __rl: true,
            value: '1BsclfGTt6w6-wsYoSgrYkkhBDYPz-iEw',
            mode: 'list',
            cachedResultName: 'Z CANCELADOS',
            cachedResultUrl: 'https://drive.google.com/drive/folders/1BsclfGTt6w6-wsYoSgrYkkhBDYPz-iEw',
        },
    };

    @node({
        id: '72c6e1bc-63f0-4545-aa1e-527b462d5fde',
        name: 'Busca Pasta',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [-496, -560],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
        onError: 'continueRegularOutput',
        alwaysOutputData: true,
        retryOnFail: true,
    })
    BuscaPasta = {
        resource: 'fileFolder',
        searchMethod: 'query',
        queryString: "=name contains '{{ $json.pedido }}' and trashed = false",
        limit: 1,
        filter: {},
        options: {},
    };

    @node({
        id: 'd3a12fc6-27fd-4288-bf57-fb728b532ef6',
        name: 'Update file',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [336, -624],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
    })
    UpdateFile = {
        operation: 'update',
        fileId: {
            __rl: true,
            value: '={{ $json.id }}',
            mode: 'id',
        },
        newUpdatedFileName:
            "={{ $('Agendamento de Validação').item.json.data }} {{ $('Agendamento de Validação').item.json.hora }} Pedido {{ $('Agendamento de Validação').item.json.pedido }} {{ $('Agendamento de Validação').item.json.nomeCliente }} {{ $('Agendamento de Validação').item.json.telefone }}",
        options: {},
    };

    @node({
        id: '2bf2bb1a-408b-4131-99c6-aa2476f834b7',
        name: 'Switch1',
        type: 'n8n-nodes-base.switch',
        version: 3.2,
        position: [-288, -560],
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
                                leftValue: '={{ $json.id }}',
                                rightValue: 'Novo pedido',
                                operator: {
                                    type: 'string',
                                    operation: 'exists',
                                    singleValue: true,
                                },
                                id: '90344cb6-b371-4914-acd4-4a9f91eb563c',
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Nã_Criar_Pasta',
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
                                id: 'd95e23c1-56fb-44a7-8a5e-12684df179c7',
                                leftValue: '={{ $json.id }}',
                                rightValue: 'Cancelamento',
                                operator: {
                                    type: 'string',
                                    operation: 'notExists',
                                    singleValue: true,
                                },
                            },
                        ],
                        combinator: 'and',
                    },
                    renameOutput: true,
                    outputKey: 'Criar',
                },
            ],
        },
        options: {},
    };

    @node({
        id: '9c623c0d-406b-4274-8adf-c010f9030600',
        name: 'Busca Pasta1',
        type: 'n8n-nodes-base.googleDrive',
        version: 3,
        position: [-256, -176],
        credentials: { googleDriveOAuth2Api: { id: 'HtuAlJ584rZcRKop', name: 'Google Drive | Cliente AVMD' } },
        onError: 'continueRegularOutput',
        alwaysOutputData: true,
        retryOnFail: true,
    })
    BuscaPasta1 = {
        resource: 'fileFolder',
        searchMethod: 'query',
        queryString: "=name contains '{{ $json.pedido }}' and trashed = false",
        limit: 1,
        filter: {},
        options: {},
    };

    @node({
        id: 'df868902-17f7-40d1-a85a-cecefe082bc8',
        name: 'Aggregate',
        type: 'n8n-nodes-base.aggregate',
        version: 1,
        position: [704, -576],
    })
    Aggregate = {
        fieldsToAggregate: {
            fieldToAggregate: [{}],
        },
        options: {},
    };

    @node({
        id: 'f0af4fa8-7678-4821-9d67-d0aaaacf89e9',
        name: 'Evolution 2.1.0 - envia mensagem Equipe',
        type: 'n8n-nodes-base.httpRequest',
        version: 4.2,
        position: [1056, -848],
        onError: 'continueRegularOutput',
        alwaysOutputData: false,
    })
    Evolution210EnviaMensagemEquipe = {
        method: 'POST',
        url: 'https://api.mantovan.com.br/message/sendText/atendimento',
        sendHeaders: true,
        headerParameters: {
            parameters: [
                {
                    name: 'apikey',
                    value: '={{ $env.EVOLUTION_API_KEY }}',
                },
            ],
        },
        sendBody: true,
        specifyBody: 'json',
        jsonBody: `={
  "number": "5511990002583",
  "text": "🚨 **NOVO AGENDAMENTO!** \\n\\nDetalhes do Agendamento:\\n- *Cliente:* {{ $('Agendamento de Validação').item.json.nomeCliente }}\\n- *CPF/CNPJ:* {{ $('Agendamento de Validação').item.json.cnpj }}{{ $('Agendamento de Validação').item.json.cpf }}\\n- *Telefone:* {{ $('Agendamento de Validação').item.json.telefone }} \\n- *E-mail:*{{ $('Agendamento de Validação').item.json.email }}\\n- *Pedido:* {{ $('Agendamento de Validação').item.json.pedido }}\\n- *Produto:* {{ $('Agendamento de Validação').item.json.produto }}\\n- *Posto:* {{ $('Agendamento de Validação').item.json.posto }}\\n- *Data:* {{ $('Agendamento de Validação').item.json.data }}\\n- *Horário:* {{ $('Agendamento de Validação').item.json.hora }}" 
}`,
        options: {},
    };

    @node({
        id: 'c98557e7-774b-42ac-9d45-d739066b011a',
        name: 'Edit Fields',
        type: 'n8n-nodes-base.set',
        version: 3.4,
        position: [-64, -480],
    })
    EditFields = {
        assignments: {
            assignments: [
                {
                    id: '1c7bbdd6-49b6-4811-8be0-7fc047491e5b',
                    name: 'data',
                    value: "={{ $('Agendamento de Validação').item.json.data }}",
                    type: 'string',
                },
                {
                    id: 'ea1dd874-260c-47fe-9bc5-89d3574b5837',
                    name: 'hora',
                    value: "={{ $('Agendamento de Validação').item.json.hora }}",
                    type: 'string',
                },
                {
                    id: 'e97a86b6-efa7-4e21-b180-56cd9234c5cb',
                    name: 'pedido',
                    value: "={{ $('Agendamento de Validação').item.json.pedido }}",
                    type: 'string',
                },
                {
                    id: '545c7346-1e3c-4e9e-93f6-eee344a2c43e',
                    name: 'nomeCliente',
                    value: "={{ $('Agendamento de Validação').item.json.nomeCliente }}",
                    type: 'string',
                },
                {
                    id: '41f37e1a-8d27-4938-be01-4d7c2d97929b',
                    name: 'telefone',
                    value: "={{ $('Agendamento de Validação').item.json.telefone }}",
                    type: 'string',
                },
            ],
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.EmailTriggerImap.out(0).to(this.Switch_.in(0));
        this.Switch_.out(0).to(this.AgendamentoDeValidacao.in(0));
        this.Switch_.out(1).to(this.CancelamentoDeValidacao.in(0));
        this.Evolution210EnviaMensagemCliente.out(0).to(this.Wait.in(0));
        this.CancelamentoDeValidacao.out(0).to(this.Normalza1.in(0));
        this.AgendamentoDeValidacao.out(0).to(this.BuscaPasta.in(0));
        this.Wait.out(0).to(this.Evolution210EnviaMensagemCliente2.in(0));
        this.Wait1.out(0).to(this.Evolution210EnviaMensagemCliente.in(0));
        this.If_.out(0).to(this.MoviParaZCancelados.in(0));
        this.AvisaIngrid.out(0).to(this.AvisaIngrid1.in(0));
        this.Normalza1.out(0).to(this.BuscaPasta1.in(0));
        this.CriaPasta.out(0).to(this.Folderidfinal.in(0));
        this.MoveFile.out(0).to(this.UpdateFile.in(0));
        this.MoviParaZCancelados.out(0).to(this.EditFields1.in(0));
        this.BuscaPasta.out(0).to(this.Switch1.in(0));
        this.UpdateFile.out(0).to(this.Aggregate.in(0));
        this.Switch1.out(0).to(this.MoveFile.in(0));
        this.Switch1.out(1).to(this.EditFields.in(0));
        this.BuscaPasta1.out(0).to(this.If_.in(0));
        this.BuscaPasta1.out(0).to(this.AvisaIngrid.in(0));
        this.Folderidfinal.out(0).to(this.Aggregate.in(0));
        this.Aggregate.out(0).to(this.Evolution210EnviaMensagemEquipe2.in(0));
        this.Aggregate.out(0).to(this.Evolution210EnviaMensagemEquipe.in(0));
        this.Aggregate.out(0).to(this.Wait1.in(0));
        this.Aggregate.out(0).to(this.SendEmail.in(0));
        this.EditFields.out(0).to(this.CriaPasta.in(0));
    }
}
