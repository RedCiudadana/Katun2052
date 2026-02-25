import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, MessageSquare, Filter, Eye, EyeOff, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { getLawById } from '../data/laws';
import { useComments } from '../hooks/useComments';
import CommentSection from '../components/CommentSection';
import CommentForm from '../components/CommentForm';
import CommentStats from '../components/CommentStats';
import ReactMarkdown from 'react-markdown';

const LawDetail = () => {
  const { lawId } = useParams<{ lawId: string }>();
  const law = lawId ? getLawById(lawId) : null;
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'articles' | 'general'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingMatrix, setDownloadingMatrix] = useState(false);
  const [downloadingInitiative, setDownloadingInitiative] = useState(false);

  // Hooks for different comment sections
  const { addComment: addGeneralComment, loading: generalLoading } = useComments(lawId!, undefined, true);
  const { addComment: addArticleComment, loading: articleLoading } = useComments(lawId!, selectedArticle || undefined);

  // useEffect(() => {
  //   getLaws().then(laws => {
  //     const found = laws.find(l => l.id === lawId);
  //     setLaw(found || null);
  //     setLoading(false);
  //   });
  // }, [lawId]);

  if (!law) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Ley no encontrada</h1>
        <Link to="/" className="text-blue-600 hover:text-white mt-4 inline-block">
          Volver al inicio
        </Link>
      </div>
    );
  }

  const handleCommentSubmitted = () => {
    setShowCommentForm(false);
    setSelectedArticle(null);
  };

  const handleGeneralCommentSubmit = async (data: any) => {
    await addGeneralComment(data);
    handleCommentSubmitted();
  };

  const handleArticleCommentSubmit = async (data: any) => {
    await addArticleComment(data);
    handleCommentSubmitted();
  };

  // Group articles by title
  const getChapters = () => {
    if (!law) return [];

    const chapters = [
      {
        id: 'titulo-1',
        title: 'TÍTULO I – DISPOSICIONES GENERALES',
        articles: law.articles.filter((art: any) => art.titleId === 'titulo-1')
      },
      {
        id: 'titulo-2',
        title: 'TÍTULO II – PROCESO DE CONTRATACIÓN PÚBLICA',
        articles: law.articles.filter((art: any) => art.titleId === 'titulo-2')
      },
      {
        id: 'titulo-3',
        title: 'TÍTULO III – PROHIBICIONES, INFRACCIONES Y SANCIONES',
        articles: law.articles.filter((art: any) => art.titleId === 'titulo-3')
      },
      {
        id: 'titulo-4',
        title: 'TÍTULO IV – RESOLUCIÓN DE CONTROVERSIAS',
        articles: law.articles.filter((art: any) => art.titleId === 'titulo-4')
      },
      {
        id: 'titulo-5',
        title: 'TÍTULO V – OTROS TIPOS DE CONTRATACIÓN PÚBLICA',
        articles: law.articles.filter((art: any) => art.titleId === 'titulo-5')
      }
    ];

    return chapters;
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const selectChapter = (chapterId: string) => {
    setSelectedChapter(selectedChapter === chapterId ? null : chapterId);
    setSelectedArticle(null);
    setShowCommentForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to="/"
          className="inline-flex items-center text-blue-800 hover:text-blue-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a iniciativas
        </Link>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{law.title}</h1>
          <p className="text-lg text-gray-700 mb-6">{law.fullDescription}</p>

          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <a
              href={law.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={() => {
                setDownloadingPdf(true);
                window.setTimeout(() => setDownloadingPdf(false), 6000);
              }}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors text-white ${
                downloadingPdf ? 'bg-blue-700 cursor-wait' : 'bg-blue-800 hover:bg-blue-800'
              }`}
            >
              {downloadingPdf ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Abriendo PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Descargar propuesta inicial
                </>
              )}
            </a>

            <a
              href="/files/matriz_comentarios.xlsx"
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={() => {
                setDownloadingMatrix(true);
                window.setTimeout(() => setDownloadingMatrix(false), 6000);
              }}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors text-white ${
                downloadingMatrix ? 'bg-green-700 cursor-wait' : 'bg-green-800 hover:bg-green-900'
              }`}
            >
              {downloadingMatrix ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Abriendo archivo...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Descargar Matriz de comentarios de socialización de la propuesta inicial
                </>
              )}
            </a>

            <a
              href="/files/iniciativa_ley_6688.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={() => {
                setDownloadingInitiative(true);
                window.setTimeout(() => setDownloadingInitiative(false), 6000);
              }}
              className={`inline-flex items-center px-6 py-3 rounded-lg transition-colors text-white ${
                downloadingInitiative ? 'bg-purple-700 cursor-wait' : 'bg-purple-800 hover:bg-purple-900'
              }`}
            >
              {downloadingInitiative ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Abriendo PDF...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Descargar Iniciativa de Ley 6688
                </>
              )}
            </a>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-8">
        <CommentStats lawId={lawId!} />
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('articles');
                setSelectedChapter(null);
                setSelectedArticle(null);
                setShowCommentForm(false);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'articles'
                  ? 'border-blue-500 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              El Proyecto
            </button>
            <button
              onClick={() => {
                setActiveTab('general');
                setSelectedChapter(null);
                setSelectedArticle(null);
                setShowCommentForm(false);
              }}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'general'
                  ? 'border-blue-500 text-blue-800'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comentarios Generales
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigator - Only show in articles tab */}
        {activeTab === 'articles' && (
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide">
                  Navegación
                </h3>
                <nav className="space-y-1">
                  {getChapters().map((chapter) => (
                    <div key={chapter.id}>
                      <button
                        onClick={() => {
                          toggleChapter(chapter.id);
                          const element = document.getElementById(chapter.id);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          expandedChapters.has(chapter.id)
                            ? 'bg-blue-50 text-blue-800'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="line-clamp-2">{chapter.title}</span>
                          {expandedChapters.has(chapter.id) ? (
                            <ChevronDown className="h-4 w-4 flex-shrink-0 ml-2" />
                          ) : (
                            <ChevronRight className="h-4 w-4 flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </button>
                      {expandedChapters.has(chapter.id) && chapter.articles.length > 0 && (
                        <div className="ml-3 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                          {chapter.articles.map((article) => (
                            <button
                              key={article.id}
                              onClick={() => {
                                const element = document.getElementById(`article-${article.id}`);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                }
                                setSelectedArticle(article.id);
                              }}
                              className={`w-full text-left px-2 py-1.5 rounded text-xs transition-colors ${
                                selectedArticle === article.id
                                  ? 'bg-blue-100 text-blue-900 font-medium'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                              }`}
                            >
                              <span className="line-clamp-2">
                                {article.number}: {article.title}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className={activeTab === 'articles' ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {activeTab === 'articles' ? (
            <div>

              {/* Articles by Title */}
              <div className="space-y-8">
                {getChapters().map((chapter) => {
                  const isExpanded = expandedChapters.has(chapter.id);
                  const isSelected = selectedChapter === chapter.id;

                  return (
                    <div
                      key={chapter.id}
                      id={chapter.id}
                      className={`bg-white rounded-lg border shadow-sm transition-all scroll-mt-8 ${
                        isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => toggleChapter(chapter.id)}
                        className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {chapter.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {chapter.articles.length === 0 ? 'Contenido disponible próximamente' : `${chapter.articles.length} artículos`}
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="h-6 w-6 text-gray-400" />
                        ) : (
                          <ChevronRight className="h-6 w-6 text-gray-400" />
                        )}
                      </button>

                      {isExpanded && chapter.articles.length > 0 && (
                        <div className="border-gray-200 p-6 space-y-4">
                          {chapter.articles.map((article) => {
                            const isArticleSelected = selectedArticle === article.id;

                            return (
                              <div
                                key={article.id}
                                id={`article-${article.id}`}
                                className={`p-6 rounded-lg border transition-all scroll-mt-24 ${
                                  isArticleSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                                }`}
                              >
                                <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                                  {article.number}: {article.title}
                                </h4>
                                <div className="text-gray-700 mb-4 leading-relaxed prose prose-sm max-w-none article-content">
                                  <ReactMarkdown>{article.content}</ReactMarkdown>
                                </div>

                                <div className="flex items-center space-x-4">
                                  <button
                                    onClick={() => setSelectedArticle(isArticleSelected ? null : article.id)}
                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                                  >
                                    {isArticleSelected ? 'Cerrar comentarios' : 'Ver comentarios'}
                                  </button>
                                </div>

                                {isArticleSelected && (
                                  <div className="mt-4border-gray-200 pt-4">
                                    <CommentForm
                                      onSubmit={handleArticleCommentSubmit}
                                      loading={articleLoading}
                                    />
                                  </div>
                                )}

                                {isArticleSelected && (
                                  <div className="mt-4 border-t border-gray-300 pt-4">
                                    <CommentSection
                                      lawId={lawId!}
                                      articleId={article.id}
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Comentarios Generales sobre la Ley
                </h2>
                <button
                  onClick={() => setShowCommentForm(!showCommentForm)}
                  className="inline-flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {showCommentForm ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                  {showCommentForm ? 'Ocultar formulario' : 'Agregar comentario'}
                </button>
              </div>

              {showCommentForm && (
                <div className="mb-8">
                  <CommentForm
                    onSubmit={handleGeneralCommentSubmit}
                    isGeneral={true}
                    loading={generalLoading}
                  />
                </div>
              )}
              
              <CommentSection
                lawId={lawId!}
                isGeneral={true}
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LawDetail;
