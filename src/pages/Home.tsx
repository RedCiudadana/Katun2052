import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Fingerprint, Network, CheckCircle, Users, MessageSquare, FileText, Clock } from 'lucide-react';
import { laws } from '../data/laws';
import { useCommentStats } from '../hooks/useComments';
import HeroSlider from '../components/HeroSlider';
import EnhancedCard from '../components/EnhancedCard';
import AnimatedSection from '../components/AnimatedSection';
import InteractiveTimeline from '../components/InteractiveTimeline';
import Linea from '../assets/LINEA.png';
import Imagen1 from '../assets/images/IMAGEN_01.png';
import Imagen2 from '../assets/images/IMAGEN_02.png';
import Imagen3 from '../assets/images/IMAGEN_03.png';
import Footer1 from '../assets/footer/footer1.png';
import Footer2 from '../assets/footer/footer2.png';

const Home = () => {
  // Elimina el estado y efecto innecesarios
  // Usa directamente 'laws' importado
  // ...resto igual...

  const getIconComponent = (icon: string) => {
    switch (icon) {
      case 'shield': return Shield;
      case 'fingerprint': return Fingerprint;
      case 'network': return Network;
      default: return Shield;
    }
  };

  // Component to get stats for each law
  const LawStatsWrapper = ({ lawId, children }: { lawId: string, children: (stats: any) => React.ReactNode }) => {
    const { stats } = useCommentStats(lawId);
    return <>{children(stats)}</>;
  };

  const processSteps = [
    {
      step: 1,
      title: 'Explora el contenido de la nueva Ley',
      description: 'Revisa el documento que contiene la propuesta de la nueva Ley.',
      icon: FileText,
      color: 'blue',
      actions: [
        'Descarga el documento PDF completo si lo deseas.',
        'Identifica los temas que te interesan.'
      ]
    },
    {
      step: 2,
      title: 'Lee Artículo por Artículo',
      description: 'Puedes comentar sobre artículos individuales o la ley completa.',
      icon: MessageSquare,
      color: 'green',
      actions: [
        'Revisa cada artículo cuidadosamente',
        'Identifica aspectos que te parezcan importantes',
        'establece los artículos de impacto en el proceso de contratación pública'
      ]
    },
    {
      step: 3,
      title: 'Comparte tu Opinión',
      description: 'Envía comentarios constructivos y específicos. Tu opinión es valiosa para mejorar el proyecto.',
      icon: Users,
      color: 'orange',
      actions: [
        'Escribe comentarios claros y específicos',
        'Redacta tus propuestas de mejora o cambios concretos'
      ]
    }
  ];

  const lawImages = {
    'infraestructuras-criticas': Imagen1,
    'proteccion-datos': Imagen2,
    'ciberseguridad': Imagen3
  };

  const getStepColor = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-800',
          icon: 'text-blue-800',
          border: 'border-blue-500',
          step: 'bg-blue-800'
        };
      default:
        return {
          bg: 'bg-blue-500',
          text: 'text-blue-800',
          icon: 'text-blue-800',
          border: 'border-blue-500',
          step: 'bg-blue-800'
        };
    }
  };

  return (
    <div className="space-y-0">
      {/* Hero Slider */}
      <HeroSlider />

      {/* Statistics Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Participación Ciudadana
            </h2>
            <p className="text-xl text-gray-600">
              para la
              creación de una Nueva Ley de
              Contrataciones Públicas.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea}/>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <LawStatsWrapper lawId="contrataciones-estado">
              {(contractStats) => {
                const totalComments = contractStats.totalComments;
                const totalParticipants = contractStats.uniqueParticipants;
                        
                return (
                  <>
                    {[
                      {
                        value: totalComments,
                        label: 'Comentarios recibidos',
                        description: 'Aportes sobre la reforma',
                        color: 'blue',
                        trend: '+12% esta semana'
                      },
                      {
                        value: totalParticipants,
                        label: 'Participantes',
                        description: 'Ciudadanos y organizaciones',
                        color: 'blue',
                        trend: '+8% esta semana'
                      }
                    ].map((stat, index) => (
                      <AnimatedSection key={index} delay={index * 100}>
                        <div className="text-center p-8 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                            stat.color === 'blue' ? 'bg-gradient-to-br from-cyan-500 to-cyan-600' :
                            stat.color === 'green' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                            stat.color === 'orange' ? 'bg-gradient-to-br from-orange-100 to-orange-200' : 'bg-gradient-to-br from-blue-100 to-blue-200'
                          }`}>
                            <span className={`text-3xl font-bold ${
                              stat.color === 'blue' ? 'text-white' :
                              stat.color === 'green' ? 'text-emerald-700' :
                              stat.color === 'orange' ? 'text-orange-700' : 'text-blue-700'
                            }`}>
                              {stat.value}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            {stat.label}
                          </h3>
                          <p className="text-gray-600 text-base mb-2">{stat.description}</p>
                        </div>
                      </AnimatedSection>
                    ))}
                  </>
                );
              }}
            </LawStatsWrapper>
          </div>
        </div>
      </AnimatedSection>

      {/* Laws Section */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Hacia una nueva era en las contrataciones públicas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Impulsamos un cambio integral en el Sistema Nacional de
              Contrataciones Públicas. Nuestro objetivo es modernizarlo,
              promoviendo la transparencia, eficiencia, rendición de cuentas y una
              activa participación ciudadana en el control de los recursos públicos.
            </p>
            {/* <div className="flex justify-center my-6">
              <img src={Linea}/>
            </div> */}
          </div>

          {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {laws.filter(law => law.id === 'contrataciones-estado').map((law, index) => {
              const IconComponent = getIconComponent(law.icon);
              
              return (
                <AnimatedSection key={law.id} delay={200} className="lg:col-span-3">
                  <LawStatsWrapper lawId={law.id}>
                    {(stats) => (
                      <div className="max-w-4xl mx-auto">
                        <EnhancedCard
                          title={law.title}
                          description={law.shortDescription}
                          image={lawImages[law.id as keyof typeof lawImages]}
                          link={`/ley/${law.id}`}
                          stats={{
                            comments: stats.totalComments,
                            participants: stats.uniqueParticipants,
                            daysLeft: 45
                          }}
                          color={law.color}
                          icon={IconComponent}
                        />
                      </div>
                    )}
                  </LawStatsWrapper>
                </AnimatedSection>
              );
            })}
          </div> */}
        </div>
      </AnimatedSection>
      {/* Timeline Section */}
      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Conoce el proceso de la nueva Ley de Contrataciones Públicas
            </h2>
            <p className="text-xl text-gray-600">
              La creación de esta nueva ley, impulsada por el Ministerio de Finanzas Públicas, se llevó a cabo en varias fases.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea}/>
            </div>
          </div>

          <InteractiveTimeline />
        </div>
      </AnimatedSection>

      {/* Process Explanation */}
      <AnimatedSection className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Participar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participa activamente en la modernización del
              Sistema Nacional de Contrataciones Públicas de
              Guatemala
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea}/>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => {
              const IconComponent = step.icon;
              const colors = getStepColor(step.color);
              
              return (
                <AnimatedSection key={index} delay={index * 150}>
                  <div className="relative">
                    {/* Connection Line */}
                    {index < processSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 z-0"></div>
                    )}
                    
                    <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative z-10">
                      {/* Step Number */}
                      <div className={`w-14 h-14 rounded-2xl ${colors.step} text-white font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                        {step.step}
                      </div>

                      {/* Icon */}
                      <div className={`${colors.bg} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md`}>
                        <IconComponent className={`h-10 w-10 ${colors.icon}`} />
                      </div>

                      {/* Content */}
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center leading-tight">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-center mb-6 leading-relaxed text-base">
                        {step.description}
                      </p>

                      {/* Actions List */}
                      <div className={`${colors.bg} rounded-xl p-5 ${colors.border} border-2`}>
                        <h4 className={`text-sm font-bold ${colors.text} mb-3`}>
                          Acciones clave:
                        </h4>
                        <ul className="space-y-2">
                          {step.actions.map((action, actionIndex) => (
                            <li key={actionIndex} className="flex items-start text-sm text-gray-700">
                              <CheckCircle className={`h-5 w-5 ${colors.icon} mr-2 mt-0.5 flex-shrink-0`} />
                              <span className="leading-relaxed">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {/* Additional Information */}
          <AnimatedSection delay={600}>
            <div className="mt-12 bg-gradient-to-br from-cyan-50 to-white rounded-2xl p-10 shadow-md border border-cyan-200">
              <div className="text-center">
                <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Clock className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">
                  ¡Tu participación es clave!
                </h3>
                <p className="text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed text-lg">
                  Cada comentario que envíes será revisado, analizado e integrado en el proyecto final por el equipo
                  técnico y especialista del Ministerio de Finanzas Públicas.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                  <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Explora el contenido de la nueva Ley</h4>
                    <p className="text-base text-gray-600 leading-relaxed">Revisa el documento que
                      contiene la propuesta de la
                      nueva Ley.</p>
                  </div>
                  <div className="text-center bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Impacto Real</h4>
                    <p className="text-base text-gray-600 leading-relaxed">Tus aportes enriquecen el
                      proyecto.</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      {/* Call to Action */}
      <AnimatedSection className="py-16 bg-gradient-to-br from-cyan-700 via-cyan-800 to-cyan-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJWMzRoLTJ6TTAgMTZoMnYySDJ2MXYxMGgydjFIMHYtMXYtMXYtMlYxNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 leading-tight">
              Tus comentarios y sugerencias son importantes
            </h2>
            <p className="text-xl text-cyan-50 mb-8 leading-relaxed">
              El Ministerio de Finanzas Públicas te invita a ser parte de este esfuerzo para
              modernizar las contrataciones públicas de Guatemala.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" className="opacity-80"/>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/ley/contrataciones-estado"
                className="group bg-white text-cyan-800 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-2xl shadow-lg"
              >
                Ver Comentarios
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

    </div>
  );
};

export default Home;