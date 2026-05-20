import React, { useState } from 'react';
import { ExternalLink, ClipboardList } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const DEFAULT_URL = '';

const Survey = () => {
  const [embedUrl, setEmbedUrl] = useState(DEFAULT_URL);
  const [inputValue, setInputValue] = useState(DEFAULT_URL);
  const [error, setError] = useState('');

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError('Por favor ingresa una URL válida.');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      setError('La URL ingresada no es válida.');
      return;
    }
    setError('');
    setEmbedUrl(trimmed);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="h-8 w-8 text-blue-200" />
              <span className="text-blue-200 font-semibold text-sm uppercase tracking-wider">
                Participación Ciudadana
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Encuesta</h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Comparte tu opinión sobre el Plan Nacional de Desarrollo K'atun: Nuestra Guatemala 2032.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* URL config */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              URL de la encuesta externa
            </h2>
            <form onSubmit={handleLoad} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="https://forms.google.com/... o cualquier URL embebible"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap"
              >
                Cargar encuesta
              </button>
            </form>
            {error && (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            )}
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir encuesta en nueva pestaña
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Embed */}
        <AnimatedSection>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Encuesta K'atun 2032"
                className="w-full"
                style={{ minHeight: '700px', border: 'none' }}
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                <ClipboardList className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  No hay encuesta cargada
                </h3>
                <p className="text-gray-400 max-w-md">
                  Ingresa la URL de una encuesta externa en el campo de arriba y presiona
                  "Cargar encuesta" para mostrarla aquí.
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>

        <div className="mt-12">
          <img src={Linea} alt="Separador" className="h-5 w-full" />
        </div>
      </div>
    </div>
  );
};

export default Survey;
