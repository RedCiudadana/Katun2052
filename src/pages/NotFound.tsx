import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, FileQuestion, Compass } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';

const NotFound = () => {
  const suggestions = [
    {
      title: 'Iniciativas de Ley',
      description: 'Explora las propuestas legislativas abiertas a consulta',
      link: '/',
      icon: FileQuestion,
      color: 'blue'
    },
    {
      title: 'Calendario',
      description: 'Conoce las fechas importantes del proceso',
      link: '/calendario',
      icon: Compass,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return {
          bg: 'bg-blue-100',
          text: 'text-white',
          icon: 'text-blue-600',
          hover: 'hover:bg-blue-50'
        };
      case 'green':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: 'text-green-600',
          hover: 'hover:bg-green-50'
        };
      case 'purple':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          icon: 'text-purple-600',
          hover: 'hover:bg-purple-50'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: 'text-gray-600',
          hover: 'hover:bg-gray-50'
        };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* 404 Animation */}
        <AnimatedSection>
          <div className="relative mb-8">
            <div className="text-8xl sm:text-9xl font-bold text-blue-100 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white rounded-full p-6 shadow-lg border border-blue-200">
                <FileQuestion className="h-16 w-16 text-blue-600" />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <AnimatedSection delay={200}>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Página no encontrada
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Lo sentimos, la página que buscas no existe o ha sido movida. 
            Te ayudamos a encontrar lo que necesitas.
          </p>
        </AnimatedSection>

        {/* Quick Actions */}
        <AnimatedSection delay={400}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to="/"
              className="group inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <Home className="h-5 w-5 mr-2" />
              Ir al Inicio
            </Link>
            
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Volver Atrás
            </button>
          </div>
        </AnimatedSection>

      </div>
    </div>
  );
};

export default NotFound;