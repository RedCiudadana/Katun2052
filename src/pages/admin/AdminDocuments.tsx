import { useEffect, useState, useRef } from 'react';
import { Plus, CreditCard as Edit2, Trash2, FileText, Upload, X, Save, Loader2, CheckCircle, AlertTriangle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Document, Dimension } from '../../types/katun';

type DocForm = {
  title: string;
  description: string;
  document_type: string;
  version: string;
  status: string;
  pdf_url: string;
  word_url: string;
  publication_date: string;
  dimension_id: string;
  is_published: boolean;
};

const emptyForm = (): DocForm => ({
  title: '',
  description: '',
  document_type: 'plan',
  version: '1.0',
  status: 'vigente',
  pdf_url: '',
  word_url: '',
  publication_date: new Date().toISOString().split('T')[0],
  dimension_id: '',
  is_published: true,
});

const DOC_TYPES = ['plan', 'lineamientos', 'diagnóstico', 'estrategia', 'informe', 'otro'];

const AdminDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Document | null>(null);
  const [form, setForm] = useState<DocForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploadingFile, setUploadingFile] = useState<'word' | 'pdf' | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const wordRef = useRef<HTMLInputElement>(null);
  const pdfRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    if (!supabase) return;
    const [docsRes, dimsRes] = await Promise.all([
      supabase.from('documents').select('*').order('publication_date', { ascending: false }),
      supabase.from('dimensions').select('*').eq('is_active', true).order('order_index'),
    ]);
    setDocuments((docsRes.data || []) as Document[]);
    setDimensions((dimsRes.data || []) as Dimension[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (doc: Document) => {
    setEditing(doc);
    setForm({
      title: doc.title,
      description: doc.description,
      document_type: doc.document_type,
      version: doc.version,
      status: doc.status,
      pdf_url: doc.pdf_url || '',
      word_url: (doc as any).word_url || '',
      publication_date: doc.publication_date,
      dimension_id: doc.dimension_id,
      is_published: doc.is_published,
    });
    setShowForm(true);
  };

  const handleFileUpload = async (file: File, type: 'word' | 'pdf') => {
    if (!supabase) return;
    setUploadingFile(type);
    try {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('documents')
        .upload(path, file, { upsert: true });

      if (upErr) throw upErr;

      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      const url = urlData.publicUrl;

      if (type === 'word') {
        setForm(p => ({ ...p, word_url: url }));
      } else {
        setForm(p => ({ ...p, pdf_url: url }));
      }
      showToast('Archivo subido correctamente');
    } catch (err: any) {
      showToast(err.message || 'Error al subir el archivo', 'error');
    } finally {
      setUploadingFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        document_type: form.document_type,
        version: form.version,
        status: form.status,
        pdf_url: form.pdf_url || null,
        word_url: form.word_url || null,
        publication_date: form.publication_date,
        dimension_id: form.dimension_id,
        is_published: form.is_published,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from('documents').update(payload).eq('id', editing.id);
        if (error) throw error;
        showToast('Documento actualizado');
      } else {
        const { error } = await supabase.from('documents').insert([{ ...payload, sections: [], metadata: {} }]);
        if (error) throw error;
        showToast('Documento creado');
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (doc: Document) => {
    if (!confirm(`¿Eliminar "${doc.title}"? Esta acción no se puede deshacer.`)) return;
    if (!supabase) return;
    setDeleting(doc.id);
    try {
      const { error } = await supabase.from('documents').delete().eq('id', doc.id);
      if (error) throw error;
      showToast('Documento eliminado');
      await load();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublished = async (doc: Document) => {
    if (!supabase) return;
    const { error } = await supabase.from('documents')
      .update({ is_published: !doc.is_published, updated_at: new Date().toISOString() })
      .eq('id', doc.id);
    if (!error) await load();
  };

  const dimName = (id: string) => dimensions.find(d => d.id === id)?.name || '—';

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Documentos</h2>
          <p className="text-slate-500 text-sm mt-1">{documents.length} documento{documents.length !== 1 ? 's' : ''} en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> Nuevo documento
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? 'Editar documento' : 'Nuevo documento'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="form-label">Título *</label>
                <input type="text" required value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="form-input" placeholder="Título del documento" />
              </div>

              <div>
                <label className="form-label">Descripción *</label>
                <textarea required rows={3} value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="form-input resize-none" placeholder="Descripción breve del documento" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Dimensión *</label>
                  <select required value={form.dimension_id}
                    onChange={e => setForm(p => ({ ...p, dimension_id: e.target.value }))}
                    className="form-input">
                    <option value="">Seleccionar…</option>
                    {dimensions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Tipo</label>
                  <select value={form.document_type}
                    onChange={e => setForm(p => ({ ...p, document_type: e.target.value }))}
                    className="form-input">
                    {DOC_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Versión</label>
                  <input type="text" value={form.version}
                    onChange={e => setForm(p => ({ ...p, version: e.target.value }))}
                    className="form-input" placeholder="1.0" />
                </div>
                <div>
                  <label className="form-label">Fecha de publicación</label>
                  <input type="date" value={form.publication_date}
                    onChange={e => setForm(p => ({ ...p, publication_date: e.target.value }))}
                    className="form-input" />
                </div>
              </div>

              {/* Word upload */}
              <div>
                <label className="form-label">Documento Word (.docx)</label>
                <div className="flex gap-2 items-center">
                  <input ref={wordRef} type="file" accept=".doc,.docx" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'word'); }} />
                  <button type="button" onClick={() => wordRef.current?.click()}
                    disabled={uploadingFile === 'word'}
                    className="btn-secondary btn-sm shrink-0">
                    {uploadingFile === 'word'
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</>
                      : <><Upload className="h-4 w-4" /> Subir Word</>}
                  </button>
                  <input type="url" value={form.word_url}
                    onChange={e => setForm(p => ({ ...p, word_url: e.target.value }))}
                    className="form-input flex-1 text-sm" placeholder="O pega la URL del archivo Word" />
                </div>
                {form.word_url && (
                  <p className="text-xs text-green-700 mt-1 truncate">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    {form.word_url}
                  </p>
                )}
              </div>

              {/* PDF upload */}
              <div>
                <label className="form-label">Documento PDF</label>
                <div className="flex gap-2 items-center">
                  <input ref={pdfRef} type="file" accept=".pdf" className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) handleFileUpload(f, 'pdf'); }} />
                  <button type="button" onClick={() => pdfRef.current?.click()}
                    disabled={uploadingFile === 'pdf'}
                    className="btn-secondary btn-sm shrink-0">
                    {uploadingFile === 'pdf'
                      ? <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</>
                      : <><Upload className="h-4 w-4" /> Subir PDF</>}
                  </button>
                  <input type="url" value={form.pdf_url}
                    onChange={e => setForm(p => ({ ...p, pdf_url: e.target.value }))}
                    className="form-input flex-1 text-sm" placeholder="O pega la URL del PDF" />
                </div>
                {form.pdf_url && (
                  <p className="text-xs text-green-700 mt-1 truncate">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    {form.pdf_url}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_published" checked={form.is_published}
                  onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                <label htmlFor="is_published" className="text-sm text-slate-700 font-medium">
                  Publicado (visible en el sitio)
                </label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</> : <><Save className="h-4 w-4" /> Guardar</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents list */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          Cargando documentos…
        </div>
      ) : documents.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <FileText className="h-14 w-14 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No hay documentos. Crea el primero.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Título</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Dimensión</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900 line-clamp-1 max-w-xs">{doc.title}</div>
                    <div className="text-xs text-slate-400 line-clamp-1 mt-0.5">{doc.description}</div>
                  </td>
                  <td className="px-4 py-4 text-slate-600 hidden lg:table-cell">
                    <span className="line-clamp-1 max-w-[160px]">{dimName(doc.dimension_id)}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 hidden md:table-cell">
                    <span className="badge-brand text-xs">{doc.document_type}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 hidden md:table-cell">
                    {new Date(doc.publication_date).toLocaleDateString('es-GT')}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => togglePublished(doc)}
                      title={doc.is_published ? 'Publicado — clic para despublicar' : 'No publicado — clic para publicar'}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        doc.is_published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {doc.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {doc.is_published ? 'Publicado' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(doc)}
                        className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(doc)}
                        disabled={deleting === doc.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        {deleting === doc.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDocuments;
