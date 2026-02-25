import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { katunService } from '../services/katunService';
import type { ProcessMilestone } from '../types/katun';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const KatunCalendar = () => {
  const [milestones, setMilestones] = useState<ProcessMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMilestones = async () => {
      try {
        setLoading(true);
        const data = await katunService.getProcessMilestones();
        setMilestones(data);
      } catch (error) {
        console.error('Error loading milestones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMilestones();
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        };
      case 'in_progress':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: Clock,
          iconColor: 'text-blue-600'
        };
      case 'upcoming':
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-300',
          icon: AlertCircle,
          iconColor: 'text-gray-400'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          border: 'border-gray-300',
          icon: Clock,
          iconColor: 'text-gray-400'
        };
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'publication': return 'Publicación';
      case 'consultation': return 'Consulta';
      case 'deadline': return 'Fecha Límite';
      case 'event': return 'Evento';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cronograma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Cronograma del Proceso K'atun 2052
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Conoce las fases y fechas clave del proceso de actualización del
              Plan Nacional de Desarrollo.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform md:-translate-x-px"></div>

            <div className="space-y-8">
              {milestones.map((milestone, index) => {
                const styles = getStatusStyles(milestone.status);
                const StatusIcon = styles.icon;
                const isLeft = index % 2 === 0;

                return (
                  <AnimatedSection key={milestone.id} delay={index * 100}>
                    <div className={`relative flex items-center ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                      <div className={`w-full md:w-1/2 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                        <div className={`bg-white rounded-xl p-6 shadow-sm border-2 ${styles.border} hover:shadow-lg transition-all duration-300`}>
                          <div className={`flex items-center gap-3 mb-3 ${isLeft ? 'md:flex-row-reverse md:justify-end' : 'md:flex-row md:justify-start'}`}>
                            <div className={`w-10 h-10 rounded-full ${styles.bg} flex items-center justify-center flex-shrink-0`}>
                              <StatusIcon className={`h-5 w-5 ${styles.iconColor}`} />
                            </div>
                            <div>
                              <span className={`px-3 py-1 ${styles.bg} ${styles.text} text-xs font-semibold rounded-full`}>
                                {getTypeLabel(milestone.milestone_type)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {milestone.title}
                          </h3>

                          <p className="text-gray-600 mb-3 leading-relaxed">
                            {milestone.description}
                          </p>

                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(milestone.milestone_date).toLocaleDateString('es-GT', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="absolute left-4 md:left-1/2 w-8 h-8 rounded-full bg-white border-4 ${styles.border} transform md:-translate-x-1/2 flex items-center justify-center">
                        <div className={`w-3 h-3 rounded-full ${styles.bg}`}></div>
                      </div>

                      <div className="hidden md:block w-1/2"></div>
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={600}>
          <div className="mt-16 bg-blue-50 rounded-xl p-8 border border-blue-100">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mantente Informado
              </h3>
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                El proceso de actualización del Plan Nacional de Desarrollo es transparente
                y participativo. Revisa regularmente esta página para conocer los avances
                y oportunidades de participación.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Completadas</h4>
                  <p className="text-sm text-gray-600">
                    {milestones.filter(m => m.status === 'completed').length} fases
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">En Progreso</h4>
                  <p className="text-sm text-gray-600">
                    {milestones.filter(m => m.status === 'in_progress').length} fases
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <AlertCircle className="h-6 w-6 text-gray-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">Próximas</h4>
                  <p className="text-sm text-gray-600">
                    {milestones.filter(m => m.status === 'upcoming').length} fases
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default KatunCalendar;
