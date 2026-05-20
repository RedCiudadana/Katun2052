import { useState, useEffect } from 'react';
import { Calendar as CalIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { ProcessMilestone } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const statusConfig = {
  completed: {
    label: 'Completado',
    dot:   'bg-green-500',
    badge: 'bg-green-100 text-green-800 border border-green-200',
    border:'border-t-green-400',
    icon:  CheckCircle,
    iconColor: 'text-green-600',
    ring:  'border-green-400 bg-green-50',
  },
  in_progress: {
    label: 'En Proceso',
    dot:   'bg-brand-500',
    badge: 'bg-brand-100 text-brand-800 border border-brand-200',
    border:'border-t-brand-400',
    icon:  Clock,
    iconColor: 'text-brand-600',
    ring:  'border-brand-400 bg-brand-50',
  },
  upcoming: {
    label: 'Próximo',
    dot:   'bg-slate-300',
    badge: 'bg-slate-100 text-slate-600 border border-slate-200',
    border:'border-t-slate-300',
    icon:  AlertCircle,
    iconColor: 'text-slate-400',
    ring:  'border-slate-300 bg-slate-50',
  },
} as const;

const typeLabel: Record<string, string> = {
  publication: 'Publicación',
  consultation:'Consulta',
  deadline:    'Fecha Límite',
  event:       'Evento',
};

const KatunCalendar = () => {
  const [milestones, setMilestones] = useState<ProcessMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    katunService.getProcessMilestones()
      .then(setMilestones)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 text-sm font-medium">Cargando cronograma…</p>
      </div>
    </div>
  );

  const counts = {
    completed:   milestones.filter(m => m.status === 'completed').length,
    in_progress: milestones.filter(m => m.status === 'in_progress').length,
    upcoming:    milestones.filter(m => m.status === 'upcoming').length,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="page-hero">
        <div className="container-wide">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-3">
              <CalIcon className="h-6 w-6 text-brand-200" />
              <span className="badge bg-white/15 text-white/90 text-xs uppercase tracking-wider">
                Proceso participativo
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
              Cronograma del Proceso K'atun 2032
            </h1>
            <p className="text-lg text-brand-100 max-w-2xl">
              Conoce las fases y fechas clave del proceso de actualización del
              Plan Nacional de Desarrollo.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Stats */}
      <div className="container-wide -mt-6 mb-10 relative z-10">
        <AnimatedSection>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { key: 'completed',   label: 'Completadas', Icon: CheckCircle, cls: 'text-green-600 bg-green-50 border-green-200' },
              { key: 'in_progress', label: 'En Proceso',  Icon: Clock,       cls: 'text-brand-600 bg-brand-50 border-brand-200' },
              { key: 'upcoming',    label: 'Próximas',    Icon: AlertCircle, cls: 'text-slate-500 bg-white border-slate-200' },
            ].map(s => (
              <div key={s.key} className={`card-flat border px-4 py-4 sm:py-5 flex items-center gap-3 ${s.cls}`}>
                <s.Icon className="h-7 w-7 sm:h-8 sm:w-8 shrink-0" />
                <div>
                  <div className="text-2xl sm:text-3xl font-bold">
                    {counts[s.key as keyof typeof counts]}
                  </div>
                  <div className="text-xs font-semibold opacity-70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* Timeline */}
      <div className="container-wide pb-16">
        <div className="relative">
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-200 md:-translate-x-px" />

          <div className="space-y-6 sm:space-y-8">
            {milestones.map((m, i) => {
              const cfg = statusConfig[m.status as keyof typeof statusConfig] ?? statusConfig.upcoming;
              const StatusIcon = cfg.icon;
              const isLeft = i % 2 === 0;
              const dateStr = new Date(m.milestone_date).toLocaleDateString('es-GT', {
                year: 'numeric', month: 'long', day: 'numeric',
              });

              return (
                <AnimatedSection key={m.id} delay={i * 80}>
                  {/* Mobile */}
                  <div className="md:hidden flex gap-5 pl-0">
                    <div className="flex flex-col items-center" style={{ minWidth: 48 }}>
                      <div className={`w-12 h-12 rounded-full border-2 ${cfg.ring} flex items-center justify-center z-10 shadow-soft`}>
                        <StatusIcon className={`h-5 w-5 ${cfg.iconColor}`} />
                      </div>
                    </div>
                    <div className={`card bg-white p-4 border-t-4 ${cfg.border} flex-1 mb-1`}>
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`badge text-xs ${cfg.badge}`}>{cfg.label}</span>
                        <span className="badge-slate text-xs">{typeLabel[m.milestone_type] ?? m.milestone_type}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base mb-1">{m.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-2">{m.description}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                        <CalIcon className="h-3.5 w-3.5" />
                        {dateStr}
                      </div>
                    </div>
                  </div>

                  {/* Desktop */}
                  <div className={`hidden md:flex items-start ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${isLeft ? 'pr-10' : 'pl-10'}`}>
                      <div className={`card bg-white p-6 border-t-4 ${cfg.border}`}>
                        <div className={`flex items-center gap-2 flex-wrap mb-3 ${isLeft ? 'justify-end' : 'justify-start'}`}>
                          <span className={`badge text-xs ${cfg.badge}`}>{cfg.label}</span>
                          <span className="badge-slate text-xs">{typeLabel[m.milestone_type] ?? m.milestone_type}</span>
                        </div>
                        <h3 className={`font-bold text-slate-900 text-lg mb-2 ${isLeft ? 'text-right' : 'text-left'}`}>
                          {m.title}
                        </h3>
                        <p className={`text-sm text-slate-600 leading-relaxed mb-3 ${isLeft ? 'text-right' : 'text-left'}`}>
                          {m.description}
                        </p>
                        <div className={`flex items-center gap-1.5 text-xs text-slate-400 font-medium ${isLeft ? 'justify-end' : 'justify-start'}`}>
                          <CalIcon className="h-3.5 w-3.5" />
                          {dateStr}
                        </div>
                      </div>
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2 z-10">
                      <div className={`w-12 h-12 rounded-full border-4 ${cfg.ring} flex items-center justify-center shadow-soft`}>
                        <StatusIcon className={`h-5 w-5 ${cfg.iconColor}`} />
                      </div>
                    </div>

                    <div className="w-1/2" />
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>

        {/* Info */}
        <AnimatedSection delay={600}>
          <div className="mt-16 bg-brand-50 border border-brand-200 rounded-2xl p-8 text-center max-w-2xl mx-auto">
            <CalIcon className="h-10 w-10 text-brand-600 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Mantente Informado</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              El proceso de actualización es transparente y participativo.
              Revisa esta página regularmente para conocer avances y oportunidades de participación.
            </p>
          </div>
        </AnimatedSection>

        <div className="mt-10">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default KatunCalendar;
