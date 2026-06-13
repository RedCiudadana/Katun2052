import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, Send, CheckCircle, Heart, TrendingUp, Leaf, Map, Shield, ChevronDown, BookOpen, ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react';
import { dimensionService, Dimension, DimensionArticle, DimensionComment } from '../services/dimensionService';

const iconMap: Record<string, React.ComponentType<any>> = {
  'heart': Heart,
  'trending-up': TrendingUp,
  'leaf': Leaf,
  'map': Map,
  'shield': Shield
};

const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
  'blue':    { bg: 'bg-blue-50',    text: 'text-blue-900',    accent: 'bg-blue-500' },
  'green':   { bg: 'bg-green-50',   text: 'text-green-900',   accent: 'bg-green-500' },
  'emerald': { bg: 'bg-emerald-50', text: 'text-emerald-900', accent: 'bg-emerald-500' },
  'teal':    { bg: 'bg-teal-50',    text: 'text-teal-900',    accent: 'bg-teal-500' },
  'amber':   { bg: 'bg-amber-50',   text: 'text-amber-900',   accent: 'bg-amber-500' },
  'orange':  { bg: 'bg-orange-50',  text: 'text-orange-900',  accent: 'bg-orange-500' },
  'red':     { bg: 'bg-red-50',     text: 'text-red-900',     accent: 'bg-red-500' },
};

