import { useEffect, useState, useRef } from 'react';
import {
  Plus, Pencil, Trash2, Newspaper, Upload, X, Save,
  Loader2, CheckCircle, AlertTriangle, Eye, EyeOff, Star, Image, Tag,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { PressPost } from '../SalaDePrensaPage';

const CATEGORIES = ['noticia', 'blog', 'comunicado', 'evento'];
const CATEGORY_LABELS: Record<string, string> = {
  noticia: 'Noticia', blog: 'Blog', comunicado: 'Comunicado', evento: 'Evento',
};

type PostForm = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  author_name: string;
  published_at: string;
  is_published: boolean;
  is_featured: boolean;
  tags: string;
};

const emptyForm = (): PostForm => ({
  title: '',
  slug: '',
  category: 'noticia',
  excerpt: '',
  content: '',
  cover_image_url: '',
  author_name: 'SEGEPLAN',
  published_at: new Date().toISOString().split('T')[0],
  is_published: false,
  is_featured: false,
  tags: '',
});

const toSlug = (text: string) =>
  text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const AdminPress = () => {
  const [posts, setPosts] = useState<PressPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PressPost | null>(null);
  const [form, setForm] = useState<PostForm>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const imgRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const load = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from('press_posts')
      .select('*')
      .order('published_at', { ascending: false });
    setPosts((data as PressPost[]) || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setShowForm(true);
  };

  const openEdit = (post: PressPost) => {
    setEditing(post);
    setForm({
      title: post.title,
      slug: post.slug,
      category: post.category,
      excerpt: post.excerpt,
      content: post.content,
      cover_image_url: post.cover_image_url || '',
      author_name: post.author_name,
      published_at: post.published_at,
      is_published: post.is_published,
      is_featured: post.is_featured,
      tags: post.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleTitleChange = (title: string) => {
    setForm(p => ({
      ...p,
      title,
      slug: editing ? p.slug : toSlug(title),
    }));
  };

  const handleImageUpload = async (file: File) => {
    if (!supabase) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `press/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('documents').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('documents').getPublicUrl(path);
      setForm(p => ({ ...p, cover_image_url: urlData.publicUrl }));
      showToast('Imagen subida correctamente');
    } catch (err: any) {
      showToast(err.message || 'Error al subir la imagen', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setSaving(true);
    try {
      const tags = form.tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const payload = {
        title: form.title,
        slug: form.slug || toSlug(form.title),
        category: form.category,
        excerpt: form.excerpt,
        content: form.content,
        cover_image_url: form.cover_image_url || null,
        author_name: form.author_name,
        published_at: form.published_at,
        is_published: form.is_published,
        is_featured: form.is_featured,
        tags,
        updated_at: new Date().toISOString(),
      };

      if (editing) {
        const { error } = await supabase.from('press_posts').update(payload).eq('id', editing.id);
        if (error) throw error;
        showToast('Publicación actualizada');
      } else {
        const { error } = await supabase.from('press_posts').insert([payload]);
        if (error) throw error;
        showToast('Publicación creada');
      }
      setShowForm(false);
      await load();
    } catch (err: any) {
      showToast(err.message || 'Error al guardar', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: PressPost) => {
    if (!confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
    if (!supabase) return;
    setDeleting(post.id);
    try {
      const { error } = await supabase.from('press_posts').delete().eq('id', post.id);
      if (error) throw error;
      showToast('Publicación eliminada');
      await load();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const togglePublished = async (post: PressPost) => {
    if (!supabase) return;
    await supabase
      .from('press_posts')
      .update({ is_published: !post.is_published, updated_at: new Date().toISOString() })
      .eq('id', post.id);
    await load();
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('es-GT', { year: 'numeric', month: 'short', day: 'numeric' });

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
          <h2 className="text-2xl font-bold text-slate-900">Sala de Prensa</h2>
          <p className="text-slate-500 text-sm mt-1">{posts.length} publicación{posts.length !== 1 ? 'es' : ''} en total</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> Nueva publicación
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-start justify-center overflow-y-auto py-10 px-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {editing ? 'Editar publicación' : 'Nueva publicación'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Cover image */}
              <div>
                <label className="form-label">Imagen de portada</label>
                <div className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex gap-2 items-center">
                      <input ref={imgRef} type="file" accept="image/*" className="hidden"
                        onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f); }} />
                      <button type="button" onClick={() => imgRef.current?.click()}
                        disabled={uploading}
                        className="btn-secondary btn-sm shrink-0">
                        {uploading
                          ? <><Loader2 className="h-4 w-4 animate-spin" /> Subiendo…</>
                          : <><Image className="h-4 w-4" /> Subir imagen</>}
                      </button>
                      <input type="url" value={form.cover_image_url}
                        onChange={e => setForm(p => ({ ...p, cover_image_url: e.target.value }))}
                        className="form-input flex-1 text-sm" placeholder="O pega la URL de la imagen" />
                    </div>
                    {form.cover_image_url && (
                      <p className="text-xs text-green-700 truncate">
                        <CheckCircle className="h-3 w-3 inline mr-1" />{form.cover_image_url}
                      </p>
                    )}
                  </div>
                  {form.cover_image_url && (
                    <div className="relative shrink-0">
                      <img src={form.cover_image_url} alt="Preview"
                        className="w-24 h-16 object-cover rounded-lg border border-slate-200" />
                      <button type="button"
                        onClick={() => setForm(p => ({ ...p, cover_image_url: '' }))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="form-label">Título *</label>
                <input type="text" required value={form.title}
                  onChange={e => handleTitleChange(e.target.value)}
                  className="form-input" placeholder="Título de la publicación" />
              </div>

              {/* Slug */}
              <div>
                <label className="form-label">Slug (URL) *</label>
                <input type="text" required value={form.slug}
                  onChange={e => setForm(p => ({ ...p, slug: toSlug(e.target.value) }))}
                  className="form-input font-mono text-sm" placeholder="url-de-la-publicacion" />
                <p className="text-xs text-slate-400 mt-1">
                  URL: /sala-de-prensa/<span className="text-brand-600">{form.slug || '…'}</span>
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <label className="form-label">Resumen *</label>
                <textarea required rows={2} value={form.excerpt}
                  onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  className="form-input resize-none" placeholder="Resumen breve visible en la lista de publicaciones" />
              </div>

              {/* Content */}
              <div>
                <label className="form-label">Contenido *</label>
                <textarea required rows={10} value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  className="form-input resize-y font-mono text-sm leading-relaxed"
                  placeholder="Contenido completo del artículo. Puedes usar HTML básico o texto plano." />
              </div>

              {/* Category + Author + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Categoría</label>
                  <select value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="form-input">
                    {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="form-label">Autor</label>
                  <input type="text" value={form.author_name}
                    onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
                    className="form-input" placeholder="Nombre del autor" />
                </div>
                <div>
                  <label className="form-label">Fecha</label>
                  <input type="date" value={form.published_at}
                    onChange={e => setForm(p => ({ ...p, published_at: e.target.value }))}
                    className="form-input" />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="form-label flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5" /> Etiquetas
                </label>
                <input type="text" value={form.tags}
                  onChange={e => setForm(p => ({ ...p, tags: e.target.value }))}
                  className="form-input" placeholder="participación, Guatemala, K'atun (separadas por comas)" />
              </div>

              {/* Flags */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pp_published" checked={form.is_published}
                    onChange={e => setForm(p => ({ ...p, is_published: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600" />
                  <label htmlFor="pp_published" className="text-sm text-slate-700 font-medium flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-slate-400" /> Publicado
                  </label>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="pp_featured" checked={form.is_featured}
                    onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-amber-500" />
                  <label htmlFor="pp_featured" className="text-sm text-slate-700 font-medium flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 text-amber-500" /> Destacado
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary">
                  {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Guardando…</> : <><Save className="h-4 w-4" /> Guardar</>}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-ghost">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
          Cargando publicaciones…
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center">
          <Newspaper className="h-14 w-14 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No hay publicaciones. Crea la primera.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-5 py-3 font-semibold text-slate-600">Publicación</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600 hidden lg:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-semibold text-slate-600">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {posts.map(post => (
                <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {post.cover_image_url ? (
                        <img src={post.cover_image_url} alt=""
                          className="w-14 h-10 object-cover rounded-lg border border-slate-200 shrink-0" />
                      ) : (
                        <div className="w-14 h-10 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center shrink-0">
                          <Newspaper className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-slate-900 line-clamp-1 max-w-[220px]">{post.title}</span>
                          {post.is_featured && <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" fill="currentColor" />}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1">{post.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell">
                    <span className="badge-brand text-xs capitalize">{CATEGORY_LABELS[post.category] ?? post.category}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500 hidden lg:table-cell">
                    {formatDate(post.published_at)}
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => togglePublished(post)}
                      title={post.is_published ? 'Publicado — clic para ocultar' : 'Oculto — clic para publicar'}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                        post.is_published
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {post.is_published ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      {post.is_published ? 'Publicado' : 'Oculto'}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => openEdit(post)}
                        className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(post)}
                        disabled={deleting === post.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        {deleting === post.id
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

export default AdminPress;
