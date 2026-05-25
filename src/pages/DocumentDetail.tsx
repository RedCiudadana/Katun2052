import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, FileText, Download, Calendar, MessageSquare,
  Send, CheckCircle, User, Loader2, ThumbsUp, Clock
} from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Document, Feedback, ACTOR_TYPES } from '../types/katun';
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

const DocumentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<Document | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [userLikes, setUserLikes] = useState<string[]>([]);

  const [form, setForm] = useState({
    author_name: '',
    author_email: '',
    actor_type: 'Ciudadano' as typeof ACTOR_LIST[number],
    content: '',
  });

  const userId = getUserId();

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        setLoading(true);
        const [doc, fb, likes] = await Promise.all([
          katunService.getDocumentById(id),
          katunService.getFeedback({ documentId: id }),
          katunService.getUserLikes(userId),
        ]);
        setDocument(doc);
        setFeedback(fb);
        setUserLikes(likes);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!document) return;

    try {
      setSubmitting(true);
      await katunService.submitFeedback({
        document_id: document.id,
        dimension_id: document.dimension_id,
        author_name: form.author_name,
        author_email: form.author_email,
        actor_type: form.actor_type,
        content: form.content,
        is_general: true,
      });
      setSubmitSuccess(true);
      setForm({ author_name: '', author_email: '', actor_type: 'Ciudadano', content: '' });
      // Reload feedback list
      const updated = await katunService.getFeedback({ documentId: document.id });
      setFeedback(updated);
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error al enviar el comentario. Por favor intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (feedbackId: string) => {
    if (!supabase) return;
    const hasLiked = userLikes.includes(feedbackId);
    try {
      if (hasLiked) {
        await katunService.unlikeFeedback(feedbackId, userId);
        setUserLikes(prev => prev.filter(l => l !== feedbackId));
        setFeedback(prev => prev.map(f =>
          f.id === feedbackId ? { ...f, like_count: (f.like_count || 1) - 1 } : f
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
                  <span className="badge bg-white/15 text-white/90 text-xs">
                    v{document.version}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-snug max-w-3xl">
                  {document.title}
                </h1>
                <div className="flex items-center gap-2 text-brand-200 text-sm">
                  <Calendar className="h-4 w-4" />
                  {new Date(document.publication_date).toLocaleDateString('es-GT', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-4">
            <AnimatedSection>
              <div className="card bg-white p-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Sobre este documento
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{document.description}</p>
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5" />
                    Publicado: {new Date(document.publication_date).toLocaleDateString('es-GT')}
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {feedback.length} comentario{feedback.length !== 1 ? 's' : ''}
                  </div>
                </div>
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

          {/* Main */}
          <main className="lg:col-span-2 space-y-6">

            {/* Comment form */}
            <AnimatedSection>
              <div className="card bg-white p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-brand-600" />
                  Deja tu comentario
                </h2>
                <p className="text-sm text-slate-500 mb-5">
                  Tu opinión ayuda a construir un mejor Plan Nacional de Desarrollo.
                </p>

                {submitSuccess ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-900 mb-1">¡Comentario enviado!</h3>
                    <p className="text-slate-500 text-sm">Gracias por tu participación.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">
                          <User className="h-3.5 w-3.5 inline mr-1" />
                          Nombre completo *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.author_name}
                          onChange={e => setForm(p => ({ ...p, author_name: e.target.value }))}
                          className="form-input"
                          placeholder="Tu nombre"
                          disabled={submitting}
                        />
                      </div>
                      <div>
                        <label className="form-label">Correo electrónico</label>
                        <input
                          type="email"
                          value={form.author_email}
                          onChange={e => setForm(p => ({ ...p, author_email: e.target.value }))}
                          className="form-input"
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
                        className="form-input"
                        disabled={submitting}
                      >
                        {ACTOR_LIST.map(a => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="form-label">Tu comentario *</label>
                      <textarea
                        required
                        minLength={10}
                        rows={4}
                        value={form.content}
                        onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                        className="form-input resize-none"
                        placeholder="Comparte tu opinión, sugerencia o aporte sobre este documento…"
                        disabled={submitting}
                      />
                      <p className="text-xs text-slate-400 mt-1">Mínimo 10 caracteres</p>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting || form.content.length < 10 || !form.author_name.trim()}
                      className="btn-primary btn-sm"
                    >
                      {submitting ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Enviando…</>
                      ) : (
                        <><Send className="h-4 w-4" /> Enviar Comentario</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Comments list */}
            <AnimatedSection delay={100}>
              <div className="card bg-white p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-5">
                  Comentarios{' '}
                  <span className="text-slate-400 font-normal text-base">({feedback.length})</span>
                </h2>

                {feedback.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-25" />
                    <p className="text-sm">Aún no hay comentarios. ¡Sé el primero en participar!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {feedback.map(item => (
                      <div
                        key={item.id}
                        className="border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-brand-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                              {(item.author_name || 'A').charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-900">
                                {item.author_name || 'Anónimo'}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">
                                  {new Date(item.created_at).toLocaleDateString('es-GT', {
                                    year: 'numeric', month: 'short', day: 'numeric',
                                  })}
                                </span>
                                <span className="badge-brand text-xs">{item.actor_type}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed mb-3">
                          {item.content}
                        </p>
                        <button
                          onClick={() => handleLike(item.id)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full transition-colors ${
                            userLikes.includes(item.id)
                              ? 'bg-brand-100 text-brand-700'
                              : 'text-slate-400 hover:text-brand-600 hover:bg-brand-50'
                          }`}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          {item.like_count || 0}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </AnimatedSection>
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
