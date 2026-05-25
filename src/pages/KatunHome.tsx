import { Link } from 'react-router-dom';
import { ArrowRight, FileText, MessageSquare, Users, TrendingUp, Heart, Leaf, Map, Shield, BarChart3, Clock, CheckCircle, ChevronRight } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
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

const steps = [
  {
    step: '01', title: 'Explora las Dimensiones',
    description: 'Conoce las 5 áreas estratégicas del Plan Nacional y los documentos oficiales de cada una.',
    icon: FileText,
    href: '/documentos',
  },
  {
    step: '02', title: 'Lee los Documentos',
    description: 'Accede a los documentos validados por SEGEPLAN organizados por dimensión temática.',
    icon: BarChart3,
    href: '/documentos',
  },
  {
    step: '03', title: 'Comparte tu Opinión',
    description: 'Deja comentarios y propuestas concretas para enriquecer el plan de desarrollo.',
    icon: MessageSquare,
    href: '/dimension-articulos/bienestar',
  },
];

const values = [
  { icon: CheckCircle, title: 'Transparencia', desc: 'Proceso abierto y documentado' },
  { icon: Users,       title: 'Inclusión',     desc: 'Todas las voces importan' },
  { icon: BarChart3,   title: 'Impacto Real',  desc: 'Aportes integrados al plan' },
];

const KatunHome = () => (
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

    {/* How to participate */}
    <AnimatedSection className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-12">
          <span className="badge-teal text-xs uppercase tracking-wider mb-3 inline-block">
            Guía de participación
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            ¿Cómo Participar?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Tres pasos sencillos para que tu voz forme parte del Plan Nacional de Desarrollo.
          </p>
          <img src={Linea} alt="" className="linea mt-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <AnimatedSection key={i} delay={i * 120}>
                <div className="card-flat p-7 h-full flex flex-col items-center text-center border border-slate-200 bg-slate-50">
                  <div className="w-14 h-14 rounded-2xl bg-brand-700 text-white font-bold text-xl flex items-center justify-center mb-4 shadow-soft">
                    {s.step}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-brand-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">{s.description}</p>
                  <Link
                    to={s.href}
                    className="mt-5 text-sm font-semibold text-brand-700 hover:text-brand-900 flex items-center gap-1 transition-colors"
                  >
                    Comenzar <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        {/* Values banner */}
        <AnimatedSection delay={400}>
          <div className="bg-gradient-brand rounded-3xl p-8 sm:p-10 text-white">
            <div className="text-center mb-8">
              <Clock className="h-10 w-10 text-teal-300 mx-auto mb-3" />
              <h3 className="text-2xl font-bold mb-2">Tu Participación es Fundamental</h3>
              <p className="text-white/75 max-w-2xl mx-auto text-sm leading-relaxed">
                Cada comentario y propuesta es revisado, analizado e integrado por el equipo técnico
                de SEGEPLAN. Tu voz construye un plan verdaderamente representativo.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <div key={i} className="flex flex-col items-center text-center bg-white/10 border border-white/20 rounded-2xl p-6">
                    <Icon className="h-8 w-8 text-teal-300 mb-3" />
                    <h4 className="font-semibold text-white mb-1">{v.title}</h4>
                    <p className="text-sm text-white/65">{v.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </AnimatedSection>

    {/* CTA band */}
    <AnimatedSection className="section bg-brand-700">
      <div className="container-narrow text-center text-white space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold">Comienza a Participar Hoy</h2>
        <p className="text-lg text-brand-100 max-w-xl mx-auto">
          SEGEPLAN te invita a ser parte activa de la construcción del futuro de Guatemala.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
          <Link
            to="/documentos"
            className="btn bg-white text-brand-800 px-8 py-4 rounded-2xl text-base hover:bg-brand-50 hover:shadow-hero"
          >
            <FileText className="h-5 w-5" />
            Ver Documentos
          </Link>
          <Link
            to="/encuesta"
            className="btn bg-white/15 border-2 border-white/40 text-white px-8 py-4 rounded-2xl text-base hover:bg-white/25 hover:border-white/60"
          >
            Participar en Encuesta
          </Link>
        </div>
      </div>
    </AnimatedSection>
  </div>
);

export default KatunHome;
