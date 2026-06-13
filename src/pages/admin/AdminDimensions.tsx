import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, Trash2, Eye, BookOpen, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';

interface DimensionRow {
  id: string;
  name: string;
  slug: string;
  color: string;
  order_index: number;
  pdf_url: string | null;
  pdf_title: string | null;
}

const COLOR_DOT: Record<string, string> = {
  blue: 'bg-blue-500', green: 'bg-green-500', emerald: 'bg-emerald-500',
  teal: 'bg-teal-500', amber: 'bg-amber-500', red: 'bg-red-500',
};

export default function AdminDimensions() {
  const [dimensions, setDimensions] = useState<DimensionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [titleDraft, setTitleDraft] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => { loadDimensions(); }, []);

  async function loadDimensions() {
    if (!supabase) return;
    const { data } = await supabase
      .from('dimensions')
      .select('id, name, slug, color, order_index, pdf_url, pdf_title')
      .order('order_index');
    setDimensions((data as DimensionRow[]) ?? []);
    setLoading(false);
  }

  function showToast(type: 'success' | 'error', msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleUpload(dimensionId: string, file: File) {
    if (!supabase) return;
    setUploading(dimensionId);
    try {
      const ext = file.name.split('.').pop();
      const path = `${dimensionId}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('dimension-pdfs')
        .upload(path, file, { upsert: true, contentType: 'application/pdf' });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('dimension-pdfs')
        .getPublicUrl(path);

      const { error: dbError } = await supabase
        .from('dimensions')
        .update({ pdf_url: urlData.publicUrl })
        .eq('id', dimensionId);
      if (dbError) throw dbError;

      setDimensions(prev =>
        prev.map(d => d.id === dimensionId ? { ...d, pdf_url: urlData.publicUrl } : d)
      );
      showToast('success', 'PDF subido correctamente.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Error al subir el PDF. Intenta de nuevo.');
    } finally {
      setUploading(null);
      if (fileRefs.current[dimensionId]) fileRefs.current[dimensionId]!.value = '';
    }
  }

  async function handleRemovePdf(dim: DimensionRow) {
    if (!supabase) return;
    if (!confirm(`¿Eliminar el PDF de "${dim.name}"?`)) return;
    setRemoving(dim.id);
    try {
      const ext = dim.pdf_url?.split('.').pop()?.split('?')[0];
      const path = `${dim.id}.${ext ?? 'pdf'}`;
      await supabase.storage.from('dimension-pdfs').remove([path]);

      const { error } = await supabase
        .from('dimensions')
        .update({ pdf_url: null, pdf_title: null })
        .eq('id', dim.id);
      if (error) throw error;

      setDimensions(prev =>
        prev.map(d => d.id === dim.id ? { ...d, pdf_url: null, pdf_title: null } : d)
      );
      showToast('success', 'PDF eliminado.');
    } catch (err) {
      console.error(err);
      showToast('error', 'Error al eliminar el PDF.');
    } finally {
      setRemoving(null);
    }
  }

  async function saveTitle(dimensionId: string) {
    if (!supabase) return;
    setSavingTitle(true);
    const { error } = await supabase
      .from('dimensions')
      .update({ pdf_title: titleDraft.trim() || null })
      .eq('id', dimensionId);
    if (!error) {
      setDimensions(prev =>
        prev.map(d => d.id === dimensionId ? { ...d, pdf_title: titleDraft.trim() || null } : d)
      );
      setEditingTitle(null);
      showToast('success', 'Título actualizado.');
    } else {
      showToast('error', 'Error al guardar el título.');
    }
    setSavingTitle(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Ejes K'atun — PDFs</h2>
        <p className="text-slate-500 text-sm mt-1">
          Sube el PDF de cada eje para mostrarlo como lector de documentos en la página pública.
        </p>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 text-sm font-medium ${
          toast.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      <div className="space-y-4">
        {dimensions.map(dim => (
          <div key={dim.id} className="bg-white border border-slate-200 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              {/* Color dot + name */}
              <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${COLOR_DOT[dim.color] ?? 'bg-slate-400'}`} />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">{dim.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">/dimension-articulos/{dim.slug}</p>

                {dim.pdf_url ? (
                  <div className="mt-4 space-y-3">
                    {/* Title editor */}
                    <div>
                      <label className="text-xs font-medium text-slate-500 block mb-1">Título del lector</label>
                      {editingTitle === dim.id ? (
                        <div className="flex gap-2">
                          <input
                            autoFocus
                            value={titleDraft}
                            onChange={e => setTitleDraft(e.target.value)}
                            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Ej: Plan K'atun — Bienestar para la Gente"
                          />
                          <button
                            onClick={() => saveTitle(dim.id)}
                            disabled={savingTitle}
                            className="px-4 py-2 bg-brand-700 text-white text-sm font-semibold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-50"
                          >
                            {savingTitle ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Guardar'}
                          </button>
                          <button
                            onClick={() => setEditingTitle(null)}
                            className="px-4 py-2 text-sm text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700">
                            {dim.pdf_title || <span className="text-slate-400 italic">Sin título</span>}
                          </span>
                          <button
                            onClick={() => { setEditingTitle(dim.id); setTitleDraft(dim.pdf_title ?? ''); }}
                            className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                          >
                            Editar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <a
                        href={dim.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-brand-700 border border-brand-200 bg-brand-50 rounded-xl hover:bg-brand-100 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                        Ver PDF
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <label className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 border border-slate-200 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer">
                        <Upload className="h-4 w-4" />
                        {uploading === dim.id ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</>
                        ) : 'Reemplazar PDF'}
                        <input
                          type="file"
                          accept="application/pdf"
                          className="hidden"
                          ref={el => { fileRefs.current[dim.id] = el; }}
                          onChange={e => {
                            const f = e.target.files?.[0];
                            if (f) handleUpload(dim.id, f);
                          }}
                        />
                      </label>

                      <button
                        onClick={() => handleRemovePdf(dim)}
                        disabled={removing === dim.id}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-xl hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {removing === dim.id
                          ? <Loader2 className="h-4 w-4 animate-spin" />
                          : <Trash2 className="h-4 w-4" />}
                        Eliminar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-700 hover:bg-brand-800 rounded-xl transition-colors cursor-pointer">
                      {uploading === dim.id ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</>
                      ) : (
                        <><BookOpen className="h-4 w-4" /> Subir PDF</>
                      )}
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        ref={el => { fileRefs.current[dim.id] = el; }}
                        onChange={e => {
                          const f = e.target.files?.[0];
                          if (f) handleUpload(dim.id, f);
                        }}
                        disabled={uploading === dim.id}
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-2">
                      Acepta PDF · máximo 100 MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
