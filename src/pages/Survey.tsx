import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';
import { ClipboardList, Users, MapPin, Heart, Leaf, TrendingUp } from 'lucide-react';

const SURVEY_URL = 'https://ee.kobotoolbox.org/i/R25zBE2N';

const topics = [
  { icon: Heart,      label: 'Bienestar y servicios públicos' },
  { icon: TrendingUp, label: 'Economía y desarrollo' },
  { icon: Leaf,       label: 'Recursos naturales' },
  { icon: MapPin,     label: 'Desarrollo territorial' },
  { icon: Users,      label: 'Derechos humanos e institucionalidad' },
];

const Survey = () => (
  <div className="min-h-screen bg-slate-50">
    {/* Hero */}
    <section className="page-hero">
      <div className="container-wide">
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-3">
            <ClipboardList className="h-6 w-6 text-brand-200" />
            <span className="badge bg-white/15 text-white/90 text-xs uppercase tracking-wider">
              Participación ciudadana
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight max-w-3xl">
            Encuesta ciudadana para la actualización del Plan Nacional de Desarrollo K'atun
          </h1>
          <p className="text-xl font-semibold text-teal-300 mb-3">
            Participa en la actualización del Plan Nacional de Desarrollo K'atun
          </p>
          <p className="text-base text-brand-100 max-w-3xl leading-relaxed">
            Guatemala está actualizando su Plan Nacional de Desarrollo K'atun: Nuestra Guatemala 2032,
            la hoja de ruta de largo plazo que orienta las prioridades del país en temas como bienestar,
            desarrollo territorial, economía, recursos naturales, derechos humanos, servicios públicos
            e institucionalidad.
          </p>
        </AnimatedSection>
      </div>
    </section>

    <div className="container-wide py-10">
      {/* Context card */}
      <AnimatedSection>
        <div className="card bg-white p-6 sm:p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-slate-900">
                ¿Por qué es importante tu participación?
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                Esta encuesta busca recoger opiniones, prioridades y propuestas de la ciudadanía,
                comunidades, organizaciones, sectores productivos, academia, pueblos indígenas,
                juventudes, mujeres, gobiernos locales, instituciones públicas y otros actores
                del desarrollo nacional.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Cada respuesta es analizada e integrada por el equipo técnico de SEGEPLAN para
                construir un plan verdaderamente representativo de todas las voces de Guatemala.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Temas que cubre la encuesta
              </p>
              {topics.map((t, i) => {
                const Icon = t.icon;
                return (
                  <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    {t.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Embed */}
      <AnimatedSection>
        <div className="card bg-white overflow-hidden border border-slate-200">
          <div className="bg-brand-50 border-b border-brand-100 px-6 py-4 flex items-center gap-3">
            <ClipboardList className="h-5 w-5 text-brand-600" />
            <span className="font-semibold text-brand-800 text-sm">Encuesta K'atun 2032 — KoboToolbox</span>
          </div>
          <iframe
            src={SURVEY_URL}
            title="Encuesta ciudadana K'atun 2032"
            className="w-full border-0"
            style={{ minHeight: '700px' }}
            allowFullScreen
          />
        </div>
      </AnimatedSection>

      <div className="mt-12">
        <img src={Linea} alt="" className="linea" />
      </div>
    </div>
  </div>
);

export default Survey;
