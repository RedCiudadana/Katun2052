import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, TrendingUp, Heart, Leaf, Map, Shield, ChevronRight, ClipboardList, Download, ExternalLink } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
import GuatemalaMap from '../components/GuatemalaMap';
import { supabase } from '../lib/supabase';
import type { Document } from '../types/katun';
import Linea from '../assets/LINEA.png';

const dimensions = [
  {
    code: 'dimension-1', slug: 'bienestar',
    name: 'Bienestar para la Gente',
    description: 'Desarrollo humano, salud, educación y reducción de la pobreza.',
    icon: Heart,
    bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-600', tag: 'badge-brand',
  },
  {
    code: 'dimension-2', slug: 'riqueza',
    name: 'Riqueza para Todos y Todas',
    description: 'Desarrollo económico sostenible, empleo digno e inversión.',
    icon: TrendingUp,
    bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-600', tag: 'badge-teal',
  },
  {
    code: 'dimension-3', slug: 'recursos',
    name: 'Recursos Naturales para Hoy y el Futuro',
    description: 'Gestión sostenible, conservación y protección ambiental.',
    icon: Leaf,
    bg: 'bg-teal-50', border: 'border-teal-200', iconBg: 'bg-teal-600', tag: 'badge-teal',
  },
  {
    code: 'dimension-4', slug: 'territorial',
    name: 'Guatemala Urbana y Rural',
    description: 'Desarrollo territorial equilibrado e infraestructura inclusiva.',
    icon: Map,
    bg: 'bg-amber-50', border: 'border-amber-200', iconBg: 'bg-amber-600', tag: 'badge-amber',
  },
  {
    code: 'dimension-5', slug: 'estado',
    name: 'Estado como Garante de los Derechos',
    description: 'Gobernabilidad democrática, institucionalidad y transparencia.',
    icon: Shield,
    bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-600', tag: 'badge-red',
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
      .limit(6)
      .then(({ data }) => {
        if (data) setFeaturedDocs(data as Document[]);
      });
  }, []);

  return (
  <div>
    <HeroSlider />

    {/* Dimensions */}
    <AnimatedSection className="section bg-slate-50">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-slate text-xs uppercase tracking-wider mb-3 inline-block">
            Estructura del Plan
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Las 5 Dimensiones del K'atun
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            El Plan Nacional se organiza en cinco dimensiones estratégicas que
            definen la visión integral del país hacia 2032.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        <div className="flex gap-5 overflow-x-auto pb-3 -mx-2 px-2 snap-x snap-mandatory">
          {dimensions.map((d, i) => {
            const Icon = d.icon;
            return (
              <AnimatedSection key={d.code} delay={i * 80} className="shrink-0 w-64 snap-start">
                <div className={`h-full flex flex-col ${d.bg} border ${d.border} rounded-2xl p-6`}>
                  <div className={`w-12 h-12 ${d.iconBg} rounded-xl flex items-center justify-center mb-4 shrink-0`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Eje {i + 1}
                  </span>
                  <h3 className="font-bold text-slate-900 leading-snug text-sm mb-3 flex-1">
                    {d.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    {d.description}
                  </p>
                  <Link
                    to={`/dimension/${d.code}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900 transition-colors"
                  >
                    Ver más <ChevronRight className="h-4 w-4" />
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
          <div className="bg-gradient-brand rounded-3xl p-8 sm:p-10 mb-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                  <ClipboardList className="h-7 w-7 text-white" />
                </div>
                <span className="text-sm font-semibold text-white/75 uppercase tracking-wider">Encuesta</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-3">Encuesta Digital Nacional</h3>
              <p className="text-white/75 leading-relaxed max-w-xl">
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

        {/* Timeline horizontal scroll */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-200 via-brand-400 to-brand-200 z-0" style={{ top: '2rem' }} />

          <div className="flex gap-6 overflow-x-auto pb-4 -mx-2 px-2 snap-x snap-mandatory md:grid md:grid-cols-6 md:overflow-visible md:pb-0 md:px-0 md:mx-0">
            {[
              {
                num: '01',
                title: 'Preparación estratégica y diseño metodológico',
                color: 'bg-brand-600', ring: 'ring-brand-200', text: 'text-brand-700', bg: 'bg-brand-50', border: 'border-brand-100',
              },
              {
                num: '02',
                title: 'Recopilación de información técnica territorial y participativa',
                color: 'bg-teal-600', ring: 'ring-teal-200', text: 'text-teal-700', bg: 'bg-teal-50', border: 'border-teal-100',
              },
              {
                num: '03',
                title: 'Sistematización, análisis integrado y prospectiva estratégica',
                color: 'bg-amber-500', ring: 'ring-amber-200', text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100',
              },
              {
                num: '04',
                title: 'Formulación estratégica y redacción del plan',
                color: 'bg-blue-600', ring: 'ring-blue-200', text: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-100',
              },
              {
                num: '05',
                title: 'Validación, aprobación y lanzamiento',
                color: 'bg-green-600', ring: 'ring-green-200', text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100',
              },
              {
                num: '06',
                title: 'Institucionalización, seguimiento e implementación inicial',
                color: 'bg-slate-700', ring: 'ring-slate-200', text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200',
              },
            ].map((phase, i) => (
              <AnimatedSection key={phase.num} delay={i * 100} className="shrink-0 w-52 md:w-auto snap-start">
                <div className="flex flex-col items-center text-center relative z-10">
                  {/* Node */}
                  <div className={`w-16 h-16 rounded-2xl ${phase.color} ring-4 ${phase.ring} flex items-center justify-center mb-4 shadow-soft shrink-0`}>
                    <span className="text-white font-bold text-xl">{phase.num}</span>
                  </div>
                  {/* Card */}
                  <div className={`${phase.bg} border ${phase.border} rounded-2xl p-4 w-full`}>
                    <p className={`text-xs font-bold uppercase tracking-wider ${phase.text} mb-2`}>
                      Fase {i + 1}
                    </p>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {phase.title}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
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

        {featuredDocs.length === 0 ? (
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
        )}

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
