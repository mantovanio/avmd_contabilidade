// Configurações do Supabase
let supabaseUrl = localStorage.getItem('avmd_supabase_url') || '';
let supabaseKey = localStorage.getItem('avmd_supabase_key') || '';

// Elementos DOM
const kanbanContainer = document.getElementById('kanban-container');
const kanbanBoard = document.getElementById('kanban-board');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');
const retryButton = document.getElementById('retry-button');

// Elementos do modal
const settingsModal = document.getElementById('settings-modal');
const openSettingsBtn = document.getElementById('open-crm-settings');
const closeSettingsBtn = document.querySelector('.close-modal');
const saveSettingsBtn = document.getElementById('save-crm-settings');
const supabaseUrlInput = document.getElementById('supabase-url-input');
const supabaseKeyInput = document.getElementById('supabase-key-input');
const toggleKeyBtn = document.getElementById('toggle-key-visibility');
const refreshBtn = document.getElementById('refresh-crm');

// Cliente Supabase
let supabase;
let realtimeSubscription;

// Dados
let leadsData = [];

// Etapas do Kanban
const kanbanStages = [
    { id: 'iniciou-conversa', label: 'Iniciou Conversa', color: 'var(--status-iniciou-conversa)' },
    { id: 'conversando', label: 'Conversando', color: 'var(--status-conversando)' },
    { id: 'agendado', label: 'Agendado', color: 'var(--status-agendado)' },
    { id: 'cliente', label: 'Cliente', color: 'var(--status-cliente)' },
    { id: 'follow-up', label: 'Follow Up', color: 'var(--status-follow-up)' },
    { id: 'cancelou-agendamento', label: 'Cancelou Agendamento', color: 'var(--status-cancelou-agendamento)' },
    { id: 'perdido', label: 'Perdido', color: 'var(--status-perdido)' }
];

// Inicializar
window.addEventListener('DOMContentLoaded', initCrm);

// Função de inicialização
function initCrm() {
    // Preencher inputs do modal
    supabaseUrlInput.value = supabaseUrl;
    supabaseKeyInput.value = supabaseKey;
    
    // Verificar se as credenciais do Supabase existem
    if (!supabaseUrl || !supabaseKey) {
        showError('Configurações do Supabase não encontradas. Por favor, configure-as para continuar.');
        openSettingsModal();
        return;
    }
    
    // Inicializar Supabase
    initSupabase();
    
    // Carregar dados
    loadLeads();
}

// Inicializar Supabase
function initSupabase() {
    try {
        supabase = supabase.createClient(supabaseUrl, supabaseKey);
        console.log('Supabase cliente inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar cliente Supabase:', error);
        showError('Não foi possível conectar ao Supabase. Verifique suas credenciais.');
    }
}

// Carregar leads
async function loadLeads() {
    if (!supabase) {
        showError('Cliente Supabase não inicializado.');
        return;
    }
    
    showLoading();
    
    try {
        const { data, error } = await supabase
            .from('leads_contabilidade')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        leadsData = data || [];
        renderKanbanBoard();
        setupRealtimeSubscription();
        
        hideLoading();
        showKanban();
    } catch (error) {
        console.error('Erro ao carregar leads:', error);
        showError('Não foi possível carregar os leads. ' + error.message);
    }
}

// Configurar assinatura em tempo real
function setupRealtimeSubscription() {
    if (realtimeSubscription) {
        supabase.removeSubscription(realtimeSubscription);
    }
    
    realtimeSubscription = supabase
        .channel('leads_changes')
        .on('postgres_changes', 
            { event: '*', schema: 'public', table: 'leads_contabilidade' }, 
            (payload) => {
                handleRealtimeChange(payload);
            })
        .subscribe();
        
    console.log('Assinatura de tempo real configurada');
}

// Lidar com mudanças em tempo real
function handleRealtimeChange(payload) {
    console.log('Alteração em tempo real detectada:', payload);
    
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    switch (eventType) {
        case 'INSERT':
            leadsData = [newRecord, ...leadsData];
            break;
        case 'UPDATE':
            leadsData = leadsData.map(lead => 
                lead.id === newRecord.id ? newRecord : lead
            );
            break;
        case 'DELETE':
            leadsData = leadsData.filter(lead => lead.id !== oldRecord.id);
            break;
    }
    
    renderKanbanBoard();
}

// Renderizar Kanban board
function renderKanbanBoard() {
    kanbanBoard.innerHTML = '';
    
    // Criar colunas para cada etapa
    kanbanStages.forEach(stage => {
        const stageLeads = leadsData.filter(lead => lead.status === stage.id);
        
        const column = document.createElement('div');
        column.className = 'kanban-column';
        column.dataset.status = stage.id;
        
        column.innerHTML = `
            <div class="column-header">
                <div class="column-title">
                    <span>${stage.label}</span>
                    <span class="column-count">${stageLeads.length}</span>
                </div>
            </div>
            <div class="column-cards" data-status="${stage.id}">
                <!-- Os cards serão adicionados aqui -->
            </div>
        `;
        
        const cardsContainer = column.querySelector('.column-cards');
        
        // Adicionar cards para cada lead
        stageLeads.forEach(lead => {
            const card = createLeadCard(lead);
            cardsContainer.appendChild(card);
        });
        
        kanbanBoard.appendChild(column);
    });
    
    // Configurar Drag and Drop após renderizar o board
    setupDragAndDrop();
}

// Criar card de lead
function createLeadCard(lead) {
    const card = document.createElement('div');
    card.className = 'lead-card';
    card.dataset.id = lead.id;
    
    card.innerHTML = `
        <div class="lead-name">${lead.nome_lead || 'Sem nome'}</div>
        <div class="lead-whatsapp">${formatWhatsApp(lead.whatsapp_lead) || 'Sem contato'}</div>
        <div class="lead-motivo">${lead.motivo_contato || 'Sem informações'}</div>
    `;
    
    return card;
}

// Formatar WhatsApp
function formatWhatsApp(whatsapp) {
    if (!whatsapp) return '';
    
    // Remover caracteres não numéricos
    const numbers = whatsapp.replace(/\D/g, '');
    
    // Formatar conforme tamanho
    if (numbers.length === 11) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    } else if (numbers.length === 10) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    }
    
    return whatsapp;
}

// Configurar Drag and Drop
function setupDragAndDrop() {
    const { DndContext, SensorOptions, PointerSensor, useSensor, DragOverlay } = window.DndKit;
    
    let activeCard = null;
    let activeCardElement = null;
    
    // Selecionar todos os cards
    const cards = document.querySelectorAll('.lead-card');
    const dropZones = document.querySelectorAll('.column-cards');
    
    // Adicionar event listeners para drag start
    cards.forEach(card => {
        card.addEventListener('mousedown', (e) => {
            activeCard = card;
            activeCardElement = card.cloneNode(true);
            activeCardElement.classList.add('dragging');
            
            // Posicionar o elemento clone na posição do cursor
            document.body.appendChild(activeCardElement);
            positionDragElement(e, activeCardElement);
            
            // Adicionar classe dragging ao card original
            card.classList.add('dragging');
        });
    });
    
    // Event listener para movimento do mouse
    document.addEventListener('mousemove', (e) => {
        if (activeCardElement) {
            positionDragElement(e, activeCardElement);
            
            // Verificar se está sobre uma drop zone
            dropZones.forEach(zone => {
                const rect = zone.getBoundingClientRect();
                
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    zone.classList.add('drop-target');
                } else {
                    zone.classList.remove('drop-target');
                }
            });
        }
    });
    
    // Event listener para soltar
    document.addEventListener('mouseup', (e) => {
        if (activeCard && activeCardElement) {
            // Verificar se está sobre uma drop zone
            let targetZone = null;
            
            dropZones.forEach(zone => {
                const rect = zone.getBoundingClientRect();
                
                if (
                    e.clientX >= rect.left &&
                    e.clientX <= rect.right &&
                    e.clientY >= rect.top &&
                    e.clientY <= rect.bottom
                ) {
                    targetZone = zone;
                }
                
                zone.classList.remove('drop-target');
            });
            
            // Se estiver sobre uma drop zone, mover o lead
            if (targetZone) {
                const leadId = activeCard.dataset.id;
                const newStatus = targetZone.dataset.status;
                
                updateLeadStatus(leadId, newStatus);
            }
            
            // Remover o elemento clone
            if (activeCardElement.parentNode) {
                activeCardElement.parentNode.removeChild(activeCardElement);
            }
            
            activeCard.classList.remove('dragging');
            activeCard = null;
            activeCardElement = null;
        }
    });
}

