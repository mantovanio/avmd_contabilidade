import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/Card';
import { Plus, Pencil, Trash2, Search, Save, X } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Servico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  ativo: boolean;
  criado_em: string;
}

export function ServicosContabeis() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Servico>>({
    nome: '',
    descricao: '',
    preco: 0,
    categoria: 'fiscal',
    ativo: true
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServicos, setFilteredServicos] = useState<Servico[]>([]);

  useEffect(() => {
    fetchServicos();
  }, []);

  useEffect(() => {
    // Filtra os serviços com base no termo de busca
    if (searchTerm.trim() === '') {
      setFilteredServicos(servicos);
    } else {
      const filtered = servicos.filter(servico => 
        servico.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
        servico.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        servico.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredServicos(filtered);
    }
  }, [searchTerm, servicos]);

  const fetchServicos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('servicos_contabilidade')
        .select('*')
        .order('nome');

      if (error) throw error;
      setServicos(data || []);
      setFilteredServicos(data || []);
    } catch (error: any) {
      console.error('Erro ao buscar serviços:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'preco' ? parseFloat(value) || 0 : value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      descricao: '',
      preco: 0,
      categoria: 'fiscal',
      ativo: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        // Atualizar serviço existente
        const { error } = await supabase
          .from('servicos_contabilidade')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Criar novo serviço
        const { error } = await supabase
          .from('servicos_contabilidade')
          .insert([formData]);

        if (error) throw error;
      }
      
      fetchServicos();
      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar serviço:', error);
      setError(error.message);
    }
  };

  const handleEdit = (servico: Servico) => {
    setFormData({
      nome: servico.nome,
      descricao: servico.descricao,
      preco: servico.preco,
      categoria: servico.categoria,
      ativo: servico.ativo
    });
    setEditingId(servico.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('servicos_contabilidade')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchServicos();
    } catch (error: any) {
      console.error('Erro ao excluir serviço:', error);
      setError(error.message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoriaLabel = (categoria: string) => {
    const categorias: Record<string, string> = {
      'fiscal': 'Fiscal',
      'contabil': 'Contábil',
      'trabalhista': 'Trabalhista',
      'societario': 'Societário',
      'consultoria': 'Consultoria',
      'outros': 'Outros'
    };
    return categorias[categoria] || categoria;
  };

  if (loading && servicos.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold">Serviços Contábeis</h1>
            <p className="text-muted-foreground">Gerencie os serviços oferecidos pela AVMD Contábil</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
            >
              <Plus size={18} />
              Novo Serviço
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg border border-red-100 dark:border-red-800 mb-6">
            {error}
          </div>
        )}

        {/* Formulário de Serviço */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
              <CardDescription>
                {editingId 
                  ? 'Atualize as informações do serviço selecionado' 
                  : 'Preencha os detalhes para adicionar um novo serviço contábil'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="nome" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Nome do Serviço *
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ex: Declaração de Imposto de Renda"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="categoria" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Categoria *
                    </label>
                    <select
                      id="categoria"
                      name="categoria"
                      required
                      value={formData.categoria}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="fiscal">Fiscal</option>
                      <option value="contabil">Contábil</option>
                      <option value="trabalhista">Trabalhista</option>
                      <option value="societario">Societário</option>
                      <option value="consultoria">Consultoria</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preco" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Preço (R$) *
                    </label>
                    <input
                      id="preco"
                      name="preco"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      value={formData.preco}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0,00"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        id="ativo"
                        name="ativo"
                        type="checkbox"
                        checked={formData.ativo}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="ativo" className="text-sm text-slate-700 dark:text-slate-300">
                        Serviço ativo e disponível
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="descricao" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Descrição *
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    required
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descreva o serviço em detalhes..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors"
                  >
                    {editingId ? 'Atualizar' : 'Salvar'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Serviços */}
        {filteredServicos.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-slate-500 dark:text-slate-400">
                {searchTerm 
                  ? 'Nenhum serviço encontrado para esta busca. Tente outros termos.' 
                  : 'Nenhum serviço cadastrado. Clique em "Novo Serviço" para começar.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredServicos.map(servico => (
              <Card key={servico.id} className={`overflow-hidden ${!servico.ativo ? 'opacity-70' : ''}`}>
                <div className={`h-2 ${servico.ativo ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{servico.nome}</CardTitle>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleEdit(servico)}
                        className="p-1 text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(servico.id)}
                        className="p-1 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <CardDescription>
                    <span className="inline-block bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                      {getCategoriaLabel(servico.categoria)}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {servico.descricao.length > 120
                      ? `${servico.descricao.substring(0, 120)}...`
                      : servico.descricao
                    }
                  </p>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-lg text-blue-600 dark:text-blue-400">
                      {formatCurrency(servico.preco)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-500">
                      {servico.criado_em && format(new Date(servico.criado_em), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}