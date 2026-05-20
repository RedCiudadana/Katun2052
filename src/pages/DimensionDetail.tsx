import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, Download, Calendar, CheckCircle, Filter, Heart, TrendingUp, Leaf, Map, Shield, ArrowLeft, MessageSquare } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Dimension, Document } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const getDimIcon = (code: string): React.ElementType => {
  const m: Record<string, React.ElementType> = {
    'dimension-1': Heart, 'dimension-2': TrendingUp,
    'dimension-3': Leaf,  'dimension-4': Map, 'dimension-5': Shield,
  };
  return m[code] ?? FileText;
};

const getDimSlug = (code: string) => {
  const m: Record<string, string> = {
    'dimension-1': 'bienestar', 'dimension-2': 'riqueza',
    'dimension-3': 'recursos',  'dimension-4': 'territorial', 'dimension-5': 'estado',
  };
  return m[code] ?? 'bienestar';
};

const DimensionDetail = () => {
  const { dimensionCode } = useParams<{ dimensionCode: string }>();
  const [dimension, setDimension] = useState<Dimension | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');

  useEffect(() => {
    if (!dimensionCode) return;
    const load = async () => {
      try {
        setLoading(true);
        const dim = await katunService.getDimensionByCode(dimensionCode);
        setDimension(dim);
        if (dim) setDocuments(await katunService.getDocuments({ dimensionId: dim.id }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [dimensionCode]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm">Cargando…</p>
      </div>
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

  const Icon = getDimIcon(dimension.code);
  const slug = getDimSlug(dimension.code);
  const documentTypes = Array.from(new Set(documents.map(d => d.document_type)));
  const filtered = filter === 'all' ? documents : documents.filter(d => d.document_type === filter);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <AnimatedSection>
            <Link to="/documentos" className="inline-flex items-center gap-2 text-brand-200 hover:text-white text-sm font-medium mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Todos los documentos
            </Link>
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl flex items-center justify-center shrink-0">
                <Icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
                  {dimension.name}
                </h1>
                <p className="text-brand-100 text-base">{dimension.description}</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-wide py-10">
        {/* Toolbar */}
        <AnimatedSection>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Documentos Oficiales</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {documents.length} documento{documents.length !== 1 ? 's' : ''} disponible{documents.length !== 1 ? 's' : ''}
              </p>
            </div>
            {documentTypes.length > 1 && (
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="form-input w-auto text-sm"
                >
                  <option value="all">Todos los tipos</option>
                  {documentTypes.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </AnimatedSection>

        {filtered.length === 0 ? (
          <AnimatedSection>
            <div className="card flex flex-col items-center py-20 text-center">
              <FileText className="h-14 w-14 text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-1">Sin documentos</h3>
              <p className="text-sm text-slate-400">Los documentos se publicarán próximamente.</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {filtered.map((doc, i) => (
              <AnimatedSection key={doc.id} delay={i * 60}>
                <div className="card bg-white p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row gap-5">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4">
                        <div className="w-11 h-11 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                            {doc.title}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                            {doc.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(doc.publication_date).toLocaleDateString('es-GT', {
                                year: 'numeric', month: 'long', day: 'numeric',
                              })}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                              <CheckCircle className="h-3 w-3" />
                              v{doc.version}
                            </span>
                            <span className="badge-brand text-xs">{doc.document_type}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2 lg:w-44 shrink-0">
                      <Link
                        to={`/documento/${doc.id}`}
                        className="btn-primary btn-sm flex-1 lg:flex-none justify-center"
                      >
                        <FileText className="h-4 w-4" />
                        Ver y Comentar
                      </Link>
                      {doc.pdf_url && (
                        <a
                          href={doc.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary btn-sm flex-1 lg:flex-none justify-center"
                        >
                          <Download className="h-4 w-4" />
                          Descargar PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        )}

        {/* CTA */}
        <AnimatedSection delay={400}>
          <div className="mt-12 bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center">
            <MessageSquare className="h-10 w-10 text-brand-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              ¿Tienes una opinión sobre esta dimensión?
            </h3>
            <p className="text-slate-600 text-sm max-w-xl mx-auto mb-5">
              Comparte tu retroalimentación general o comenta artículos específicos.
              Tu voz enriquece el Plan Nacional.
            </p>
            <Link to={`/dimension-articulos/${slug}`} className="btn-primary">
              <MessageSquare className="h-4 w-4" />
              Comentar esta Dimensión
            </Link>
          </div>
        </AnimatedSection>

        <div className="mt-10">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default DimensionDetail;
