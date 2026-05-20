import { useState } from 'react';
import { ExternalLink, ClipboardList, Link2 } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import Linea from '../assets/LINEA.png';

const Survey = () => {
  const [embedUrl, setEmbedUrl]     = useState('');
  const [inputValue, setInputValue] = useState('');
  const [error, setError]           = useState('');

  const handleLoad = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) { setError('Por favor ingresa una URL válida.'); return; }
    try { new URL(trimmed); } catch { setError('La URL ingresada no es válida.'); return; }
    setError('');
    setEmbedUrl(trimmed);
  };

  return (
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
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">Encuesta</h1>
            <p className="text-lg text-brand-100 max-w-2xl">
              Comparte tu opinión sobre el Plan Nacional de Desarrollo
              K'atun: Nuestra Guatemala 2032.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <div className="container-wide py-10">
        {/* URL config */}
        <AnimatedSection>
          <div className="card-flat border border-slate-200 bg-white p-5 sm:p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link2 className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Configurar encuesta
              </span>
            </div>
            <form onSubmit={handleLoad} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="https://forms.google.com/... o cualquier URL embebible"
                className="form-input flex-1"
              />
              <button type="submit" className="btn-primary shrink-0">
                Cargar encuesta
              </button>
            </form>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            {embedUrl && (
              <a
                href={embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-brand-600 hover:text-brand-800 font-medium transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Abrir en nueva pestaña
              </a>
            )}
          </div>
        </AnimatedSection>

        {/* Embed */}
        <AnimatedSection>
          <div className="card bg-white overflow-hidden border border-slate-200">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="Encuesta K'atun 2032"
                className="w-full border-0"
                style={{ minHeight: '700px' }}
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center px-6">
                <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center mb-5">
                  <ClipboardList className="h-10 w-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-600 mb-2">
                  Encuesta no configurada
                </h3>
                <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                  Ingresa la URL de una encuesta externa arriba y presiona
                  "Cargar encuesta" para mostrarla aquí.
                </p>
              </div>
            )}
          </div>
        </AnimatedSection>

        <div className="mt-12">
          <img src={Linea} alt="" className="linea" />
        </div>
      </div>
    </div>
  );
};

export default Survey;
