import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/Card';
import { ArrowLeft, Calendar, Phone, Mail, Clock, MessageSquare, User, Edit, Save, Trash2 } from 'lucide-react';

interface Lead {
  id: string;
  nome_lead: string;
  telefone: string;
  email: string;
  status: string;
  horario_comercial: boolean;
  inicio_atendimento: string;
  observacoes?: string;
  ultima_atualizacao?: string;
  responsavel?: string;
}

const statusOptions = [
  { value: 'iniciou_conversa', label: 'Iniciou Conversa' },
  { value: 'conversando', label: 'Em Conversa' },
  { value: 'agendado', label: 'Agendado' },
  { value: 'cliente', label: 'Cliente' },
  { value: 'perdido', label: 'Perdido' },
];

const statusColors: Record<string, string> = {
  'agendado': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'conversando': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'iniciou_conversa': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
  'cliente': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'perdido': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLead();
  }, [id]);

  const fetchLead = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads_contabilidade')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setLead(data);
    } catch (error: any) {
      console.error('Error fetching lead:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setIsEditing(false);
      setEditedLead({});
    } else {
      setIsEditing(true);
      setEditedLead(lead || {});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setEditedLead(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    if (!lead) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('leads_contabilidade')
        .update({
          ...editedLead,
          ultima_atualizacao: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;
      fetchLead();
      setIsEditing(false);
      setEditedLead({});
    } catch (error: any) {
      console.error('Error updating lead:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este lead? Esta ação não pode ser desfeita.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('leads_contabilidade')
        .delete()
        .eq('id', id);

      if (error) throw error;
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error deleting lead:', error);
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-6 rounded-xl border border-red-100 dark:border-red-800">
            <h2 className="text-xl font-bold mb-4">Erro ao carregar dados do lead</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
            <h2 className="text-xl font-bold mb-4">Lead não encontrado</h2>
            <p>O lead solicitado não foi encontrado em nossa base de dados.</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Voltar para o Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg border shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft size={16} />
            Voltar para o Dashboard
          </button>
          
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEditToggle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/50 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Edit size={16} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-800/50 shadow-sm hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  <Trash2 size={16} />
                  Excluir
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg border border-green-100 dark:border-green-800/50 shadow-sm hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50"
                >
                  <Save size={16} />
                  Salvar
                </button>
                <button
                  onClick={handleEditToggle}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Informações Principais */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-start gap-2">
                <User className="h-5 w-5 mt-0.5 text-blue-600 dark:text-blue-400" />
                {isEditing ? (
                  <input
                    type="text"
                    name="nome_lead"
                    value={editedLead.nome_lead || ''}
                    onChange={handleInputChange}
                    className="w-full p-1 border rounded bg-white dark:bg-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nome do Lead"
                  />
                ) : (
                  lead.nome_lead || 'Sem Nome'
                )}
              </CardTitle>
              <CardDescription>
                {!isEditing ? (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusColors[lead.status] || 'bg-slate-100 text-slate-700'}`}>
                    {lead.status.replace('_', ' ')}
                  </span>
                ) : (
                  <select
                    name="status"
                    value={editedLead.status || lead.status}
                    onChange={handleInputChange}
                    className="p-1 border rounded bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      name="telefone"
                      value={editedLead.telefone || lead.telefone || ''}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Telefone"
                    />
                  ) : (
                    <span>{lead.telefone || 'Não informado'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={editedLead.email || lead.email || ''}
                      onChange={handleInputChange}
                      className="w-full p-1 border rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Email"
                    />
                  ) : (
                    <span>{lead.email || 'Não informado'}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>
                    {lead.inicio_atendimento ? format(new Date(lead.inicio_atendimento), "dd 'de' MMMM, yyyy", { locale: ptBR }) : '-'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <div className="flex items-center">
                    {isEditing ? (
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="horario_comercial"
                          checked={editedLead.horario_comercial !== undefined ? editedLead.horario_comercial : lead.horario_comercial}
                          onChange={handleCheckboxChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Horário Comercial
                      </label>
                    ) : (
                      <span>
                        {lead.horario_comercial ? 'Dentro do Horário Comercial' : 'Fora do Horário Comercial'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Observações
                </label>
                {isEditing ? (
                  <textarea
                    name="observacoes"
                    value={editedLead.observacoes !== undefined ? editedLead.observacoes : lead.observacoes || ''}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full p-2 border rounded bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adicione observações sobre este lead"
                  />
                ) : (
                  <p className="text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 p-3 rounded-lg border">
                    {lead.observacoes || 'Nenhuma observação registrada.'}
                  </p>
                )}
              </div>
            </CardContent>
            {lead.ultima_atualizacao && (
              <CardFooter>
                <p className="text-sm text-slate-500 dark:text-slate-500">
                  Última atualização: {format(new Date(lead.ultima_atualizacao), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </p>
              </CardFooter>
            )}
          </Card>

          {/* Timeline e Ações */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Próximas Ações
              </CardTitle>
              <CardDescription>
                Acompanhamento do lead
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 transition-colors">
                  Agendar Reunião
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 transition-colors">
                  Enviar Proposta
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-4 transition-colors">
                  Registrar Contato
                </button>
              </div>
              
              <div className="mt-8 border-t pt-4">
                <h4 className="font-medium mb-2">Histórico de Contato</h4>
                <div className="space-y-3 text-sm">
                  <div className="border-l-2 border-blue-500 pl-3 py-1">
                    <p className="font-medium">Primeiro contato</p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {lead.inicio_atendimento ? format(new Date(lead.inicio_atendimento), "dd/MM/yyyy", { locale: ptBR }) : '-'}
                    </p>
                  </div>
                  {/* Aqui seria adicionado mais itens do histórico */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}