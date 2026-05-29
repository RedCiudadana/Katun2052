import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, Map, ChevronRight, ClipboardList, Download, ExternalLink, MessageSquare } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
import GuatemalaMap from '../components/GuatemalaMap';
import { supabase } from '../lib/supabase';
import type { Document } from '../types/katun';
import Linea from '../assets/LINEA.png';
import Katun06 from '../assets/iconos/KATUN-06.png';
import Katun07 from '../assets/iconos/KATUN-07.png';
import Katun08 from '../assets/iconos/KATUN-08.png';
import Katun09 from '../assets/iconos/KATUN-09.png';
import Katun10 from '../assets/iconos/KATUN-10.png';

const dimensions = [
  {
    code: 'dimension-4', slug: 'territorial',
    name: 'Guatemala Urbana y Rural',
    description: 'Desarrollo territorial equilibrado e infraestructura inclusiva.',
    icon: Katun09,
    border: 'border-slate-200', iconBg: 'bg-amber-600', ctaBg: 'bg-[#F1BF3A]', tag: 'badge-amber',
  },
  {
    code: 'dimension-1', slug: 'bienestar',
    name: 'Bienestar para la Gente',
    description: 'Desarrollo humano, salud, educación y reducción de la pobreza.',
    icon: Katun06,
    border: 'border-slate-200', iconBg: 'bg-blue-600', ctaBg: 'bg-[#3E7BBE]', tag: 'badge-brand',
  },
  {
    code: 'dimension-2', slug: 'riqueza',
    name: 'Riqueza para Todos y Todas',
    description: 'Desarrollo económico sostenible, empleo digno e inversión.',
    icon: Katun07,
    border: 'border-slate-200', iconBg: 'bg-green-600', ctaBg: 'bg-[#D92C2C]', tag: 'badge-teal',
  },
  {
    code: 'dimension-3', slug: 'recursos',
    name: 'Recursos Naturales para Hoy y el Futuro',
    description: 'Gestión sostenible, conservación y protección ambiental.',
    icon: Katun08,
    border: 'border-slate-200', iconBg: 'bg-teal-600', ctaBg: 'bg-[#56A947]', tag: 'badge-teal',
  },
  {
    code: 'dimension-5', slug: 'estado',
    name: 'Estado como Conductor del Desarrollo',
    description: 'Gobernabilidad democrática, institucionalidad y transparencia.',
    icon: Katun10,
    border: 'border-slate-200', iconBg: 'bg-red-600', ctaBg: 'bg-[#6CB6E8]', tag: 'badge-red',
  },
];


// Icon map for document types
const DOC_TYPE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  plan:         { bg: 'bg-brand-100',  text: 'text-brand-700',  label: 'Plan' },
  lineamientos: { bg: 'bg-teal-100',   text: 'text-teal-700',   label: 'Lineamientos' },
  diagnóstico:  { bg: 'bg-amber-100',  text: 'text-amber-700',  label: 'Diagnóstico' },
  estrategia:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Estrategia' },
  informe:      { bg: 'bg-green-100',  text: 'text-green-700',  label: 'Informe' },
  otro:         { bg: 'bg-slate-100',  text: 'text-slate-600',  label: 'Documento' },
};

// Generic cover thumbnails from Pexels keyed by document_type
const FALLBACK_THUMBS: Record<string, string> = {
  plan:         'https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=600',
  lineamientos: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=600',
  diagnóstico:  'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
  estrategia:   'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
  informe:      'https://images.pexels.com/photos/669619/pexels-photo-669619.jpeg?auto=compress&cs=tinysrgb&w=600',
  otro:         'https://images.pexels.com/photos/256395/pexels-photo-256395.jpeg?auto=compress&cs=tinysrgb&w=600',
};

const processPhases = [
  {
    num: '01',
    title: 'Preparación estratégica y diseño metodológico',
    color: 'bg-[#F3BE32]',
    line: 'bg-[#F3BE32]',
  },
  {
    num: '02',
    title: 'Recopilación de información técnica territorial y participativa',
    color: 'bg-[#3E7BBE]',
    line: 'bg-[#3E7BBE]',
  },
  {
    num: '03',
    title: 'Sistematización, análisis integrado y prospectiva estratégica',
    color: 'bg-[#D92C2C]',
    line: 'bg-[#D92C2C]',
  },
  {
    num: '04',
    title: 'Formulación estratégica y redacción del plan',
    color: 'bg-[#CC2E8A]',
    line: 'bg-[#CC2E8A]',
  },
  {
    num: '05',
    title: 'Validación, aprobación y lanzamiento',
    color: 'bg-[#56A947]',
    line: 'bg-[#56A947]',
  },
  {
    num: '06',
    title: 'Institucionalización, seguimiento e implementación inicial',
    color: 'bg-[#56A947]',
    line: 'bg-[#56A947]',
  },
];

