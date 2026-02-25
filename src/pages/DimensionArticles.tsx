import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, FileText, Send, CheckCircle, Heart, TrendingUp, Leaf, Map, Shield } from 'lucide-react';
import { dimensionService, Dimension, DimensionArticle, DimensionComment } from '../services/dimensionService';

const iconMap: Record<string, React.ComponentType<any>> = {
  'heart': Heart,
  'trending-up': TrendingUp,
  'leaf': Leaf,
  'map': Map,
  'shield': Shield
};

const colorMap: Record<string, { bg: string; text: string; accent: string }> = {
  'blue': { bg: 'bg-blue-50', text: 'text-blue-900', accent: 'bg-blue-500' },
  'green': { bg: 'bg-green-50', text: 'text-green-900', accent: 'bg-green-500' },
  'emerald': { bg: 'bg-emerald-50', text: 'text-emerald-900', accent: 'bg-emerald-500' },
  'orange': { bg: 'bg-orange-50', text: 'text-orange-900', accent: 'bg-orange-500' },
  'red': { bg: 'bg-red-50', text: 'text-red-900', accent: 'bg-red-500' }
};

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!dimension) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dimensión no encontrada</h2>
          <Link to="/" className="text-blue-600 hover:underline">Volver al inicio</Link>
        </div>
      </div>
    );
  }

  const IconComponent = iconMap[dimension.icon] || FileText;
  const colors = colorMap[dimension.color] || colorMap.blue;

  const currentComments = activeTab === 'general'
    ? generalComments
    : articleComments[activeTab] || [];

  const currentArticle = articles.find(a => a.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${colors.bg} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/"
            className={`inline-flex items-center ${colors.text} hover:underline mb-6`}
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>

          <div className="flex items-start gap-6">
            <div className={`${colors.accent} p-4 rounded-2xl`}>
              <IconComponent className="h-12 w-12 text-white" />
            </div>

            <div className="flex-1">
              <h1 className={`text-4xl font-bold ${colors.text} mb-4`}>
                {dimension.name}
              </h1>
              <p className="text-xl text-gray-700 mb-4">{dimension.description}</p>
              <p className="text-lg text-gray-600">{dimension.full_description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Contenido</h3>

              <button
                onClick={() => setActiveTab('general')}
                className={`w-full text-left px-4 py-3 rounded-lg mb-2 transition-colors ${
                  activeTab === 'general'
                    ? `${colors.accent} text-white`
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">Vista General</span>
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="text-xs mt-1 opacity-80">
                  {commentCounts.general || 0} comentarios
                </div>
              </button>

              <div className="space-y-2">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setActiveTab(article.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === article.id
                        ? `${colors.accent} text-white`
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-medium">
                        {article.title}
                      </span>
                      <FileText className="h-4 w-4 flex-shrink-0" />
                    </div>
                    <div className="text-xs mt-1 opacity-80">
                      {commentCounts[article.id] || 0} comentarios
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
              {activeTab === 'general' ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Comentarios Generales
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Comparte tu opinión general sobre esta dimensión del K'atun 2052.
                    Tus aportes son fundamentales para la construcción participativa del Plan Nacional de Desarrollo.
                  </p>
                </div>
              ) : currentArticle ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {currentArticle.title}
                  </h2>
                  <div className="prose max-w-none text-gray-700 whitespace-pre-line mb-8">
                    {currentArticle.content}
                  </div>
                </div>
              ) : null}

              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">
                    Comentarios ({currentComments.length})
                  </h3>
                  <button
                    onClick={() => setShowCommentForm(showCommentForm === activeTab ? null : activeTab)}
                    className={`${colors.accent} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2`}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Agregar Comentario
                  </button>
                </div>

                {showCommentForm === activeTab && (
                  <div className={`${colors.bg} rounded-xl p-6 mb-6`}>
                    {submitSuccess ? (
                      <div className="text-center py-8">
                        <CheckCircle className={`h-16 w-16 ${colors.text} mx-auto mb-4`} />
                        <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
                          ¡Comentario enviado!
                        </h3>
                        <p className="text-gray-600">
                          Tu comentario está pendiente de aprobación y será visible pronto.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleSubmitComment(e, activeTab === 'general' ? undefined : activeTab)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Nombre completo *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correo electrónico *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="tu@email.com"
                            />
                          </div>
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tu comentario *
                          </label>
                          <textarea
                            required
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            rows={4}
                            minLength={10}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Comparte tu opinión, sugerencia o aporte..."
                          />
                          <p className="text-xs text-gray-500 mt-1">Mínimo 10 caracteres</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={submitting}
                            className={`${colors.accent} text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50`}
                          >
                            <Send className="h-4 w-4" />
                            {submitting ? 'Enviando...' : 'Enviar Comentario'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowCommentForm(null)}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                <div className="space-y-4">
                  {currentComments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Aún no hay comentarios. ¡Sé el primero en participar!</p>
                    </div>
                  ) : (
                    currentComments.map((comment) => (
                      <div key={comment.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                          <div className={`${colors.accent} w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}>
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {comment.author_name}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.created_at).toLocaleDateString('es-GT', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 whitespace-pre-line">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DimensionArticles;
