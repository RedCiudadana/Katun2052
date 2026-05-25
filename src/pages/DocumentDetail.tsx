import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Download, Calendar, MessageSquare,
  Send, CheckCircle, User, Loader2, ThumbsUp, Clock, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Document, Feedback, DocumentSection } from '../types/katun';
import { ACTOR_TYPES as ACTOR_LIST } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';
import { supabase } from '../lib/supabase';

const getUserId = () => {
  let id = localStorage.getItem('user_identifier');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    localStorage.setItem('user_identifier', id);
  }
  return id;
};

interface CommentFormState {
  author_name: string;
  author_email: string;
  actor_type: typeof ACTOR_LIST[number];
  content: string;
}

const emptyForm = (): CommentFormState => ({
  author_name: '',
  author_email: '',
  actor_type: 'Ciudadano',
  content: '',
});

interface InlineFormProps {
  sectionId: string | null; // null = general
  onClose: () => void;
  onSubmitted: (sectionId: string | null) => void;
  documentId: string;
  dimensionId: string;
}

const InlineCommentForm: React.FC<InlineFormProps> = ({
  sectionId, onClose, onSubmitted, documentId, dimensionId
}) => {
  const [form, setForm] = useState<CommentFormState>(emptyForm());
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await katunService.submitFeedback({
        document_id: documentId,
        dimension_id: dimensionId,
        section_id: sectionId ?? undefined,
        author_name: form.author_name,
        author_email: form.author_email || undefined,
        actor_type: form.actor_type,
        content: form.content,
        is_general: sectionId === null,
      });
      setSuccess(true);
      setTimeout(() => {
        onSubmitted(sectionId);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
      alert('Error al enviar el comentario. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center py-6 text-center">
        <CheckCircle className="h-10 w-10 text-green-500 mb-2" />
        <p className="font-semibold text-slate-800">¡Comentario enviado!</p>
        <p className="text-sm text-slate-500">Gracias por tu participación.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="form-label">
            <User className="h-3 w-3 inline mr-1" />
            Nombre *
          </label>
          <input
            type="text" required
            value={form.author_name}
            onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
            className="form-input text-sm"
            placeholder="Tu nombre"
            disabled={submitting}
          />
        </div>
        <div>
          <label className="form-label">Correo (opcional)</label>
          <input
            type="email"
            value={form.author_email}
            onChange={e => setForm(p => ({ ...p, author_email: e.target.value }))}
            className="form-input text-sm"
            placeholder="tu@email.com"
            disabled={submitting}
          />
        </div>
      </div>
      <div>
        <label className="form-label">Tipo de actor *</label>
        <select
          required
          value={form.actor_type}
          onChange={e => setForm(p => ({ ...p, actor_type: e.target.value as any }))}
          className="form-input text-sm"
          disabled={submitting}
        >
          {ACTOR_LIST.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div>
        <label className="form-label">Tu comentario *</label>
        <textarea
          required minLength={10} rows={3}
          value={form.content}
          onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
          className="form-input text-sm resize-none"
          placeholder="Escribe tu opinión, sugerencia o aporte…"
          disabled={submitting}
        />
        <p className="text-xs text-slate-400 mt-0.5">Mínimo 10 caracteres</p>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || form.content.length < 10 || !form.author_name.trim()}
          className="btn-primary btn-sm"
        >
          {submitting
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</>
            : <><Send className="h-4 w-4" /> Enviar</>}
        </button>
        <button type="button" onClick={onClose} className="btn-ghost btn-sm">
          <X className="h-4 w-4" />
          Cancelar
        </button>
      </div>
    </form>
  );
};

interface SectionProps {
  section: DocumentSection;
  feedback: Feedback[];
  userLikes: string[];
  onLike: (id: string) => void;
}

const SectionBlock: React.FC<SectionProps & {
  documentId: string;
  dimensionId: string;
  onCommentAdded: () => void;
}> = ({ section, feedback, userLikes, onLike, documentId, dimensionId, onCommentAdded }) => {
  const [showForm, setShowForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const count = feedback.length;

  return (
    <div className="group border border-slate-100 rounded-2xl bg-white hover:border-brand-200 transition-colors overflow-hidden">
      {/* Paragraph content */}
      <div className="p-5 sm:p-6">
        <h3 className="text-base font-bold text-slate-800 mb-2">{section.title}</h3>
        <p className="text-slate-700 text-sm leading-relaxed">{section.content}</p>
      </div>

      {/* Section footer */}
      <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => { setShowForm(v => !v); setShowComments(false); }}
          className="btn-primary btn-sm"
        >
          <MessageSquare className="h-3.5 w-3.5" />
          Comentar este párrafo
        </button>
        {count > 0 && (
          <button
            onClick={() => { setShowComments(v => !v); setShowForm(false); }}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-700 transition-colors"
          >
            {showComments ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            {count} comentario{count !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      {/* Inline comment form */}
      {showForm && (
        <div className="border-t border-brand-100 bg-brand-50 p-5 sm:p-6">
          <p className="text-xs font-semibold text-brand-700 uppercase tracking-wider mb-3">
            Comentando: {section.title}
          </p>
          <InlineCommentForm
            sectionId={section.id}
            documentId={documentId}
            dimensionId={dimensionId}
            onClose={() => setShowForm(false)}
            onSubmitted={() => { onCommentAdded(); setShowComments(true); }}
          />
        </div>
      )}

      {/* Comments list */}
      {showComments && count > 0 && (
        <div className="border-t border-slate-100 divide-y divide-slate-50">
          {feedback.map(item => (
            <div key={item.id} className="px-5 py-4 flex gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                {(item.author_name || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-semibold text-slate-900">
                    {item.author_name || 'Anónimo'}
                  </span>
                  <span className="badge-brand text-xs">{item.actor_type}</span>
                  <span className="text-xs text-slate-400">
                    {new Date(item.created_at).toLocaleDateString('es-GT', {
                      year: 'numeric', month: 'short', day: 'numeric',
                    })}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
                <button
                  onClick={() => onLike(item.id)}
                  className={`mt-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                    userLikes.includes(item.id)
                      ? 'bg-brand-100 text-brand-700'
                      : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'
                  }`}
                >
                  <ThumbsUp className="h-3 w-3" />
                  {item.like_count || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [showGeneralComments, setShowGeneralComments] = useState(false);

  const userId = getUserId();

  const loadData = async (docId: string) => {
    const [doc, fb, likes] = await Promise.all([
      katunService.getDocumentById(docId),
      katunService.getFeedback({ documentId: docId }),
      katunService.getUserLikes(userId),
    ]);
    setDocument(doc);
    setFeedback(fb);
    setUserLikes(likes);
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    loadData(id).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  const handleLike = async (feedbackId: string) => {
    if (!supabase) return;
    const hasLiked = userLikes.includes(feedbackId);
    try {
      if (hasLiked) {
        await katunService.unlikeFeedback(feedbackId, userId);
        setUserLikes(prev => prev.filter(l => l !== feedbackId));
        setFeedback(prev => prev.map(f =>
          f.id === feedbackId ? { ...f, like_count: Math.max((f.like_count || 1) - 1, 0) } : f
        ));
      } else {
        await katunService.likeFeedback(feedbackId, userId);
        setUserLikes(prev => [...prev, feedbackId]);
        setFeedback(prev => prev.map(f =>
          f.id === feedbackId ? { ...f, like_count: (f.like_count || 0) + 1 } : f
        ));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentAdded = () => {
    if (id) loadData(id).catch(console.error);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Cargando documento…</p>
      </div>
    </div>
  );

  if (!document) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <FileText className="h-16 w-16 text-slate-200 mx-auto" />
        <h2 className="text-2xl font-bold text-slate-900">Documento no encontrado</h2>
        <Link to="/documentos" className="btn-primary btn-sm">Volver a documentos</Link>
      </div>
    </div>
  );

  const sections: DocumentSection[] = Array.isArray(document.sections) ? document.sections : [];
  const generalFeedback = feedback.filter(f => f.is_general || !f.section_id);
  const feedbackBySection = (sectionId: string) =>
    feedback.filter(f => f.section_id === sectionId);
  const totalComments = feedback.length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <AnimatedSection>
            <Link
              to="/documentos"
              className="inline-flex items-center gap-2 text-brand-200 hover:text-white text-sm font-medium mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Todos los documentos
            </Link>
            <div className="flex items-start gap-5">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shrink-0">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="badge bg-white/15 text-white/90 text-xs uppercase tracking-wider">
                    {document.document_type}
                  </span>
                  <span className="badge bg-white/15 text-white/90 text-xs">v{document.version}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug max-w-3xl">
                  {document.title}
                </h1>
                <div className="flex items-center gap-4 text-brand-200 text-sm flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {new Date(document.publication_date).toLocaleDateString('es-GT', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4" />
                    {totalComments} comentario{totalComments !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* Sticky sidebar */}
          <aside className="lg:col-span-1">
            <AnimatedSection>
              <div className="card bg-white p-5 sticky top-24 space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Sobre este documento
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{document.description}</p>
                <div className="border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(document.publication_date).toLocaleDateString('es-GT')}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {totalComments} comentario{totalComments !== 1 ? 's' : ''} en total
                  </div>
                </div>

                {/* Section quick-nav */}
                {sections.length > 0 && (
                  <div className="border-t border-slate-100 pt-3">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Secciones
                    </p>
                    <ul className="space-y-1">
                      {sections.map(s => (
                        <li key={s.id}>
                          <a
                            href={`#section-${s.id}`}
                            className="text-xs text-slate-600 hover:text-brand-700 transition-colors block py-0.5 leading-snug"
                          >
                            {s.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {document.pdf_url && (
                  <a
                    href={document.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary btn-sm w-full justify-center"
                  >
                    <Download className="h-4 w-4" />
                    Descargar PDF
                  </a>
                )}
              </div>
            </AnimatedSection>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3 space-y-4">

            {/* General comment block */}
            <AnimatedSection>
              <div className="card bg-white overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-brand-600" />
                      Comentario general del documento
                    </h2>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Comparte tu opinión sobre el documento completo
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {generalFeedback.length > 0 && (
                      <button
                        onClick={() => { setShowGeneralComments(v => !v); setShowGeneralForm(false); }}
                        className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-700 transition-colors"
                      >
                        {showGeneralComments ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        {generalFeedback.length} comentario{generalFeedback.length !== 1 ? 's' : ''}
                      </button>
                    )}
                    <button
                      onClick={() => { setShowGeneralForm(v => !v); setShowGeneralComments(false); }}
                      className="btn-primary btn-sm"
                    >
                      <MessageSquare className="h-3.5 w-3.5" />
                      Comentar
                    </button>
                  </div>
                </div>

                {showGeneralForm && (
                  <div className="bg-brand-50 border-b border-brand-100 p-5 sm:p-6">
                    <InlineCommentForm
                      sectionId={null}
                      documentId={document.id}
                      dimensionId={document.dimension_id}
                      onClose={() => setShowGeneralForm(false)}
                      onSubmitted={() => { handleCommentAdded(); setShowGeneralComments(true); }}
                    />
                  </div>
                )}

                {showGeneralComments && generalFeedback.length > 0 && (
                  <div className="divide-y divide-slate-50">
                    {generalFeedback.map(item => (
                      <div key={item.id} className="px-5 py-4 flex gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {(item.author_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-xs font-semibold text-slate-900">
                              {item.author_name || 'Anónimo'}
                            </span>
                            <span className="badge-brand text-xs">{item.actor_type}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(item.created_at).toLocaleDateString('es-GT', {
                                year: 'numeric', month: 'short', day: 'numeric',
                              })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 leading-relaxed">{item.content}</p>
                          <button
                            onClick={() => handleLike(item.id)}
                            className={`mt-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${
                              userLikes.includes(item.id)
                                ? 'bg-brand-100 text-brand-700'
                                : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'
                            }`}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {item.like_count || 0}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>

            {/* Paragraph sections */}
            {sections.length > 0 && (
              <>
                <AnimatedSection delay={80}>
                  <div className="flex items-center gap-3 px-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                      Contenido del documento
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                </AnimatedSection>

                {sections.map((section, i) => (
                  <AnimatedSection key={section.id} delay={i * 60 + 120}>
                    <div id={`section-${section.id}`}>
                      <SectionBlock
                        section={section}
                        feedback={feedbackBySection(section.id)}
                        userLikes={userLikes}
                        onLike={handleLike}
                        documentId={document.id}
                        dimensionId={document.dimension_id}
                        onCommentAdded={handleCommentAdded}
                      />
                    </div>
                  </AnimatedSection>
                ))}
              </>
            )}
          </main>
        </div>

        <div className="mt-12">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
