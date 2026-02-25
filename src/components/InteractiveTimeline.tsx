import React, { useState } from 'react';
import { CheckCircle, Clock, Calendar, Users, FileText, Presentation, MessageCircleMore, Download } from 'lucide-react';

interface TimelinePhase {
  id: number;
  title: string;
  description: string;
  details: string[];
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ComponentType<any>;
  color: string;
  downloadLink?: string;
}

const InteractiveTimeline = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | null>(0);

  const phases: TimelinePhase[] = [
    {
      id: 1,
      title: 'Fase de Diagnóstico',
      description: 'Metodología para la elaboración de la propuesta.',
      details: [
        'Diseño de hoja de ruta',
        'Derecho comparado',
        'Mejores Prácticas y Estándares Internacionales',
        'Análisis Comparativos de Reformas Anteriores'
      ],
      status: 'completed',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      title: 'Fase de Participación y Consulta',
      description: 'Conocer experiencias y buenas prácticas internacionales y recabar insumos de entidades compradoras.',
      details: [
        'Remisión de matriz de insumos a entidades compradoras.',
        'Reuniones para conocer experiencias de otros países (Chile, Paraguay, Perú, Costa Rica, Panamá y República Dominicana).'
      ],
      status: 'completed',
      icon: MessageCircleMore,
      color: 'blue'
    },
    {
      id: 3,
      title: 'Fase de elaboración del proyecto',
      description: 'Redacción y revisión del contenido del proyecto.',
      details: [
        'Análisis de insumos de entidades compradoras y buenas prácticas internacionales.',
        'Elaboración de estructura de la Ley',
        'Redacción del articulado.',
        'Revisión y discusión con experto internacional.'
      ],
      status: 'completed',
      icon: MessageCircleMore,
      color: 'blue'
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
        'Validación con expertos.'
      ],
      status: 'completed',
      icon: Clock,
      color: 'blue'
    },
    {
      id: 5,
      title: 'Fase de Presentación de la Propuesta',
      description: 'Presentación de la iniciativa de ley ante el Congreso de la República.',
      details: [
        'Revisión final de la propuesta',
        'Emisión de dictámenes para expediente de iniciativa de ley',
        'Presentación de iniciativa de ley ante el Congreso de la República',
        'Conocimiento de la iniciativa por el Pleno del Congreso de la República y traslado a la Comisión de Economía y Comercio Exterior para su estudio y dictamen correspondiente'
      ],
      status: 'current',
      icon: Presentation,
      color: 'blue',
      downloadLink: '/files/iniciativa_ley_contrataciones.pdf'
    }
  ];

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-800',
          border: 'border-blue-500',
          icon: 'text-blue-800',
          dot: 'bg-blue-500'
        };
      case 'current':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-800',
          border: 'border-blue-500',
          icon: 'text-blue-800',
          dot: 'bg-blue-500'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-800',
          border: 'border-blue-500',
          icon: 'text-blue-800',
          dot: 'bg-blue-500'
        };
    }
  };

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-green-500 via-orange-500 to-gray-300 transform md:-translate-x-px"></div>
      
      <div className="space-y-12">
        {phases.map((phase, index) => {
          const styles = getStatusStyles(phase.status);
          const IconComponent = phase.icon;
          const isSelected = selectedPhase === phase.id;
          
          return (
            <div key={phase.id} className="relative flex items-center">
              {/* Timeline Dot */}
              {/* <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full transform md:-translate-x-1/2 ${styles.dot} border-4 border-white shadow-lg z-10`}>
                {phase.status === 'completed' && (
                  <CheckCircle className="absolute inset-0 w-4 h-4 text-white" />
                )}
              </div> */}
              
              {/* Content Card */}
              <div className={`ml-20 md:ml-0 ${index % 2 === 0 ? 'md:mr-1/2 md:pr-12' : 'md:ml-1/2 md:pl-12'} w-full md:w-auto`}>
                <div 
                  className={`bg-white rounded-xl p-6 shadow-sm border-2 cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `${styles.border} shadow-lg transform scale-105` 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedPhase(isSelected ? null : phase.id)}
                >
                  <div className="flex items-center mb-4">
                    <div className={`${styles.bg} p-3 rounded-lg mr-4`}>
                      <IconComponent className={`h-6 w-6 ${styles.icon}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{phase.title}</h3>
                      {/* <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 bg-blue-500 text-blue-800`}>
                        {phase.period}
                      </span> */}
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{phase.description}</p>
                  
                  {/* Expandable Details */}
                  <div className={`transition-all duration-500 overflow-hidden ${
                    isSelected ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Actividades principales:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {phase.details.map((detail, idx) => (
                          <div key={idx} className="flex items-start">
                            <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-sm text-gray-600">{detail}</span>
                          </div>
                        ))}
                      </div>

                      {/* Download Button */}
                      {phase.downloadLink && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <a
                            href={phase.downloadLink}
                            download
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium text-sm"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar Iniciativa de Ley (PDF)
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Click Indicator */}
                  <div className="text-center mt-4">
                    <span className="text-xs text-gray-500">
                      {isSelected ? 'Click para contraer' : 'Click para expandir'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveTimeline;