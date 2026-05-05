// Funções de exportação
function exportConversation(conversationId) {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (!conversation) return;
    
    // Formatar a conversa para exportação
    const formattedConversation = formatConversationForExport(conversation);
    
    // Criar nome do arquivo
    const date = new Date(conversation.timestamp);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const fileName = `AVMD_Contabil_${formattedDate}_${conversation.title.substring(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    
    // Criar e baixar o arquivo
    downloadTextFile(formattedConversation, fileName);
    
    // Mostrar notificação
    showNotification(`Conversa exportada como ${fileName}`);
}

function exportAllConversations() {
    if (conversations.length === 0) {
        showNotification('Não há conversas para exportar.', 'error');
        return;
    }
    
    // Criar conteúdo combinado
    let combinedContent = '# HISTÓRICO DE CONVERSAS - AVMD CONTÁBIL\n\n';
    combinedContent += `Data de exportação: ${new Date().toLocaleString('pt-BR')}\n\n`;
    
    // Ordenar conversas por data (mais recentes primeiro)
    const sortedConversations = [...conversations].sort((a, b) => b.timestamp - a.timestamp);
    
    // Adicionar cada conversa
    sortedConversations.forEach(conv => {
        combinedContent += '='.repeat(80) + '\n';
        combinedContent += formatConversationForExport(conv);
        combinedContent += '\n\n';
    });
    
    // Criar nome do arquivo
    const today = new Date();
    const formattedDate = today.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');
    const fileName = `AVMD_Contabil_Historico_Completo_${formattedDate}.txt`;
    
    // Criar e baixar o arquivo
    downloadTextFile(combinedContent, fileName);
    
    // Mostrar notificação
    showNotification(`Histórico completo exportado como ${fileName}`);
}

function formatConversationForExport(conversation) {
    const date = new Date(conversation.timestamp);
    const formattedDate = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const formattedTime = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    let content = `# ${conversation.title}\n`;
    content += `Data: ${formattedDate} às ${formattedTime}\n`;
    content += `Modelo: ${conversation.model || 'Não especificado'}\n\n`;
    
    // Adicionar mensagens
    if (conversation.messages && conversation.messages.length > 0) {
        conversation.messages.forEach(msg => {
            if (msg.role === 'user') {
                content += `👤 Usuário: ${msg.content}\n\n`;
            } else if (msg.role === 'assistant') {
                content += `🤖 Assistente: ${msg.content}\n\n`;
            }
        });
    } else {
        content += 'Não há mensagens nesta conversa.\n';
    }
    
    return content;
}

function downloadTextFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';
    
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Gerenciamento de tema
let currentTheme = localStorage.getItem('avmd_theme') || 'dark';

function initTheme() {
    // Definir tema inicial
    if (currentTheme === 'light') {
        document.documentElement.classList.add('light-theme');
        document.getElementById('theme-toggle').checked = true;
    } else {
        document.documentElement.classList.remove('light-theme');
        document.getElementById('theme-toggle').checked = false;
    }
}

function toggleTheme() {
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('light-theme');
        currentTheme = 'light';
    } else {
        document.documentElement.classList.remove('light-theme');
        currentTheme = 'dark';
    }
    
    localStorage.setItem('avmd_theme', currentTheme);
}

// Inicializar o aplicativo
function initApp() {
    // Inicializar sistema de conversas
    initializeConversation();
    
    // Inicializar tema
    initTheme();
    
    // Adicionar event listener para o toggle de tema
    document.getElementById('theme-toggle').addEventListener('change', toggleTheme);
    
    // Exibir a seção de chat inicialmente
    showChatSection();
}

// Event listener para a seção de documentos
btnDocs.addEventListener('click', showDocumentsSection);

// Iniciar a aplicação
window.addEventListener('DOMContentLoaded', initApp);