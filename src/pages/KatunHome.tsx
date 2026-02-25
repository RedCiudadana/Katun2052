import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, MessageSquare, Users, TrendingUp, Heart, Leaf, Map, Shield, BarChart3, Clock, CheckCircle } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import HeroSlider from '../components/HeroSlider';
import Linea from '../assets/LINEA.png';

const KatunHome = () => {
  const dimensions = [
    {
      code: 'dimension-1',
      slug: 'bienestar',
      name: 'Bienestar para la Gente',
      description: 'Desarrollo humano, salud, educación y reducción de la pobreza',
      icon: Heart,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      code: 'dimension-2',
      slug: 'riqueza',
      name: 'Riqueza para Todos y Todas',
      description: 'Desarrollo económico sostenible y empleo digno',
      icon: TrendingUp,
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      code: 'dimension-3',
      slug: 'recursos',
      name: 'Recursos Naturales para Hoy y para el Futuro',
      description: 'Gestión sostenible y protección ambiental',
      icon: Leaf,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600'
    },
    {
      code: 'dimension-4',
      slug: 'territorial',
      name: 'Guatemala Urbana y Rural',
      description: 'Desarrollo territorial equilibrado e infraestructura',
      icon: Map,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      code: 'dimension-5',
      slug: 'estado',
      name: 'Estado como Garante de los Derechos',
      description: 'Gobernabilidad, institucionalidad y transparencia',
      icon: Shield,
      color: 'red',
      gradient: 'from-red-500 to-red-600'
    }
  ];

  const participationSteps = [
    {
      step: 1,
      title: 'Explora las Dimensiones',
      description: 'Conoce las 5 dimensiones del Plan Nacional de Desarrollo y revisa los documentos oficiales.',
      icon: FileText,
      color: 'blue'
    },
    {
      step: 2,
      title: 'Revisa los Documentos',
      description: 'Lee los documentos oficiales validados por SEGEPLAN organizados por dimensión.',
      icon: BarChart3,
      color: 'green'
    },
    {
      step: 3,
      title: 'Comparte tu Retroalimentación',
      description: 'Deja comentarios constructivos y propuestas para enriquecer el plan nacional.',
      icon: MessageSquare,
      color: 'orange'
    }
  ];

  const stats = [
    {
      value: '5',
      label: 'Dimensiones del Plan',
      description: 'Áreas estratégicas de desarrollo',
      icon: BarChart3
    },
    {
      value: '2052',
      label: 'Horizonte de Planificación',
      description: 'Visión de largo plazo',
      icon: TrendingUp
    },
    {
      value: 'Abierto',
      label: 'Proceso Participativo',
      description: 'Tu voz cuenta',
      icon: Users
    }
  ];

  return (
    <div className="space-y-0">
      <HeroSlider />

      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              K'atun: Nuestra Guatemala 2052
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Participa en la actualización del Plan Nacional de Desarrollo.
              Tu retroalimentación es fundamental para construir el futuro de Guatemala.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 100}>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-500">{stat.description}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Las 5 Dimensiones del K'atun
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              El Plan Nacional de Desarrollo se organiza en cinco dimensiones estratégicas
              que definen la visión integral del país hacia el 2052.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dimensions.map((dimension, index) => {
              const IconComponent = dimension.icon;
              return (
                <AnimatedSection key={dimension.code} delay={index * 100}>
                  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${dimension.gradient} flex items-center justify-center mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {dimension.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {dimension.description}
                    </p>
                    <div className="space-y-2">
                      <Link
                        to={`/dimension-articulos/${dimension.slug}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 text-center"
                      >
                        Ver Artículos y Comentar
                      </Link>
                      <Link
                        to={`/dimension/${dimension.code}`}
                        className="flex items-center justify-center text-blue-600 hover:text-blue-700 font-semibold text-sm transition-colors"
                      >
                        Explorar documentos
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo Participar?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tu participación es clave para enriquecer el Plan Nacional de Desarrollo.
              Sigue estos sencillos pasos.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {participationSteps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <AnimatedSection key={index} delay={index * 150}>
                  <div className="relative">
                    {index < participationSteps.length - 1 && (
                      <div className="hidden md:block absolute top-12 left-full w-8 h-0.5 bg-gradient-to-r from-blue-300 to-blue-200 z-0"></div>
                    )}

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 relative z-10">
                      <div className="w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                        {step.step}
                      </div>

                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-blue-600" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 text-center leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          <AnimatedSection delay={500}>
            <div className="mt-12 bg-blue-50 rounded-xl p-8 border border-blue-100">
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  ¡Tu Participación es Fundamental!
                </h3>
                <p className="text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
                  Cada comentario y propuesta será revisado, analizado e integrado por el
                  equipo técnico de SEGEPLAN. Tu voz es esencial para construir un plan
                  nacional verdaderamente participativo y representativo.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <CheckCircle className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Transparencia</h4>
                    <p className="text-sm text-gray-600">Proceso abierto y público</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Inclusión</h4>
                    <p className="text-sm text-gray-600">Todas las voces son importantes</p>
                  </div>
                  <div className="text-center">
                    <BarChart3 className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900 mb-1">Impacto Real</h4>
                    <p className="text-sm text-gray-600">Tus aportes cuentan</p>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </AnimatedSection>

      <AnimatedSection className="py-16 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Comienza a Participar Hoy
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              SEGEPLAN te invita a ser parte activa de la construcción del futuro de Guatemala.
              Explora los documentos oficiales y comparte tu retroalimentación.
            </p>
            <div className="flex justify-center my-6">
              <img src={Linea} alt="Separador" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/documentos"
                className="group bg-white hover:bg-gray-50 text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl"
              >
                Ver Documentos
                <FileText className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/calendario"
                className="group bg-blue-800 hover:bg-blue-900 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl"
              >
                Ver Cronograma
                <Clock className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default KatunHome;