function PdfBookViewer({ url, title }: { url: string; title: string }) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [inputPage, setInputPage] = useState('1');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Build URL with page fragment for browsers that support it
  const pdfSrc = `${url}#page=${page}&toolbar=1&navpanes=0&scrollbar=1&view=FitH`;

  const go = (n: number) => {
    const next = Math.max(1, totalPages ? Math.min(n, totalPages) : n);
    setPage(next);
    setInputPage(String(next));
  };

  const handleInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const n = parseInt(inputPage, 10);
      if (!isNaN(n)) go(n);
    }
  };

  return (
    <div className={`${fullscreen ? 'fixed inset-0 z-50 bg-slate-900 flex flex-col' : 'relative'}`}>
      {/* Toolbar */}
      <div className={`flex items-center gap-3 px-5 py-3 ${fullscreen ? 'bg-slate-800 text-white' : 'bg-slate-900 text-white rounded-t-2xl'}`}>
        <BookOpen className="h-4 w-4 text-brand-400 shrink-0" />
        <span className="text-sm font-semibold truncate flex-1">{title}</span>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Página anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5 text-xs">
            <input
              value={inputPage}
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={handleInputKey}
              onBlur={() => { const n = parseInt(inputPage, 10); if (!isNaN(n)) go(n); else setInputPage(String(page)); }}
              className="w-12 text-center bg-white/10 border border-white/20 rounded-lg py-1 px-1 text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
            />
            {totalPages && <span className="text-slate-400">/ {totalPages}</span>}
          </div>
          <button
            onClick={() => go(page + 1)}
            disabled={totalPages !== null && page >= totalPages}
            className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
            aria-label="Página siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <a
            href={url}
            download
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Descargar PDF"
          >
            <Download className="h-4 w-4" />
          </a>
          <button
            onClick={() => setFullscreen(f => !f)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label={fullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
          >
            {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* PDF iframe */}
      <div className={`${fullscreen ? 'flex-1' : 'h-[640px]'} bg-slate-700 ${!fullscreen ? 'rounded-b-2xl overflow-hidden' : ''}`}>
        <iframe
          ref={iframeRef}
          key={pdfSrc}
          src={pdfSrc}
          className="w-full h-full border-0"
          title={title}
          onLoad={() => {
            // Attempt to read page count via iframe contentWindow (only works same-origin)
            try {
              const win = iframeRef.current?.contentWindow as any;
              const count = win?.PDFViewerApplication?.pdfDocument?.numPages;
              if (count) setTotalPages(count);
            } catch {
              // cross-origin, skip
            }
          }}
        />
      </div>

      {/* Bottom page navigation bar (non-fullscreen only) */}
      {!fullscreen && (
        <div className="flex items-center justify-center gap-4 pt-4 pb-1">
          <button
            onClick={() => go(page - 1)}
            disabled={page <= 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-sm text-slate-500">
            Página {page}{totalPages ? ` de ${totalPages}` : ''}
          </span>
          <button
            onClick={() => go(page + 1)}
            disabled={totalPages !== null && page >= totalPages}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

const DimensionArticles = () => {
  const { slug } = useParams<{ slug: string }>();
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [articles, setArticles] = useState<DimensionArticle[]>([]);
  const [generalComments, setGeneralComments] = useState<DimensionComment[]>([]);
  const [articleComments, setArticleComments] = useState<Record<string, DimensionComment[]>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | string>('general');
  const [showCommentForm, setShowCommentForm] = useState<string | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    loadDimensionData();
  }, [slug]);

  const loadDimensionData = async () => {
    if (!slug) return;

    try {
      setLoading(true);
      const dimensionData = await dimensionService.getDimensionBySlug(slug);

      if (dimensionData) {
        setDimension(dimensionData);

        const articlesData = await dimensionService.getDimensionArticles(dimensionData.id);
        setArticles(articlesData);

        const generalCommentsData = await dimensionService.getGeneralComments(dimensionData.id);
        setGeneralComments(generalCommentsData);

        const generalCount = await dimensionService.getCommentCount(dimensionData.id);
        const counts: Record<string, number> = { general: generalCount };

        for (const article of articlesData) {
          const commentsData = await dimensionService.getArticleComments(article.id);
          setArticleComments(prev => ({ ...prev, [article.id]: commentsData }));

          const count = await dimensionService.getCommentCount(dimensionData.id, article.id);
          counts[article.id] = count;
        }

        setCommentCounts(counts);
      }
    } catch (error) {
      console.error('Error loading dimension:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent, articleId?: string) => {
    e.preventDefault();
    if (!dimension) return;

    try {
      setSubmitting(true);
      await dimensionService.submitComment(
        dimension.id,
        formData.name,
        formData.email,
        formData.comment,
        articleId
      );

      setSubmitSuccess(true);
      setFormData({ name: '', email: '', comment: '' });

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowCommentForm(null);
      }, 3000);

    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Hubo un error al enviar tu comentario. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!dimension) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Dimensión no encontrada</h2>
        <Link to="/" className="btn-primary btn-sm">Volver al inicio</Link>
      </div>
    </div>
  );

  const IconComponent = iconMap[dimension.icon] || FileText;
  const colors = colorMap[dimension.color] || colorMap.blue;
  const currentComments = activeTab === 'general' ? generalComments : articleComments[activeTab] || [];
  const currentArticle = articles.find(a => a.id === activeTab);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <Link to="/" className="inline-flex items-center gap-2 text-brand-200 hover:text-white text-sm font-medium mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shrink-0">
              <IconComponent className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{dimension.name}</h1>
              <p className="text-brand-100 text-base max-w-2xl">{dimension.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PDF Book Viewer */}
      <div className="container-wide py-8">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-brand-600" />
          <h2 className="text-lg font-bold text-slate-900">
            {dimension.pdf_title || 'Documento del Eje'}
          </h2>
        </div>
        {dimension.pdf_url ? (
          <PdfBookViewer
            url={dimension.pdf_url}
            title={dimension.pdf_title || dimension.name}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-slate-400" />
            </div>
            <div>
              <p className="font-semibold text-slate-700 mb-1">Documento no disponible aún</p>
              <p className="text-sm text-slate-400 max-w-xs">
                El administrador puede subir el PDF de este eje desde{' '}
                <span className="font-medium text-brand-600">Panel Admin → Ejes K'atun</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="container-wide py-6 sm:py-10">

        {/* Mobile section picker */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-700 shadow-soft"
          >
            <span>
              {activeTab === 'general'
                ? 'Vista General'
                : articles.find(a => a.id === activeTab)?.title ?? 'Seleccionar sección'}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`overflow-hidden transition-all duration-300 ${sidebarOpen ? 'max-h-[600px] mt-2' : 'max-h-0'}`}>
            <div className="bg-white border border-slate-200 rounded-2xl p-3 space-y-1">
              <button
                onClick={() => { setActiveTab('general'); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-3 rounded-xl transition-colors text-sm ${
                  activeTab === 'general' ? 'bg-brand-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Vista General</span>
                  <MessageSquare className="h-3.5 w-3.5 opacity-70" />
                </div>
                <div className="text-xs mt-0.5 opacity-70">{commentCounts.general || 0} comentarios</div>
              </button>
              {articles.map(article => (
                <button
                  key={article.id}
                  onClick={() => { setActiveTab(article.id); setSidebarOpen(false); }}
                  className={`w-full text-left px-3 py-3 rounded-xl transition-colors text-sm ${
                    activeTab === article.id ? 'bg-brand-700 text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium leading-snug">{article.title}</span>
                    <FileText className="h-3.5 w-3.5 shrink-0 opacity-70 mt-0.5" />
                  </div>
                  <div className="text-xs mt-0.5 opacity-70">{commentCounts[article.id] || 0} comentarios</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar — desktop only */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="card-flat border border-slate-200 bg-white p-4 sticky top-24">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-1">
                Contenido
              </h3>
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-colors text-sm ${
                  activeTab === 'general'
                    ? 'bg-brand-700 text-white shadow-soft'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Vista General</span>
                  <MessageSquare className="h-3.5 w-3.5 opacity-70" />
                </div>
                <div className="text-xs mt-0.5 opacity-70">{commentCounts.general || 0} comentarios</div>
              </button>
              {articles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setActiveTab(article.id)}
                  className={`w-full text-left px-3 py-3 rounded-xl mb-1 transition-colors text-sm ${
                    activeTab === article.id
                      ? 'bg-brand-700 text-white shadow-soft'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium leading-snug">{article.title}</span>
                    <FileText className="h-3.5 w-3.5 shrink-0 opacity-70 mt-0.5" />
                  </div>
                  <div className="text-xs mt-0.5 opacity-70">{commentCounts[article.id] || 0} comentarios</div>
                </button>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-5">
            <div className="card bg-white p-6 sm:p-8">
              {activeTab === 'general' ? (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Comentarios Generales</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-0">
                    Comparte tu opinión general sobre esta dimensión del K'atun 2032.
                    Tus aportes son fundamentales para el Plan Nacional de Desarrollo.
                  </p>
                </>
              ) : currentArticle ? (
                <>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">{currentArticle.title}</h2>
                  <div className="article-content text-slate-700 whitespace-pre-line mb-0">
                    {currentArticle.content}
                  </div>
                </>
              ) : null}

              <div className="border-t border-slate-100 mt-6 pt-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    Comentarios <span className="text-slate-400 font-normal text-base">({currentComments.length})</span>
                  </h3>
                  <button
                    onClick={() => setShowCommentForm(showCommentForm === activeTab ? null : activeTab)}
                    className="btn-primary btn-sm"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Agregar Comentario
                  </button>
                </div>

                {showCommentForm === activeTab && (
                  <div className="bg-brand-50 border border-brand-200 rounded-2xl p-5 sm:p-6 mb-5">
                    {submitSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-slate-900 mb-1">¡Comentario enviado!</h3>
                        <p className="text-slate-500 text-sm">Tu comentario está pendiente de aprobación.</p>
                      </div>
                    ) : (
                      <form onSubmit={e => handleSubmitComment(e, activeTab === 'general' ? undefined : activeTab)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="form-label">Nombre completo *</label>
                            <input
                              type="text" required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              className="form-input"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="form-label">Correo electrónico *</label>
                            <input
                              type="email" required
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              className="form-input"
                              placeholder="tu@email.com"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="form-label">Tu comentario *</label>
                          <textarea
                            required
                            value={formData.comment}
                            onChange={e => setFormData({ ...formData, comment: e.target.value })}
                            rows={4} minLength={10}
                            className="form-input resize-none"
                            placeholder="Comparte tu opinión, sugerencia o aporte…"
                          />
                          <p className="text-xs text-slate-400 mt-1">Mínimo 10 caracteres</p>
                        </div>
                        <div className="flex gap-3">
                          <button type="submit" disabled={submitting} className="btn-primary btn-sm">
                            <Send className="h-4 w-4" />
                            {submitting ? 'Enviando…' : 'Enviar Comentario'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCommentForm(null)}
                            className="btn-ghost btn-sm"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                <div className="space-y-3">
                  {currentComments.length === 0 ? (
                    <div className="text-center py-14 text-slate-400">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-25" />
                      <p className="text-sm">Aún no hay comentarios. ¡Sé el primero en participar!</p>
                    </div>
                  ) : currentComments.map(comment => (
                    <div key={comment.id} className="card-flat border border-slate-200 p-5 bg-white rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-brand-700 text-white font-bold flex items-center justify-center shrink-0 text-sm">
                          {comment.author_name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-slate-900 text-sm">{comment.author_name}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(comment.created_at).toLocaleDateString('es-GT', {
                                year: 'numeric', month: 'long', day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default DimensionArticles;
