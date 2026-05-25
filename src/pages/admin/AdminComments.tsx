import { useEffect, useState } from 'react';
import { Download, Filter, Search, RefreshCw, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Feedback, Document, Dimension } from '../../types/katun';

const AdminComments = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDoc, setFilterDoc] = useState('');
  const [filterDim, setFilterDim] = useState('');
  const [filterActor, setFilterActor] = useState('');
  const [search, setSearch] = useState('');

  const load = async () => {
    if (!supabase) return;
    setLoading(true);
    const [fbRes, docsRes, dimsRes] = await Promise.all([
      supabase.from('feedback').select('*').order('created_at', { ascending: false }),
      supabase.from('documents').select('id, title, dimension_id').order('title'),
      supabase.from('dimensions').select('id, name, code').eq('is_active', true).order('order_index'),
    ]);
    setFeedback((fbRes.data || []) as Feedback[]);
    setDocuments((docsRes.data || []) as Document[]);
    setDimensions((dimsRes.data || []) as Dimension[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const docName = (id: string) => documents.find(d => d.id === id)?.title || '—';
  const dimName = (id: string) => dimensions.find(d => d.id === id)?.name || '—';
  const actors = Array.from(new Set(feedback.map(f => f.actor_type))).sort();

  const filtered = feedback.filter(f => {
    if (filterDoc && f.document_id !== filterDoc) return false;
    if (filterDim && f.dimension_id !== filterDim) return false;
    if (filterActor && f.actor_type !== filterActor) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!f.content?.toLowerCase().includes(q) &&
          !f.author_name?.toLowerCase().includes(q) &&
          !f.author_email?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Fecha', 'Autor', 'Email', 'Tipo Actor', 'Documento', 'Dimensión', 'Sección', 'General', 'Comentario'];
    const rows = filtered.map(f => [
      f.id,
      new Date(f.created_at).toLocaleString('es-GT'),
      f.author_name || '',
      f.author_email || '',
      f.actor_type,
      docName(f.document_id),
      dimName(f.dimension_id),
      f.section_id || '',
      f.is_general ? 'Sí' : 'No',
      `"${(f.content || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comentarios_katun_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Comentarios</h2>
          <p className="text-slate-500 text-sm mt-1">
            {filtered.length} de {feedback.length} comentarios
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-ghost btn-sm" title="Recargar">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={exportCSV} disabled={filtered.length === 0} className="btn-primary btn-sm">
            <Download className="h-4 w-4" /> Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5">
        <div className="flex items-center gap-2 mb-4 text-slate-600">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-semibold">Filtros</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar…"
              className="form-input pl-8 text-sm"
            />
          </div>
          <select value={filterDoc} onChange={e => setFilterDoc(e.target.value)} className="form-input text-sm">
            <option value="">Todos los documentos</option>
            {documents.map(d => <option key={d.id} value={d.id}>{d.title}</option>)}
          </select>
          <select value={filterDim} onChange={e => setFilterDim(e.target.value)} className="form-input text-sm">
            <option value="">Todas las dimensiones</option>
            {dimensions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={filterActor} onChange={e => setFilterActor(e.target.value)} className="form-input text-sm">
            <option value="">Todos los actores</option>
            {actors.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          Cargando comentarios…
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <MessageSquare className="h-14 w-14 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No hay comentarios con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Fecha</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Autor</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Actor</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Documento</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Sección</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Comentario</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(f => (
                  <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                      {new Date(f.created_at).toLocaleDateString('es-GT', {
                        day: '2-digit', month: 'short', year: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{f.author_name || 'Anónimo'}</div>
                      {f.author_email && (
                        <div className="text-xs text-slate-400">{f.author_email}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge-brand text-xs">{f.actor_type}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-slate-600 line-clamp-1 max-w-[180px]">
                        {docName(f.document_id)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {f.section_id ? (
                        <span className="text-xs text-slate-500">{f.section_id}</span>
                      ) : (
                        <span className="text-xs text-slate-400 italic">General</span>
                      )}
                    </td>
                    <td className="px-4 py-3 max-w-sm">
                      <p className="text-slate-700 line-clamp-2">{f.content}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminComments;