const KatunHome = () => {
  const [featuredDocs, setFeaturedDocs] = useState<Document[]>([]);

  useEffect(() => {
    if (!supabase) return;
    supabase
      .from('documents')
      .select('*')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('publication_date', { ascending: false })
      .limit(3)
      .then(({ data }) => {
        if (data) setFeaturedDocs(data as Document[]);
      });
  }, []);

  const documentPreviewCards = [
    ...featuredDocs.map((doc) => ({
      id: doc.id,
      title: doc.title,
      href: doc.pdf_url || (doc as any).word_url || `/documentos/${doc.id}`,
      external: !!(doc.pdf_url || (doc as any).word_url),
      isDummy: false,
    })),
  ];

  return (
  <div>
    <HeroSlider />

    <section className="relative z-30 -mt-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-2xl justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.22)] ring-1 ring-slate-200/80 sm:grid-cols-2">
          <Link
            to="/documentos"
            className="group flex min-h-[74px] items-center justify-center gap-3 rounded-[1.5rem] bg-[#74BDF2] px-8 py-5 text-center text-sm font-extrabold uppercase tracking-wide text-white transition-all duration-300 hover:bg-[#5aafea]"
          >
            Conoce los Ejes
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
          <Link
            to="/encuesta"
            className="group flex min-h-[74px] items-center justify-center gap-3 rounded-[1.5rem] px-8 py-5 text-center text-sm font-extrabold uppercase tracking-wide text-[#23286B] transition-all duration-300 hover:bg-slate-50"
          >
            <MessageSquare className="h-4 w-4" />
            Participa Aqui
          </Link>
        </div>
      </div>
    </section>

    {/* Dimensions */}
    <AnimatedSection className="section bg-slate-50 pt-24">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-slate text-xs uppercase tracking-wider mb-3 inline-block">
            Estructura del Plan
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Los 5 Ejes del K'atun 2032
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            El Plan Nacional se organiza en cinco ejes estratégicos.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-5">
          {dimensions.map((d, i) => {
            return (
              <AnimatedSection key={d.code} delay={i * 80} className="h-full">
                <div className={`flex h-full flex-col rounded-[2rem] border bg-[#F3F1EF] ${d.border} shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="flex flex-1 flex-col items-center px-7 pb-8 pt-10 text-center">
                    <div className={`mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl`}>
                      <img src={d.icon} alt="" className="h-100 w-100 object-contain" />
                    </div>
                    <span className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                      Eje {i + 1}
                    </span>
                    <h3 className="mb-4 text-2xl font-bold leading-tight text-slate-900">
                      {d.name}
                    </h3>
                    <p className="text-base leading-relaxed text-slate-600">
                      {d.description}
                    </p>
                  </div>
                  <Link
                    to={`/dimension-articulos/${d.slug}`}
                    className={`flex items-center justify-center gap-2 px-6 py-5 text-xl font-extrabold text-white transition-opacity duration-300 hover:opacity-90 ${d.ctaBg}`}
                  >
                    Ver más
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </AnimatedSection>

    {/* Participation Tools */}
    <AnimatedSection className="section bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-brand text-xs uppercase tracking-wider mb-3 inline-block">
            Participa
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Herramientas de Participación Ciudadana
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comparte tu opinión y conoce cómo participa Guatemala en la construcción del Plan Nacional de Desarrollo.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        {/* Survey CTA */}
        <AnimatedSection delay={100}>
          <div className="bg-[#4FC4FF] rounded-3xl p-8 sm:p-10 mb-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-slate-600">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Encuesta Digital Nacional</h3>
              <p className="leading-relaxed max-w-xl text-slate-600">
                Responde la encuesta oficial del proceso participativo. Tu opinión sobre las cinco dimensiones
                del K'atun contribuye directamente al Plan Nacional de Desarrollo Guatemala 2032.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/encuesta"
                className="inline-flex items-center gap-3 bg-white text-brand-800 font-bold px-8 py-4 rounded-2xl text-base hover:bg-brand-50 transition-colors shadow-lg hover:shadow-xl"
              >
                <ClipboardList className="h-5 w-5" />
                Participar en la Encuesta
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Interactive Map */}
        <AnimatedSection delay={200}>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                <Map className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Mapa de Participación Departamental</h3>
                <p className="text-sm text-slate-500">Haz clic en un departamento para ver sus estadísticas de participación</p>
              </div>
            </div>
            <div className="mt-6">
              <GuatemalaMap />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedSection>

    {/* Process Route */}
    <AnimatedSection className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-slate text-xs uppercase tracking-wider mb-3 inline-block">
            Proceso
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Ruta del Proceso
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            El Plan Nacional de Desarrollo K'atun 2032 se construye a través de seis fases
            que garantizan rigor técnico y amplia participación ciudadana.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        <div className="space-y-8 lg:hidden">
          {processPhases.map((phase, i) => (
            <AnimatedSection key={phase.num} delay={i * 80}>
              <div className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-5 w-5 rounded-full ${phase.color}`} />
                  {i < processPhases.length - 1 && <div className={`mt-2 h-20 w-1 ${phase.line}`} />}
                </div>
                <div className="pt-0.5">
                  <p className="text-lg font-extrabold text-[#23286B]">Fase {i + 1}</p>
                  <p className="mt-1 text-lg leading-snug text-[#23286B]">{phase.title}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="mx-auto hidden max-w-7xl grid-cols-6 grid-rows-[1fr_auto_1fr] lg:grid">
          {processPhases.map((phase, i) => (
            <AnimatedSection key={`${phase.num}-top`} delay={i * 80} className="flex items-end justify-center pb-16">
              {i % 2 === 1 ? (
                <div className="w-[220px] text-center">
                  <p className="text-[0.95rem] font-extrabold text-[#23286B]">Fase {i + 1}</p>
                  <p className="mt-1 text-[0.95rem] leading-tight text-[#23286B]">{phase.title}</p>
                </div>
              ) : null}
            </AnimatedSection>
          ))}

          {processPhases.map((phase, i) => (
            <div key={`${phase.num}-line`} className="relative flex h-10 items-center justify-center">
              {i < processPhases.length - 1 ? (
                <div className={`absolute left-1/2 top-1/2 h-5 w-full -translate-y-1/2 rounded-full ${phase.line}`} />
              ) : null}
              <div className={`relative z-10 h-10 w-10 rounded-full ${phase.color}`} />
            </div>
          ))}

          {processPhases.map((phase, i) => (
            <AnimatedSection key={`${phase.num}-bottom`} delay={i * 80} className="flex items-start justify-center pt-16">
              {i % 2 === 0 ? (
                <div className="w-[220px] text-center">
                  <p className="text-[0.95rem] font-extrabold text-[#23286B]">Fase {i + 1}</p>
                  <p className="mt-1 text-[0.95rem] leading-tight text-[#23286B]">{phase.title}</p>
                </div>
              ) : null}
            </AnimatedSection>
          ))}
        </div>
      </div>
    </AnimatedSection>

    {/* Featured Documents */}
    <AnimatedSection className="section bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-teal text-xs uppercase tracking-wider mb-3 inline-block">
            Descarga
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Documentos Destacados para Descarga
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Accede a los documentos oficiales del Plan Nacional de Desarrollo K'atun 2032.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        <div className="mb-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {documentPreviewCards.map((doc, i) => {
            const titleParts = doc.title.split(' ');
            const cardContent = (
              <>
                <div className="flex min-h-[360px] items-center justify-center rounded-[1.25rem_10rem_1.25rem_10rem] bg-[#BEEBFA] px-10 py-12 text-center shadow-[0_16px_40px_rgba(79,196,255,0.14)] transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="max-w-[14ch] text-3xl font-normal leading-[1.05] text-[#262262] sm:text-[2.15rem]">
                    <span className="font-bold">{titleParts.slice(0, 2).join(' ')}</span>{' '}
                    {titleParts.slice(2).join(' ')}
                  </h3>
                </div>
                <div className="mt-6 flex justify-center">
                  <span className="inline-flex items-center rounded-full bg-[#4FC4FF] px-7 py-3 text-xl font-bold uppercase tracking-wide text-white shadow-[0_10px_24px_rgba(79,196,255,0.28)]">
                    Descarga
                  </span>
                </div>
              </>
            );

            return (
              <AnimatedSection key={doc.id} delay={i * 80}>
                {doc.external && !doc.isDummy ? (
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="group block"
                  >
                    {cardContent}
                  </a>
                ) : doc.isDummy ? (
                  <div className="group block">
                    {cardContent}
                  </div>
                ) : (
                  <Link to={doc.href} className="group block">
                    {cardContent}
                  </Link>
                )}
              </AnimatedSection>
            );
          })}
        </div>

        {false && (featuredDocs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No hay documentos disponibles aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featuredDocs.map((doc, i) => {
              const typeInfo = DOC_TYPE_COLORS[doc.document_type] ?? DOC_TYPE_COLORS.otro;
              const thumb = doc.thumbnail_url || FALLBACK_THUMBS[doc.document_type] || FALLBACK_THUMBS.otro;
              const hasDownload = !!(doc.pdf_url || doc.word_url);
              return (
                <AnimatedSection key={doc.id} delay={i * 80}>
                  <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-soft hover:shadow-md transition-shadow flex flex-col h-full">
                    {/* Thumbnail */}
                    <div className="relative h-44 overflow-hidden bg-slate-100">
                      <img
                        src={thumb}
                        alt={doc.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full ${typeInfo.bg} ${typeInfo.text}`}>
                        {typeInfo.label}
                      </span>
                      {doc.is_featured && (
                        <span className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400 text-amber-900">
                          Destacado
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug mb-2 line-clamp-2">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                        {doc.description}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {doc.pdf_url && (
                          <a
                            href={doc.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 bg-brand-700 hover:bg-brand-800 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            PDF
                          </a>
                        )}
                        {(doc as any).word_url && (
                          <a
                            href={(doc as any).word_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                          >
                            <Download className="h-3.5 w-3.5" />
                            Word
                          </a>
                        )}
                        {!hasDownload && (
                          <Link
                            to={`/documentos/${doc.id}`}
                            className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Ver detalles
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        ))}

        <div className="text-center">
          <Link
            to="/documentos"
            className="inline-flex items-center gap-2 btn-primary px-8 py-3"
          >
            <FileText className="h-4 w-4" />
            Ver todos los documentos
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  </div>
  );
};

export default KatunHome;
