import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, FileText, Heart, TrendingUp, Leaf, Map, Shield } from 'lucide-react';
import Slider1 from '../assets/slider/Banner.png';

const HeroSlider = () => {
  const dimensions = [
    { icon: Heart, name: 'Bienestar', color: 'bg-blue-500' },
    { icon: TrendingUp, name: 'Riqueza', color: 'bg-green-500' },
    { icon: Leaf, name: 'Recursos', color: 'bg-emerald-500' },
    { icon: Map, name: 'Territorial', color: 'bg-orange-500' },
    { icon: Shield, name: 'Estado', color: 'bg-red-500' }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={Slider1}
          alt="K'atun: Nuestra Guatemala 2052"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/85 to-blue-900/80"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center text-white space-y-12">
            {/* Main Heading */}
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block">
                <span className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-sm font-semibold text-white">
                  Plan Nacional de Desarrollo
                </span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="block">K'atun:</span>
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Nuestra Guatemala 2052
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                SEGEPLAN te invita a participar en la actualización del Plan Nacional de Desarrollo.
                <span className="block mt-4 text-white font-semibold">
                  Tu voz construye el futuro de Guatemala.
                </span>
              </p>
            </div>

            {/* Dimension Pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
              {dimensions.map((dim, index) => {
                const IconComponent = dim.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full hover:bg-white/20 transition-all duration-300"
                  >
                    <IconComponent className="h-4 w-4 text-white" />
                    <span className="text-sm font-medium text-white">{dim.name}</span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/documentos"
                className="group bg-white hover:bg-blue-50 text-blue-900 px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-2xl"
              >
                <FileText className="mr-3 h-6 w-6" />
                Explorar Documentos
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/calendario"
                className="group bg-blue-800/50 backdrop-blur-sm hover:bg-blue-700 border-2 border-white text-white px-10 py-5 rounded-xl font-bold text-lg transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105"
              >
                <Calendar className="mr-3 h-6 w-6" />
                Ver Cronograma
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2">5</div>
                <div className="text-lg text-blue-100 font-semibold mb-1">Dimensiones</div>
                <div className="text-sm text-blue-200">Estratégicas</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <div className="text-5xl font-bold text-white mb-2">2052</div>
                <div className="text-lg text-blue-100 font-semibold mb-1">Horizonte</div>
                <div className="text-sm text-blue-200">Visión de largo plazo</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                <Users className="h-12 w-12 text-white mx-auto mb-3" />
                <div className="text-lg text-blue-100 font-semibold mb-1">Participativo</div>
                <div className="text-sm text-blue-200">Tu voz cuenta</div>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="pt-12 animate-bounce">
              <div className="inline-flex flex-col items-center">
                <div className="text-sm text-blue-100 mb-2">Descubre más</div>
                <svg className="w-6 h-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSlider;