import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Filter, Calendar, Download, Heart, TrendingUp, Leaf, Map, Shield, Search } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { Dimension, Document } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const getDimIcon = (code: string) => {
  const map: Record<string, React.ElementType> = {
    'dimension-1': Heart,
    'dimension-2': TrendingUp,
    'dimension-3': Leaf,
    'dimension-4': Map,
    'dimension-5': Shield,
  };
  return map[code] ?? FileText;
};

const getDimColor = (code: string) => {
  const map: Record<string, string> = {
    'dimension-1': 'bg-blue-100 text-blue-700',
    'dimension-2': 'bg-green-100 text-green-700',
    'dimension-3': 'bg-teal-100 text-teal-700',
    'dimension-4': 'bg-amber-100 text-amber-700',
    'dimension-5': 'bg-red-100 text-red-700',
  };
  return map[code] ?? 'bg-slate-100 text-slate-700';
};

const Documents = () => {
  const [dimensions, setDimensions]         = useState<Dimension[]>([]);
  const [documents, setDocuments]           = useState<Document[]>([]);
  const [loading, setLoading]               = useState(true);
  const [selectedDimension, setSelectedDimension] = useState('all');
  const [selectedType, setSelectedType]     = useState('all');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [dims, docs] = await Promise.all([
          katunService.getDimensions(),
          katunService.getDocuments(),
        ]);
        setDimensions(dims);
        setDocuments(docs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const documentTypes = Array.from(new Set(documents.map(d => d.document_type)));

  const filtered = documents.filter(doc => {
    if (selectedDimension !== 'all' && doc.dimension_id !== selectedDimension) return false;
    if (selectedType !== 'all' && doc.document_type !== selectedType) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 text-sm font-medium">Cargando documentos…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <FileText className="h-6 w-6 text-brand-200" />
              <span className="badge bg-white/15 text-white/90 text-xs uppercase tracking-wider">
                Biblioteca oficial
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Documentos Oficiales
            </h1>
            <p className="text-lg text-brand-100 max-w-2xl">
              Documentos validados por SEGEPLAN organizados por dimensión del
              Plan Nacional de Desarrollo K'atun 2032.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-wide py-10">
        {/* Filters */}
        <AnimatedSection>
          <div className="card-flat border border-slate-200 p-5 mb-8 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Filtrar documentos
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Por Dimensión</label>
                <select
                  value={selectedDimension}
                  onChange={e => setSelectedDimension(e.target.value)}
                  className="form-input"
                >
                  <option value="all">Todas las dimensiones</option>
                  {dimensions.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Por Tipo</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value)}
                  className="form-input"
                >
                  <option value="all">Todos los tipos</option>
                  {documentTypes.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Mostrando <strong className="text-slate-700">{filtered.length}</strong> de {documents.length} documentos
            </p>
          </div>
        </AnimatedSection>

        {/* Results */}
        {filtered.length === 0 ? (
          <AnimatedSection>
            <div className="card flex flex-col items-center justify-center py-20 text-center px-6">
              <Search className="h-14 w-14 text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-1">Sin resultados</h3>
              <p className="text-sm text-slate-400">Ajusta los filtros para ver más documentos.</p>
            </div>
          </AnimatedSection>
        ) : (
          <div className="space-y-4">
            {filtered.map((doc, i) => {
              const dim = dimensions.find(d => d.id === doc.dimension_id);
              const Icon = dim ? getDimIcon(dim.code) : FileText;
              const iconColor = dim ? getDimColor(dim.code) : 'bg-slate-100 text-slate-600';

              return (
                <AnimatedSection key={doc.id} delay={i * 60}>
                  <div className="card bg-white p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconColor}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            {dim && (
                              <Link
                                to={`/dimension/${dim.code}`}
                                className="badge-slate mb-2 inline-block hover:bg-slate-200 transition-colors text-xs"
                              >
                                {dim.name}
                              </Link>
                            )}
                            <h3 className="text-lg font-bold text-slate-900 mb-1 leading-snug">
                              {doc.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                              {doc.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-3">
                              <span className="flex items-center gap-1 text-xs text-slate-400">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(doc.publication_date).toLocaleDateString('es-GT', {
                                  year: 'numeric', month: 'long', day: 'numeric',
                                })}
                              </span>
                              <span className="badge-brand text-xs">{doc.document_type}</span>
                              <span className="badge-green text-xs">v{doc.version}</span>
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
              );
            })}
          </div>
        )}

        <div className="mt-12">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default Documents;
