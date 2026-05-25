import { Link } from 'react-router-dom';
import { ArrowRight, FileText, MessageSquare, Users, TrendingUp, Heart, Leaf, Map, Shield, BarChart3, Clock, CheckCircle, ChevronRight, ClipboardList } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
import GuatemalaMap from '../components/GuatemalaMap';
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
  </div>
);

export default KatunHome;
