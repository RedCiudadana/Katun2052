import React, { useState } from 'react';
import { FileText, MessageCircleMore, Clock, Presentation, Download } from 'lucide-react';

interface TimelinePhase {
  id: number;
  title: string;
  description: string;
  details: string[];
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ComponentType<{ className?: string }>;
  downloadLink?: string;
}

const phases: TimelinePhase[] = [
  {
    id: 1,
    title: 'Fase de Diagnóstico',
    description: 'Metodología para la elaboración de la propuesta.',
    details: [
      'Diseño de hoja de ruta',
      'Derecho comparado',
      'Mejores Prácticas y Estándares Internacionales',
      'Análisis Comparativos de Reformas Anteriores',
    ],
    status: 'completed',
    icon: FileText,
  },
  {
    id: 2,
    title: 'Fase de Participación y Consulta',
    description: 'Conocer experiencias y buenas prácticas internacionales y recabar insumos de entidades compradoras.',
    details: [
      'Remisión de matriz de insumos a entidades compradoras.',
      'Reuniones para conocer experiencias de otros países (Chile, Paraguay, Perú, Costa Rica, Panamá y República Dominicana).',
    ],
    status: 'completed',
    icon: MessageCircleMore,
  },
  {
    id: 3,
    title: 'Fase de Elaboración del Proyecto',
    description: 'Redacción y revisión del contenido del proyecto.',
    details: [
      'Análisis de insumos de entidades compradoras y buenas prácticas internacionales.',
      'Elaboración de estructura de la Ley.',
      'Redacción del articulado.',
      'Revisión y discusión con experto internacional.',
    ],
    status: 'completed',
    icon: MessageCircleMore,
  },
  {
    id: 4,
    title: 'Fase de Socialización',
    description: 'Dar a conocer el proyecto y recabar comentarios.',
    details: [
      'Publicación de plataforma electrónica para la socialización y recopilación de comentarios.',
      'Sistematización de comentarios.',
      'Incorporación de observaciones viables.',
      'Revisión técnico-jurídica.',
      'Validación con expertos.',
    ],
    status: 'completed',
    icon: Clock,
  },
  {
    id: 5,
    title: 'Fase de Presentación de la Propuesta',
    description: 'Presentación de la iniciativa de ley ante el Congreso de la República.',
    details: [
      'Revisión final de la propuesta.',
      'Emisión de dictámenes para expediente de iniciativa de ley.',
      'Presentación de iniciativa de ley ante el Congreso de la República.',
      'Conocimiento de la iniciativa por el Pleno del Congreso de la República y traslado a la Comisión de Economía y Comercio Exterior.',
    ],
    status: 'current',
    icon: Presentation,
    downloadLink: '/files/iniciativa_ley_contrataciones.pdf',
  },
];

const InteractiveTimeline = () => {
  const [selected, setSelected] = useState<number | null>(0);

  return (
    <>
      {/* ── Desktop: alternating above/below ── */}
      <div className="hidden md:block relative">
        {/* Central horizontal line */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 -translate-y-px" />

        <div className="flex items-stretch">
          {phases.map((phase, index) => {
            const above = index % 2 === 0;
            const isSelected = selected === phase.id;
            const Icon = phase.icon;

            return (
              <div key={phase.id} className="flex-1 flex flex-col min-w-0">
                {/* Top slot */}
                <div className={`flex-1 flex flex-col justify-end pb-4 px-2 ${above ? '' : 'invisible'}`}>
                  {above && (
                    <button
                      onClick={() => setSelected(isSelected ? null : phase.id)}
                      className={`w-full text-left rounded-xl p-4 border-2 shadow-sm transition-all duration-300 bg-white ${
                        isSelected
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <PhaseCard phase={phase} isSelected={isSelected} Icon={Icon} />
                    </button>
                  )}
                </div>

                {/* Dot on the line */}
                <div className="flex justify-center items-center relative z-10 py-0">
                  <div className={`w-5 h-5 rounded-full border-4 border-white shadow-md ${
                    phase.status === 'current' ? 'bg-orange-400' : 'bg-blue-500'
                  }`} />
                </div>

                {/* Bottom slot */}
                <div className={`flex-1 flex flex-col justify-start pt-4 px-2 ${above ? 'invisible' : ''}`}>
                  {!above && (
                    <button
                      onClick={() => setSelected(isSelected ? null : phase.id)}
                      className={`w-full text-left rounded-xl p-4 border-2 shadow-sm transition-all duration-300 bg-white ${
                        isSelected
                          ? 'border-blue-500 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <PhaseCard phase={phase} isSelected={isSelected} Icon={Icon} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded detail panel — shown below the whole track */}
        {selected !== null && (() => {
          const phase = phases.find(p => p.id === selected)!;
          return (
            <div className="mt-8 bg-white rounded-xl border-2 border-blue-200 shadow-md p-6 transition-all duration-300">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">
                Actividades principales — {phase.title}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {phase.details.map((d, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="mt-2 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                    <span className="text-sm text-gray-600">{d}</span>
                  </div>
                ))}
              </div>
              {phase.downloadLink && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <a
                    href={phase.downloadLink}
                    download
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <Download className="h-4 w-4" />
                    Descargar Iniciativa de Ley (PDF)
                  </a>
                </div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── Mobile: vertical list ── */}
      <div className="md:hidden space-y-4">
        {phases.map((phase) => {
          const isSelected = selected === phase.id;
          const Icon = phase.icon;
          return (
            <button
              key={phase.id}
              onClick={() => setSelected(isSelected ? null : phase.id)}
              className={`w-full text-left rounded-xl p-5 border-2 shadow-sm bg-white transition-all duration-300 ${
                isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <PhaseCard phase={phase} isSelected={isSelected} Icon={Icon} showDetails />
            </button>
          );
        })}
      </div>
    </>
  );
};

interface PhaseCardProps {
  phase: TimelinePhase;
  isSelected: boolean;
  Icon: React.ComponentType<{ className?: string }>;
  showDetails?: boolean;
}

const PhaseCard = ({ phase, isSelected, Icon, showDetails }: PhaseCardProps) => (
  <div>
    <div className="flex items-start gap-3 mb-2">
      <div className={`p-2 rounded-lg shrink-0 ${phase.status === 'current' ? 'bg-orange-100' : 'bg-blue-100'}`}>
        <Icon className={`h-5 w-5 ${phase.status === 'current' ? 'text-orange-600' : 'text-blue-600'}`} />
      </div>
      <div>
        <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5 ${
          phase.status === 'current' ? 'text-orange-500' : 'text-blue-500'
        }`}>
          Fase {phase.id}
        </p>
        <h3 className="text-sm font-bold text-gray-900 leading-snug">{phase.title}</h3>
      </div>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed">{phase.description}</p>
    <p className="text-xs text-gray-400 mt-2">{isSelected ? 'Click para contraer' : 'Click para ver detalles'}</p>

    {/* On mobile showDetails renders inline */}
    {showDetails && isSelected && (
      <div className="mt-3 pt-3 border-t border-gray-200 space-y-1.5">
        {phase.details.map((d, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
            <span className="text-xs text-gray-600">{d}</span>
          </div>
        ))}
        {phase.downloadLink && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <a
              href={phase.downloadLink}
              download
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs font-medium"
            >
              <Download className="h-3.5 w-3.5" />
              Descargar Iniciativa (PDF)
            </a>
          </div>
        )}
      </div>
    )}
  </div>
);

export default InteractiveTimeline;