// Posicionar elemento arrastado
function positionDragElement(e, element) {
    element.style.position = 'fixed';
    element.style.top = e.clientY + 'px';
    element.style.left = e.clientX + 'px';
    element.style.transform = 'translate(-50%, -50%)';
    element.style.pointerEvents = 'none';
    element.style.zIndex = '9999';
}

// Atualizar status do lead
async function updateLeadStatus(leadId, newStatus) {
    if (!leadId || !newStatus) return;
    
    try {
        const { error } = await supabase
            .from('leads_contabilidade')
            .update({ status: newStatus })
            .eq('id', leadId);
        
        if (error) throw error;
        
        console.log(`Lead ${leadId} atualizado para ${newStatus}`);
        
        // Atualizar localmente (será sobrescrito pela atualização em tempo real)
        leadsData = leadsData.map(lead => {
            if (lead.id === leadId) {
                return { ...lead, status: newStatus };
            }
            return lead;
        });
        
        renderKanbanBoard();
    } catch (error) {
        console.error('Erro ao atualizar lead:', error);
        showError('Não foi possível atualizar o status do lead. ' + error.message, true);
    }
}

// Funções para controlar a exibição
function showLoading() {
    loadingState.style.display = 'flex';
    kanbanContainer.style.display = 'none';
    errorState.style.display = 'none';
}

function showKanban() {
    loadingState.style.display = 'none';
    kanbanContainer.style.display = 'block';
    errorState.style.display = 'none';
}

function showError(message, isTemporary = false) {
    loadingState.style.display = 'none';
    kanbanContainer.style.display = 'none';
    errorState.style.display = 'flex';
    errorMessage.textContent = message;
    
    if (isTemporary) {
        setTimeout(() => {
            errorState.style.display = 'none';
            kanbanContainer.style.display = 'block';
        }, 3000);
    }
}

function hideLoading() {
    loadingState.style.display = 'none';
}

// Modal e configurações
function openSettingsModal() {
    settingsModal.classList.add('active');
}

function closeSettingsModal() {
    settingsModal.classList.remove('active');
}

// Event Listeners
openSettingsBtn.addEventListener('click', openSettingsModal);

closeSettingsBtn.addEventListener('click', closeSettingsModal);

window.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        closeSettingsModal();
    }
});

toggleKeyBtn.addEventListener('click', () => {
    const type = supabaseKeyInput.getAttribute('type') === 'password' ? 'text' : 'password';
    supabaseKeyInput.setAttribute('type', type);
    toggleKeyBtn.textContent = type === 'password' ? '👁️' : '🔒';
});

saveSettingsBtn.addEventListener('click', () => {
    const newUrl = supabaseUrlInput.value.trim();
    const newKey = supabaseKeyInput.value.trim();
    
    if (!newUrl || !newKey) {
        alert('Por favor, preencha todos os campos.');
        return;
    }
    
    supabaseUrl = newUrl;
    supabaseKey = newKey;
    
    localStorage.setItem('avmd_supabase_url', newUrl);
    localStorage.setItem('avmd_supabase_key', newKey);
    
    closeSettingsModal();
    
    // Reiniciar o cliente e recarregar os dados
    initSupabase();
    loadLeads();
});

refreshBtn.addEventListener('click', loadLeads);

retryButton.addEventListener('click', loadLeads);